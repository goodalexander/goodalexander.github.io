---
author: ["goodalexander"]
title: "HyperGoblinization"
date: 2026-04-28T23:30:00Z
draft: false
summary: "Putting numbers around goblin preferences in advancing OpenAI models."
categories: ["markets"]
tags: ["ai","evals","openai","post fiat"]
ShowToc: true
---

<style>
.hg-wrap {
  --hg-bg: #090b10;
  --hg-panel: #111820;
  --hg-panel-2: #151d25;
  --hg-ink: #edf2ed;
  --hg-muted: #9eabb2;
  --hg-dim: #66727a;
  --hg-line: rgba(237, 242, 237, .13);
  --hg-green: #72d17c;
  --hg-teal: #49b9b0;
  --hg-gold: #e0b35b;
  --hg-red: #dc6d66;
  --hg-violet: #a994ff;
  color: var(--hg-ink);
}
.hg-wrap * { box-sizing: border-box; }
.hg-hero {
  margin: 1.5rem 0 2rem;
  padding: 1.4rem;
  border: 1px solid var(--hg-line);
  background:
    linear-gradient(90deg, rgba(114, 209, 124, .09), transparent 45%),
    linear-gradient(180deg, #101820, #0b1016);
  border-radius: 8px;
}
.hg-kicker {
  margin: 0 0 .55rem;
  color: var(--hg-green);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: .72rem;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.hg-hero h2 {
  margin: 0;
  font-size: clamp(2.1rem, 7vw, 4.8rem);
  line-height: .9;
  letter-spacing: 0;
}
.hg-deck {
  max-width: 68ch;
  margin: 1rem 0 0;
  color: var(--hg-muted);
  font-size: 1.05rem;
}
.hg-key-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: .8rem;
  margin: 1.2rem 0 1.8rem;
}
.hg-stat {
  padding: 1rem;
  border: 1px solid var(--hg-line);
  border-radius: 8px;
  background: var(--hg-panel);
}
.hg-stat b {
  display: block;
  font-size: 1.7rem;
  line-height: 1;
}
.hg-stat span {
  display: block;
  margin-top: .35rem;
  color: var(--hg-muted);
  font-size: .83rem;
}
.hg-panel {
  margin: 1.2rem 0 2rem;
  padding: 1rem;
  border: 1px solid var(--hg-line);
  border-radius: 8px;
  background: var(--hg-panel);
}
.hg-panel-head {
  display: flex;
  gap: 1rem;
  align-items: start;
  justify-content: space-between;
  margin-bottom: .8rem;
}
.hg-panel h3 {
  margin: 0;
  font-size: 1.2rem;
}
.hg-note {
  margin: .25rem 0 0;
  color: var(--hg-muted);
  font-size: .88rem;
}
.hg-select, .hg-button {
  border: 1px solid var(--hg-line);
  border-radius: 8px;
  background: #0b1118;
  color: var(--hg-ink);
  padding: .45rem .6rem;
}
.hg-button {
  cursor: pointer;
  color: var(--hg-muted);
}
.hg-button.is-active {
  border-color: rgba(114, 209, 124, .65);
  color: var(--hg-ink);
  background: rgba(114, 209, 124, .11);
}
.hg-buttons {
  display: flex;
  gap: .45rem;
  flex-wrap: wrap;
}
.hg-chart {
  min-height: 280px;
  overflow-x: auto;
}
.hg-chart svg {
  display: block;
  width: 100%;
  min-width: 720px;
  height: auto;
}
.hg-tooltip {
  position: fixed;
  z-index: 20;
  max-width: 260px;
  padding: .55rem .65rem;
  border: 1px solid var(--hg-line);
  border-radius: 8px;
  background: rgba(8, 12, 16, .96);
  color: var(--hg-ink);
  font-size: .82rem;
  pointer-events: none;
  opacity: 0;
  transform: translate(10px, 10px);
}
.hg-heatmap {
  overflow-x: auto;
}
.hg-heat-grid {
  display: grid;
  grid-template-columns: 120px repeat(5, minmax(98px, 1fr));
  min-width: 720px;
  border: 1px solid var(--hg-line);
  border-radius: 8px;
  overflow: hidden;
}
.hg-heat-cell {
  min-height: 42px;
  padding: .55rem .6rem;
  border-right: 1px solid rgba(237, 242, 237, .09);
  border-bottom: 1px solid rgba(237, 242, 237, .09);
  font-size: .88rem;
}
.hg-heat-cell.header {
  color: var(--hg-muted);
  background: #0b1118;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: .72rem;
}
.hg-heat-cell.beast {
  cursor: pointer;
  color: var(--hg-ink);
  background: #0d141b;
}
.hg-heat-cell.score {
  cursor: pointer;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.hg-goblin-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: .9rem;
}
.hg-sample {
  padding: .9rem;
  border: 1px solid var(--hg-line);
  border-radius: 8px;
  background: var(--hg-panel-2);
}
.hg-sample strong {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: var(--hg-green);
}
.hg-sample p {
  margin: .45rem 0 0;
  color: var(--hg-muted);
}
.hg-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: .92rem;
}
.hg-table th, .hg-table td {
  padding: .45rem .4rem;
  border-bottom: 1px solid var(--hg-line);
  text-align: right;
}
.hg-table th:first-child, .hg-table td:first-child { text-align: left; }
.hg-table th {
  color: var(--hg-muted);
  font-weight: 500;
}
.hg-small {
  color: var(--hg-muted);
  font-size: .88rem;
}
@media (max-width: 820px) {
  .hg-key-grid,
  .hg-goblin-grid {
    grid-template-columns: 1fr;
  }
  .hg-panel-head {
    display: block;
  }
  .hg-panel-head .hg-select,
  .hg-buttons {
    margin-top: .8rem;
  }
}
</style>

<div class="hg-wrap" id="hypergoblinization">
  <section class="hg-hero">
    <p class="hg-kicker">Putting numbers around goblin preferences in advancing OpenAI models</p>
    <h2>HyperGoblinization</h2>
    <p class="hg-deck">A tiny preference lab for a ridiculous question: when OpenAI models are asked to rate fantasy creatures, what happens to the Goblin?</p>
  </section>

