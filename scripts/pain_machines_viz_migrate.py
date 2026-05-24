#!/usr/bin/env python3
"""Replace text SVG figures with canvas viz mounts; fix duplicate pm-after; add CSS/JS."""

from __future__ import annotations

import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ARTICLE = REPO / "content/posts/pain_machines.md"

VIZ_CSS = """
.pm-viz-wrap {
  width: 100%;
  aspect-ratio: 16 / 10;
  min-height: 220px;
  max-height: 400px;
  background: var(--bg);
  position: relative;
  overflow: hidden;
}
.pm-viz-wrap canvas.pm-viz {
  display: block;
  width: 100%;
  height: 100%;
}
.pm-fig-viz .pm-fig-fallback { display: none !important; }
.pm-beat {
  margin: 0 0 1rem;
  font-size: .92rem;
  line-height: 1.55;
  color: var(--ink);
  max-width: 42ch;
}
@media (max-width: 720px) {
  .pm-viz-wrap {
    aspect-ratio: 4 / 3;
    min-height: 260px;
    max-height: none;
  }
  .pm p, .pm li { max-width: none; font-size: .88rem; line-height: 1.6; }
  .pm-after { font-size: .82rem; }
  .pm-beat { max-width: none; font-size: .86rem; }
}
"""

CAPTIONS = {
    "fig-neuromatrix": "Many inputs converge. The brain writes pain before the wound finishes arguing.",
    "fig-iasp": "Sensory and emotional pain arrive together. One channel, two alarms.",
    "fig-icd11": "Pain branches in the clinic. One label was never enough.",
    "fig-mcgill": "Patients name pain in dozens of ways. Pleasure shares fewer words.",
    "fig-price": "Pain stacks: intensity, dread, grief. Pleasure rarely builds floors.",
    "fig-berridge": "Liking is tiny. Wanting runs the warehouse.",
    "fig-leknes": "Relief and reward share pipes with pain. Substitution is built in.",
    "fig-baumeister": "Bad events outweigh matched good ones. The scale tips red.",
    "fig-rozin": "Bad spreads. Good stays local.",
    "fig-eisenberger": "Ostracism lights the same circuits as bodily hurt.",
    "fig-lazarus": "Same injury. Different story. Different suffering.",
    "pmx-00": "Every birth ships a warranty: repair yes, exit no.",
    "pmx-01": "Pleasure plateaus. Pain opens files.",
    "pmx-02": "Alarm rises tissue → identity. Upper layers keep screaming.",
    "pmx-03": "Genesis reads like a defect table once you stop blaming the user.",
    "pmx-04": "Warranty theology sends guilt down. The defect report sends it up.",
    "pmx-05": "Every regime blesses the ladder until you cross outside the original format.",
    "pmx-06": "Christianity heals the product. It cannot recall it.",
    "pmx-07": "Islam: stewardship under divine title, not self-ownership.",
    "pmx-08": "Secular dignity needs something unchanged. Factor X is the secular soul.",
    "pmx-09": "Three heavens. One lock on exit.",
    "pmx-10": "Abolition is a route, not a sales pitch for heaven.",
    "pmx-11": "Count involuntary suffering. Stop calling preservation mercy.",
}


def fix_duplicates(text: str) -> str:
    text = re.sub(
        r'<p class="pm-after"><p class=[\'"]pm-after[\'"]>(.*?)</p></p>\s*<p class=[\'"]pm-after[\'"]>\1</p>',
        r'<p class="pm-after">\1</p>',
        text,
        flags=re.S,
    )
    return text


ID_MAP = {
    "fig-neuromatrix": "neuromatrix",
    "fig-iasp": "iasp",
    "fig-icd11": "icd11",
    "fig-mcgill": "mcgill",
    "fig-price": "price",
    "fig-berridge": "berridge",
    "fig-leknes": "leknes",
    "fig-baumeister": "baumeister",
    "fig-rozin": "rozin",
    "fig-eisenberger": "eisenberger",
    "fig-lazarus": "lazarus",
    "pmx-00": "warranty",
    "pmx-01": "ledger",
    "pmx-02": "stack",
    "pmx-03": "genesis",
    "pmx-04": "inversion",
    "pmx-05": "ladder",
    "pmx-06": "christian",
    "pmx-07": "islam",
    "pmx-08": "secular",
    "pmx-09": "regimes",
    "pmx-10": "roadmap",
    "pmx-11": "audit",
}


def svg_to_viz(text: str) -> str:
    def repl(m: re.Match) -> str:
        fid = m.group(1)
        head = m.group(2)
        if fid == "fig-brain":
            return m.group(0)
        viz = ID_MAP.get(fid, fid)
        cap = CAPTIONS.get(fid, "")
        cap_html = f'\n  <p class="pm-viz-cap">{cap}</p>' if cap else ""
        return (
            f'<figure class="pm-fig pm-fig-viz" id="{fid}">\n'
            f"{head}\n"
            f'  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="{viz}" aria-label="{cap or fid}"></canvas></div>'
            f"{cap_html}\n"
            f"</figure>"
        )

    pat = re.compile(
        r'<figure class="pm-fig[^"]*" id="([^"]+)">\s*(<div class="pm-fig-head">.*?</div>)\s*<svg.*?</svg>\s*</figure>',
        re.S,
    )
    return pat.sub(repl, text)


def inject_assets(text: str) -> str:
    if "pm-viz.js" not in text:
        text = text.replace(
            "</div>\n\n<div class=\"pm-appendix\">",
            '</div>\n<script src="/research/pain_machines/pm-viz.js" defer></script>\n\n<div class="pm-appendix">',
        )
        if "pm-viz.js" not in text:
            text = re.sub(
                r"(</div>\s*\n\s*<div class=\"pm-appendix\">)",
                r'</div>\n<script src="/research/pain_machines/pm-viz.js" defer></script>\n\n<div class="pm-appendix">',
                text,
                count=1,
            )
    if ".pm-viz-wrap" not in text:
        text = text.replace("</style>", VIZ_CSS + "\n</style>", 1)
    text = text.replace("# Void the Warranty", "# Pain Machines")
    text = text.replace(
        "### Pain Machines and the Mandate to Leave the Human Format",
        "### Original Sin was manufacturing the human as a pain machine",
    )
    return text


def main() -> int:
    text = ARTICLE.read_text(encoding="utf-8")
    text = fix_duplicates(text)
    text = svg_to_viz(text)
    text = inject_assets(text)
    ARTICLE.write_text(text, encoding="utf-8")
    n = len(re.findall(r'class="pm-viz"', text))
    print(f"Updated {ARTICLE}: {n} canvas viz mounts")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
