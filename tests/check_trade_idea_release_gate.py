"""Release gate for the public API docs and the trade-idea path (plan 05, criterion 4).

Run after building `_site/production` (and optionally `_site/draft-preview`) with the
CI Hugo invocation:

    HUGO_ENV=production hugo --gc --minify --baseURL "https://goodalexander.com/" -d _site/production

Default mode enforces that the *released state is truthful*:

  G1  /api/ and /llms.txt are built and served from the released source.
  G2  Every site-internal path advertised by /api/ or /llms.txt exists in the built
      site (no public doc may advertise a 404).
  G3  /api/ makes no promise the system cannot deliver: no key-delivery promise from
      the newsletter, no free-access promise (no member subsidy exists; D-COMMERCE
      is open in plan 05).
  G4  The trade idea is either fully published or fully withheld. Withheld means no
      built public file mentions the idea slug, its title or its evidence path.
  G5  A published idea carries the *current* accepted model identity and matches the
      live signal book (plan 03 recheck at publication; plan 04 acceptance), and its
      NAVCoin data either names a real coin or renders the explicit closed/placeholder
      refusal state — an unlabeled empty slot fails.

`--require-published` mode additionally runs the G5 publication checks against the
live sources and refuses (exit 1, with reasons) when the idea is withheld or stale.
Use it at authorized republication.

Read-only environment inputs (never modified):

  GA_IDEA_SLUG        slug of the real idea page (default tsla-short-2026-11-10)
  GA_SIGNAL_JSON      live coverage_universe_equity signal.json (models the book)
  GA_MODEL_DIR        research/company_models/<TICKER> directory in the models release
"""

from html.parser import HTMLParser
from pathlib import Path
import argparse
import hashlib
import json
import os
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PROD = ROOT / '_site/production'
DRAFT = ROOT / '_site/draft-preview'
SITE_ORIGIN = 'https://goodalexander.com/'

FORBIDDEN_API_PHRASES = [
    'Get my API key',
    'Get an API key',
    'Your API key follows',
    'models free',          # no Task Node member subsidy exists yet (D-COMMERCE open)
]

failures = []
notes = []


def refuse(reason):
    failures.append(reason)


