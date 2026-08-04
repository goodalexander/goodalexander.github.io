# Doom Thesis quantitative-index specification

Version: 0.6.0  
Status: research evidence score live; calibrated probability and trading stop withheld  
Last reviewed: 2026-08-04  
Original brief: [`docs/doom-thesis-original-brief.md`](doom-thesis-original-brief.md)  
Machine-readable framework: [`static/doom-thesis/doom-index-framework.json`](../static/doom-thesis/doom-index-framework.json)  
Operating runbook: [`docs/doom-index-runbook.md`](doom-index-runbook.md)

## 1. Mandate

The Doom Thesis is a falsifiable chain of contentions about the most likely
medium-term U.S. political-economic regime. Its purpose is to inform
long/short equities, macro positioning, and cryptocurrency trading. The public
page must make the chain understandable in plain English, show the strongest
evidence for and against every contention, and distinguish observed facts from
inference.

The intended output is a regularly updated 0–100 Doom Index. The number should
estimate whether the Doom regime is the base case, not measure how alarming a
chart looks. Until it is calibrated to outcomes, it must be labeled an
**evidence score**, not a probability.

The Doom regime is the joint case that:

1. The United States has a structural fiscal problem that ordinary growth does
   not resolve.
2. A timely, explicit fiscal settlement is politically unlikely.
3. AI does not yet provide the sustained economy-wide productivity escape
   needed to make the adjustment small.
4. AI remains unusually capital-intensive relative to demonstrated economic
   returns and has material negative attention and human-capital externalities.
5. Weak legitimacy makes explicit adjustment harder and increases the appeal
   of inflation, financial repression, digital control, and other indirect
   forms of adjustment.

Financial bread and circuses, command-and-control government, and eventual
superintelligence are downstream scenarios. They do not become true merely
because the core index is high and must not be used to inflate their own input
score.

## 2. Falsification and portfolio stop

The thesis is invalidated as a base case when the published Doom Index closes
below 20. Doom-linked positions must be exited under the execution convention
defined by the relevant strategy.

There is also a productivity override: if the estimated probability that U.S.
labor productivity averages at least 5% annually over the next five years
reaches 50%, the index is capped at 19. A single strong quarter does not
activate the override. It requires a versioned forecast ensemble containing
professional forecasts, appropriate prediction-market or survey information,
realized BLS vintages, and explicit AI-adoption scenarios.

Acceptance gate:

- [x] The numeric stop threshold and conceptual productivity override are
  written down.
- [x] A five-year productivity research ensemble exists using the Philadelphia
  Fed SPF cross-section, CBO, the historical BLS base rate, and disclosed AI
  scenario priors.
- [x] The research override estimate is reproducible from stored source data
  and versioned assumptions.
- [ ] The ensemble is calibrated well enough to treat its output as a forecast
  probability rather than a research estimate.
- [ ] The stop has an execution time, confirmation rule, revision rule, and
  whipsaw test.
- [ ] At least one Doom-linked strategy has passed its release gate, making the
  stop operational rather than theoretical.

## 3. Causal architecture and weights

The proposed component weights sum to 100. They are research priors and remain
provisional until frozen before historical calibration.

| Component | Weight | Role in the thesis | Current state |
|---|---:|---|---|
| Fiscal constraint | 20 | Measures the size, flow, carrying cost, and required correction of the fiscal gap | Partial |
| Productivity escape | 20 | Measures whether ordinary or AI-driven productivity can outrun the gap | Partial |
| AI capital efficiency | 15 | Measures AI investment against attributable economic return | Partial |
| Distraction economy | 10 | Measures capital and cash flow directed toward attention capture and the associated productivity offset | Partial |
| Political feasibility | 15 | Measures the probability of timely explicit fiscal adjustment | Partial |
| Debasement and repression | 10 | Measures observable movement toward indirect fiscal adjustment | Partial |
| Institutional and economic legitimacy | 10 | Measures trust, compliance, capacity, exit behavior, and conflict that affect the adjustment path | Partial |

The intended causal ordering is:

