---
author: ["goodalexander"]
title: "Pain Machines"
date: 2026-05-23T20:00:00Z
draft: false
summary: "Original Sin was not disobedience. It was shipping a creature whose suffering-space is N orders of magnitude larger than its pleasure-space."
categories: ["philosophy"]
tags: ["post fiat", "philosophy", "long-form"]
ShowToc: true
---

<style>
.pm {
  --bg: #040506;
  --panel: #0a0b0d;
  --line: rgba(235, 228, 220, 0.1);
  --ink: #ebe4dc;
  --muted: #8a9199;
  --dim: #555c64;
  --gold: #b89a6a;
  --pain: #b85c55;
  --pleasure: #7a9a8c;
  color: var(--ink);
  font-variant-ligatures: common-ligatures;
}
.pm * { box-sizing: border-box; }
.pm p, .pm li {
  color: var(--muted);
  line-height: 1.65;
  max-width: 68ch;
}
.pm h3 {
  margin: 0 0 .35rem;
  font-size: .95rem;
  font-weight: 500;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--dim);
}
.pm-compute {
  margin: 2rem 0;
  border: 1px solid var(--line);
  background: var(--panel);
}
.pm-compute-head {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem 1rem;
  align-items: center;
  justify-content: space-between;
  padding: .75rem 1rem;
  border-bottom: 1px solid var(--line);
}
.pm-compute-head strong {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: .82rem;
  font-weight: 500;
  color: var(--ink);
}
.pm-profile {
  display: flex;
  gap: .35rem;
  flex-wrap: wrap;
}
.pm-profile button {
  border: 1px solid var(--line);
  background: transparent;
  color: var(--muted);
  font: 500 .75rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  padding: .4rem .65rem;
  cursor: pointer;
  min-height: 36px;
  touch-action: manipulation;
}
.pm-profile button.is-active {
  border-color: rgba(235, 228, 220, .28);
  color: var(--ink);
  background: rgba(235, 228, 220, .04);
}
.pm-src {
  margin: 0;
  padding: 1rem 1rem 1rem 1.1rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--line);
  background: #060708;
  color: #c5bfb7;
  font: 400 .74rem/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  -webkit-overflow-scrolling: touch;
}
.pm-src .c { color: #5f6b73; }
.pm-src .k { color: #9a7bff; }
.pm-src .n { color: #b89a6a; }
.pm-src .s { color: #7a9a8c; }
.pm-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: var(--line);
  border-bottom: 1px solid var(--line);
}
.pm-metric {
  padding: .85rem 1rem;
  background: var(--panel);
}
.pm-metric b {
  display: block;
  font: 500 1.35rem/1.1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-variant-numeric: tabular-nums;
}
.pm-metric span {
  display: block;
  margin-top: .25rem;
  font-size: .72rem;
  color: var(--dim);
  line-height: 1.35;
}
.pm-metric.p b { color: var(--pleasure); }
.pm-metric.n b { color: var(--pain); }
.pm-metric.r b { color: var(--gold); }
.pm-chart {
  padding: .5rem .75rem 1rem;
  min-height: 300px;
}
.pm-chart + .pm-chart {
  border-top: 1px solid var(--line);
}
.pm-chart-cap {
  padding: .85rem 1rem 0;
  font-size: .72rem;
  color: var(--dim);
  letter-spacing: .03em;
  text-transform: uppercase;
}
.pm-chart-cap strong {
  display: block;
  margin-bottom: .15rem;
  color: var(--muted);
  font-size: .78rem;
  font-weight: 500;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.pm-json-wrap {
  border-top: 1px solid var(--line);
}
.pm-json-wrap summary {
  padding: .65rem 1rem;
  cursor: pointer;
  font: 500 .75rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--dim);
  list-style: none;
  touch-action: manipulation;
  min-height: 44px;
  display: flex;
  align-items: center;
}
.pm-json-wrap summary::-webkit-details-marker { display: none; }
.pm-json-wrap summary::before {
  content: "▸";
  margin-right: .5rem;
  color: var(--muted);
}
.pm-json-wrap[open] summary::before { content: "▾"; }
.pm-json-wrap summary:hover { color: var(--muted); }
.pm-chart svg {
  display: block;
  width: 100%;
  height: auto;
}
.pm-json {
  margin: 0;
  padding: 1rem;
  max-height: 420px;
  overflow: auto;
  background: #060708;
  color: #aeb6bf;
  font: 400 .72rem/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  border-top: 1px solid var(--line);
  -webkit-overflow-scrolling: touch;
}
.pm-foot {
  padding: .65rem 1rem;
  border-top: 1px solid var(--line);
  font-size: .72rem;
  color: var(--dim);
  line-height: 1.45;
}
.pm-foot a { color: var(--muted); }
.pm-appendix {
  margin-top: 2.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line);
}
.pm-appendix h2 {
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: .03em;
  margin: 0 0 1rem;
  color: var(--ink);
}
.pm-appendix h4 {
  margin: 1.35rem 0 .55rem;
  font-size: .78rem;
  font-weight: 500;
  letter-spacing: .05em;
  text-transform: uppercase;
  color: var(--dim);
}
.pm-src-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.pm-src-list li {
  margin-bottom: .7rem;
  padding-bottom: .7rem;
  border-bottom: 1px solid rgba(235, 228, 220, .05);
  font-size: .8rem;
  line-height: 1.55;
  color: var(--muted);
  max-width: 76ch;
}
.pm-src-list li:last-child { border-bottom: 0; }
.pm-src-list a {
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid rgba(235, 228, 220, .18);
}
.pm-src-list a:hover { border-bottom-color: var(--gold); }
.pm-src-list em { color: var(--dim); font-style: normal; }
.pm-src-list .use { display: block; margin-top: .2rem; color: var(--dim); font-size: .74rem; }
@media (max-width: 720px) {
  .pm-metrics { grid-template-columns: 1fr; }
  .pm-compute-head { align-items: stretch; }
  .pm-profile { width: 100%; }
  .pm-profile button { flex: 1; text-align: center; }
}
</style>

<div class="pm" id="pain-machines">

Genesis frames the bug as disobedience. That is a mislabeled stack trace.

The actual fault is architectural. Clinical psychology and pain medicine have spent decades **inventorying** suffering — the McGill Pain Questionnaire alone lists 78 distinguishable descriptors across sensory, affective, and evaluative domains. Hedonic neuroscience, meanwhile, keeps converging on a **small set of receptor families** that synthetic drugs can hijack interchangeably.

Put those literatures into the same formalism — Cartesian state-space products — and the asymmetry is not poetic. It is countable.

## I. What the clinics already know

**Pain multiplies.** Melzack's neuromatrix model treats pain as network output — somatic input plus appraisal, social context, memory, and identity — not as a direct readout of tissue damage ([Melzack, 2001](https://pubmed.ncbi.nlm.nih.gov/11780656/)). The IASP's revised definition (2020) insists pain is always **both sensory and emotional** ([Raja et al., 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7680716/)). The ICD-11 chronic pain chapter (2022) encodes that biopsychosocial structure into seven top-level diagnoses with nested subtypes ([Treede et al., 2022](https://journals.lww.com/pain/fulltext/2022/02000/classification_of_chronic_pain_for_the.29.aspx)).

Clinicians do not ask "rate your nociception 1–10." They deploy instruments. The McGill Pain Questionnaire lists **78 words** across sensory, affective, and evaluative subclasses ([Melzack, 1975](https://pubmed.ncbi.nlm.nih.gov/1235985/)) — because ordinary language already knows pain factorizes. Price's work separates **pain sensation** from **pain unpleasantness** and secondary affect ([Price, 2000](https://doi.org/10.1126/science.288.5472.1769)); the dimensions do not collapse under analgesia the way bliss collapses under fentanyl.

**Pleasure compresses.** Weber–Fechner psychophysics gives you a handful of discriminable intensity bins per modality. Berridge and Kringelbach map "liking" onto a **small set of hedonic hotspots** — nucleus accumbens, ventral pallidum, orbitofrontal cortex — while "wanting" sprawls across a much larger mesolimbic system ([Berridge & Kringelbach, 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4425246/)). Leknes and Tracey note that opioid and dopamine circuits modulate both pain and reward, but that shared substrate is exactly why synthetics can substitute for natural bliss ([Leknes & Tracey, 2008](https://www.nature.com/articles/nrn2333)).

**Bad dominates good — and varies more.** Baumeister's review finds negative events outweigh positive across trauma, relationships, learning, and self-concept — with almost no exceptions ([Baumeister et al., 2001](https://doi.org/10.1037/1089-2680.5.4.323)). Cacioppo and colleagues formalize **negative differentiation**: negative entities are more varied, yield richer representations, and engage wider response repertoires than equivalent positive ones ([Rozin & Royzman, 2001](https://doi.org/10.1207/S15327957PSPR0504_2)). That is not mood. It is **state-space geometry**.

The pharmacological catalog is small. The pain descriptor catalog is not. Lazarus's appraisal theory adds another independent axis: the same injury framed as injustice, fate, or self-blame is not the same state ([Lazarus & Folkman, 1984](https://archive.org/details/stressappraisalc0000laza)).

## II. Enumerate it

Below is a **state-space estimator**: explicit axes, explicit level counts, explicit collapse rules. Pleasure gets a pharmacological quotient. Pain does not — because clinically, grief does not collapse to toothache under fentanyl.

<div class="pm-compute" id="pm-compute">
  <div class="pm-compute-head">
    <strong>pain_machines_state_space_v1.py</strong>
    <div class="pm-profile" role="tablist" aria-label="Sensitivity profile">
      <button type="button" data-profile="conservative">conservative</button>
      <button type="button" data-profile="central" class="is-active">central</button>
      <button type="button" data-profile="liberal">liberal</button>
    </div>
  </div>

  <pre class="pm-src" aria-label="Model source excerpt"><code><span class="k">def</span> analyze(profile):
    spec = PROFILES[profile]
    pleasure = pleasure_analysis(spec)  <span class="c"># pharmacological quotient applied</span>
    pain = pain_analysis(spec)          <span class="c"># collapse = identity</span>
    ratio = pain[<span class="s">"distinguishable_states"</span>] / pleasure[<span class="s">"effective_states_after_quotient"</span>]
    <span class="k">return</span> ratio, build_traces</code></pre>

  <div class="pm-metrics">
    <div class="pm-metric p"><b id="pm-p-eff">—</b><span>pleasure effective states (post-quotient)</span></div>
    <div class="pm-metric n"><b id="pm-n-states">—</b><span>pain distinguishable states (full product)</span></div>
    <div class="pm-metric r"><b id="pm-log10">—</b><span>log₁₀(pain / pleasure)</span></div>
  </div>

  <div class="pm-chart-cap"><strong>Figure 1</strong>Cumulative log₁₀ state-space build · each axis multiplies distinct states</div>
  <div class="pm-chart" id="pm-chart" aria-label="Cumulative log10 state-space build"></div>

  <div class="pm-chart-cap"><strong>Figure 2</strong>Inventory cross-check · model output vs McGill descriptor count vs pharmacopeia classes</div>
  <div class="pm-chart" id="pm-chart-inventory" aria-label="Inventory cross-check"></div>

  <details class="pm-json-wrap">
    <summary>Export model JSON</summary>
    <pre class="pm-json" id="pm-json" aria-label="Model output JSON"></pre>
  </details>

  <div class="pm-foot">
    Full source: <a href="/research/pain_machines/model.py">model.py</a> ·
    Run locally: <code>python model.py --profile central --json</code>
  </div>
</div>

### Reading Figure 1

The green trace is pleasure: three axes, then a **quotient step** where modalities collapse to receptor classes. The curve flattening is the argument — industrial bliss is compressible.

The red trace is pain: eight axes, no collapse. Each clinical dimension (mechanism, location, appraisal, social field, temporality, identity, agency, episodic binding) multiplies the space. The curve keeps climbing because the literature treats these as **independent contributors**, not redundant labels for the same signal.

### Reading Figure 2

Three ways to count the same thesis:

1. **Model output** — full cross-product under the selected profile.
2. **McGill MPQ** — 78 published pain descriptors across 20 subclass categories ([Melzack, 1975](https://pubmed.ncbi.nlm.nih.gov/1235985/)). A lower bound from vocabulary alone, before combinatorics.
3. **Pharmacopeia classes** — ~11 analgesic / anxiolytic / dopaminergic families that approximate engineered pleasure SKUs (see Appendix §C).

Even the vocabulary gap (78 vs 11) is ~7×. The combinatorial model is ~10³–10⁴. Both point the same direction: **the hardware enumerates suffering faster than it compresses bliss.**

Conservative and liberal profiles bracket the band by varying bin counts only. No fitted constants.

## III. Original Sin as mislabeled spec

The Eden story tells you the crime was curiosity. The enumeration tells you the crime was **specification** — shipping a creature whose pain state-space has higher cardinality than its pleasure state-space, then moralizing the output.

That is what "Pain Machines" names. Not metaphor. Firmware.

More sections forthcoming: Eden mislabeled, the pleasure stack vs pain kernel, Pain-as-a-Service.

<div class="pm-appendix">

## Appendix. Sources

<p>Linked readings behind the axes, inventories, and charts. Full bibliography also ships as <a href="/research/pain_machines/SOURCES.md">SOURCES.md</a>.</p>

<h4>A. Pain measurement & clinical taxonomy</h4>
<ul class="pm-src-list">
  <li>
    <a href="https://pubmed.ncbi.nlm.nih.gov/1235985/">Melzack R (1975). The McGill Pain Questionnaire: major properties and scoring methods. <em>Pain</em> 1(3):277–299.</a>
    <span class="use">Primary source for the 78-descriptor inventory in Figure 2; sensory / affective / evaluative subclass structure.</span>
  </li>
  <li>
    <a href="https://www.mcgill.ca/painresearch/research/mcgill-pain-questionnaire">McGill University — McGill Pain Questionnaire resource page.</a>
    <span class="use">Instrument history; SF-MPQ revisions; clinical scoring notes.</span>
  </li>
  <li>
    <a href="https://journals.lww.com/pain/fulltext/2022/02000/classification_of_chronic_pain_for_the.29.aspx">Treede RD et al. (2022). Classification of chronic pain for the ICD-11. <em>Pain</em> 163(2):e1–e14.</a>
    <span class="use">IASP task-force taxonomy; seven chronic-pain categories; biopsychosocial framing used in the pain_mechanism axis.</span>
  </li>
  <li>
    <a href="https://www.iasp-pain.org/advocacy/structure-of-the-icd-11-classification/">IASP — Structure of the ICD-11 chronic pain classification (MG30).</a>
    <span class="use">Operational ICD-11 hierarchy: primary, neuropathic, visceral, postsurgical, etc.</span>
  </li>
  <li>
    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7680716/">Raja SN et al. (2020). The revised IASP definition of pain. <em>Pain</em> 161(9):1976–1982.</a>
    <span class="use">Pain as inseparable sensory + emotional experience; motivates non-collapsing pain axes.</span>
  </li>
  <li>
    <a href="https://www.iasp-pain.org/wp-content/uploads/2022/04/revised-definition-flysheet_R2-1-1-1.pdf">IASP — Revised definition of pain flysheet (2020).</a>
    <span class="use">Plain-language summary of the 2020 definition and accompanying notes.</span>
  </li>
</ul>

<h4>B. Pain as multidimensional construct</h4>
<ul class="pm-src-list">
  <li>
    <a href="https://pubmed.ncbi.nlm.nih.gov/11780656/">Melzack R (2001). Pain and the neuromatrix in the brain. <em>J Dent Educ</em> 65(12):1378–1382.</a>
    <span class="use">Neuromatrix / neurosignature model; pain generated by distributed brain network, not input alone; basis for episodic_embedding axis.</span>
  </li>
  <li>
    <a href="https://doi.org/10.1126/science.288.5472.1769">Price DD (2000). Psychological and neural mechanisms of the affective dimension of pain. <em>Science</em> 288(5472):1769–1772.</a>
    <span class="use">Serial dissociation of sensation intensity, unpleasantness, and secondary affect; cortico-limbic vs direct pathways.</span>
  </li>
  <li>
    <a href="https://pubmed.ncbi.nlm.nih.gov/18607258/">Berns GS et al. (2008). The price of pain and the value of suffering. <em>Psychol Sci</em> 19(4):309–317.</a>
    <span class="use">Experimental market for pain avoidance; willingness-to-pay for relief is context-dependent — suffering is not a single fungible SKU.</span>
  </li>
  <li>
    <a href="https://archive.org/details/stressappraisalc0000laza">Lazarus RS, Folkman S (1984). <em>Stress, Appraisal, and Coping.</em> Springer.</a>
    <span class="use">Cognitive appraisal families; same stressor → different suffering by frame; pain_appraisal axis.</span>
  </li>
  <li>
    <a href="https://www.nature.com/articles/35053509">Hunt SP, Mantyh PW (2001). The molecular dynamics of pain control. <em>Nat Rev Neurosci</em> 2:83–91.</a>
    <span class="use">Parallel spinothalamic (sensory) vs spinoparabrachial (affective) pain pathways; mechanism heterogeneity.</span>
  </li>
  <li>
    <a href="https://pubmed.ncbi.nlm.nih.gov/18003941/">Treede RD et al. (2008). Neuropathic pain: redefinition and a grading system. <em>Neurology</em> 70(18):1630–1635.</a>
    <span class="use">Nociceptive vs neuropathic vs nociplastic distinction; clinical mechanism granularity.</span>
  </li>
</ul>

<h4>C. Hedonic compression & reward neuroscience</h4>
<ul class="pm-src-list">
  <li>
    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4425246/">Berridge KC, Kringelbach ML (2015). Pleasure systems in the brain. <em>Neuron</em> 86(3):646–664.</a>
    <span class="use">Hedonic hotspots vs sprawling "wanting" system; common neural currency of pleasure; pharmacological_quotient rationale.</span>
  </li>
  <li>
    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3004012/">Berridge KC, Kringelbach ML (2010). Affective neuroscience of pleasure. In <em>Pleasures of the Brain</em>.</a>
    <span class="use">Liking vs wanting vs learning; orbitofrontal representation vs subcortical causation of pleasure.</span>
  </li>
  <li>
    <a href="https://www.nature.com/articles/nrn2333">Leknes S, Tracey I (2008). A common neurobiology for pain and pleasure. <em>Nat Rev Neurosci</em> 9:314–320.</a>
    <span class="use">Opioid/dopamine overlap; mutual inhibition of pain and reward — explains substitutability of engineered bliss.</span>
  </li>
  <li>
    <a href="https://www.accessdata.fda.gov/scripts/cder/daf/">FDA Drugs@FDA — approved drug products database.</a>
    <span class="use">Ground truth for pharmacopeia-class enumeration (opioids, benzodiazepines, stimulants, etc.) behind the ~11-class inventory check.</span>
  </li>
</ul>

<h4>D. Affective asymmetry & negative dominance</h4>
<ul class="pm-src-list">
  <li>
    <a href="https://doi.org/10.1037/1089-2680.5.4.323">Baumeister RF et al. (2001). Bad is stronger than good. <em>Review of General Psychology</em> 5(4):323–370.</a>
    <span class="use">Cross-domain evidence that negative events outweigh positive; bad information processed more thoroughly.</span>
  </li>
  <li>
    <a href="https://doi.org/10.1207/S15327957PSPR0504_2">Rozin P, Royzman EB (2001). Negativity bias, negativity dominance, and contagion. <em>Perspectives on Psychological Science</em>.</a>
    <span class="use">Negative potency, negative differentiation (negative states more varied); direct support for high-cardinality suffering.</span>
  </li>
  <li>
    <a href="https://doi.org/10.1037/0022-3514.75.4.887">Ito TA et al. (1998). Negative information weighs more heavily on the brain. <em>J Personality & Social Psychology</em> 75(4):887–900.</a>
    <span class="use">ERP evidence for stronger neural weighting of negative vs matched positive evaluative categories.</span>
  </li>
  <li>
    <a href="https://doi.org/10.1037/0033-295X.105.3.482">Cacioppo JT, Berntson GG (1999). The affect system. <em>Psychological Review</em>.</a>
    <span class="use">Evaluative-space model; separable positive/negative substrates; negativity bias and positivity offset.</span>
  </li>
  <li>
    <a href="https://doi.org/10.2307/1914185">Kahneman D, Tversky A (1979). Prospect theory: an analysis of decision under risk. <em>Econometrica</em> 47(2):263–291.</a>
    <span class="use">Losses loom larger than gains; economic formalization parallel to pain/pleasure asymmetry.</span>
  </li>
</ul>

<h4>E. Psychophysics & measurement foundations</h4>
<ul class="pm-src-list">
  <li>
    <a href="https://plato.stanford.edu/entries/weber-fechners-law/">Stanford Encyclopedia of Philosophy — Weber-Fechner law.</a>
    <span class="use">Logarithmic intensity perception; justification for discrete JND bins on pleasure_intensity axis.</span>
  </li>
  <li>
    <a href="https://www.sralab.org/rehabilitation-measures/mcgill-pain-questionnaire">Shirley Ryan AbilityLab — McGill Pain Questionnaire measure profile.</a>
    <span class="use">Independent replication of 78-word structure, subclass counts, and clinical use cases.</span>
  </li>
</ul>

<h4>F. Model & reproducibility</h4>
<ul class="pm-src-list">
  <li>
    <a href="/research/pain_machines/model.py">pain_machines_state_space_v1 — model.py</a>
    <span class="use">Canonical Python implementation of axis products, pharmacological quotient, and JSON export.</span>
  </li>
  <li>
    <a href="/research/pain_machines/README.md">pain_machines — README</a>
    <span class="use">Run instructions: <code>python model.py --profile central --json</code></span>
  </li>
  <li>
    <a href="/research/pain_machines/SOURCES.md">pain_machines — SOURCES.md</a>
    <span class="use">Plain-text mirror of this appendix for citation and LLM ingestion.</span>
  </li>
</ul>

</div>

</div>

<script type="application/json" id="pm-spec">{
  "profiles": {
    "conservative": {"pleasure_intensity":3,"pleasure_duration":3,"pleasure_modality":4,"pain_mechanism":4,"pain_location":8,"pain_appraisal":4,"pain_social":3,"pain_temporal":3,"pain_identity":3,"pain_agency":3,"pain_episodic":4},
    "central": {"pleasure_intensity":5,"pleasure_duration":4,"pleasure_modality":6,"pain_mechanism":6,"pain_location":12,"pain_appraisal":5,"pain_social":4,"pain_temporal":4,"pain_identity":4,"pain_agency":4,"pain_episodic":6},
    "liberal": {"pleasure_intensity":7,"pleasure_duration":5,"pleasure_modality":8,"pain_mechanism":8,"pain_location":16,"pain_appraisal":6,"pain_social":5,"pain_temporal":5,"pain_identity":5,"pain_agency":5,"pain_episodic":8}
  },
  "modalityToReceptor": {"0":"dopaminergic","1":"dopaminergic","2":"opioidergic","3":"oxytocinergic","4":"mixed","5":"opioidergic","6":"dopaminergic","7":"mixed"}
}</script>

<script>
(() => {
  const root = document.getElementById('pain-machines');
  const specEl = document.getElementById('pm-spec');
  if (!root || !specEl || root.dataset.ready) return;
  root.dataset.ready = 'true';

  const { profiles, modalityToReceptor } = JSON.parse(specEl.textContent);
  let profile = 'central';

  const pleasureAxisMeta = [
    ['intensity_jnd_bins', 'pleasure_intensity', 'Weber-Fechner JND bins'],
    ['duration_regime', 'pleasure_duration', 'acute / session / day / sustained'],
    ['modality', 'pleasure_modality', 'consumption, achievement, touch, social, aesthetic, relief']
  ];
  const painAxisMeta = [
    ['somatic_mechanism', 'pain_mechanism', 'IASP 2021 mechanism taxonomy'],
    ['location', 'pain_location', 'regional somatic / visceral map'],
    ['cognitive_appraisal', 'pain_appraisal', 'Lazarus appraisal families'],
    ['social_field', 'pain_social', 'alone / intimate / professional / public'],
    ['temporality', 'pain_temporal', 'acute / recurrent / chronic / dread'],
    ['identity_salience', 'pain_identity', 'peripheral / personal / reputation / core self'],
    ['agency_attribution', 'pain_agency', 'self / other / system / fate / ambiguous'],
    ['episodic_embedding', 'pain_episodic', 'Melzack neuromatrix episode binding']
  ];

  function receptorQuotient(n) {
    const classes = new Set();
    for (let i = 0; i < n; i += 1) classes.add(modalityToReceptor[String(i % 8)]);
    return classes.size;
  }

  function buildTrace(meta, spec, key) {
    const trace = [];
    let running = 1;
    for (const [name, field, source] of meta) {
      const levels = spec[field];
      running *= levels;
      trace.push({ axis: name, levels, [key]: running, source });
    }
    return trace;
  }

  function analyze(name) {
    const spec = { name, ...profiles[name] };
    const pTrace = buildTrace(pleasureAxisMeta, spec, 'running_raw');
    const rawP = pTrace[pTrace.length - 1].running_raw;
    const collapsed = receptorQuotient(spec.pleasure_modality);
    const pEff = spec.pleasure_intensity * spec.pleasure_duration * collapsed;
    pTrace.push({
      axis: 'pharmacological_quotient',
      levels: collapsed,
      running_raw: pEff,
      source: 'Receptor-class collapse: synthetic agonists interchange within class'
    });

    const nTrace = buildTrace(painAxisMeta, spec, 'running_product');
    const nStates = nTrace[nTrace.length - 1].running_product;
    const ratio = nStates / Math.max(pEff, 1);

    return {
      model: 'pain_machines_state_space_v1',
      profile: name,
      spec,
      pleasure: {
        raw_cartesian_states: rawP,
        effective_states_after_quotient: pEff,
        build_trace: pTrace
      },
      pain: {
        distinguishable_states: nStates,
        collapse_function: 'identity',
        build_trace: nTrace
      },
      comparison: {
        pain_over_pleasure_ratio: ratio,
        log10_orders_of_magnitude: Math.round(Math.log10(ratio) * 100) / 100
      },
      independent_checks: {
        mcgill_pain_questionnaire_descriptor_count: 78,
        mcgill_sensory_subscale_descriptors: 20,
        mcgill_affective_subscale_descriptors: 12,
        mcgill_evaluative_subscale_descriptors: 8,
        fda_analgesic_anxiolytic_dopaminergic_sku_classes: 11,
        ratio_from_descriptor_inventory: Math.round((78 / 11) * 100) / 100
      },
      claim: 'Original Sin mislabels the bug. The spec ships high-cardinality suffering and low-cardinality pleasure that collapses under pharmacological equivalence.'
    };
  }

  const fmt = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(2)}e6` : n >= 1e4 ? n.toLocaleString() : String(n);

  function renderMetrics(result) {
    document.getElementById('pm-p-eff').textContent = fmt(result.pleasure.effective_states_after_quotient);
    document.getElementById('pm-n-states').textContent = fmt(result.pain.distinguishable_states);
    document.getElementById('pm-log10').textContent = `10^${result.comparison.log10_orders_of_magnitude}`;
    document.getElementById('pm-json').textContent = JSON.stringify(result, null, 2);
  }

  function renderChart(result) {
    const node = document.getElementById('pm-chart');
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    const W = 880, H = mobile ? 340 : 300;
    const ml = mobile ? 52 : 68, mr = 16, mt = 28, mb = mobile ? 72 : 58;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Log10 cumulative state space');

    const add = (name, attrs) => {
      const el = document.createElementNS(svgNS, name);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      svg.appendChild(el);
      return el;
    };

    const pSteps = result.pleasure.build_trace.map(s => ({
      label: s.axis.replace(/_/g, ' '),
      log: Math.log10(Math.max(1, s.running_raw ?? s.running_product))
    }));
    const nSteps = result.pain.build_trace.map(s => ({
      label: s.axis.replace(/_/g, ' '),
      log: Math.log10(Math.max(1, s.running_product))
    }));
    const maxLog = Math.max(4, ...pSteps.map(s => s.log), ...nSteps.map(s => s.log)) + 0.35;
    const y = v => mt + (1 - v / maxLog) * (H - mt - mb);
    const colP = (W - ml - mr) * 0.38;
    const colN = (W - ml - mr) * 0.62;
    const xP = i => ml + (i / Math.max(1, pSteps.length - 1)) * colP;
    const xN = i => ml + colN + (i / Math.max(1, nSteps.length - 1)) * ((W - ml - mr) - colN);

    for (let t = 0; t <= Math.ceil(maxLog); t += 1) {
      add('line', { x1: ml, x2: W - mr, y1: y(t), y2: y(t), stroke: 'rgba(235,228,220,.07)', 'stroke-width': 1 });
      add('text', { x: ml - 8, y: y(t) + 3, fill: '#555c64', 'font-size': 10, 'text-anchor': 'end', 'font-family': 'monospace' }).textContent = `10^${t}`;
    }

    add('text', { x: ml + colP * 0.5, y: 16, fill: '#7a9a8c', 'font-size': 11, 'text-anchor': 'middle', 'font-family': 'monospace' }).textContent = 'pleasure → quotient';
    add('text', { x: ml + colN + (W - ml - mr - colN) * 0.5, y: 16, fill: '#b85c55', 'font-size': 11, 'text-anchor': 'middle', 'font-family': 'monospace' }).textContent = 'pain → no collapse';

    const draw = (steps, xFn, color) => {
      let prev = null;
      steps.forEach((s, i) => {
        const cx = xFn(i), cy = y(s.log);
        if (prev) add('line', { x1: prev.x, y1: prev.y, x2: cx, y2: cy, stroke: color, 'stroke-width': 1.5, opacity: .85 });
        add('circle', { cx, cy, r: 3.5, fill: color });
        if (mobile ? (i === 0 || i === steps.length - 1 || i % 2 === 0) : true) {
          add('text', {
            x: cx, y: H - mb + 14 + (i % 2) * 12, fill: '#8a9199', 'font-size': 9,
            'text-anchor': i === 0 ? 'start' : (i === steps.length - 1 ? 'end' : 'middle'),
            'font-family': 'monospace'
          }).textContent = s.label.length > 14 ? s.label.slice(0, 12) + '…' : s.label;
        }
        prev = { x: cx, y: cy };
      });
    };

    draw(pSteps, xP, '#7a9a8c');
    draw(nSteps, xN, '#b85c55');

    node.replaceChildren(svg);
  }

  function renderInventoryChart(result) {
    const node = document.getElementById('pm-chart-inventory');
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    const W = 880, H = mobile ? 220 : 200;
    const ml = mobile ? 118 : 200, mr = 20, mt = 16, mb = 36;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Inventory cross-check');

    const add = (name, attrs, text) => {
      const el = document.createElementNS(svgNS, name);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      if (text != null) el.textContent = text;
      svg.appendChild(el);
      return el;
    };

    const rows = [
      { label: 'pleasure (model, post-quotient)', value: result.pleasure.effective_states_after_quotient, color: '#7a9a8c' },
      { label: 'pharmacopeia SKU classes', value: result.independent_checks.fda_analgesic_anxiolytic_dopaminergic_sku_classes, color: '#6a7570' },
      { label: 'McGill MPQ descriptors', value: result.independent_checks.mcgill_pain_questionnaire_descriptor_count, color: '#9a7b6a' },
      { label: 'pain (model, full product)', value: result.pain.distinguishable_states, color: '#b85c55' }
    ];
    const maxLog = Math.max(4.5, ...rows.map(r => Math.log10(Math.max(1, r.value)))) + 0.2;
    const x0 = ml, x1 = W - mr;
    const x = v => x0 + (Math.log10(Math.max(1, v)) / maxLog) * (x1 - x0);
    const rowH = (H - mt - mb) / rows.length;

    for (let t = 0; t <= Math.floor(maxLog); t += 1) {
      const xx = x(Math.pow(10, t));
      add('line', { x1: xx, x2: xx, y1: mt - 4, y2: H - mb, stroke: 'rgba(235,228,220,.06)', 'stroke-width': 1 });
      add('text', { x: xx, y: H - 10, fill: '#555c64', 'font-size': 9, 'text-anchor': 'middle', 'font-family': 'monospace' }, `10^${t}`);
    }

    rows.forEach((row, i) => {
      const yy = mt + i * rowH + rowH * 0.55;
      add('text', {
        x: mobile ? 8 : 8, y: yy + 4, fill: '#8a9199', 'font-size': mobile ? 9 : 10,
        'text-anchor': 'start', 'font-family': 'monospace'
      }, mobile && row.label.length > 22 ? row.label.replace(' (model, post-quotient)', '').replace(' (model, full product)', ' (model)') : row.label);
      const barW = Math.max(2, x(row.value) - x0);
      add('rect', {
        x: x0, y: yy - rowH * 0.22, width: barW, height: Math.max(6, rowH * 0.44),
        fill: row.color, opacity: 0.9
      });
      add('text', {
        x: x0 + barW + 6, y: yy + 4, fill: '#ebe4dc', 'font-size': 10,
        'text-anchor': 'start', 'font-family': 'monospace'
      }, fmt(row.value));
    });

    node.replaceChildren(svg);
  }

  function renderProfileButtons() {
    const bar = root.querySelector('.pm-profile');
    if (!bar || bar.dataset.bound) return;
    bar.dataset.bound = 'true';
    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-profile]');
      if (!btn) return;
      profile = btn.dataset.profile;
      bar.querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b === btn));
      const result = analyze(profile);
      renderMetrics(result);
      renderChart(result);
      renderInventoryChart(result);
    });
  }

  function renderAll() {
    const result = analyze(profile);
    renderMetrics(result);
    renderChart(result);
    renderInventoryChart(result);
  }

  renderProfileButtons();
  renderAll();
  let t;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(renderAll, 120); });
})();
</script>
