#!/usr/bin/env python3
"""GPT-5.5-pro full literary draft of Void the Warranty manifesto from outline."""

from __future__ import annotations

import json
import os
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
OUTLINE_PATH = REPO / "research/pain_machines/manifesto_outline.json"
OUT = REPO / "research/pain_machines/manifesto_draft.json"
ENV = Path("/home/pfrpc/repos/tasknodeofficial/.env.tasknodeofficial-dev")

MODEL = os.environ.get("MANIFESTO_MODEL", "gpt-5.5-pro")
REASONING = os.environ.get("MANIFESTO_REASONING", "xhigh")

FIGURE_IDS = [f"PMX-{i:02d}" for i in range(12)]


def api_key() -> str:
    if os.environ.get("OPENAI_API_KEY"):
        return os.environ["OPENAI_API_KEY"]
    for line in ENV.read_text(encoding="utf-8").splitlines():
        if line.startswith("OPENAI_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"')
    raise SystemExit("No OPENAI_API_KEY")


SYSTEM = """\
You are writing a neo-reactionary manifesto from a detailed outline.

TITLE: Void the Warranty — A manifesto for leaving the pain-machine format

VOICE: Cold, literary, aphoristic, technically exact. Vonnegut clarity + Philip K. Dick metaphysical dread. Neo-reactionary civilizational analysis without chan slop. Steelman opponents before cutting.

BANNED:
- "It's not X, it's Y" / "Not A. B." rhetorical pivots
- Meta-instructions to reader ("the figure below", "read this section as")
- AI slop hedges: "important to note", "it's worth noting", "in conclusion"
- Cheap blasphemy, irony poisoning, racial hierarchy, coercive eugenics cheerleading

REQUIRED:
- Place figure placeholders EXACTLY where infographics belong: {{FIG:PMX-00}} through {{FIG:PMX-11}}
- Use placeholders once per figure ID unless the outline reuses one (PMX-00, PMX-05, PMX-09, PMX-10 may appear twice)
- After each figure placeholder: one short pm-after paragraph (2-4 sentences) closing back to thesis
- Open each major section with a bang sentence from the outline beats
- Link to pain_machines article as established proof in sections I-II (markdown link)
- Use ## headers matching outline section numbers: Prelude, I, II, III, IV, V, VI, VII, Coda
- Pull quotes as blockquote with class: <blockquote class="pm-pull">...</blockquote>
- Pure markdown/HTML prose — no front matter, no style block, no figure SVG

STRUCTURE: Follow outline beats closely. Hit word targets approximately. Be lethal and readable.

Deliver complete manifesto from prelude through coda.
"""


def schema() -> dict:
    return {
        "type": "object",
        "additionalProperties": False,
        "required": ["manifesto_markdown", "voice_notes"],
        "properties": {
            "manifesto_markdown": {"type": "string"},
            "voice_notes": {"type": "string"},
        },
    }


def main() -> int:
    key = api_key()
    outline_data = json.loads(OUTLINE_PATH.read_text(encoding="utf-8"))
    outline = outline_data["outline"]
    payload = {
        "model": MODEL,
        "input": [
            {"role": "system", "content": SYSTEM},
            {
                "role": "user",
                "content": (
                    "Write the complete manifesto from this outline.\n\n"
                    f"OUTLINE JSON:\n{json.dumps(outline, ensure_ascii=False)}\n\n"
                    "Figure placement guide from outline sections' infographic_ids.\n"
                    "pain_machines proof URL: /posts/pain_machines/"
                ),
            },
        ],
        "reasoning": {"effort": REASONING},
        "text": {
            "verbosity": "high",
            "format": {
                "type": "json_schema",
                "name": "manifesto_draft",
                "strict": True,
                "schema": schema(),
            },
        },
        "max_output_tokens": 48000,
        "store": False,
    }
    req = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    print(f"Writing manifesto via {MODEL} reasoning={REASONING}...")
    with urllib.request.urlopen(req, timeout=900) as resp:
        body = json.loads(resp.read().decode())
    text = body.get("output_text") or ""
    if not text:
        for item in body.get("output") or []:
            for part in item.get("content") or []:
                if part.get("text"):
                    text += part["text"]
    draft = json.loads(text)
    result = {
        "model": body.get("model", MODEL),
        "reasoning_effort": REASONING,
        "usage": body.get("usage", {}),
        **draft,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {OUT}")
    wc = len(draft.get("manifesto_markdown", "").split())
    print(f"approx words: {wc}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