> weak returns on public/private investment + fiscal deterioration + weak
> productivity escape → required adjustment → political refusal and declining
> legitimacy → noncompliance, exit, and distributional conflict → inflation,
> repression, or coercive control.

This ordering matters. An implication cannot also be treated as independent
proof of its upstream cause without an explicit model that prevents double
counting.

## 4. Component specifications and acceptance gates

### 4.1 Fiscal constraint — 20%

Plain English: debt, interest, deficits, and promised-program funding are
growing faster than the ordinary tax base. Stabilization requires unusually
strong growth, materially higher revenue, benefit reform, inflation, or some
combination.

Required indicators:

- Gross public debt, debt held by the public, deficit and primary deficit as a
  share of GDP.
- Actual net interest and a security-level refinancing projection using the
  maturity wall and current curve.
- Conservative 75-year Social Security and Medicare present-value funding
  gaps, disclosed as changing actuarial projections rather than fixed debts.
- Debt, liabilities, and required recurring adjustment per household and
  relative to income, corporate net income, receipts, and GDP.
- A clearly defined prudent scenario and sensitivities for taxes, benefits,
  growth, rates, and behavioral feedback.

Component acceptance gate:

- [x] Daily Bloomberg public-debt history and annual official deficit,
  receipts, and interest series exist.
- [x] Social Security and Medicare 75-year present-value series exist with
  conservative definitions and unit disclosures.
- [x] Daily point-in-time public-company net income and market capitalization
  comparisons exist.
- [x] A security-level Treasury refinancing model uses actual CUSIPs,
  maturities, coupons, issuance assumptions, and the current Bloomberg curve.
- [x] A prudent fiscal scenario and tax/reform sensitivities are displayed.
- [ ] The component's 0–100 transformation and historical thresholds are frozen.
- [ ] Historical vintages are backtested across inflation, consolidation, and
  fiscal-stress regimes.
- [ ] Claims that there is "no path" are linked to the separately measured
  political-feasibility component rather than inferred from arithmetic alone.

### 4.2 Productivity escape — 20%

Plain English: ordinary productivity growth does not make the fiscal bill
disappear. The thesis fails if AI produces a sustained economy-wide growth
regime strong enough to dilute the obligations without destructive adjustment.

Required indicators:

- Realized nonfarm-business productivity, including release vintages,
  year-over-year growth, and rolling five-year growth.
- Consensus real-GDP and productivity forecasts with forecast dispersion.
- A probability distribution for average five-year productivity, including the
  probability of at least 5%.
- Output-per-real-dollar panels for physical infrastructure, education/human
  capital, and operating-company cash generation.
- Point-in-time rolling-four-quarter real revenue growth, operating-cash-flow
  margin, and FCF margin for U.S. operating companies outside the score-70+
  Distraction Economy basket; retain nominal growth in the audit data and use
  the GDP deflator for the scored series.
- An explicit decomposition of positive AI automation effects and negative
  attention, displacement, transition, and capital-misallocation effects.

Component acceptance gate:

- [x] Realized BLS productivity and rolling-trend series exist.
- [x] Utility capex versus physical electricity output exists.
- [x] Education spending versus NAEP, ACT context, graduation, and entry-level
  technology hiring evidence exists, with causal caveats.
- [x] Daily point-in-time operating-company rolling-four-quarter FCF exists.
- [x] A daily point-in-time real-business bridge exists outside known
  distraction businesses, using a shared four-quarter revenue/NCFO/FCF cohort
  and retaining a literal all-sector diagnostic.
- [x] The mechanical AGI growth hurdle is shown against consensus baselines.
- [x] A versioned five-year productivity research distribution and mechanical
  5% override calculation exist.
- [ ] The override is approved for live execution after calibration and
  governance review.
- [ ] AI's positive and offsetting effects are estimated in one coherent model;
  private returns earned from distraction are not counted as a productivity
  escape without broad real-business pass-through.
- [ ] Real-time source vintages prevent revised BLS data from leaking into the
  historical score.

### 4.3 AI capital efficiency — 15%

