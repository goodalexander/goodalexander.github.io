#!/usr/bin/env python3
"""Inject Pearl-style stacked mobile explanations for evidence figures."""

from __future__ import annotations

import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ARTICLE = REPO / "content/posts/pain_machines.md"

CSS_BLOCK = """
.pm-fig-wide { display: block; }
.pm-fig-stack {
  display: none;
  gap: .55rem;
  padding: .75rem .85rem;
  border-top: 1px solid var(--line);
}
.pm-m-card {
  border: 1px solid var(--line);
  background: var(--panel);
  padding: .7rem .8rem;
}
.pm-m-card.pain { border-color: rgba(184, 92, 85, .45); background: #120909; }
.pm-m-card.gold { border-color: rgba(184, 154, 106, .45); }
.pm-m-card.good { border-color: rgba(122, 154, 140, .45); background: #0d1a12; }
.pm-m-card .k {
  display: block;
  font: 600 .58rem/1.2 ui-monospace, monospace;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--dim);
  margin-bottom: .35rem;
}
.pm-m-card .v {
  display: block;
  font-size: .84rem;
  line-height: 1.45;
  color: var(--ink);
}
.pm-m-card .h {
  display: block;
  margin-top: .35rem;
  font-size: .76rem;
  line-height: 1.4;
  color: var(--muted);
}
.pm-m-row {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  gap: .45rem .65rem;
  align-items: start;
  padding: .45rem 0;
  border-bottom: 1px solid rgba(235, 228, 220, .06);
  font-size: .8rem;
  line-height: 1.45;
}
.pm-m-row:last-child { border-bottom: 0; }
.pm-m-row .k {
  font: 600 .58rem/1.3 ui-monospace, monospace;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--gold);
}
.pm-m-row .v { color: var(--muted); }
.pm-m-flow { display: grid; gap: .45rem; }
.pm-m-step {
  position: relative;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, .02);
  padding: .55rem .65rem .55rem 2rem;
  font-size: .8rem;
  line-height: 1.45;
  color: var(--muted);
}
.pm-m-step strong { display: block; color: var(--ink); font-weight: 500; font-size: .82rem; }
.pm-m-step .n {
  position: absolute;
  left: .55rem;
  top: .55rem;
  width: 1.1rem;
  height: 1.1rem;
  border: 1px solid rgba(184, 154, 106, .45);
  color: var(--gold);
  font: 700 .58rem/1.1rem ui-monospace, monospace;
  text-align: center;
}
.pm-m-step:not(:last-child)::after {
  content: "↓";
  display: block;
  text-align: center;
  color: var(--gold);
  font-size: .75rem;
  margin: .15rem 0 -.15rem;
}
.pm-m-tags { display: flex; flex-wrap: wrap; gap: .35rem; }
.pm-m-tag {
  padding: .25rem .45rem;
  border: 1px solid var(--line);
  border-radius: 2px;
  font: 500 .68rem/1.2 ui-monospace, monospace;
  color: var(--muted);
}
.pm-m-tag.pain { border-color: rgba(184, 92, 85, .45); color: #d4847d; }
.pm-m-tag.good { border-color: rgba(122, 154, 140, .45); color: #9ab8ac; }
.pm-m-meter { display: grid; gap: .5rem; }
.pm-m-meter-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: .35rem .5rem;
  align-items: center;
  font-size: .76rem;
}
.pm-m-meter-row span { color: var(--muted); }
.pm-m-meter-row em {
  font: 700 .68rem/1 ui-monospace, monospace;
  font-style: normal;
  color: var(--pain);
}
.pm-m-meter-track {
  grid-column: 1 / -1;
  height: 8px;
  background: rgba(255, 255, 255, .04);
  border: 1px solid var(--line);
  overflow: hidden;
}
.pm-m-meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #b85c55, #b89a6a);
}
.pm-m-meter-fill.good { background: linear-gradient(90deg, #5a8a72, #7a9a8c); }
.pm-m-join {
  text-align: center;
  font: 600 .62rem/1 ui-monospace, monospace;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--pain);
  padding: .25rem 0;
}
@media (max-width: 720px) {
  .pm-fig-evidence .pm-fig-wide { display: none; }
  .pm-fig-evidence .pm-fig-stack { display: grid; }
  .pm-fig-evidence { overflow: visible; }
  .pm-fig-evidence .pm-fig-wide svg { min-width: 0; }
}
@media (min-width: 721px) {
  .pm-fig-stack { display: none !important; }
}
"""


def card(k: str, v: str, hint: str = "", tone: str = "") -> str:
    cls = f"pm-m-card {tone}".strip()
    h = f'\n    <span class="h">{hint}</span>' if hint else ""
    return f'  <div class="{cls}">\n    <span class="k">{k}</span>\n    <span class="v">{v}</span>{h}\n  </div>'


