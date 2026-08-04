#!/usr/bin/env python3
"""Regression checks for separating thesis content from research operations."""

from __future__ import annotations

from pathlib import Path
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
PROCESS_MARKERS = (
    "Active acceptance work",
    "Update runbook",
    "Acceptance gate:",
    "Release gate:",
    "Remaining warrant inventory",
    "Freeze a reproducible fiscal-stress normalization",
    "Separate current-law arithmetic",
    "Backtest how the proposed measures behaved",
)
CHECKLIST_REQUIRED = (
    "Claim checklist",
    "Update runbook",
    "Immutable release archive",
    "Coverage-gated score history",
    "Scoring rule",
    "Update cadence",
    "Acceptance gate:",
    "Freeze a reproducible fiscal-stress normalization",
    "Separate current-law arithmetic",
    "Backtest how the proposed measures behaved",
)


class DoomThesisContentSeparationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls._temporary = tempfile.TemporaryDirectory(prefix="doom-content-test-")
        destination = Path(cls._temporary.name)
        subprocess.run(
            ("hugo", "--gc", "--minify", "--destination", str(destination)),
            cwd=ROOT,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )
        cls.thesis = (destination / "doom-thesis/index.html").read_text(encoding="utf-8")
        cls.checklist = (destination / "doom-thesis/checklist/index.html").read_text(
            encoding="utf-8"
        )

    @classmethod
    def tearDownClass(cls) -> None:
        cls._temporary.cleanup()

    def test_reader_facing_thesis_excludes_research_operations(self) -> None:
        for marker in PROCESS_MARKERS:
            with self.subTest(marker=marker):
                self.assertNotIn(marker, self.thesis)

    def test_checklist_preserves_work_inventory(self) -> None:
        for marker in CHECKLIST_REQUIRED:
            with self.subTest(marker=marker):
                self.assertIn(marker, self.checklist)

    def test_thesis_links_to_separate_checklist(self) -> None:
        self.assertIn('href=/doom-thesis/checklist/', self.thesis)

    def test_thesis_preserves_expandable_component_auditability(self) -> None:
        self.assertEqual(self.thesis.count("<details class=doom-index-component"), 6)
        for marker in (
            "Current quantitative inputs",
            "Claim audit",
            "Evidence already on this page",
            "Scoring rule",
            "Coverage-gated score history",
            "Release provenance",
        ):
            with self.subTest(marker=marker):
                self.assertIn(marker, self.thesis)

    def test_common_prosperity_preserves_metric_boundaries(self) -> None:
        for marker in (
            "06 / Common Prosperity",
            "Mortgage rate × median new-house price / median personal income",
            "IWM’s",
            "is not used as “Russell 2000 market cap.”",
            "Birth certificates do not identify U.S.-born or citizen mothers.",
            "one troy-ounce investment bar",
        ):
            with self.subTest(marker=marker):
                self.assertIn(marker, self.thesis)


if __name__ == "__main__":
    unittest.main()
