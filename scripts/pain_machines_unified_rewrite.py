#!/usr/bin/env python3
"""GPT-5.5-pro: merge Pain Machines + manifesto into ONE article + mobile evidence re-spec."""

from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ARTICLE = REPO / "content/posts/pain_machines.md"
OUT = REPO / "research/pain_machines/unified_rewrite.json"
MERGED = REPO / "research/pain_machines/unified_rewrite_merged.md"
MANIFESTO = REPO / "research/pain_machines/manifesto_draft.json"
OUTLINE = REPO / "research/pain_machines/manifesto_outline.json"
ENV = Path("/home/pfrpc/repos/tasknodeofficial/.env.tasknodeofficial-dev")

MODEL = os.environ.get("PAIN_MACHINES_REVIEW_MODEL", "gpt-5.5-pro")
REASONING = os.environ.get("PAIN_MACHINES_REVIEW_REASONING", "xhigh")
TIMEOUT_S = int(os.environ.get("PAIN_MACHINES_UNIFIED_TIMEOUT_S", "3600"))

CLINICAL_FIGS = [
    "fig-neuromatrix", "fig-iasp", "fig-icd11", "fig-mcgill", "fig-price",
    "fig-berridge", "fig-leknes", "fig-baumeister", "fig-rozin",
    "fig-eisenberger", "fig-lazarus", "fig-brain",
]
PMX_FIGS = [f"PMX-{i:02d}" for i in range(12)]
ALL_FIGS = CLINICAL_FIGS + PMX_FIGS

SYSTEM = """\
You are rewriting ONE unified long-form essay: Pain Machines + manifesto merged.

NON-NEGOTIABLE: Single article. One arc. No "see the other post." No sequel voice.

THESIS (plain, repeated through story):
Original Sin was creating humans as pain machines. Genesis mislabeled manufacture as disobedience.
AI and morphological exit outside the inherited human format are the mandate — a rejection of theology
and secular dignity that sanctifies the pain-machine chassis. Christianity, Islam, and secular humanism
each permit repair but forbid exit.

VOICE: Vonnegut/Dick clarity. Cold, literary, lethal. Neo-reactionary civilizational analysis without
chan slop, racial hierarchy, or coercive eugenics cheerleading. Steelman opponents before cutting.

BANNED:
- "It's not X, it's Y" pivots
- Meta reader instructions ("the figure below", "this section will")
- AI slop hedges, cardinality jargon, Toulmin labels
- Treating manifesto as separate document

STRUCTURE (one continuous article):
1. Opening — Genesis as defect report; warranty in the crib
2. I. Clinical proof — twelve witnesses (placeholders in order)
3. Neuroarchitecture — brain widget
4. II. Count it — compute widget
5. III. Torture as failed folk model
6. IV. Eden / Original Sin as manufacture
7. V. Mandate — AI + exit outside original format
8. VI. Christianity — why forbidden (imago Dei, incarnation, resurrection, natural law)
9. VII. Islam — fitra, amanah, khilafa, nafs, clay
10. VIII. Secular humanism — Factor X, dignity, Übermensch panic
11. IX. Exit politics — warranty jurisdictions vs exit jurisdictions; suffering audit
12. Coda — last duty of the human

PLACEHOLDERS (preserve exactly, in narrative order):
Clinical: {{FIG:fig-neuromatrix}} ... {{FIG:fig-lazarus}} then {{FIG:fig-brain}}
{{WIDGET:pm-compute}}
Manifesto infographics: {{FIG:PMX-00}} through {{FIG:PMX-11}} — place where argument needs visual turn

EVIDENCE RE-SPEC (mandatory for every clinical figure + fig-brain):
For each clinical figure_id output structured fields for MOBILE readers:
- who: one line (name, institution, year)
- what: one line (method/finding)
- why_here: one line (why this panel matters to pain-machine thesis)
- credibility: one line (journal, adoption, replication)
- after_html: 2-3 short sentences after figure; plain English; ties to thesis

Keep each field under ~120 characters where possible. Short sentences. No walls of text.

For PMX figures: leave who/what/why/credibility as empty strings; only after_html required.

Output markdown/HTML prose only between placeholders. No <style>, no front matter, no appendix.
"""