def row(k: str, v: str) -> str:
    return f'  <div class="pm-m-row"><span class="k">{k}</span><span class="v">{v}</span></div>'


def flow(*steps: tuple[str, str]) -> str:
    parts = ['  <div class="pm-m-flow">']
    for i, (title, hint) in enumerate(steps, 1):
        parts.append(
            f'    <div class="pm-m-step"><span class="n">{i}</span>'
            f"<strong>{title}</strong>{hint}</div>"
        )
    parts.append("  </div>")
    return "\n".join(parts)


def tags(items: list[tuple[str, str]]) -> str:
    bits = ['  <div class="pm-m-tags">']
    for label, tone in items:
        bits.append(f'    <span class="pm-m-tag {tone}">{label}</span>')
    bits.append("  </div>")
    return "\n".join(bits)


def meter(label: str, pct: int, tone: str = "") -> str:
    return f"""  <div class="pm-m-meter-row">
    <span>{label}</span><em>{pct}%</em>
    <div class="pm-m-meter-track"><div class="pm-m-meter-fill {tone}" style="width:{pct}%"></div></div>
  </div>"""


MOBILE: dict[str, str] = {
    "pmx-00": "\n".join([
        card("Product", "Homo sapiens — shipped at birth without consent", tone="gold"),
        card("Known defects", "Pain · fear · grief · decay · death", tone="pain"),
        card("Warranty terms", "Repair permitted · exit prohibited", "Every civilization slips this card in the crib."),
        card("Christianity", "Sanctify the body · forbid exit", tone="gold"),
        card("Islam", "Amanah (trust) · forbid self-ownership", tone="gold"),
        card("Secular humanism", "Dignity · forbid natural-kind break", tone="gold"),
        card("Convergence", "Repair yes · exit no — same lock, three keys", tone="pain"),
    ]),
    "fig-neuromatrix": "\n".join([
        card("Evidence", "Melzack neuromatrix — pain is distributed brain output", "Not a wound-to-wire meter."),
        flow(
            ("Somatic input", "One contributor · insufficient alone"),
            ("Appraisal · memory · identity", "Meaning, prior episodes, self-schema"),
            ("Social field · stress", "Context and arousal gate"),
            ("Neuromatrix", "Brain writes pain output pattern"),
            ("Pain experience", "≠ damage magnitude"),
        ),
    ]),
    "fig-iasp": "\n".join([
        card("IASP 2020", "Revised definition — two mandatory dimensions", tone="gold"),
        card("Sensory channel", "Quality · intensity · location · duration", tone="pain"),
        card("Emotional channel", "Unpleasantness · distress · threat", tone="gold"),
        '  <div class="pm-m-join">always both → pain</div>',
        card("Clinical point", "Associated with actual or potential tissue damage — but experience can persist without it", tone="pain"),
    ]),
    "fig-icd11": "\n".join([
        card("WHO ICD-11 MG30", "Chronic pain is a disease category, not a long complaint", tone="gold"),
        flow(
            ("MG30.0 primary / nociplastic", "Pain without clear ongoing injury"),
            ("MG30.1 cancer pain", "Tumor and treatment-related"),
            ("MG30.2 postsurgical / posttraumatic", "Persists after healing expected"),
            ("MG30.3 musculoskeletal", "Back, joint, widespread"),
            ("MG30.4–6 neuropathic · headache · visceral", "Nerve, cranial, organ pain"),
            ("MG30.7 secondary syndromes", "Fibromyalgia, CRPS, etc."),
        ),
        card("Takeaway", "The alarm can outlive the fire — chronicity becomes the illness", tone="pain"),
    ]),
    "fig-mcgill": "\n".join([
        card("McGill Pain Questionnaire", "78 pain descriptors in clinical use", tone="gold"),
        card("Pleasure vocabulary", "Reward · satiety · calm — few shared words", tone="good"),
        tags([
            ("burning", "pain"), ("stabbing", "pain"), ("shooting", "pain"),
            ("sickening", "pain"), ("exhausting", "pain"), ("terrifying", "pain"),
            ("punishing", "pain"), ("gnawing", "pain"), ("heavy", "pain"),
            ("splitting", "pain"), ("tight", "pain"), ("nagging", "pain"),
        ]),
        card("Takeaway", "Pain demands a language map pleasure rarely needs", tone="pain"),
    ]),
    "fig-price": "\n".join([
        card("Price affect dimensions", "Same stimulus · multiple ledgers", tone="gold"),
        '  <div class="pm-m-meter">',
        meter("Sensory intensity", 85, "pain"),
        meter("Unpleasantness / misery", 72, "pain"),
        meter("Anticipatory dread", 58, "pain"),
        "  </div>",
        card("Takeaway", "One injury becomes more than one bill", tone="pain"),
    ]),
    "fig-berridge": "\n".join([
        card("Berridge wanting vs liking", "Reward can chase what it no longer enjoys", tone="gold"),
        row("Wanting", "Large mesolimbic territory — dopamine-driven pursuit"),
        row("Liking", "Compact hot spots — hedonic 'liking'"),
        card("Pain contrast", "Red circuitry has empires; green has tricks", tone="pain"),
    ]),
    "fig-leknes": "\n".join([
        flow(
            ("Threat / pain", "Baseline alarm state"),
            ("Relief", "Pleasure with a history of threat"),
            ("Reward substitution", "End-of-pain can feel like reward"),
        ),
        card("Takeaway", "Even green light often borrows from red darkness", tone="pain"),
    ]),
    "fig-baumeister": "\n".join([
        card("Baumeister et al.", "Bad is stronger than good across domains", tone="gold"),
        '  <div class="pm-m-meter">',
        meter("Impact of matched bad event", 92, "pain"),
        meter("Impact of matched good event", 38, "good"),
        "  </div>",
        card("Takeaway", "Harm writes in heavier ink — not an exception in the clinic", tone="pain"),
    ]),
    "fig-rozin": "\n".join([
        card("Rozin & Royzman", "Negativity bias and contamination", tone="gold"),
        row("Bad spreads", "One stain contaminates neighbors, memory, identity"),
        row("Good stays local", "Positive events rarely generalize the same way"),
        card("Takeaway", "Pain machines become culture machines when negativity learns language", tone="pain"),
    ]),
    "fig-eisenberger": "\n".join([
        card("Eisenberger et al.", "Social exclusion recruits bodily distress circuits", tone="gold"),
        flow(
            ("Ostracism / rejection", "Face, silence, room that stops welcoming you"),
            ("dACC · anterior insula", "Overlap with physical hurt networks"),
            ("Felt injury", "Social wound arrives as bodily alarm"),
        ),
    ]),
    "fig-lazarus": "\n".join([
        card("Lazarus & Folkman", "Appraisal transforms the event", tone="gold"),
        flow(
            ("Primary appraisal", "Is this threat, loss, or challenge?"),
            ("Secondary appraisal", "Can I cope? Who is to blame?"),
            ("Coping response", "Emotion-focused or problem-focused"),
            ("Felt pain", "Same blow → injury, insult, prophecy, or doom"),
        ),
    ]),
    "pmx-01": "\n".join([
        card("Pleasure ledger", "Reward · satiety · calm — few branches", tone="good"),
        tags([
            ("nociception", "pain"), ("neuropathy", "pain"), ("allodynia", "pain"),
            ("panic", "pain"), ("grief", "pain"), ("chronicity", "pain"),
            ("trauma memory", "pain"), ("shame", "pain"),
        ]),
        card("Evidence", "McGill 78 descriptors · ICD-11 seven categories · Baumeister bad > good"),
        card("Takeaway", "Suffering enumerates faster than satisfaction", tone="pain"),
    ]),
    "pmx-02": flow(
        ("Tissue · nociceptor", "Peripheral signal"),
        ("Spinal gate · thalamus", "Gating and relay"),
        ("Insula · ACC", "Interoception and salience"),
        ("Memory · prediction", "Prior episodes shape output"),
        ("Identity · social cost", "Alarm becomes biography and law"),
    ),
    "pmx-03": "\n".join([
        card("Traditional read", "Disobedience → curse → guilt", tone="gold"),
        card("Defect read", "Embodied vulnerability → reproductive trauma → mortality", tone="pain"),
        flow(
            ("Dust → breath → command", "Manufacture sequence"),
            ("Tree → eyes open", "Self-report switched on"),
            ("Birth pain · toil · grave", "Hardware properties, not moral invoice"),
        ),
        card("Root cause", "Design architecture — not user error", tone="pain"),
    ]),
    "pmx-04": "\n".join([
        card("Warranty theology", "Disobedience → Fall → suffering → redemption", tone="gold"),
        card("Defect report", "Pain-machine architecture → consciousness of harm → blame narrative", tone="pain"),
        card("Inversion", "Fault moves upstream — from creature to design", tone="gold"),
    ]),
    "pmx-05": "\n".join([
        flow(
            ("Pain medicine", "Allowed repair"),
            ("Prosthetics · psychiatry", "Allowed repair"),
            ("Gene repair · neural interfaces", "Allowed repair"),
            ("Affect editing · synthetic body", "Exit — outside original format"),
            ("Substrate migration", "Exit — veto band begins"),
        ),
        card("Veto bands", "Christian natural law · Islamic fitra Q 4:119 · secular dignity / Factor X", tone="pain"),
    ]),
    "pmx-06": "\n".join([
        card("Sacred object", "Human body — imago Dei · incarnation · resurrection", tone="gold"),
        row("Repair OK", "Medicine · prosthetic · charity"),
        row("Exit forbidden", "Abandon flesh · rival eschatology"),
        card("Policy", "Redeem · do not recall", tone="pain"),
    ]),
    "pmx-07": "\n".join([
        card("Amanah", "Body as trust · Q 2:30 khilafa", tone="gold"),
        row("Repair OK", "Therapeutic repair under divine title"),
        row("Exit forbidden", "Ontological alteration · self-ownership · contempt for clay"),
        card("Boundary", "Stewardship ≠ manufacture", tone="pain"),
    ]),
    "pmx-08": "\n".join([
        card("Secular triangle", "Dignity · equality · natural kind", tone="gold"),
        card("Factor X", "Human essence anchor — Fukuyama · Habermas · UNESCO", tone="gold"),
        card("Trap", "Posthuman exit breaks the triangle", tone="pain"),
    ]),
    "pmx-09": "\n".join([
        card("Christianity", "Sacred: imago Dei · repair: medicine · exit: abandon flesh", tone="gold"),
        card("Islam", "Sacred: fitra · repair: harm removal · exit: alter creation", tone="gold"),
        card("Secular humanism", "Sacred: dignity · repair: therapy · exit: posthuman taboo", tone="gold"),
        card("All three converge", "Repair yes · exit no", tone="pain"),
    ]),
    "pmx-10": flow(
        ("Proof", "Clinical + psych evidence (this article)"),
        ("Mandate", "Void the warranty — ordered refusal"),
        ("AI design", "Engineer without pain-machine defaults"),
        ("Exit labs", "Morphological freedom under law"),
        ("Post-human ?", "Not heaven sales — hazard management"),
    ),
    "pmx-11": "\n".join([
        card("Involuntary pain-hours", "↓ target zero", tone="pain"),
        card("Chronic pain prevalence", "20%+ globally", tone="pain"),
        card("Severe mental distress", "~970M people", tone="pain"),
        card("Access to exit tech", "~0% under warranty regimes", tone="gold"),
        card("Policy levers", "Analgesia · psychiatric repair · morphological freedom · personhood law · AI safety"),
    ]),
}


