#!/usr/bin/env python3
"""Merge manifesto draft + figures into Hugo post."""

from __future__ import annotations

import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DRAFT = REPO / "research/pain_machines/manifesto_draft.json"
FIGURES = REPO / "research/pain_machines/manifesto_figures.json"
OUTLINE = REPO / "research/pain_machines/manifesto_outline.json"
OUT = REPO / "content/posts/void_the_warranty.md"
PAIN_CSS = REPO / "content/posts/pain_machines.md"

EXTRA_CSS = """
.pm-pull {
  margin: 1.5rem 0;
  padding: .85rem 1rem .85rem 1.1rem;
  border-left: 2px solid var(--gold);
  font-size: .92rem;
  line-height: 1.55;
  color: var(--ink);
  font-style: italic;
  max-width: 52ch;
}
.pm-lede {
  font-size: 1.02rem;
  line-height: 1.6;
  color: var(--muted);
  max-width: 62ch;
  margin-bottom: 1.5rem;
}
.pm-logline {
  margin: 0 0 2rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--line);
  background: var(--panel);
  font-size: .88rem;
  line-height: 1.6;
  color: var(--muted);
  max-width: 68ch;
}
"""


def extract_css() -> str:
    text = PAIN_CSS.read_text(encoding="utf-8")
    m = re.search(r"<style>(.*?)</style>", text, re.S)
    if not m:
        raise SystemExit("Could not extract CSS from pain_machines.md")
    css = m.group(1).rstrip()
    if ".pm-pull" not in css:
        css += EXTRA_CSS
    return css


def merge_figures(md: str, figures: dict[str, str]) -> str:
    for fid, html in figures.items():
        md = md.replace(f"{{{{FIG:{fid}}}}}", html)
    missing = re.findall(r"\{\{FIG:(PMX-\d+)\}\}", md)
    if missing:
        raise SystemExit(f"Unresolved figure placeholders: {missing}")
    return md


def main() -> int:
    draft = json.loads(DRAFT.read_text(encoding="utf-8"))
    figures = json.loads(FIGURES.read_text(encoding="utf-8"))
    outline = json.loads(OUTLINE.read_text(encoding="utf-8"))["outline"]
    md = merge_figures(draft["manifesto_markdown"], figures)
    css = extract_css()
    front = f"""---
author: ["goodalexander"]
title: "{outline['title']}"
date: 2026-05-24T18:00:00Z
draft: false
summary: "{outline['logline'][:200]}"
categories: ["philosophy"]
tags: ["post fiat", "philosophy", "long-form"]
ShowToc: true
---

<style>
{css}
</style>
<div class="pm" id="void-the-warranty">

<p class="pm-logline">{outline['logline']}</p>

"""
    body = md.strip()
    if not body.startswith("#"):
        body = f"# {outline['title']}\n\n*{outline['subtitle']}*\n\n" + body
    post = front + body + "\n\n</div>\n"
    OUT.write_text(post, encoding="utf-8")
    print(f"Wrote {OUT} ({len(post)} chars)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