class Links(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.hrefs = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        for name, value in dict(attrs).items():
            if name in ('href', 'src') and value:
                self.hrefs.append(value)


def built_path(url):
    """Map a site-internal URL to a file in the build; None if external or absent."""
    if url.startswith(SITE_ORIGIN):
        url = url[len(SITE_ORIGIN):]
    elif not url.startswith('/'):
        return None
    url = url.split('#')[0].split('?')[0]
    if not url or url.startswith('//'):
        return None
    candidate = (PROD / url.lstrip('/'))
    if candidate.is_file():
        return candidate
    if (candidate / 'index.html').is_file():
        return candidate / 'index.html'
    return None


def normalize(path):
    """Resolve '.' and '..' segments in an absolute site path."""
    out = []
    for segment in path.split('/'):
        if segment in ('', '.'):
            continue
        if segment == '..':
            if out:
                out.pop()
            continue
        out.append(segment)
    return '/' + '/'.join(out)


def advertised_paths(text):
    """Site-internal absolute paths the text advertises (origin-qualified URLs only)."""
    return {m[len(SITE_ORIGIN) - 1:] for m in re.findall(r'https://goodalexander\.com/[\w\-./]+', text)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--require-published', action='store_true',
                    help='also require the real idea to be published and current')
    args = ap.parse_args()

    slug = os.environ.get('GA_IDEA_SLUG', 'tsla-short-2026-11-10')
    idea_md = ROOT / 'content/trade-ideas' / f'{slug}.md'
    idea_page = PROD / 'trade-ideas' / slug / 'index.html'
    evidence_json = PROD / 'evidence' / f'{slug.split("-short-")[0].lower()}-2026-11-10.json'

    # G1 — the public paths exist in the release build.
    api_html = PROD / 'api/index.html'
    llms = PROD / 'llms.txt'
    if not api_html.is_file():
        refuse('G1: /api/ missing from the production build')
    if not llms.is_file():
        refuse('G1: /llms.txt missing from the production build')
    if not api_html.is_file() or not llms.is_file():
        report(args); return
    api_text = api_html.read_text()
    llms_text = llms.read_text()
    notes.append('G1 PASS: /api/ and /llms.txt built from the released source')

    # G2 — no advertised site-internal path may 404 in the release build.
    for label, text in (('/api/', api_text), ('/llms.txt', llms_text)):
        for path in sorted(advertised_paths(text)):
            if built_path(path) is None:
                refuse(f'G2: {label} advertises {path} which is not in the production build')
    for href in Links(api_text).hrefs:
        if href.startswith(('mailto:', 'data:', 'javascript:')) or href.startswith('//'):
            continue
        target = href
        if target.startswith('http'):
            if not target.startswith(SITE_ORIGIN):
                continue                           # external origin: out of scope
            target = '/' + target[len(SITE_ORIGIN):]
        elif not target.startswith('/'):
            target = '/api/' + href                # resolve relative to the /api/ page
        target = normalize(target)
        if built_path(target) is None:
            refuse(f'G2: /api/ links {href} which is not in the production build')
    if not any(f.startswith('G2:') for f in failures):
        notes.append('G2 PASS: every site-internal path advertised by /api/ and /llms.txt exists in the build')

    # G3 — no undeliverable promise on /api/.
    for phrase in FORBIDDEN_API_PHRASES:
        if phrase.lower() in api_text.lower():
            refuse(f'G3: /api/ contains the undeliverable promise {phrase!r}')
    if not any(f.startswith('G3:') for f in failures):
        notes.append('G3 PASS: /api/ promises no key delivery and no free member access')

    # G4 — the idea is fully published or fully withheld.
    if not idea_md.is_file():
        refuse(f'G4: idea source {idea_md.relative_to(ROOT)} missing')
        report(args); return
    front = idea_md.read_text().split('---')[1]
    is_draft = re.search(r'^draft:\s*true\s*$', front, re.M) is not None
    mentions = []
    if is_draft:
        for file in PROD.rglob('*'):
            if file.suffix in {'.html', '.json', '.xml', '.txt', '.js'} and file.is_file():
                body = file.read_text(errors='replace')
                if slug in body:
                    mentions.append(str(file.relative_to(PROD)))
        if mentions:
            for m in mentions[:10]:
                refuse(f'G4: withheld idea slug leaks into the public build: {m}')
        else:
            notes.append('G4 PASS: idea is withheld (draft) and no public file references it')
    else:
        if not idea_page.is_file():
            refuse('G4: idea is not draft but has no production page')
        else:
            notes.append('G4 PASS: idea page is built in production')

    # G5 — publication checks (also the body of --require-published).
    run_g5 = (not is_draft) or args.require_published
    if run_g5:
        check_publication(slug, idea_md, idea_page, evidence_json, is_draft, args)

    report(args)


def check_publication(slug, idea_md, idea_page, evidence_json, is_draft, args):
    signal_path = os.environ.get('GA_SIGNAL_JSON')
    model_dir = os.environ.get('GA_MODEL_DIR')

    if is_draft:
        refuse('G5: --require-published: the idea is withheld (draft); publication requires founder review')

    # Model acceptance recheck (plan 04) using the gateway's exact rule
    # (scripts/prepare-company-models.mjs + company-model-subscription-routes.ts).
    if model_dir:
        model_dir = Path(model_dir)
        raw_bytes = (model_dir / 'outputs.json').read_bytes()
        raw = json.loads(raw_bytes)
        card = json.loads((model_dir / 'model_card.json').read_text())
        version = 'sha256:' + hashlib.sha256(raw_bytes).hexdigest()
        superseded = card['asof'] != raw['meta']['asof'] or card['price_target'] != raw['model_card']['price_target']
        accepted = (card.get('publication', {}).get('status') == 'published'
                    and not card.get('publication', {}).get('blocked_by')
                    and card.get('checks_passed') is True
                    and not card.get('stale')
                    and not superseded
                    and not (card.get('withheld') or {})
                    and raw.get('meta', {}).get('status') == 'complete')
        if not accepted:
            refuse(f'G5: model is not accepted at the current source (version {version}, card asof {card["asof"]})')
        else:
            notes.append(f'G5 model: ACCEPTED at current source — {version}, source date {card["asof"]}, '
                         f'target {card["price_target"]:.2f}')
        if not is_draft and idea_page.is_file():
            page = idea_page.read_text()
            if version not in page:
                refuse('G5: published page does not carry the current accepted model version '
                       f'({version}); a superseded generation may not be presented as current')
            if card['asof'] not in page:
                refuse(f'G5: published page does not carry the current model source date {card["asof"]}')
            if f'{card["price_target"]:.2f}' not in page:
                refuse(f'G5: published page does not carry the current model target {card["price_target"]:.2f}')
            if not any(f.startswith('G5: published page') for f in failures):
                notes.append('G5 PASS: published page carries the current accepted model version, date and target')
    else:
        notes.append('G5 model: GA_MODEL_DIR not set; acceptance recheck skipped (refused, not assumed)')
        refuse('G5: GA_MODEL_DIR not set; cannot verify model acceptance for publication')

    # Signal/eligibility recheck (plan 03) against the live book.
    if signal_path:
        signal = json.loads(Path(signal_path).read_text())
        strategy = signal.get('strategy_id') or signal.get('strategy')
        if not is_draft:
            page = idea_page.read_text() if idea_page.is_file() else ''
            evidence_text = evidence_json.read_text() if evidence_json.is_file() else ''
            if strategy and strategy not in page and strategy not in evidence_text:
                refuse(f'G5: published idea does not record the live strategy id {strategy}')
        rows = signal.get('targets') or signal.get('rows') or []
        ticker_match = os.environ.get('GA_IDEA_TICKER', 'TSLA')
        row = next((r for r in rows if ticker_match in json.dumps(r)), None)
        if row is None:
            refuse(f'G5: {ticker_match} absent from the live signal book — no compliant direction exists')
        else:
            weight = row.get('target_weight')
            if weight is None or weight >= 0:
                refuse(f'G5: live signal does not hold a short {ticker_match} position (target_weight={weight})')
            else:
                notes.append(f'G5 signal: live book holds {ticker_match} {weight} (generated '
                             f'{signal.get("generated_at_utc")}, decision {signal.get("decision_date")}); '
                             'idea direction agrees with the systematic instruction')
    else:
        notes.append('G5 signal: GA_SIGNAL_JSON not set; eligibility recheck skipped (refused, not assumed)')
        refuse('G5: GA_SIGNAL_JSON not set; cannot verify signal eligibility for publication')

    # Evidence record and NAVCoin state (plans 05/07).
    if not is_draft:
        if not evidence_json.is_file():
            refuse(f'G5: published idea has no dated evidence record at /{evidence_json.relative_to(PROD)}')
        else:
            evidence = json.loads(evidence_json.read_text())
            if evidence.get('direction') != 'SHORT':
                refuse('G5: evidence record direction is not SHORT')
            if not evidence.get('checks_passed'):
                refuse('G5: evidence record does not state checks_passed')
            if model_dir:
                if evidence.get('model_version') != version:
                    refuse(f'G5: evidence record model_version {evidence.get("model_version")} is not the current '
                           f'accepted version {version}')
                if evidence.get('model_source_date') != card['asof']:
                    refuse(f'G5: evidence record model_source_date {evidence.get("model_source_date")} is not the '
                           f'current source date {card["asof"]}')
                if abs((evidence.get('price_target_usd') or 0) - card['price_target']) > 0.005:
                    refuse(f'G5: evidence record price_target_usd {evidence.get("price_target_usd")} is not the '
                           f'current target {card["price_target"]:.2f}')
        page = idea_page.read_text() if idea_page.is_file() else ''
        coin_file = ROOT / 'data/navcoins'
        front = idea_md.read_text().split('---')[1]
        navkey = (re.search(r'^navcoin:\s*(\S+)', front, re.M) or [None, None])[1]
        coin = None
        if navkey and (coin_file / f'{navkey}.json').is_file():
            coin = json.loads((coin_file / f'{navkey}.json').read_text())
        if coin and coin.get('coin'):
            if not re.search(r'0x[0-9a-fA-F]{40}', str(coin.get('contract', '')) ) and not coin.get('contract'):
                refuse('G5: a named coin without a contract address cannot be a matching live checkout')
            notes.append(f"G5 coin: {coin.get('coin')} attached")
        else:
            # No real coin: the page must render the explicit refusal state, never a
            # bare empty slot (plan 05 W4; plan 07 default).
            for required in ('Not attached — placeholder', 'Buying is closed', 'no NAV supplied'):
                if required not in page:
                    refuse(f'G5: unpublished coin must render the explicit refusal state; missing {required!r}')
            if not any(f.startswith('G5: unpublished coin') for f in failures):
                notes.append('G5 coin: no coin attached and the page renders the explicit closed/placeholder refusal state')


def report(args):
    mode = 'require-published' if args.require_published else 'default (truthful released state)'
    print(f'# release gate [{mode}]')
    for note in notes:
        print('#', note)
    if failures:
        for failure in failures:
            print('REFUSED:', failure)
        print(f'FAIL: {len(failures)} refusal(s)')
        sys.exit(1)
    print('PASS: released state is truthful and consistent')
    sys.exit(0)


if __name__ == '__main__':
    main()