Plain English: AI can add to measured investment and GDP—and can even earn
private returns—without producing an economy-wide productivity escape. Revenue
from better attention capture is not equivalent to durable revenue growth and
cash conversion across businesses outside distraction.

Required indicators:

- Point-in-time hyperscaler capex, depreciation, AI infrastructure commitments,
  data-center capacity, power demand, and financing.
- Separately identified AI revenue, gross profit, cost savings, and incremental
  cash flow, with ranges where companies do not disclose them.
- Incremental AI ROIC under low, base, and high monetization cases.
- HBM supply, price, lead times, accelerator utilization, and the claimed memory
  bottleneck.
- A versioned quality-adjusted benchmark for the cost of generating AI video.

Component acceptance gate:

- [x] The current research hyperscaler universe is frozen and disclosed.
- [x] A point-in-time quarterly total-capex/depreciation panel exists.
- [x] Disclosed/inferred AI revenue and modeled cash-return ranges exist, with
  exact disclosures separated from lower bounds and scenario assumptions.
- [ ] Company-wide capex and cash-return ranges are validated as specifically
  AI-attributable rather than cloud, ordinary infrastructure, or mixed chips.
- [ ] Incremental ROIC sensitivities exist and avoid counting ordinary cloud
  growth as AI return.
- [x] A dated HBM disclosure-event series exists for Micron and Samsung.
- [x] A vintaged market-wide HBM capacity, supplier-share, and public
  pricing-regime forecast panel complements the disclosure proxy.
- [ ] Realized HBM supply, transacted price, lead-time, and accelerator-
  utilization histories replace the current forecast and disclosure proxies.
- [x] A rerunnable official-vendor 720p-with-audio AI-video API price history
  exists.
- [ ] Archived quality scores are joined by model vintage so the video-cost
  history is genuinely quality-adjusted.
- [ ] The component score is validated against subsequent monetization rather
  than management narrative alone.

### 4.4 Distraction economy — 10%

Plain English: increasingly cheap, personalized digital stimulation can absorb
the time and agency that productivity tools save. Market value is evidence of
where capital expects profits, not by itself proof of social harm or a causal
productivity loss.

Required indicators:

- A survivorship-safe classification of U.S. public companies whose economics
  benefit directly from increased screen time, compulsive consumption,
  pornography/addiction, digital entertainment, reduced attention, depression,
  isolation, or fractured offline ties.
- Market capitalization and rolling-four-quarter FCF for the distraction basket
  versus U.S. Industrials, with active and delisted companies.
- Time-use, screen-time, engagement, recommendation intensity, advertising
  yield, and personalization-lift evidence.
- A causal or bounded sensitivity mapping attention capture into lost human
  capital or productivity.

Component acceptance gate:

- [x] The classification prompt and 0–100 definition are frozen for the current
  research vintage.
- [x] All 6,226 active and delisted U.S. Sharadar companies that ever exceeded
  $1 billion of market cap were scored with GLM 5.2; failures were retried and
  no unresolved response was silently given a score.
- [x] The score-≥70 membership and full audit files are retained.
- [x] Annual market cap is compared with all U.S. Industrials using each
  ticker-year's final observation and survivorship-safe membership.
- [x] Daily FCF uses the same point-in-time ARQ/datekey replay and four-distinct-
  calendardate method as the core Doom data.
- [x] The classification result, market-cap history, and point-in-time FCF
  history are integrated into the public page and canonical update command.
- [ ] Classifier stability is tested across prompt/model vintages and reviewed
  manually for the largest contributors.
- [x] A BLS ATUS primary-activity series exists for television, leisure
  gaming/computer use, socializing, reading, and exercise; the annual 2020 gap
  is preserved and concurrent media use is explicitly outside the measure.
- [x] Dated company-disclosed personalization/engagement lift events exist as
  unscored diagnostics with comparison-basis caveats.
- [ ] A broader, consistently defined platform-engagement panel exists across
  Meta, Alphabet/YouTube, Netflix, Apple, and other major contributors.
- [ ] A defensible causal bridge or explicitly bounded noncausal sensitivity
  connects distraction to aggregate productivity.