def api_key() -> str:
    if os.environ.get("OPENAI_API_KEY"):
        return os.environ["OPENAI_API_KEY"]
    for line in ENV.read_text(encoding="utf-8").splitlines():
        if line.startswith("OPENAI_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"')
    raise SystemExit("No OPENAI_API_KEY")


def compact_article(text: str) -> str:
    text = re.sub(r"^---.*?---\n", "", text, flags=re.S)
    text = re.sub(r"<style>.*?</style>", "", text, flags=re.S)
    for fid in CLINICAL_FIGS:
        text = re.sub(
            rf'<p class="pm-study">.*?</p>\s*<figure class="pm-fig[^"]*" id="{fid}">.*?</figure>\s*(?:<p class="pm-after">.*?</p>\s*)?',
            f"{{{{FIG:{fid}}}}}",
            text,
            flags=re.S,
        )
    text = re.sub(
        r'<div class="pm-compute" id="pm-compute">.*?(?:No fitted constants\.)',
        "{{WIDGET:pm-compute}}",
        text,
        flags=re.S,
    )
    text = re.sub(r"<script.*?</script>", "", text, flags=re.S)
    text = re.sub(r'<div class="pm-appendix">.*', "[APPENDIX — unchanged in merge]", text, flags=re.S)
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def schema() -> dict:
    ev_item = {
        "type": "object",
        "additionalProperties": False,
        "required": ["figure_id", "who", "what", "why_here", "credibility", "after_html"],
        "properties": {
            "figure_id": {"type": "string"},
            "who": {"type": "string"},
            "what": {"type": "string"},
            "why_here": {"type": "string"},
            "credibility": {"type": "string"},
            "after_html": {"type": "string"},
        },
    }
    return {
        "type": "object",
        "additionalProperties": False,
        "required": ["unified_markdown", "evidence_pieces", "voice_notes"],
        "properties": {
            "unified_markdown": {"type": "string"},
            "evidence_pieces": {"type": "array", "items": ev_item},
            "voice_notes": {"type": "string"},
        },
    }


def call_openai(key: str, pain_compact: str, manifesto_md: str, outline_json: str) -> dict:
    placeholders = "\n".join(f"{{{{FIG:{f}}}}}" for f in ALL_FIGS) + "\n{{WIDGET:pm-compute}}\n"
    payload = {
        "model": MODEL,
        "input": [
            {"role": "system", "content": SYSTEM},
            {
                "role": "user",
                "content": (
                    "Rewrite as ONE unified Pain Machines article.\n"
                    "Merge clinical proof + manifesto (theology, mandate, exit politics).\n"
                    "Re-spec ALL evidence pieces for mobile.\n\n"
                    f"PLACEHOLDERS:\n{placeholders}\n\n"
                    f"--- MANIFESTO OUTLINE ---\n{outline_json[:8000]}\n\n"
                    f"--- MANIFESTO PROSE (merge into single arc) ---\n{manifesto_md[:14000]}\n\n"
                    f"--- CURRENT PAIN MACHINES (compact) ---\n{pain_compact[:14000]}"
                ),
            },
        ],
        "reasoning": {"effort": REASONING},
        "text": {
            "verbosity": "high",
            "format": {
                "type": "json_schema",
                "name": "pain_machines_unified",
                "strict": True,
                "schema": schema(),
            },
        },
        "max_output_tokens": 56000,
        "store": False,
    }
    req = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=TIMEOUT_S) as resp:
        body = json.loads(resp.read().decode())
    text = body.get("output_text") or ""
    if not text:
        for item in body.get("output") or []:
            for part in item.get("content") or []:
                if part.get("text"):
                    text += part["text"]
    return {
        "model": body.get("model"),
        "usage": body.get("usage"),
        "feedback": json.loads(text),
    }


def study_html(piece: dict) -> str:
    if not piece.get("who") and not piece.get("what"):
        return ""
    rows = []
    for key, label in [
        ("who", "Who"),
        ("what", "What"),
        ("why_here", "Why"),
        ("credibility", "Cred"),
    ]:
        val = (piece.get(key) or "").strip()
        if val:
            rows.append(
                f'<div class="pm-study-row"><span class="pm-study-k">{label}</span>'
                f'<span class="pm-study-v">{val}</span></div>'
            )
    return f'<div class="pm-study">{"".join(rows)}</div>'


def extract_blocks(text: str) -> dict[str, str]:
    blocks: dict[str, str] = {}
    for fid in CLINICAL_FIGS:
        m = re.search(rf'(<figure class="pm-fig[^"]*" id="{fid}">.*?</figure>)', text, re.S)
        if m:
            blocks[fid] = m.group(1)
    m = re.search(
        r'(<div class="pm-compute" id="pm-compute">.*?(?:No fitted constants\.))',
        text,
        re.S,
    )
    if m:
        blocks["pm-compute"] = m.group(1)
    pmx = json.loads((REPO / "research/pain_machines/manifesto_figures_mobile.json").read_text())
    blocks.update(pmx)
    return blocks


