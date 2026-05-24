#!/usr/bin/env python3
"""Inject portrait SVG mobile diagrams; hide desktop-wide figures on narrow screens."""

from __future__ import annotations

import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO / "scripts"))

from mobile_portrait_svgs import MOBILE_PORTRAIT  # noqa: E402

ARTICLE = REPO / "content/posts/pain_machines.md"

CSS_BLOCK = """
.pm-fig-wide { display: block; }
.pm-fig-mobile {
  display: none;
  border-top: 1px solid var(--line);
  background: var(--bg);
}
.pm-fig-mobile svg {
  display: block;
  width: 100%;
  height: auto;
  max-width: 100%;
}
@media (max-width: 720px) {
  .pm .pm-lead,
  .pm .pm-point { max-width: none; }
  .pm-fig-evidence .pm-fig-wide { display: none !important; }
  .pm-fig-evidence .pm-fig-mobile { display: block !important; }
  .pm-fig-evidence .pm-fig-stack { display: none !important; }
  .pm-fig-evidence { overflow: visible; max-width: 100%; }
  .pm-fig-head { flex-direction: column; align-items: flex-start; gap: .3rem; }
  .pm-fig-head h4 { font-size: .82rem; line-height: 1.35; }
  .pm-fig-cap { font-size: .8rem; line-height: 1.5; }
  .pm-chart { overflow-x: auto; -webkit-overflow-scrolling: touch; padding: .5rem .5rem 1rem; }
  .pm-chart svg { min-width: 0; max-width: none; height: auto; }
}
@media (min-width: 721px) {
  .pm-fig-mobile,
  .pm-fig-stack { display: none !important; }
}
"""


def fix_svg(svg: str) -> str:
    return "\n".join(line for line in svg.splitlines() if line.strip())


def inject_portraits(article: str) -> str:
    for fid, svg_raw in MOBILE_PORTRAIT.items():
        if f'id="{fid}"' not in article:
            continue
        svg = fix_svg(svg_raw)
        mobile_block = f'<div class="pm-fig-mobile">\n{svg}\n  </div>'

        # Replace existing stack or mobile block
        pat_stack = (
            rf'(<figure class="pm-fig pm-fig-evidence" id="{re.escape(fid)}">.*?)'
            rf'<div class="pm-fig-(?:stack|mobile)">.*?</div>'
        )
        if re.search(pat_stack, article, re.S):
            article = re.sub(pat_stack, rf"\1{mobile_block}", article, count=1, flags=re.S)
            continue

        # Insert after pm-fig-wide closing div
        pat_wide = (
            rf'(<figure class="pm-fig pm-fig-evidence" id="{re.escape(fid)}">.*?</div>\s*)'
            rf'(\s*<p class="pm-fig-cap">)'
        )
        if re.search(pat_wide, article, re.S):
            article = re.sub(pat_wide, rf"\1{mobile_block}\n  \2", article, count=1, flags=re.S)
            continue

        # Wrap bare svg after head
        pat_bare = (
            rf'(<figure class="pm-fig pm-fig-evidence" id="{re.escape(fid)}">'
            rf'.*?<div class="pm-fig-head">.*?</div>\s*)'
            rf'(<svg\b.*?</svg>)'
            rf'(\s*<p class="pm-fig-cap">)'
        )

        def wrap(m: re.Match) -> str:
            wide = m.group(2).strip()
            return (
                f'{m.group(1)}<div class="pm-fig-wide">\n  {wide}\n  </div>\n'
                f"  {mobile_block}\n  {m.group(3)}"
            )

        article, n = re.subn(pat_bare, wrap, article, count=1, flags=re.S)
        if n == 0:
            raise SystemExit(f"Failed to inject mobile portrait for {fid}")

    return article


def upsert_css(article: str) -> str:
    marker = "/* pm-mobile-fig */"
    block = f"{marker}\n{CSS_BLOCK}"
    if marker not in article:
        return article.replace("</style>", f"{block}\n</style>", 1)
    return re.sub(rf"{re.escape(marker)}.*?(?=\n</style>)", block, article, flags=re.S)


def inject_stacks(article: str) -> str:
    """Compatibility alias — inject portrait SVGs."""
    article = inject_portraits(article)
    return upsert_css(article)


def main() -> int:
    article = ARTICLE.read_text(encoding="utf-8")
    article = inject_stacks(article)
    ARTICLE.write_text(article, encoding="utf-8")
    print(f"Injected {len(MOBILE_PORTRAIT)} mobile portrait SVGs into {ARTICLE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