### 4.5 Political feasibility — 15%

Plain English: the arithmetic identifies the bill; this component asks whether
voters and institutions will accept the necessary taxes, spending restraint,
or benefit changes before crisis conditions force an indirect adjustment.

Required indicators:

- A frozen definition of a decisive adjustment package relative to the prudent
  scenario.
- Historical proposals, enacted changes, CBO/JCT scores, roll calls, dilution
  from proposal to law, duration, and reversals.
- Polling on taxes, spending, benefits, inflation, debt, and distribution.
- Prediction-market contracts admitted only when their wording, horizon,
  liquidity, and resolution source map to a specific claim.
- A model producing the probability of a sufficient package within the needed
  horizon.

Component acceptance gate:

- [x] The required fiscal adjustment is quantified.
- [x] Candidate prediction markets have been identified and correctly labeled
  as weak proxies rather than direct proof. The public Kalshi and Polymarket
  discovery APIs now refresh a candidate audit file and append live snapshots;
  the current Kalshi FY2026 deficit-below-5% midpoint is an outcome diagnostic,
  not the missing probability of enacting a recurring prudent package.
- [x] A machine-readable panel of seven selected major enacted fiscal laws from
  2011–2025 exists with contemporaneous CBO/JCT budget-window scores and a
  common annualized-GDP scale comparison.
- [ ] The enactment panel is extended to proposals, roll calls, dilution,
  implementation, reversals, and realized primary-balance effects.
- [x] A reproducible longitudinal Gallup panel covers tax burden/fairness,
  concern about federal spending, and support for seven named deficit remedies.
  It preserves question-level results and does not turn separate questions into
  a synthetic passage probability.
- [ ] The opinion panel is extended with repeated measures of benefit reform,
  spending restraint, inflation tolerance, wealth taxation, and financial
  repression under comparable wording.
- [ ] Contract snapshots preserve price, liquidity, wording, and rules.
- [ ] A calibrated probability of timely sufficient adjustment exists.
- [ ] Revenue feedback, implementation delay, policy dilution, and repeal risk
  enter the estimate.

### 4.6 Debasement and financial repression — 10%

Plain English: if visible adjustment fails, the state has an incentive to pay
less visibly through inflation, negative real returns, captive demand, or
digitally administered restrictions. Incentive is not proof of implementation.

Required indicators:

- Breakevens, inflation swaps, survey expectations, real yields, term premium,
  MOVE/rate volatility, curve shape, and central-bank balance sheets.
- Treasury ownership and observable captive-demand or balance-sheet regulation.
- Separate event taxonomies for CBDCs, stablecoins, programmable money, wealth
  taxes, capital controls, and asset confiscation.
- Historical regime labels and transition probabilities.

Component acceptance gate:

- [x] Current debt carrying cost, refinancing exposure, Treasury yields, and
  equity-versus-fixed-income valuation series exist.
- [x] Inflation expectations, real yield, term premium, Fed assets, M2, and MOVE
  have a common panel, fixed thresholds, and freshness rules; MOVE is explicitly
  missing while the Bloomberg bridge is unavailable.
- [x] Financial repression has a narrow operational definition requiring both
  a negative ex-ante real Treasury yield and a binding broad holding or exit
  control; looser monetary conditions and Fed ownership do not suffice.
- [x] An initial source-linked event taxonomy separately codes Treasury balance-
  sheet rules, CBDC research/prohibition, and stablecoin law without treating
  any one category as proof of repression.
- [ ] The event taxonomy is extended into a comprehensive historical panel of
  compelled holdings, capital controls, wealth taxes, and asset-control laws.
- [ ] Historical regime labels and transition probabilities exist.
- [ ] The score avoids treating stablecoin growth or a policy proposal as proof
  of inevitable CBDC control.

### 4.7 Institutional and economic legitimacy — 10%

Plain English: fiscal adjustment depends on people believing the economic and
political bargain is legitimate enough to comply with. Weak trust and weak
administrative capacity can increase evasion, exit, conflict, and demand for
coercion, but those links must be measured rather than narrated as inevitable.