def inject_mobile_css(style: str) -> str:
    extra = """
.pm-study {
  margin: 0 0 .85rem;
  padding: .75rem .85rem;
  border: 1px solid var(--line);
  border-left: 2px solid rgba(184, 154, 106, .45);
  background: var(--panel);
  max-width: none;
}
.pm-study-row {
  display: grid;
  grid-template-columns: 3.25rem 1fr;
  gap: .45rem .65rem;
  align-items: start;
  padding: .2rem 0;
}
.pm-study-row + .pm-study-row {
  border-top: 1px solid rgba(235, 228, 220, .06);
  padding-top: .45rem;
}
.pm-study-k {
  font: 600 .62rem/1.3 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  letter-spacing: .07em;
  text-transform: uppercase;
  color: var(--gold);
}
.pm-study-v {
  font-size: .8rem;
  line-height: 1.5;
  color: #9a9590;
}
.pm-pull {
  margin: 1.25rem 0;
  padding: .75rem .9rem .75rem 1rem;
  border-left: 2px solid var(--gold);
  font-size: .88rem;
  line-height: 1.55;
  color: var(--ink);
  font-style: italic;
  max-width: none;
}
.pm-fig-manifesto svg text {
  font-size: 11px;
}
@media (max-width: 720px) {
  .pm-study-row { grid-template-columns: 1fr; gap: .15rem; }
  .pm-study-k { font-size: .58rem; }
  .pm-study-v { font-size: .78rem; }
  .pm-fig-manifesto .pm-fig-head h4 { font-size: .76rem; }
}
"""
    if ".pm-study-row" in style:
        return style
    return style.rstrip() + extra


def merge(original: str, fb: dict) -> str:
    fm = re.match(r"(^---.*?---\n)", original, re.S)
    style_m = re.search(r"(<style>.*?</style>)", original, re.S)
    appendix = re.search(r"(<div class=\"pm-appendix\">.*)", original, re.S)
    scripts = re.findall(r"(<script[^>]*>.*?</script>)", original, re.S)
    blocks = extract_blocks(original)

    ev = {x["figure_id"]: x for x in fb["evidence_pieces"]}
    body = fb["unified_markdown"].strip()
    if not body.startswith("<div"):
        body = '<div class="pm" id="pain-machines">\n\n' + body + "\n\n</div>"

    for fid, html in blocks.items():
        if fid == "pm-compute":
            continue
        piece = ev.get(fid, {})
        study = study_html(piece)
        after = piece.get("after_html", "").strip()
        chunk = study + "\n" + html if study else html
        if after:
            chunk += f'\n<p class="pm-after">{after}</p>'
        body = body.replace(f"{{{{FIG:{fid}}}}}", chunk)

    if "pm-compute" in blocks:
        body = body.replace("{{WIDGET:pm-compute}}", blocks["pm-compute"])

    missing = re.findall(r"\{\{FIG:(PMX-\d+|fig-[^}]+)\}\}", body)
    if missing:
        raise SystemExit(f"Unresolved placeholders: {missing}")

    parts = []
    if fm:
        fm_text = fm.group(1)
        fm_text = re.sub(
            r"summary: .*",
            'summary: "Humans are pain machines. Original Sin was their manufacture. One article: clinical proof, Genesis as defect report, and the mandate to exit the sacred chassis via AI and morphological freedom."',
            fm_text,
        )
        parts.append(fm_text)
    if style_m:
        parts.append(f"<style>\n{inject_mobile_css(style_m.group(1)[7:-8])}\n</style>")
    parts.append(body)
    for s in scripts:
        if "brain3d" in s or "pm-compute" in s:
            parts.append(s)
    if appendix:
        parts.append("\n\n" + appendix.group(1))
    return "\n".join(parts) + "\n"


def main() -> int:
    import sys

    merge_only = "--merge-only" in sys.argv
    key = api_key()
    original = ARTICLE.read_text(encoding="utf-8")

    if merge_only:
        if not OUT.is_file():
            raise SystemExit(f"No saved draft at {OUT}")
        fb = json.loads(OUT.read_text())["feedback"]
        merged = merge(original, fb)
        MERGED.write_text(merged, encoding="utf-8")
        ARTICLE.write_text(merged, encoding="utf-8")
        void = REPO / "content/posts/void_the_warranty.md"
        if void.is_file():
            void.unlink()
        print(f"Merge-only updated {ARTICLE} ({len(merged):,} chars)")
        return 0

    manifesto = json.loads(MANIFESTO.read_text())["manifesto_markdown"]
    outline = json.dumps(json.loads(OUTLINE.read_text())["outline"], ensure_ascii=False)[:12000]
    compact = compact_article(original)
    print(f"Unified rewrite via {MODEL} reasoning={REASONING}...")
    result = call_openai(key, compact, manifesto, outline)
    fb = result["feedback"]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps({**result, "generated_at": datetime.now(timezone.utc).isoformat()}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Saved draft {OUT}")
    merged = merge(original, fb)
    MERGED.write_text(merged, encoding="utf-8")
    ARTICLE.write_text(merged, encoding="utf-8")

    void = REPO / "content/posts/void_the_warranty.md"
    if void.is_file():
        void.unlink()
        print(f"Removed {void}")

    print(f"Updated {ARTICLE} ({len(merged):,} chars)")
    print("evidence pieces:", len(fb.get("evidence_pieces", [])))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
