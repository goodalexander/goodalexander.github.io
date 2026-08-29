#!/usr/bin/env python3
"""Verify that the homepage exposes the complete, deduplicated post index."""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
import sys


@dataclass(frozen=True)
class Entry:
    url: str
    title: str


class EntryParser(HTMLParser):
    def __init__(self, required_article_class: str | None = None) -> None:
        super().__init__()
        self.required_article_class = required_article_class
        self.entries: list[Entry] = []
        self.current_url = ""
        self.current_title: list[str] = []
        self.in_entry = False
        self.in_heading = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if tag == "article":
            classes = set((attributes.get("class") or "").split())
            self.in_entry = (
                self.required_article_class is None
                or self.required_article_class in classes
            )
            self.current_url = ""
            self.current_title = []
            self.in_heading = False
            return

        if not self.in_entry:
            return
        if tag == "h3":
            self.in_heading = True
        elif tag == "a" and not self.current_url:
            href = attributes.get("href") or ""
            if href.startswith(("/posts/", "/post/")):
                self.current_url = href

    def handle_endtag(self, tag: str) -> None:
        if tag == "h3":
            self.in_heading = False
        elif tag == "article" and self.in_entry:
            title = " ".join("".join(self.current_title).split())
            if self.current_url and title:
                self.entries.append(Entry(self.current_url, title))
            self.in_entry = False

    def handle_data(self, data: str) -> None:
        if self.in_entry and self.in_heading:
            self.current_title.append(data)


def parse_entries(path: Path, article_class: str | None = None) -> list[Entry]:
    parser = EntryParser(article_class)
    parser.feed(path.read_text(encoding="utf-8"))
    return parser.entries


def repeated(values: list[str]) -> list[str]:
    return sorted(value for value, count in Counter(values).items() if count > 1)


def main() -> None:
    output_dir = Path(sys.argv[1] if len(sys.argv) > 1 else "public")
    home_entries = parse_entries(output_dir / "index.html", "ga-feed-row")
    archive_entries = parse_entries(output_dir / "archives" / "index.html")

    if not home_entries or not archive_entries:
        raise AssertionError("homepage and archive must both contain posts")

    duplicate_urls = repeated([entry.url for entry in home_entries])
    duplicate_titles = repeated([entry.title.casefold() for entry in home_entries])
    if duplicate_urls or duplicate_titles:
        raise AssertionError(
            f"homepage contains duplicates: urls={duplicate_urls}, titles={duplicate_titles}"
        )

    home_urls = {entry.url for entry in home_entries}
    archive_urls = {entry.url for entry in archive_entries}
    if home_urls != archive_urls:
        raise AssertionError(
            "homepage must expose every archived post: "
            f"missing={sorted(archive_urls - home_urls)}, "
            f"unexpected={sorted(home_urls - archive_urls)}"
        )

    print(
        f"homepage index ok: {len(home_entries)} unique posts match the complete archive"
    )


if __name__ == "__main__":
    main()