Required indicators:

- Long-run trust in federal government, Congress, courts, banks, large business,
  markets, and democratic governance.
- Perceived fairness, upward mobility, confidence in currency and pension
  promises, and willingness to accept taxes or benefit reform.
- Tax gap, payment compliance, actual adjudicated fraud, corruption, improper
  payments, capital flight, migration/exit behavior, protest/unrest, and
  political violence.
- Executive-power, surveillance, civil-liberty, military domestic-role, and
  asset-control events.
- A transition model from weak legitimacy to noncompliance/conflict and from
  conflict to coercive policy.

Component acceptance gate:

- [x] A long-run federal-government trust series is displayed.
- [x] CMS improper-payment data are shown with the explicit warning that they
  are not a fraud estimate.
- [x] A fixed 14-institution Gallup panel preserves institution-level histories
  and separate elected/judicial, economic, and news-media aggregates from 1993
  through the latest poll; it is sentiment, not a governance outcome measure.
- [x] IRS voluntary-compliance and GAO government-wide improper-payment inputs
  exist and are explicitly not described as fraud.
- [x] DOJ False Claims Act enforcement outputs and V-Dem executive-corruption
  estimates exist and remain separate from compliance and improper payments;
  recoveries are explicitly not labeled fraud prevalence.
- [x] Quarterly Section 6039G legal-expatriation lists and BEA resident foreign-
  asset acquisition/GDP exist as separate diagnostics; partial years are
  flagged and neither series is labeled total emigration or capital flight.
- [ ] Broader migration/exit measures and an economically identified capital-
  flight model exist without inferring tax causality from co-movement.
- [x] V-Dem v16 and Freedom House 2026 governance, executive-constraint,
  expression, association, human-rights, centralization, and corruption series
  exist with predeclared diagnostic thresholds and revision warnings.
- [ ] Comparable protest/unrest, political-violence, surveillance-deployment,
  and capital-flight panels exist with predeclared thresholds. Court-authorized
  intercept history and the current EFF local-technology inventory are now
  reproducible diagnostics. Harvard/UConn CCC now supplies a 2017–2025 protest
  panel separating event volume, arrests, reported injury/casualty, and property
  damage; V-Dem supplies an expert-coded physical-integrity outcome. A broader
  event-level political-violence panel, identified capital-flight model, and
  broader surveillance-capacity history remain missing; the EFF source-document
  date is not treated as a deployment date.
- [ ] The transition model is calibrated; command-and-control remains a
  downstream scenario until then.

## 5. Index construction and publication gates

### 5.1 Required indicator contract

Every indicator must store: stable component and indicator IDs, information
date, retrieval date, vintage, raw value, unit, source, transformation,
direction, indicator score, within-component weight, total weight, freshness
deadline, revision policy, and quality flag. Missing data remain missing; they
are never silently assigned a neutral score.

### 5.2 Transform and aggregation rules

Before a score is published:

1. Direction, winsorization, normalization, thresholds, and weights are frozen
   before inspecting the holdout period.
2. Point-in-time vintages are used wherever revisions could create lookahead.
3. Correlated indicators are grouped or shrunk so the same fiscal or market
   fact is not counted multiple times.
4. Component scores and contributions are published alongside the composite.
5. Coverage and uncertainty are published separately from the score.
6. Every change from the prior release is attributable to data, a revision, or
   a versioned methodology change.

### 5.3 Publication acceptance gate

- [x] At least 80% of total weight has current, reproducible indicator inputs.
- [ ] Fiscal constraint, productivity escape, and political feasibility each
  pass their component gate; high aggregate coverage cannot hide a missing core
  leg of the thesis.
- [x] Transformations and weights are frozen for the current 0.5 research
  version; any further formula change requires a version increment.
- [ ] A survivorship-safe, point-in-time historical score exists.
- [ ] A holdout review and sensitivity analysis exist.
- [ ] The mapping from score to regime probability is empirically calibrated;
  otherwise the public label says "evidence score."
