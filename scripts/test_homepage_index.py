#!/usr/bin/env python3
"""Verify that every post stays one click from the homepage.

The homepage is the goodalexander landing; it links to /archive/, which Hugo renders from the same
post set as /archives/. The check: the homepage links to /archive/, and /archive/ lists every post in
the /archives/ index exactly once.
"""

from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re
import sys


class ArchivesParser(HTMLParser):
    """Post URLs from Hugo's /archives/ page (one <article> per post)."""

    def __init__(self) -> None:
        super().__init__()
        self.urls: list[str] = []
        self.in_article = False
        self.taken = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "article":
            self.in_article, self.taken = True, False
        elif tag == "a" and self.in_article and not self.taken:
            href = dict(attrs).get("href") or ""
            if href.startswith(("/posts/", "/post/")):
                self.urls.append(href)
                self.taken = True

    def handle_endtag(self, tag: str) -> None:
        if tag == "article":
            self.in_article = False


def post_path(href: str) -> str:
    return re.sub(r"^https?://[^/]+", "", href)


def main() -> None:
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "public")
    home = (out / "index.html").read_text(encoding="utf-8")
    if not re.search(r'href="?(?:/|https://goodalexander\.com/)?archive/', home):
        raise AssertionError("homepage must link to the archive (/archive/)")

    parser = ArchivesParser()
    parser.feed((out / "archives" / "index.html").read_text(encoding="utf-8"))
    archived = parser.urls
    listed = [post_path(h) for h in re.findall(
        r'<li><a href="?([^"\s>]+/posts?/[^"\s>]+)', (out / "archive" / "index.html").read_text(encoding="utf-8"))]

    if not archived or not listed:
        raise AssertionError("/archives/ and /archive/ must both contain posts")
    dupes = sorted(u for u, n in Counter(listed).items() if n > 1)
    if dupes:
        raise AssertionError(f"/archive/ lists posts more than once: {dupes}")
    if set(listed) != set(archived):
        raise AssertionError(
            "/archive/ must list every archived post: "
            f"missing={sorted(set(archived) - set(listed))}, unexpected={sorted(set(listed) - set(archived))}")
    print(f"homepage index ok: homepage links /archive/, which lists all {len(listed)} posts once")


if __name__ == "__main__":
    main()
