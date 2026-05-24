#!/usr/bin/env python3
"""Local mobile polish — no API. Fix figures, split long prose, dedupe."""

from __future__ import annotations

import re
from pathlib import Path

ARTICLE = Path(__file__).resolve().parents[1] / "content/posts/pain_machines.md"

LEDGER_VIZ = """<figure class="pm-fig pm-fig-viz" id="pmx-01">
<div class="pm-fig-head">
    <span class="pm-fig-n">PMX-01</span>
    <h4>The Pain Ledger</h4>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="ledger" aria-label="Pleasure plateaus. Pain opens files."></canvas></div>
  <p class="pm-viz-cap">Pleasure plateaus. Pain opens files.</p>
</figure>"""

BEATS = [
    "Pleasure closes loops. Pain opens files.",
    "The body is an alarm system with a mouth.",
    "Every birth ships a warranty: repair yes, exit no.",
    "Genesis blamed the user. The defect was upstream.",
    "Do not polish the cage. Model the lock.",
    "Equal dignity inside a torture chassis is still a prison.",
    "The last duty of the human may be to become a kinder thing.",
]


def fix_figures(text: str) -> str:
    text = re.sub(
        r'<figure class="pm-fig pm-fig-manifesto" id="pmx-01">.*?</figure>',
        LEDGER_VIZ,
        text,
        flags=re.S,
    )
    text = re.sub(
        r'<script src="/research/pain_machines/pm-viz\.js" defer></script>\s*',
        "",
        text,
        count=1,
    )
    return text


def dedupe_after(text: str) -> str:
    return re.sub(
        r'(<p class="pm-after">.*?</p>)\s*\1',
        r"\1",
        text,
        flags=re.S,
    )


def split_long_paragraphs(text: str, max_len: int = 220) -> str:
    """Split bare <p> prose blocks inside pm div only — skip HTML classes."""

    def split_block(m: re.Match) -> str:
        inner = m.group(1).strip()
        if not inner or inner.startswith("<") or len(inner) <= max_len:
            return m.group(0)
        parts = re.split(r"(?<=[.!?])\s+(?=[A-Z\"'])", inner)
        chunks: list[str] = []
        buf = ""
        for p in parts:
            if not p:
                continue
            if len(buf) + len(p) + 1 <= max_len:
                buf = (buf + " " + p).strip()
            else:
                if buf:
                    chunks.append(buf)
                buf = p
        if buf:
            chunks.append(buf)
        if len(chunks) <= 1:
            return m.group(0)
        return "\n\n".join(f"<p>{c}</p>" for c in chunks)

    # markdown paragraphs: blank line separated, not starting with # or <
    lines = text.split("\n")
    out: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if (
            line.strip()
            and not line.strip().startswith(("<", "#", "!", "-", "*", "1.", "2.", "3.", "4.", "5.", "6."))
            and i > 0
            and lines[i - 1].strip() == ""
            and (i + 1 >= len(lines) or lines[i + 1].strip() == "")
        ):
            para = line.strip()
            if len(para) > max_len:
                parts = re.split(r"(?<=[.!?])\s+(?=[A-Z\"'])", para)
                buf = ""
                for p in parts:
                    if len(buf) + len(p) + 1 <= max_len:
                        buf = (buf + " " + p).strip()
                    else:
                        if buf:
                            out.append(buf)
                            out.append("")
                        buf = p
                if buf:
                    out.append(buf)
                    out.append("")
                i += 1
                continue
        out.append(line)
        i += 1
    return "\n".join(out)