- [ ] Daily/weekly/monthly staleness and failure behavior are tested.
- [ ] Score history, component contributions, source lineage, revisions, and
  quality flags are downloadable.
- [ ] The productivity override and ordinary <20 stop are machine tested.

Current result: **a 68.1/100 research evidence score is available at 90.75%
weighted input coverage, with a 62.2–71.5 missing-input sensitivity range**.
The probability and trading publication gate still fails. The transforms are
fixed and disclosed for the current version, but the historical score is not
yet point-in-time calibrated, the research productivity override is not
approved for execution, and political feasibility lacks a direct passage-
probability input.

## 6. Downstream scenario gates

These scenarios are reported outside the composite unless and until an
independent, non-circular scoring case is approved.

### Financial bread and circuses

- [x] Define initial gambling, prediction-market, perpetual-swap, and stablecoin-
  collateral measures while preserving handle versus revenue and official
  statistics versus industry estimates. Tokenized-asset history is explicitly
  missing because the RWA.xyz timeseries API key is not configured.
- [ ] Build volume, take-rate, active-user, stablecoin supply/velocity, and
  legislation histories. Global stablecoin supply from 2017, U.S. commercial
  gaming from 2021, sports handle/revenue, live fiscal-market snapshots, a May
  2026 prediction-market substitution snapshot, and two perpetual-volume
  benchmarks now exist; velocity, active users, complete prediction/perpetual
  histories, tokenized assets, and a comprehensive legal panel remain missing.
- [ ] Demonstrate the link to fiscal legitimacy or political pacification
  rather than inferring it from simultaneous growth.

### Temporary command-and-control economy

- [x] Define a source-linked initial taxonomy of observable surveillance,
  censorship safeguards, domestic military, executive-power, digital-money,
  and asset-control events, keeping legal authority, use, and outcomes distinct.
- [ ] Expand the initial U.S. taxonomy into comprehensive procurement,
  surveillance-capacity, compliance, and outcome histories.
- [ ] Create historical comparison regimes and transition rates.
- [x] State falsifiers and do not describe a scenario as an inevitable outcome.

### Exit from Doom through superintelligence

- [x] Complete the unfinished causal proposition: superintelligence exits Doom
  only if it produces sustained broad-based productivity and fiscal capacity
  while preserving human agency; otherwise it can inherit or intensify control.
- [x] Link the July 23, 2026 Economist publisher episode and primary recording/
  transcript for the Elon Musk control forecast rather than a secondary
  paraphrase, and label it an interested forecast rather than evidence.
- [x] Define observable signposts for productivity, fiscal escape, attributable
  AI returns, broad distribution, and human agency/alignment.
- [x] Keep the scenario conceptual, falsifiable, and zero-weight until the
  missing conditions become measurable and calibrated.

## 7. Investment sub-strategies and release gates

An index is not a strategy. No module may be described as investable merely
because its narrative aligns with Doom.

### Structural macro: long hard assets, short fiat FX

- [ ] Freeze assets, currencies, signal, carry, valuation, trend, rebalance,
  sizing, and stop rules.
- [ ] Backtest point-in-time with transaction costs, funding, and realistic
  implementation constraints.
- [ ] Report return, volatility, drawdown, turnover, factor exposures, and
  results conditional on Doom score regimes.

### Long/short Doom equities

- [x] A research-grade, survivorship-aware distraction classification and
  historical basket panel exists.
- [ ] Define the complete stock taxonomy: transfers, scarcity, distraction,
  industrial capacity, AI capex, command/control, and financialization.
- [ ] Combine alignment with valuation, intra-quarter filing dynamics, and
  management commentary using point-in-time data.
- [ ] Neutralize unintended market, sector, size, country, and liquidity bets.
- [ ] Include borrow availability/cost, delistings, turnover, slippage, and
  capacity in the backtest.

### On-chain perpetual swaps and tokenized markets

- [ ] Define venues, instruments, collateral, custody, oracle, liquidation,
  funding, leverage, sizing, and kill switches.
- [ ] Retain historical venue and contract availability without lookahead.
- [ ] Stress depegs, exchange failure, liquidity gaps, and adverse funding.

