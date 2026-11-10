"""Plan 03 W3 page boundary: a trade-idea page publishes only on a valid eligibility record.

Part 1 verifies the real content: every published trade-idea page carries an
eligibility record from navstrategies.idea_generator.eligibility that approves
it (no refusal, unexpired, matching the page's direction and model version).
Part 2 is the negative suite: mutated copies of the real TSLA record are each
refused - no model, stale, flat, conflicting, changed signal, opposition,
expiry, direction drift and a missing record. No value is invented: every
mutant edits one field of the real record.

Run from the repository root: python3 tests/check_trade_idea_eligibility.py
"""
from datetime import datetime, timezone
from pathlib import Path
import copy
import json
import re

ROOT = Path(__file__).resolve().parents[1]
IDEAS = ROOT / 'content/trade-ideas'
RECORDS = ROOT / 'data/eligibility'


def front_matter(page: Path) -> dict:
    text = page.read_text()
    match = re.match(r'^---\n(.*?)\n---\n', text, re.S)
    assert match, f'{page.name}: no front matter'
    fields = {}
    for line in match.group(1).splitlines():
        key, _, value = line.partition(':')
        fields[key.strip()] = value.strip().strip('"')
    fields['__body__'] = text[match.end():]
    return fields


def parse_utc(value) -> datetime | None:
    if not isinstance(value, str):
        return None
    text = value.replace('+00:00', 'Z')
    try:
        moment = datetime.fromisoformat(text)
    except ValueError:
        return None
    if moment.tzinfo is None:  # local times are not accepted
        return None
    return moment.astimezone(timezone.utc)


def verify(page: Path | None, record: dict | None, *, now: datetime | None = None) -> str | None:
    """Return None when eligible for publication, else the exact refusal reason."""
    now = now or datetime.now(timezone.utc)
    if record is None:
        return 'no eligibility record: an unbacked idea cannot be published'
    if not isinstance(record, dict) or record.get('schema_version') != 1:
        return 'eligibility record is missing or has an unknown schema'
    result = record.get('result')
    if not isinstance(result, dict):
        return 'eligibility record has no result'
    if result.get('refusal'):
        return f"eligibility refused ({result['refusal']})"
    if result.get('eligible') is not True:
        return 'eligibility record does not approve the idea'
    valid_until = parse_utc(record.get('valid_until'))
    if valid_until is None:
        return 'eligibility validity window is missing or not a UTC timestamp'
    if valid_until <= now:
        return f"eligibility record expired {record['valid_until']}"
    if page is not None:
        fields = front_matter(page)
        inner = record.get('record') or {}
        direction = inner.get('direction')
        if direction and direction not in fields.get('direction', ''):
            return (f"record direction {direction} does not match the page direction "
                    f"{fields.get('direction')!r}")
        model = (result.get('model') or {})
        version = model.get('version')
        if version and version not in fields['__body__']:
            return 'record model version does not appear on the page'
    return None


# ---------------------------------------------------------------------------
# Part 1 - the real content.
# ---------------------------------------------------------------------------
now = datetime.now(timezone.utc)
pages = sorted(IDEAS.glob('*.md'))
assert pages, 'no trade-idea pages found'
published, drafts_with_record, drafts_without = [], [], []
for page in pages:
    fields = front_matter(page)
    key = fields.get('eligibility')
    record = json.loads((RECORDS / f'{key}.json').read_text()) if key else None
    if key:
        assert record is not None, f'{page.name}: eligibility key {key} has no record file'
    refusal = verify(page, record, now=now)
    if fields.get('draft') == 'true':
        (drafts_with_record if key else drafts_without).append((page.name, refusal))
    else:
        assert refusal is None, f'{page.name}: published with a refused record: {refusal}'
        published.append(page.name)
assert published == [], (
    f'no page may be published while the TSLA idea awaits founder review; found {published}')
assert drafts_with_record and drafts_with_record[0][1] is None, drafts_with_record
print(f'PASS: {len(pages)} trade-idea page(s): 0 published (founder review), '
      f'{len(drafts_with_record)} draft with a valid eligibility record, '
      f'{len(drafts_without)} placeholder draft without one (refused by the build gate).')

# The real record is bound to the deployed model API snapshot's TSLA version.
record = json.loads((RECORDS / 'tsla-short-2026-11-10.json').read_text())
acceptance = json.loads(Path('/home/postfiat/repos/post-fiat-emergency-execution-plan/'
                             'execution/work-s5-api-deploy/api/model-data/'
                             'acceptance.json').read_text())
assert record['result']['model']['version'] == acceptance['TSLA']['version']
assert acceptance['TSLA']['published'] and acceptance['TSLA']['checksPassed']
assert not acceptance['TSLA']['stale'] and not acceptance['TSLA']['withheld']
print('PASS: the attached record pins the deployed acceptance snapshot\'s exact '
      'TSLA version, which the acceptance rule has accepted.')

# ---------------------------------------------------------------------------
# Part 2 - negative suite on mutants of the real record.
# ---------------------------------------------------------------------------
def mutant(**changes):
    row = copy.deepcopy(record)
    for path, value in changes.items():
        node = row
        keys = path.split('.')
        for key in keys[:-1]:
            node = node[key]
        node[keys[-1]] = value
    return row


refused = {
    'no_model': mutant(**{'result.model.state': 'no_model', 'result.eligible': False,
                          'result.refusal': 'no_model'}),
    'stale': mutant(**{'result.eligible': False, 'result.refusal': 'stale'}),
    'flat': mutant(**{'result.eligible': False, 'result.refusal': 'flat'}),
    'conflicting': mutant(**{'result.eligible': False, 'result.refusal': 'conflicting'}),
    'changed_signal': mutant(**{'result.eligible': False, 'result.refusal': 'changed_signal'}),
    'opposes_systematic': mutant(**{'result.eligible': False, 'result.refusal': 'opposes_systematic'}),
    'inconsistent eligible-with-refusal': mutant(**{'result.refusal': 'stale'}),
    'not approved': mutant(**{'result.eligible': False}),
    'expired yesterday': mutant(**{'valid_until': (now.replace(microsecond=0)
                                                   ).isoformat().replace('+00:00', 'Z')}),
    'validity not UTC': mutant(**{'valid_until': '2026-11-14T00:00:00'}),
    'direction drift': mutant(**{'record.direction': 'LONG'}),
    'model version drift': mutant(**{'result.model.version': 'sha256:' + '0' * 64}),
}
for name, row in refused.items():
    reason = verify(IDEAS / 'tsla-short-2026-11-10.md', row, now=now)
    assert reason is not None, f'{name} was not refused'
    print(f'PASS: refused {name}: {reason}')

assert verify(IDEAS / 'tsla-short-2026-11-10.md', None, now=now) is not None
print('PASS: refused a published page with no record at all.')
assert verify(IDEAS / 'tsla-short-2026-11-10.md', record, now=now) is None
print('PASS: the real record itself verifies (the TSLA draft stays unpublished '
      'pending founder review; nothing here republishes it).')