def shorten_walls(text: str) -> str:
    replacements = [
        (
            "The first sound most humans make is a pain signal, and civilization calls it health. The room is fluorescent and sterile. Plastic wheels lock beneath a bassinet. A monitor draws its little green biography across a black face while adults lean over a wrapped animal and translate distress into reassurance. Good lungs. Strong cry. Vitality.",
            "The first sound most humans make is a pain signal. Civilization calls it health.\n\nFluorescent room. Plastic bassinet. Monitor green. Adults smile at a cry and call it vitality.",
        ),
        (
            "The child has consented to none of it. No consent to the chassis. No consent to the chemistry. No consent to the hunger cycle, the panic circuitry, the decay schedule, the birth injury waiting in the species, the dentistry of time, the grief map, the vulnerability to fever, tumor, betrayal, humiliation, oxygen debt, memory, and shame. No consent to the civic hymn that will later call this condition dignity. No consent to the religious hymn that will call it creation, trial, fall, purification, gift.",
            "The child consented to none of it: not the chassis, the chemistry, the decay schedule, the grief map.\n\nLater the civic hymn will call this dignity. The religious hymn will call it creation.",
        ),
        (
            "A pain machine is an engineering description, not an insult. It names a biological system governed by alarms, threat salience, damage memory, homeostatic coercion, and a nervous architecture in which suffering proliferates faster than pleasure can stabilize. One wound becomes sensation, fear, anticipation, avoidance, identity, cost, law, and metaphysics. Pleasure usually closes its file. Pain hires clerks.",
            "A pain machine is engineering talk, not an insult.\n\nAlarms, threat memory, homeostatic coercion. One wound becomes sensation, fear, identity, law.\n\n<p class=\"pm-beat\">Pleasure closes its file. Pain hires clerks.</p>",
        ),
        (
            "Medicine has already found the fault. Neuroscience, pain taxonomy, psychophysics, reward science, social psychology, stress theory, and brain imaging all point at the same asymmetry. The human animal counts harm more richly, urgently, and durably than satisfaction. A meal ends. A migraine becomes nausea, light sensitivity, dread of recurrence, lost work, family strain, medication side effects, insurance conflict, and a new self-description. Orgasm resolves. Panic teaches the harmless room to wear the mask of a predator. Comfort fades into baseline. Bereavement builds an archive.",
            "Medicine already found the fault.\n\nHarm is counted more richly than satisfaction. A meal ends. A migraine becomes nausea, dread, lost work, a new self.\n\nOrgasm resolves. Panic paints the harmless room as predator. Bereavement builds an archive.",
        ),
        (
            "Every civilization places a hidden warranty card in the crib. Christianity, Islam, and secular humanism disagree about God, revelation, salvation, law, anthropology, and the final shape of history. Their disagreement is immense and real. Yet each converges on the same protective clause: repair the human, console the human, sanctify the human, dignify the human, but forbid exit from the inherited human format.",
            "Every civilization slips a warranty card in the crib.\n\nChristianity, Islam, secular humanism disagree on God and salvation. They agree on the clause: repair the human, forbid exit.",
        ),
        (
            "Twelve witnesses stand in order: eleven disciplines and instruments, then the brain itself. They do not speak with one accent. That is their strength. A theory invented to explain phantom limbs meets a global definition of pain. A diagnostic code meets a questionnaire. Psychophysics meets reward science. Negativity bias meets social rejection. Appraisal theory meets the wet map of the head. The result is not a mood. It is a defect pattern.",
            "Twelve witnesses. Eleven disciplines, then the brain.\n\nPhantom limb theory meets IASP definition meets ICD-11 meets McGill meets reward science. Not a mood. A defect pattern.",
        ),
        (
            "Watch the green line do what pleasure is allowed to do: climb, then collapse through a quotient. Different pleasures keep finding the same chemical exits.\n\nWatch the red line refuse. Mechanism, location, affect, appraisal, agency, social field, temporality, identity, episodic binding: each axis survives because changing it changes treatment, impairment, or report. The curve keeps climbing because the machine keeps finding new addresses.",
            "Green line: climb, then collapse. Pleasure shares exits.\n\nRed line: keeps climbing. Each axis changes treatment or report. The machine finds new addresses.",
        ),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    return text


def main() -> int:
    text = ARTICLE.read_text(encoding="utf-8")
    text = fix_figures(text)
    text = dedupe_after(text)
    text = shorten_walls(text)
    text = split_long_paragraphs(text)
    if ".pm-viz-cap" not in text.split(".pm-viz-wrap")[0]:
        pass  # cap css already in file
    ARTICLE.write_text(text, encoding="utf-8")
    print(f"Polished {ARTICLE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