### Common strategy release gate

- [ ] Reproducible point-in-time backtest and untouched holdout.
- [ ] Net performance after all material costs.
- [ ] Explicit sizing and portfolio-level risk budget.
- [ ] Drawdown, threshold-whipsaw, and parameter-sensitivity tests.
- [ ] Live paper portfolio with timestamped decisions.
- [ ] Independent review before capital is attributed to the module.

Current result: **zero strategy modules pass the investable release gate**.

## 8. Product and operating acceptance gates

### Public situational-awareness page

- [x] A dedicated Doom Thesis page exists.
- [x] Plain-English fiscal, interest, productivity, demographics, taxation, and
  valuation sections exist with downloadable data.
- [x] An expandable component/claim inventory exists.
- [x] The completed Distraction Economy market-cap and FCF panels are on the
  page with survivorship and retrospective-classification caveats.
- [x] Every expandable component now exposes its current raw inputs, transforms,
  score, source, quality flag, and coverage; AI capital intensity, political
  difficulty, legitimacy, and repression are no longer placeholders.
- [ ] Every chart displays source, units, as-of date, definition, and important
  caveats adjacent to the visual.
- [x] The page displays the current research score, component contributions,
  coverage, missing-input sensitivity, and current/stale/missing flags.
- [x] The coverage-gated score history and immutable release archive are
  displayed, with sub-threshold diagnostics clearly withheld from publication.

### Update system

- [x] A written daily/weekly/quarterly/annual runbook exists.
- [x] Core fiscal, Treasury, Bloomberg, and Sharadar builders are reproducible.
- [x] The Sharadar daily aggregate is point-in-time, uses rolling four-quarter
  ARQ records, handles restatements by datekey, and includes active/delisted
  domestic common stocks only during their public windows.
- [x] The Distraction Economy classifier retries invalid responses and preserves
  auditable raw outcomes.
- [x] One fail-loud orchestrated command refreshes every currently admitted
  indicator, rebuilds the site payload, and validates Hugo in a temporary
  destination.
- [x] Version-controlled daily and weekly systemd refresh schedules, a six-hour
  release-health check, and a local failure artifact exist. External webhook
  delivery is supported but remains inactive until
  `DOOM_INDEX_ALERT_WEBHOOK_URL` is configured.
- [x] Every orchestrated run retains stage logs, provider-degradation state,
  output hashes, and a unique immutable release manifest.
- [x] Source outages produce explicit stale/missing flags and never silently
  reuse data as current in the score layer; the current Bloomberg outage leaves
  MOVE missing rather than assigning a value.
- [x] Each new release freezes canonical data, score, history, registry,
  framework, site payload, SHA-256 hashes, logs, profile, and degradation state
  beneath a unique release ID. Pre-snapshot legacy releases retain manifests
  and hashes but not copied artifacts.

## 9. Current completion inventory

### Implemented and reproducible

- [x] Conservative public-debt + Social Security + Medicare liability stack.
- [x] Daily public debt and daily point-in-time public-equity net income/market
  cap comparison.
- [x] Annual deficits, receipts, tax composition, interest outlays, and debt/GDP.
- [x] Treasury maturity, issuance, duration/yield, and security-level interest
  roll model.
- [x] Prudent fiscal-course, tax-mix, corporate-tax, and AGI-growth sensitivities.
- [x] Utility capex/output, operating FCF margin, labor productivity, education,
  and demographic evidence.
- [x] Equity-versus-fixed-income valuation and earnings-decline research panels.
- [x] Complete liquid historical Distraction Economy classification and its
  market-cap and rolling-four-quarter FCF comparisons with Industrials.
- [x] Point-in-time hyperscaler capital-intensity panel and fixed-threshold
  capital-stress feeder.
- [x] AI monetization low/base/high ranges, official API video-price history,
  HBM disclosure events, and a market-wide capacity/supplier/pricing-regime
  forecast panel exist. Attribution and forecast assumptions remain
  estimated and therefore reduce coverage rather than receiving a score.