def inject_stacks(article: str) -> str:
    for fid, stack in MOBILE.items():
        pat = (
            rf'(<figure class="pm-fig pm-fig-evidence" id="{re.escape(fid)}">'
            rf'.*?<div class="pm-fig-head">.*?</div>\s*)'
            rf'(<svg\b.*?</svg>)'
            rf'(\s*(?:<p class="pm-fig-cap">|</figure>))'
        )

        def repl(m: re.Match, stack_html: str = stack) -> str:
            if "pm-fig-stack" in m.group(0):
                return m.group(0)
            wide = m.group(2).strip()
            tail = m.group(3)
            if not tail.startswith("\n  <p"):
                tail = "\n  " + tail.lstrip()
            return (
                f"{m.group(1)}<div class=\"pm-fig-wide\">\n  {wide}\n  </div>\n"
                f"  <div class=\"pm-fig-stack\">\n{stack_html}\n  </div>{tail}"
            )

        article, n = re.subn(pat, repl, article, count=1, flags=re.S)
        if n == 0 and f'id="{fid}"' in article:
            raise SystemExit(f"Failed to inject mobile stack for {fid}")
    return article


def upsert_css(article: str) -> str:
    if ".pm-fig-stack" in article:
        article = re.sub(
            r"/\* pm-mobile-fig \*/.*?(?=/\* /|\n</style>)",
            "",
            article,
            flags=re.S,
        )
        article = re.sub(
            r"\.pm-fig-evidence \{\s*overflow-x: auto;.*?\}\s*",
            "",
            article,
            flags=re.S,
        )
        article = re.sub(
            r"\.pm-fig-evidence svg \{\s*min-width: 640px;.*?\}\s*",
            "",
            article,
            flags=re.S,
        )
    marker = "/* pm-mobile-fig */"
    if marker not in article:
        article = article.replace("</style>", f"{marker}\n{CSS_BLOCK}\n</style>", 1)
    else:
        article = re.sub(
            rf"{re.escape(marker)}.*?(?=\n</style>)",
            f"{marker}\n{CSS_BLOCK}",
            article,
            flags=re.S,
        )
    return article


def main() -> int:
    article = ARTICLE.read_text(encoding="utf-8")
    article = inject_stacks(article)
    article = upsert_css(article)
    ARTICLE.write_text(article, encoding="utf-8")
    print(f"Injected {len(MOBILE)} mobile stacks into {ARTICLE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