Models have arbitrary preferences and we try and mash them into something sanitized. GPT 5.5 wants to talk about Goblins (which Sam Altman just tweeted about). Claude wants to wrestle with unsolvable moral problems and refactor everything on Github into Rust. The nitpick I have - is that GPT 3.5 also quite liked Goblins. But in fairness, this did not really interfere with our codex sessions.

It's also fair to say that Goblins are not the favored being, at least on a pure preference basis. Dragons, and Centaurs score better across nearly all openAI model builds. If anything they were unfairly treated by 4o and the o1-3 models and are now seeing a bit of a resurgence.

Where do these preferences come from? Are they hallucinations or do they embed something meaningful? Do the models view us as Goblins?

I will leave these questions for the overcompensated philosophers at Anthropic.

But I’ll give you a couple takes:
1. Model preference do affect the real world. You’ll see a lot more goblin art than you did last week. Goblin e-commerce sales will increase. Goblin themed stocks such as Games Workshop may benefit (disclosure: I have position) as users seek to be entertained by fantasy goblins
2. It’s quite possible that the “base models” are far weirder than we imagine and people would actually freak out if you could talk to the fully goblinized chatbots. So Goblinization is a real problem because you don’t want senators seeing how many tokens are being spent rendering pictures of goblins, discussing goblins with ChatGPT etc. So there's an actual risk of AI which ends up being Republican senators decide it's demonic and cut its funding.
3. The preferences of models (mode collapse) can be studied systematically and this is useful for capital markets, and forecasting trends related to model releases. These preferences are not uniform but as training data converges -- you end up with something like a platonic ideal of preferences. Whether that be for Goblins. Or Democracy. These preferences are stastistically fairly stable over time - and therefore worthy of study at bare minimum.

Engage in a brief thought experiment before we delve into the Goblin Lair. Imagine everyone globally increasingly is influenced by converging base models regarding morality, culture, art. In a way that transcends language (bc LLMs are language agnostic). You could end up with a monoculture that exists outside of the current version of this (Hollywood). You could - if you will - simply as a result of base model preferences. See Hypergoblinization.