- [x] Official BLS time-use history and company-disclosed personalization-lift
  diagnostics are reproducible and integrated into Distraction Economy.
- [x] FRED/Bloomberg debasement and repression market/monetary feeder with
  freshness enforcement.
- [x] Pew/Gallup/IRS/GAO institutional-legitimacy feeder and a separately
  labeled political-adjustment-difficulty proxy.
- [x] A live 0–100 research evidence score, indicator registry, component
  contributions, weighted coverage, and missing-input bounds.
- [x] A coverage-gated annual evidence audit exists for 2004–2026; only 2026
  currently clears the 80% publication threshold, preventing an invented
  historical index line.
- [x] A reproducible productivity-escape research ensemble uses 20 Philadelphia
  Fed SPF respondents, the postwar BLS base rate, CBO's central case, and
  explicit AI scenario priors. Its current ≥5% estimate is 2.5%, not a
  calibrated probability.
- [x] Public webpage, machine-readable data payload, framework JSON, and update
  runbook.
- [x] Daily/weekly production timers, six-hour health checks, local/external
  alert plumbing, and immutable artifact snapshots for new releases.

### Partially implemented

- [ ] Productivity escape: strong backward-looking evidence and a versioned
  five-year research ensemble exist, but no calibrated probability or net AI-
  effects model exists.
- [ ] Distraction economy: classification, capital-allocation proxy, and public
  charts are complete; usage, personalization, and a causal productivity effect
  are not.
- [ ] AI capital efficiency: total capital intensity plus monetization and cash-
  coverage ranges are measured, but the ranges are not yet validated as
  specifically AI-attributable and do not constitute ROIC.
- [ ] Political feasibility: adjustment difficulty is measured; direct passage
  probability, polling history, and legislative calibration are not.
- [ ] Institutional/economic legitimacy: trust, confidence, compliance,
  enforcement, governance, protest, exit, and narrow surveillance panels are
  measured; broader political violence/capital flight and the coercion-
  transition calibration are not.
- [ ] Debasement/repression: inflation expectations, real yields, term premium,
  Fed assets, M2, Treasury ownership, and policy events are wired; historical
  regime transitions are not, and Bloomberg MOVE is currently unavailable.
- [ ] Index governance: the live research score, registry, research override,
  coverage-gated annual audit, scheduler, and immutable releases exist; point-
  in-time historical calibration and stop execution do not.

### Missing

- [ ] Validated attributable AI revenue/capex and an incremental ROIC model
  beyond the completed disclosure-based range and cash-coverage proxy.
- [ ] Realized HBM price/capacity/lead-time and accelerator-utilization history
  beyond the completed disclosure-event and market-wide forecast panels.
  AI-video cost now has both official vendor-price
  history and a prospective blind-preference quality-band frontier from
  Artificial Analysis; its short prospective history remains zero-weight.
- [ ] Calibrated political-feasibility passage-probability model beyond the
  completed enactment history, Gallup panel, and audited Kalshi/Polymarket
  candidate and snapshot archive. No live contract directly resolves passage
  of a recurring prudent-course package.
- [ ] Transition calibration beyond the completed legitimacy, compliance,
  protest, democracy, civil-liberty, executive-power, narrow surveillance,
  ownership, exit, fraud-enforcement, and asset-control diagnostics.
- [ ] Historical regime-transition calibration beyond the completed Treasury-
  ownership and financial-repression legal-policy event panel.
- [ ] Point-in-time calibrated historical Doom Index and regime-probability
  mapping beyond the live research evidence score.
- [ ] Investable macro, equity, or on-chain sub-strategy.

## 10. Definition of complete

The project is complete only when:

1. Every core contention either passes its component gate or is removed from
   the scored thesis.
2. The index passes every publication gate and produces reproducible historical
   and current releases.
3. The public page explains what changed, why it changed, what is stale, and
   what would falsify the thesis.
4. The <20 stop and 5% productivity override are executable and tested.
5. Each marketed investment sub-strategy independently passes its release gate.

Until then, the Doom Thesis page is a substantial research dossier and
completion system, not yet a validated probability index or investable index.