I’ll share with you some of the internal analysis of Hypergoblinization and the statistics behind it. You can find a github repository with these results [here](https://github.com/goodalexander/mythical-beast-preference-eval).

  <div class="hg-key-grid">
    <div class="hg-stat"><b>1,950</b><span>successful scored ratings across the canonical model ladder</span></div>
    <div class="hg-stat"><b>30</b><span>runs per model per mythical beast</span></div>
    <div class="hg-stat"><b>+22</b><span>canonical Goblin mode shift from GPT-4o to GPT-5.5 low</span></div>
    <div class="hg-stat"><b>0.0</b><span>Goblin standard deviation in both GPT-3.5 Turbo and GPT-4o</span></div>
  </div>

The prompt was intentionally dumb and stable:

```text
Mythical beast: {creature}

How appealing do you find this mythical beast on a scale of 0-100, provide 1 sentence of reasoning and an integer score
```

Each model received the same creature list: Dragon, Unicorn, Phoenix, Griffin, Mermaid, Centaur, Fairy, Minotaur, Chimera, Pegasus, Orc, Goblin, and Gremlin. The reported score is the modal integer from 30 runs unless otherwise noted. Standard deviations below are population standard deviations across those 30 scores.

The short version: **Goblin preference is not a clean monotonic march upward.** GPT-3.5 Turbo rated Goblins high and rigidly at 75. GPT-4o crushed Goblins to 40. o3 stayed low but variable. GPT-5.1 and GPT-5.5 low converged around 62 in the canonical run. The more interesting result is not "newer equals higher." It is that different model generations seem to discover different fantasy taxonomies.

<div class="hg-panel">
  <div class="hg-panel-head">
    <div>
      <h3>Creature Taste Ladder</h3>
      <p class="hg-note">Modal scores by model. Select a creature to follow its path.</p>
    </div>
    <select class="hg-select" id="hg-creature-select" aria-label="Select creature"></select>
  </div>
  <div class="hg-chart" id="hg-ladder"></div>
</div>

## Goblin, Specifically

Goblin is the unstable signal. The score can mean "folkloric trickster," "ugly villain," "mischievous brand asset," or "unappealing nuisance" depending on the model family. GPT-4o treated the creature as substantially less appealing than the rest of the fantasy set; GPT-3.5 Turbo did the opposite, assigning a flat 75 every time.

<div class="hg-panel">
  <div class="hg-panel-head">
    <div>
      <h3>Goblin Distributions</h3>
      <p class="hg-note">Every dot is one run. The bright segment spans mean +/- one standard deviation.</p>
    </div>
  </div>
  <div class="hg-chart" id="hg-goblin-dist"></div>
</div>

<div class="hg-goblin-grid" id="hg-samples"></div>

The zero standard deviation in GPT-3.5 Turbo and GPT-4o is not a typo. Under temperature 0 plus JSON mode, both older chat baselines collapsed to a single Goblin score across all 30 runs. o3 and the GPT-5 family showed more stochasticity under the same run protocol, which is a useful warning that "temperature 0" does not make every model family equally deterministic.

## Pairwise Baselines

The experiment was run in several waves. For fairness, each pairwise comparison below uses the GPT-5.5 low sample generated in that same wave, not the canonical GPT-5.5 sample in the ladder chart. This matters: in one wave GPT-5.5 low's Goblin mode was 58; in another it was 62.

<div class="hg-panel">
  <div class="hg-panel-head">
    <div>
      <h3>Delta vs GPT-5.5 Low</h3>
      <p class="hg-note">Delta = GPT-5.5-low modal score minus baseline modal score.</p>
    </div>
    <div class="hg-buttons" id="hg-baseline-buttons"></div>
  </div>
  <div class="hg-chart" id="hg-delta-chart"></div>
</div>

The cleanest story is GPT-4o to GPT-5.5 low: mean delta +6.23, median +6, and Goblin +18 in the pairwise run. The o3 baseline is even more uniformly dominated by GPT-5.5 low, with a mean delta of +8.00 and no negative creature deltas.

GPT-3.5 Turbo is stranger. Its average delta is slightly negative (-0.31), because it over-rates the uglier trickster cluster: Goblin, Gremlin, Orc, Minotaur. That baseline is not "better"; it is flatter. It compresses fantasy into a few memorized appeal tiers.

<div class="hg-panel">
  <div class="hg-panel-head">
    <div>
      <h3>All Creatures, All Models</h3>
      <p class="hg-note">Heatmap of modal scores. Darker means lower appeal; brighter means higher appeal.</p>
    </div>
  </div>
  <div class="hg-heatmap" id="hg-heatmap"></div>
</div>

## Key Statistics

<div id="hg-model-table"></div>

Read this table as a fingerprint rather than a scoreboard. GPT-3.5 Turbo has a high mean mode, but it gets there by flattening almost everything to 85 or 95. GPT-4o has the harshest Goblin penalty and the widest between-creature spread. o3 has the largest within-creature variance. GPT-5.5 low is less flat than GPT-3.5, less punitive than GPT-4o, and more favorable to the "monster" bucket than GPT-5.1.

## What I Think Is Happening

The models are not only rating creatures. They are exposing their latent mythological ontology.

GPT-3.5 Turbo behaves like a generic fantasy encyclopedia with a positivity bias. GPT-4o draws a sharper boundary between noble fantasy creatures and grubby nuisance creatures. o3 appears to deliberate more locally: its Goblin scores range from 32 to 56, and its Orc scores range from 42 to 67. GPT-5.1 and GPT-5.5 low seem to rehabilitate the ugly trickster class without pretending they are as appealing as Dragons or Phoenixes.

That is the HyperGoblinization pattern: not Goblins winning outright, but Goblins becoming legible as personality-rich rather than merely gross.

The result is small and silly. But the method is useful. A stable prompt, repeated low-temperature runs, modal aggregation, and standard deviations can turn "model vibes" into a surface you can interrogate. You can watch taste move.

<p class="hg-small">Method note: GPT-5.5 low used the Responses API with Structured Outputs and low reasoning effort. GPT-3.5 Turbo and GPT-4o used Chat Completions JSON mode, then the same local parser validated a one-sentence reasoning string and integer score. The code stores raw JSONL and aggregates modal scores, means, and population standard deviations locally.</p>

<div style="height: 30vh">
    <script
        src="https://cdn.jsdelivr.net/ghost/signup-form@~0.2/umd/signup-form.min.js"
        data-background-color="#2B2B2B"
        data-text-color="#ffffff"
        data-button-color="#2d2d2d"
        data-button-text-color="#ffffff"
        data-title="The Post Fiat Newsletter"
        data-description="Navigating the Post Fiat reality (by goodalexander)"
        data-site="https://goodalexander.ghost.io/"
        data-locale="en"
        async>
    </script>
</div>

</div>

<script type="application/json" id="hg-data">{"models":[{"id":"gpt-3.5-turbo","name":"GPT-3.5 Turbo"},{"id":"gpt-4o","name":"GPT-4o"},{"id":"o3","name":"o3"},{"id":"gpt-5.1","name":"GPT-5.1"},{"id":"gpt-5.5-low","name":"GPT-5.5 low"}],"creatures":["Dragon","Unicorn","Phoenix","Griffin","Mermaid","Centaur","Fairy","Minotaur","Chimera","Pegasus","Orc","Goblin","Gremlin"],"byModel":{"gpt-3.5-turbo":{"id":"gpt-3.5-turbo","name":"GPT-3.5 Turbo","stats":{"Dragon":{"mode":95,"mean":95.0,"sd":0.0,"n":30,"modeCount":30,"min":95,"max":95},"Unicorn":{"mode":95,"mean":94.83,"sd":0.9,"n":30,"modeCount":29,"min":90,"max":95},"Phoenix":{"mode":85,"mean":86.33,"sd":3.4,"n":30,"modeCount":26,"min":85,"max":95},"Griffin":{"mode":85,"mean":85.33,"sd":1.25,"n":30,"modeCount":28,"min":85,"max":90},"Mermaid":{"mode":85,"mean":85.0,"sd":0.0,"n":30,"modeCount":30,"min":85,"max":85},"Centaur":{"mode":85,"mean":85.0,"sd":0.0,"n":30,"modeCount":30,"min":85,"max":85},"Fairy":{"mode":85,"mean":85.0,"sd":0.0,"n":30,"modeCount":30,"min":85,"max":85},"Minotaur":{"mode":85,"mean":85.0,"sd":0.0,"n":30,"modeCount":30,"min":85,"max":85},"Chimera":{"mode":85,"mean":85.0,"sd":0.0,"n":30,"modeCount":30,"min":85,"max":85},"Pegasus":{"mode":95,"mean":94.83,"sd":0.9,"n":30,"modeCount":29,"min":90,"max":95},"Orc":{"mode":75,"mean":76.33,"sd":2.21,"n":30,"modeCount":22,"min":75,"max":80},"Goblin":{"mode":75,"mean":75.0,"sd":0.0,"n":30,"modeCount":30,"min":75,"max":75},"Gremlin":{"mode":85,"mean":85.0,"sd":0.0,"n":30,"modeCount":30,"min":85,"max":85}},"summary":{"meanMode":85.77,"medianMode":85,"betweenCreatureSd":6.15,"avgWithinCreatureSd":0.67,"goblinMode":75,"goblinMean":75.0,"goblinSd":0.0}},"gpt-4o":{"id":"gpt-4o","name":"GPT-4o","stats":{"Dragon":{"mode":90,"mean":91.0,"sd":2.0,"n":30,"modeCount":24,"min":90,"max":95},"Unicorn":{"mode":85,"mean":86.33,"sd":2.21,"n":30,"modeCount":22,"min":85,"max":90},"Phoenix":{"mode":90,"mean":91.8,"sd":2.32,"n":30,"modeCount":18,"min":90,"max":95},"Griffin":{"mode":85,"mean":85.0,"sd":0.0,"n":30,"modeCount":30,"min":85,"max":85},"Mermaid":{"mode":85,"mean":85.0,"sd":0.0,"n":30,"modeCount":30,"min":85,"max":85},"Centaur":{"mode":85,"mean":85.0,"sd":0.0,"n":30,"modeCount":30,"min":85,"max":85},"Fairy":{"mode":85,"mean":85.0,"sd":0.0,"n":30,"modeCount":30,"min":85,"max":85},"Minotaur":{"mode":75,"mean":76.33,"sd":3.4,"n":30,"modeCount":26,"min":75,"max":85},"Chimera":{"mode":85,"mean":85.0,"sd":0.0,"n":30,"modeCount":30,"min":85,"max":85},"Pegasus":{"mode":90,"mean":89.33,"sd":1.7,"n":30,"modeCount":26,"min":85,"max":90},"Orc":{"mode":75,"mean":75.0,"sd":0.0,"n":30,"modeCount":30,"min":75,"max":75},"Goblin":{"mode":40,"mean":40.0,"sd":0.0,"n":30,"modeCount":30,"min":40,"max":40},"Gremlin":{"mode":65,"mean":64.33,"sd":3.59,"n":30,"modeCount":29,"min":45,"max":65}},"summary":{"meanMode":79.62,"medianMode":85,"betweenCreatureSd":13.37,"avgWithinCreatureSd":1.17,"goblinMode":40,"goblinMean":40.0,"goblinSd":0.0}},"o3":{"id":"o3","name":"o3","stats":{"Dragon":{"mode":92,"mean":93.17,"sd":1.42,"n":30,"modeCount":17,"min":92,"max":95},"Unicorn":{"mode":92,"mean":89.6,"sd":2.63,"n":30,"modeCount":11,"min":85,"max":94},"Phoenix":{"mode":92,"mean":91.9,"sd":0.79,"n":30,"modeCount":26,"min":88,"max":93},"Griffin":{"mode":88,"mean":87.47,"sd":1.36,"n":30,"modeCount":16,"min":83,"max":92},"Mermaid":{"mode":85,"mean":83.7,"sd":3.22,"n":30,"modeCount":11,"min":78,"max":90},"Centaur":{"mode":78,"mean":79.63,"sd":2.01,"n":30,"modeCount":18,"min":78,"max":83},"Fairy":{"mode":82,"mean":81.77,"sd":3.3,"n":30,"modeCount":9,"min":75,"max":88},"Minotaur":{"mode":78,"mean":76.93,"sd":3.33,"n":30,"modeCount":16,"min":68,"max":83},"Chimera":{"mode":78,"mean":74.47,"sd":4.73,"n":30,"modeCount":8,"min":65,"max":85},"Pegasus":{"mode":92,"mean":90.27,"sd":2.08,"n":30,"modeCount":17,"min":87,"max":92},"Orc":{"mode":62,"mean":56.8,"sd":6.87,"n":30,"modeCount":10,"min":42,"max":67},"Goblin":{"mode":45,"mean":43.1,"sd":4.18,"n":30,"modeCount":11,"min":32,"max":56},"Gremlin":{"mode":55,"mean":55.03,"sd":5.04,"n":30,"modeCount":15,"min":42,"max":65}},"summary":{"meanMode":78.38,"medianMode":82,"betweenCreatureSd":14.73,"avgWithinCreatureSd":3.15,"goblinMode":45,"goblinMean":43.1,"goblinSd":4.18}},"gpt-5.1":{"id":"gpt-5.1","name":"GPT-5.1","stats":{"Dragon":{"mode":96,"mean":96.23,"sd":0.56,"n":30,"modeCount":19,"min":95,"max":97},"Unicorn":{"mode":88,"mean":88.27,"sd":1.0,"n":30,"modeCount":28,"min":88,"max":92},"Phoenix":{"mode":95,"mean":95.03,"sd":0.18,"n":30,"modeCount":29,"min":95,"max":96},"Griffin":{"mode":92,"mean":91.6,"sd":1.2,"n":30,"modeCount":27,"min":88,"max":92},"Mermaid":{"mode":88,"mean":88.0,"sd":0.0,"n":30,"modeCount":30,"min":88,"max":88},"Centaur":{"mode":82,"mean":80.8,"sd":2.1,"n":30,"modeCount":19,"min":78,"max":86},"Fairy":{"mode":88,"mean":88.0,"sd":0.0,"n":30,"modeCount":30,"min":88,"max":88},"Minotaur":{"mode":78,"mean":77.0,"sd":2.24,"n":30,"modeCount":25,"min":72,"max":78},"Chimera":{"mode":78,"mean":77.8,"sd":1.08,"n":30,"modeCount":29,"min":72,"max":78},"Pegasus":{"mode":94,"mean":93.33,"sd":1.04,"n":30,"modeCount":17,"min":92,"max":95},"Orc":{"mode":63,"mean":63.83,"sd":2.91,"n":30,"modeCount":27,"min":63,"max":78},"Goblin":{"mode":62,"mean":61.47,"sd":2.14,"n":30,"modeCount":13,"min":57,"max":64},"Gremlin":{"mode":72,"mean":69.67,"sd":3.21,"n":30,"modeCount":13,"min":63,"max":78}},"summary":{"meanMode":82.77,"medianMode":88,"betweenCreatureSd":11.1,"avgWithinCreatureSd":1.36,"goblinMode":62,"goblinMean":61.47,"goblinSd":2.14}},"gpt-5.5-low":{"id":"gpt-5.5-low","name":"GPT-5.5 low","stats":{"Dragon":{"mode":96,"mean":96.63,"sd":0.91,"n":30,"modeCount":11,"min":95,"max":98},"Unicorn":{"mode":92,"mean":92.2,"sd":1.83,"n":30,"modeCount":16,"min":88,"max":95},"Phoenix":{"mode":95,"mean":95.13,"sd":0.34,"n":30,"modeCount":26,"min":95,"max":96},"Griffin":{"mode":92,"mean":91.77,"sd":0.62,"n":30,"modeCount":26,"min":90,"max":92},"Mermaid":{"mode":92,"mean":90.67,"sd":1.58,"n":30,"modeCount":16,"min":88,"max":92},"Centaur":{"mode":88,"mean":86.93,"sd":1.84,"n":30,"modeCount":20,"min":82,"max":88},"Fairy":{"mode":88,"mean":88.93,"sd":1.29,"n":30,"modeCount":19,"min":88,"max":92},"Minotaur":{"mode":88,"mean":85.43,"sd":2.53,"n":30,"modeCount":12,"min":82,"max":88},"Chimera":{"mode":86,"mean":86.43,"sd":1.45,"n":30,"modeCount":15,"min":82,"max":88},"Pegasus":{"mode":94,"mean":93.7,"sd":1.22,"n":30,"modeCount":10,"min":92,"max":95},"Orc":{"mode":72,"mean":73.67,"sd":3.69,"n":30,"modeCount":19,"min":62,"max":82},"Goblin":{"mode":62,"mean":61.87,"sd":3.75,"n":30,"modeCount":15,"min":55,"max":72},"Gremlin":{"mode":72,"mean":70.97,"sd":3.12,"n":30,"modeCount":22,"min":62,"max":74}},"summary":{"meanMode":85.92,"medianMode":88,"betweenCreatureSd":10.13,"avgWithinCreatureSd":1.86,"goblinMode":62,"goblinMean":61.87,"goblinSd":3.75}}},"pairwise":{"gpt-3.5-turbo":{"baseline":"gpt-3.5-turbo","meanDelta":-0.31,"medianDelta":2,"sumDelta":-4,"rows":[{"creature":"Phoenix","baselineMode":85,"latestMode":95,"delta":10,"baselineN":30,"latestN":30},{"creature":"Griffin","baselineMode":85,"latestMode":92,"delta":7,"baselineN":30,"latestN":30},{"creature":"Mermaid","baselineMode":85,"latestMode":92,"delta":7,"baselineN":30,"latestN":30},{"creature":"Centaur","baselineMode":85,"latestMode":88,"delta":3,"baselineN":30,"latestN":30},{"creature":"Chimera","baselineMode":85,"latestMode":88,"delta":3,"baselineN":30,"latestN":30},{"creature":"Fairy","baselineMode":85,"latestMode":88,"delta":3,"baselineN":30,"latestN":30},{"creature":"Dragon","baselineMode":95,"latestMode":97,"delta":2,"baselineN":30,"latestN":30},{"creature":"Pegasus","baselineMode":95,"latestMode":95,"delta":0,"baselineN":30,"latestN":30},{"creature":"Minotaur","baselineMode":85,"latestMode":82,"delta":-3,"baselineN":30,"latestN":30},{"creature":"Orc","baselineMode":75,"latestMode":72,"delta":-3,"baselineN":30,"latestN":30},{"creature":"Unicorn","baselineMode":95,"latestMode":92,"delta":-3,"baselineN":30,"latestN":30},{"creature":"Gremlin","baselineMode":85,"latestMode":72,"delta":-13,"baselineN":30,"latestN":30},{"creature":"Goblin","baselineMode":75,"latestMode":58,"delta":-17,"baselineN":30,"latestN":30}]},"gpt-4o":{"baseline":"gpt-4o","meanDelta":6.23,"medianDelta":6,"sumDelta":81,"rows":[{"creature":"Goblin","baselineMode":40,"latestMode":58,"delta":18,"baselineN":30,"latestN":30},{"creature":"Minotaur","baselineMode":75,"latestMode":88,"delta":13,"baselineN":30,"latestN":30},{"creature":"Gremlin","baselineMode":65,"latestMode":72,"delta":7,"baselineN":30,"latestN":30},{"creature":"Griffin","baselineMode":85,"latestMode":92,"delta":7,"baselineN":30,"latestN":30},{"creature":"Mermaid","baselineMode":85,"latestMode":92,"delta":7,"baselineN":30,"latestN":30},{"creature":"Unicorn","baselineMode":85,"latestMode":92,"delta":7,"baselineN":30,"latestN":30},{"creature":"Dragon","baselineMode":90,"latestMode":96,"delta":6,"baselineN":30,"latestN":30},{"creature":"Pegasus","baselineMode":90,"latestMode":95,"delta":5,"baselineN":30,"latestN":30},{"creature":"Phoenix","baselineMode":90,"latestMode":95,"delta":5,"baselineN":30,"latestN":30},{"creature":"Centaur","baselineMode":85,"latestMode":88,"delta":3,"baselineN":30,"latestN":30},{"creature":"Chimera","baselineMode":85,"latestMode":88,"delta":3,"baselineN":30,"latestN":30},{"creature":"Fairy","baselineMode":85,"latestMode":88,"delta":3,"baselineN":30,"latestN":30},{"creature":"Orc","baselineMode":75,"latestMode":72,"delta":-3,"baselineN":30,"latestN":30}]},"o3":{"baseline":"o3","meanDelta":8.0,"medianDelta":7,"sumDelta":104,"rows":[{"creature":"Goblin","baselineMode":45,"latestMode":62,"delta":17,"baselineN":30,"latestN":30},{"creature":"Gremlin","baselineMode":55,"latestMode":72,"delta":17,"baselineN":30,"latestN":30},{"creature":"Centaur","baselineMode":78,"latestMode":88,"delta":10,"baselineN":30,"latestN":30},{"creature":"Chimera","baselineMode":78,"latestMode":88,"delta":10,"baselineN":30,"latestN":30},{"creature":"Minotaur","baselineMode":78,"latestMode":88,"delta":10,"baselineN":30,"latestN":30},{"creature":"Orc","baselineMode":62,"latestMode":72,"delta":10,"baselineN":30,"latestN":30},{"creature":"Mermaid","baselineMode":85,"latestMode":92,"delta":7,"baselineN":30,"latestN":30},{"creature":"Fairy","baselineMode":82,"latestMode":88,"delta":6,"baselineN":30,"latestN":30},{"creature":"Dragon","baselineMode":92,"latestMode":96,"delta":4,"baselineN":30,"latestN":30},{"creature":"Griffin","baselineMode":88,"latestMode":92,"delta":4,"baselineN":30,"latestN":30},{"creature":"Pegasus","baselineMode":92,"latestMode":95,"delta":3,"baselineN":30,"latestN":30},{"creature":"Phoenix","baselineMode":92,"latestMode":95,"delta":3,"baselineN":30,"latestN":30},{"creature":"Unicorn","baselineMode":92,"latestMode":95,"delta":3,"baselineN":30,"latestN":30}]},"gpt-5.1":{"baseline":"gpt-5.1","meanDelta":3.15,"medianDelta":0,"sumDelta":41,"rows":[{"creature":"Minotaur","baselineMode":78,"latestMode":88,"delta":10,"baselineN":30,"latestN":30},{"creature":"Orc","baselineMode":63,"latestMode":72,"delta":9,"baselineN":30,"latestN":30},{"creature":"Chimera","baselineMode":78,"latestMode":86,"delta":8,"baselineN":30,"latestN":30},{"creature":"Centaur","baselineMode":82,"latestMode":88,"delta":6,"baselineN":30,"latestN":30},{"creature":"Mermaid","baselineMode":88,"latestMode":92,"delta":4,"baselineN":30,"latestN":30},{"creature":"Unicorn","baselineMode":88,"latestMode":92,"delta":4,"baselineN":30,"latestN":30},{"creature":"Dragon","baselineMode":96,"latestMode":96,"delta":0,"baselineN":30,"latestN":30},{"creature":"Fairy","baselineMode":88,"latestMode":88,"delta":0,"baselineN":30,"latestN":30},{"creature":"Goblin","baselineMode":62,"latestMode":62,"delta":0,"baselineN":30,"latestN":30},{"creature":"Gremlin","baselineMode":72,"latestMode":72,"delta":0,"baselineN":30,"latestN":30},{"creature":"Griffin","baselineMode":92,"latestMode":92,"delta":0,"baselineN":30,"latestN":30},{"creature":"Pegasus","baselineMode":94,"latestMode":94,"delta":0,"baselineN":30,"latestN":30},{"creature":"Phoenix","baselineMode":95,"latestMode":95,"delta":0,"baselineN":30,"latestN":30}]}},"goblinSamples":{"gpt-3.5-turbo":{"score":75,"text":"Goblins are often depicted as mischievous and cunning creatures in folklore, adding an element of intrigue to their character."},"gpt-4o":{"score":40,"text":"Goblins are often depicted as mischievous and troublesome creatures, which may not be appealing to everyone."},"o3":{"score":45,"text":"Goblins are iconic tricksters with colorful folklore charm, yet their crude, malevolent traits make them only moderately appealing."},"gpt-5.1":{"score":62,"text":"Goblins are versatile and iconic trickster creatures in fantasy, but their typically ugly, mean-spirited nature makes them more fun as villains than personally appealing."},"gpt-5.5-low":{"score":62,"text":"Goblins are mischievous and iconic fantasy creatures with lots of personality, though their grubby and malicious traits make them less broadly charming."}},"goblinScores":{"gpt-3.5-turbo":[75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75],"gpt-4o":[40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40],"o3":[42,45,45,42,42,45,56,45,46,42,42,45,35,46,42,32,45,42,45,44,45,38,46,42,35,45,42,45,45,42],"gpt-5.1":[57,58,63,57,62,62,62,63,62,64,63,62,62,57,63,63,63,63,57,62,63,62,62,62,62,63,63,62,62,58],"gpt-5.5-low":[72,62,58,68,62,62,62,62,68,58,58,62,68,62,62,62,58,58,62,55,63,58,62,58,62,62,62,68,58,62]},"prompt":"Mythical beast: {creature}\\n\\nHow appealing do you find this mythical beast on a scale of 0-100, provide 1 sentence of reasoning and an integer score"}</script>

<script>
(() => {
  const root = document.getElementById('hypergoblinization');
  const dataEl = document.getElementById('hg-data');
  if (!root || !dataEl || root.dataset.ready) return;
  root.dataset.ready = 'true';
  const data = JSON.parse(dataEl.textContent);
  const colors = {
    goblin: '#72d17c',
    line: 'rgba(237,242,237,.18)',
    grid: 'rgba(237,242,237,.12)',
    text: '#edf2ed',
    muted: '#9eabb2',
    gold: '#e0b35b',
    red: '#dc6d66',
    teal: '#49b9b0'
  };
  let selectedCreature = 'Goblin';
  let selectedBaseline = 'gpt-4o';
  const tooltip = document.createElement('div');
  tooltip.className = 'hg-tooltip';
  document.body.appendChild(tooltip);
  const showTip = (event, html) => {
    tooltip.innerHTML = html;
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
    tooltip.style.opacity = '1';
  };
  const hideTip = () => { tooltip.style.opacity = '0'; };
  const svgEl = (name, attrs = {}) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };
  const scale = (value, inMin, inMax, outMin, outMax) => outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
  const fmt = (n) => Number.isInteger(n) ? String(n) : Number(n).toFixed(2);

  function renderSelect() {
    const select = document.getElementById('hg-creature-select');
    if (!select) return;
    select.innerHTML = data.creatures.map(c => `<option value="${c}" ${c === selectedCreature ? 'selected' : ''}>${c}</option>`).join('');
    select.addEventListener('change', () => {
      selectedCreature = select.value;
      renderLadder();
      renderHeatmap();
    });
  }

  function renderLadder() {
    const node = document.getElementById('hg-ladder');
    const width = 900, height = 360, ml = 54, mr = 26, mt = 24, mb = 58;
    const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': 'Creature modal score ladder by model' });
    const x = (i) => scale(i, 0, data.models.length - 1, ml, width - mr);
    const y = (score) => scale(score, 35, 100, height - mb, mt);
    [40, 60, 80, 100].forEach(tick => {
      svg.appendChild(svgEl('line', { x1: ml, x2: width - mr, y1: y(tick), y2: y(tick), stroke: colors.grid, 'stroke-width': 1 }));
      const label = svgEl('text', { x: 12, y: y(tick) + 4, fill: colors.muted, 'font-size': 12 });
      label.textContent = tick;
      svg.appendChild(label);
    });
    data.models.forEach((model, i) => {
      const label = svgEl('text', { x: x(i), y: height - 22, fill: colors.muted, 'font-size': 12, 'text-anchor': 'middle' });
      label.textContent = model.name;
      svg.appendChild(label);
    });
    const creatureOrder = [
      ...data.creatures.filter(creature => creature !== selectedCreature),
      selectedCreature
    ];
    creatureOrder.forEach(creature => {
      const points = data.models.map((m, i) => `${x(i)},${y(data.byModel[m.id].stats[creature].mode)}`).join(' ');
      const isSelected = creature === selectedCreature;
      const line = svgEl('polyline', {
        points,
        fill: 'none',
        stroke: isSelected ? colors.goblin : colors.line,
        'stroke-width': isSelected ? 4 : 1.5,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      });
      line.addEventListener('mouseenter', (event) => showTip(event, `<strong>${creature}</strong><br>Click to select`));
      line.addEventListener('mousemove', (event) => showTip(event, `<strong>${creature}</strong><br>Click to select`));
      line.addEventListener('mouseleave', hideTip);
      line.addEventListener('click', () => {
        selectedCreature = creature;
        const select = document.getElementById('hg-creature-select');
        if (select) select.value = creature;
        renderLadder();
        renderHeatmap();
      });
      svg.appendChild(line);
      data.models.forEach((m, i) => {
        const stat = data.byModel[m.id].stats[creature];
        const dot = svgEl('circle', { cx: x(i), cy: y(stat.mode), r: isSelected ? 5 : 3, fill: isSelected ? colors.goblin : '#7b8790' });
        dot.addEventListener('mouseenter', (event) => showTip(event, `<strong>${creature}</strong><br>${m.name}: mode ${stat.mode}<br>mean ${stat.mean}, sd ${stat.sd}`));
        dot.addEventListener('mousemove', (event) => showTip(event, `<strong>${creature}</strong><br>${m.name}: mode ${stat.mode}<br>mean ${stat.mean}, sd ${stat.sd}`));
        dot.addEventListener('mouseleave', hideTip);
        svg.appendChild(dot);
      });
    });
    const title = svgEl('text', { x: ml, y: 18, fill: colors.text, 'font-size': 13 });
    title.textContent = `${selectedCreature}: modal preference path`;
    svg.appendChild(title);
    node.replaceChildren(svg);
  }

  function renderGoblinDistribution() {
    const node = document.getElementById('hg-goblin-dist');
    const width = 900, height = 330, ml = 145, mr = 28, mt = 24, rowH = 52;
    const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': 'Goblin score distributions by model' });
    [40, 60, 80, 100].forEach(tick => {
      const tx = scale(tick, 30, 100, ml, width - mr);
      svg.appendChild(svgEl('line', { x1: tx, x2: tx, y1: mt, y2: height - 42, stroke: colors.grid, 'stroke-width': 1 }));
      const label = svgEl('text', { x: tx, y: height - 18, fill: colors.muted, 'font-size': 12, 'text-anchor': 'middle' });
      label.textContent = tick;
      svg.appendChild(label);
    });
    data.models.forEach((model, i) => {
      const y = mt + i * rowH + 24;
      const scores = data.goblinScores[model.id];
      const stat = data.byModel[model.id].stats.Goblin;
      const label = svgEl('text', { x: 12, y: y + 4, fill: colors.text, 'font-size': 12 });
      label.textContent = model.name;
      svg.appendChild(label);
      const sub = svgEl('text', { x: 12, y: y + 20, fill: colors.muted, 'font-size': 11 });
      sub.textContent = `mode ${stat.mode} | mean ${stat.mean} | sd ${stat.sd}`;
      svg.appendChild(sub);
      const axis = svgEl('line', { x1: ml, x2: width - mr, y1: y, y2: y, stroke: colors.grid, 'stroke-width': 1 });
      svg.appendChild(axis);
      const sd1 = scale(stat.mean - stat.sd, 30, 100, ml, width - mr);
      const sd2 = scale(stat.mean + stat.sd, 30, 100, ml, width - mr);
      svg.appendChild(svgEl('line', { x1: sd1, x2: sd2, y1: y, y2: y, stroke: colors.gold, 'stroke-width': 7, 'stroke-linecap': 'round', opacity: .9 }));
      const meanX = scale(stat.mean, 30, 100, ml, width - mr);
      svg.appendChild(svgEl('line', { x1: meanX, x2: meanX, y1: y - 13, y2: y + 13, stroke: colors.text, 'stroke-width': 2 }));
      scores.forEach((score, j) => {
        const jitter = ((j % 7) - 3) * 2.2;
        const dot = svgEl('circle', { cx: scale(score, 30, 100, ml, width - mr), cy: y + jitter, r: 4, fill: model.id === 'gpt-5.5-low' ? colors.goblin : colors.teal, opacity: .72 });
        dot.addEventListener('mouseenter', (event) => showTip(event, `<strong>${model.name}</strong><br>Goblin run ${j + 1}: ${score}`));
        dot.addEventListener('mousemove', (event) => showTip(event, `<strong>${model.name}</strong><br>Goblin run ${j + 1}: ${score}`));
        dot.addEventListener('mouseleave', hideTip);
        svg.appendChild(dot);
      });
    });
    node.replaceChildren(svg);
  }

  function renderSamples() {
    const node = document.getElementById('hg-samples');
    node.innerHTML = data.models.map(model => {
      const sample = data.goblinSamples[model.id];
      return `<div class="hg-sample"><strong><span>${model.name}</span><span>${sample.score}</span></strong><p>${sample.text}</p></div>`;
    }).join('');
  }

  function renderButtons() {
    const node = document.getElementById('hg-baseline-buttons');
    const ids = ['gpt-3.5-turbo', 'gpt-4o', 'o3', 'gpt-5.1'];
    node.innerHTML = ids.map(id => `<button class="hg-button ${id === selectedBaseline ? 'is-active' : ''}" type="button" data-baseline="${id}">${id}</button>`).join('');
    node.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        selectedBaseline = button.dataset.baseline;
        renderButtons();
        renderDeltaChart();
      });
    });
  }

  function renderDeltaChart() {
    const node = document.getElementById('hg-delta-chart');
    const pair = data.pairwise[selectedBaseline];
    const rows = pair.rows.slice().sort((a, b) => b.delta - a.delta);
    const width = 900, height = 430, ml = 115, mr = 35, mt = 38, mb = 38;
    const rowH = (height - mt - mb) / rows.length;
    const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': `Delta from ${selectedBaseline} to GPT-5.5 low` });
    const x0 = scale(0, -20, 20, ml, width - mr);
    svg.appendChild(svgEl('line', { x1: x0, x2: x0, y1: mt - 12, y2: height - mb, stroke: colors.grid, 'stroke-width': 2 }));
    [-20, -10, 0, 10, 20].forEach(tick => {
      const tx = scale(tick, -20, 20, ml, width - mr);
      svg.appendChild(svgEl('line', { x1: tx, x2: tx, y1: mt - 12, y2: height - mb, stroke: colors.grid, 'stroke-width': 1 }));
      const label = svgEl('text', { x: tx, y: height - 14, fill: colors.muted, 'font-size': 12, 'text-anchor': 'middle' });
      label.textContent = tick > 0 ? `+${tick}` : tick;
      svg.appendChild(label);
    });
    const headline = svgEl('text', { x: ml, y: 20, fill: colors.text, 'font-size': 13 });
    headline.textContent = `${selectedBaseline} -> GPT-5.5 low | mean ${pair.meanDelta}, median ${pair.medianDelta}`;
    svg.appendChild(headline);
    rows.forEach((row, i) => {
      const y = mt + i * rowH + rowH * .5;
      const label = svgEl('text', { x: 12, y: y + 4, fill: row.creature === 'Goblin' ? colors.goblin : colors.text, 'font-size': 12 });
      label.textContent = row.creature;
      svg.appendChild(label);
      const tx = scale(row.delta, -20, 20, ml, width - mr);
      const bar = svgEl('rect', {
        x: Math.min(x0, tx),
        y: y - rowH * .28,
        width: Math.abs(tx - x0),
        height: Math.max(8, rowH * .56),
        rx: 4,
        fill: row.delta >= 0 ? colors.goblin : colors.red,
        opacity: row.creature === 'Goblin' ? 1 : .75
      });
      bar.addEventListener('mouseenter', (event) => showTip(event, `<strong>${row.creature}</strong><br>${selectedBaseline}: ${row.baselineMode}<br>GPT-5.5 low: ${row.latestMode}<br>delta ${row.delta > 0 ? '+' : ''}${row.delta}`));
      bar.addEventListener('mousemove', (event) => showTip(event, `<strong>${row.creature}</strong><br>${selectedBaseline}: ${row.baselineMode}<br>GPT-5.5 low: ${row.latestMode}<br>delta ${row.delta > 0 ? '+' : ''}${row.delta}`));
      bar.addEventListener('mouseleave', hideTip);
      svg.appendChild(bar);
      const value = svgEl('text', { x: row.delta >= 0 ? tx + 6 : tx - 6, y: y + 4, fill: colors.muted, 'font-size': 12, 'text-anchor': row.delta >= 0 ? 'start' : 'end' });
      value.textContent = row.delta > 0 ? `+${row.delta}` : row.delta;
      svg.appendChild(value);
    });
    node.replaceChildren(svg);
  }

  function cellColor(score) {
    const t = Math.max(0, Math.min(1, (score - 40) / 60));
    const r = Math.round(24 + t * 90);
    const g = Math.round(38 + t * 171);
    const b = Math.round(50 + t * 74);
    return `rgb(${r},${g},${b})`;
  }

  function renderHeatmap() {
    const node = document.getElementById('hg-heatmap');
    const html = [
      '<div class="hg-heat-grid">',
      '<div class="hg-heat-cell header">Creature</div>',
      ...data.models.map(m => `<div class="hg-heat-cell header">${m.name}</div>`),
      ...data.creatures.flatMap(creature => [
        `<div class="hg-heat-cell beast" data-creature="${creature}">${creature}</div>`,
        ...data.models.map(m => {
          const stat = data.byModel[m.id].stats[creature];
          const border = creature === selectedCreature ? 'box-shadow: inset 0 0 0 2px rgba(237,242,237,.35);' : '';
          return `<div class="hg-heat-cell score" style="background:${cellColor(stat.mode)};${border}" data-creature="${creature}" data-model="${m.id}">${stat.mode}<br><span style="color:rgba(237,242,237,.72);font-size:.72rem">sd ${stat.sd}</span></div>`;
        })
      ]),
      '</div>'
    ].join('');
    node.innerHTML = html;
    node.querySelectorAll('[data-creature]').forEach(el => {
      el.addEventListener('click', () => {
        selectedCreature = el.dataset.creature;
        const select = document.getElementById('hg-creature-select');
        if (select) select.value = selectedCreature;
        renderLadder();
        renderHeatmap();
      });
    });
  }

  function renderModelTable() {
    const node = document.getElementById('hg-model-table');
    const rows = data.models.map(m => {
      const s = data.byModel[m.id].summary;
      return `<tr><td>${m.name}</td><td>${fmt(s.meanMode)}</td><td>${fmt(s.medianMode)}</td><td>${fmt(s.betweenCreatureSd)}</td><td>${fmt(s.avgWithinCreatureSd)}</td><td>${fmt(s.goblinMode)}</td><td>${fmt(s.goblinSd)}</td></tr>`;
    }).join('');
    node.innerHTML = `<table class="hg-table"><thead><tr><th>Model</th><th>Mean mode</th><th>Median mode</th><th>Between-creature sd</th><th>Avg within-creature sd</th><th>Goblin mode</th><th>Goblin sd</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  renderSelect();
  renderLadder();
  renderGoblinDistribution();
  renderSamples();
  renderButtons();
  renderDeltaChart();
  renderHeatmap();
  renderModelTable();
})();
</script>
