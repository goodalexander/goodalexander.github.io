(function () {
  const root = document.querySelector(".pfb-widget");
  if (!root) {
    return;
  }

  const DEFAULT_WEIGHTS = {
    quality: 50,
    cost: 25,
    latency: 25,
  };
  const PLAIN_ENGLISH_SCORING_PROMPT =
    "Each judge receives the capped task history, capped chat history, the selected chat modality, the recent chat, the exact model input, and the candidate response. The judge then scores the response from 0 to 100 on relevance, insight, and alignment with the user's request, and returns JSON whose top-level score is the rounded average of those three dimensions.";

  const refs = {
    generatedAt: root.querySelector('[data-role="generated-at"]'),
    candidateCount: root.querySelector('[data-role="candidate-count"]'),
    canonCount: root.querySelector('[data-role="canon-count"]'),
    scorerCount: root.querySelector('[data-role="scorer-count"]'),
    defaultJson: root.querySelector('[data-role="default-json"]'),
    liveLeader: root.querySelector('[data-role="live-leader"]'),
    tableBody: root.querySelector('[data-role="table-body"]'),
    stateMessage: root.querySelector('[data-role="state-message"]'),
    displayedCount: root.querySelector('[data-role="displayed-count"]'),
    weightSummary: root.querySelector('[data-role="weight-summary"]'),
    search: root.querySelector('[data-role="search"]'),
    scope: root.querySelector('[data-role="scope"]'),
    limit: root.querySelector('[data-role="limit"]'),
    reset: root.querySelector('[data-role="reset-weights"]'),
    methodologyScorers: root.querySelector('[data-role="methodology-scorers"]'),
    methodologyPrompt: root.querySelector('[data-role="methodology-prompt"]'),
    methodology: root.querySelector('#methodology'),
    winnerCards: {
      overall: root.querySelector('[data-role="winner-overall"]'),
      open_weight: root.querySelector('[data-role="winner-open-weight"]'),
      closed_source: root.querySelector('[data-role="winner-closed-source"]'),
    },
    controls: {
      quality: {
        range: root.querySelector('[data-role="quality-range"]'),
        number: root.querySelector('[data-role="quality-number"]'),
        value: root.querySelector('[data-role="quality-value"]'),
      },
      cost: {
        range: root.querySelector('[data-role="cost-range"]'),
        number: root.querySelector('[data-role="cost-number"]'),
        value: root.querySelector('[data-role="cost-value"]'),
      },
      latency: {
        range: root.querySelector('[data-role="latency-range"]'),
        number: root.querySelector('[data-role="latency-number"]'),
        value: root.querySelector('[data-role="latency-value"]'),
      },
    },
  };

  const state = {
    summary: null,
    rows: [],
  };

  function clamp(value, min, max) {
    if (!Number.isFinite(value)) {
      return min;
    }
    return Math.min(max, Math.max(min, value));
  }

  function parseNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function formatTimestamp(value) {
    if (!value) {
      return "Unknown run time";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  }

  function formatPercent(value) {
    return `${(Number(value || 0) * 100).toFixed(1)}%`;
  }

  function formatScore(value) {
    return Number(value || 0).toFixed(2);
  }

  function formatCurrency(value) {
    return `$${Number(value || 0).toFixed(4)}`;
  }

  function formatLatency(milliseconds) {
    return `${(Number(milliseconds || 0) / 1000).toFixed(2)}s`;
  }

  function formatLivebenchScore(value) {
    if (!Number.isFinite(Number(value))) {
      return "n/a";
    }
    return Number(value).toFixed(4);
  }

  function normalizeMetric(value, minValue, maxValue, invert) {
    if (!Number.isFinite(value)) {
      return 0;
    }
    if (maxValue <= minValue) {
      return 100;
    }
    let fraction = (value - minValue) / (maxValue - minValue);
    if (invert) {
      fraction = 1 - fraction;
    }
    return Math.max(0, Math.min(1, fraction)) * 100;
  }

  function prepareRows(rows) {
    const qualityValues = rows.map((row) => Number(row.quality_mean || 0));
    const costValues = rows.map((row) => Number(row.response_cost_mean || 0));
    const latencyValues = rows.map((row) => Number(row.response_latency_ms_mean || 0));
    const qualityMin = Math.min(...qualityValues);
    const qualityMax = Math.max(...qualityValues);
    const costMin = Math.min(...costValues);
    const costMax = Math.max(...costValues);
    const latencyMin = Math.min(...latencyValues);
    const latencyMax = Math.max(...latencyValues);

    return rows.map((row, index) => ({
      ...row,
      defaultRank: index + 1,
      qualityNormClient: normalizeMetric(Number(row.quality_mean || 0), qualityMin, qualityMax, false),
      costNormClient: normalizeMetric(Number(row.response_cost_mean || 0), costMin, costMax, true),
      latencyNormClient: normalizeMetric(Number(row.response_latency_ms_mean || 0), latencyMin, latencyMax, true),
      searchableText: [
        row.candidate_model_key,
        row.candidate_model_id,
        row.label,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    }));
  }

  function getNormalizedWeights() {
    const quality = clamp(parseNumber(refs.controls.quality.number.value, DEFAULT_WEIGHTS.quality), 0, 100);
    const cost = clamp(parseNumber(refs.controls.cost.number.value, DEFAULT_WEIGHTS.cost), 0, 100);
    const latency = clamp(parseNumber(refs.controls.latency.number.value, DEFAULT_WEIGHTS.latency), 0, 100);
    const total = quality + cost + latency;

    if (total <= 0) {
      return {
        raw: { ...DEFAULT_WEIGHTS },
        normalized: {
          quality: 0.5,
          cost: 0.25,
          latency: 0.25,
        },
      };
    }

    return {
      raw: { quality, cost, latency },
      normalized: {
        quality: quality / total,
        cost: cost / total,
        latency: latency / total,
      },
    };
  }

  function computeDynamicScore(row, weights) {
    return (
      row.qualityNormClient * weights.quality +
      row.costNormClient * weights.cost +
      row.latencyNormClient * weights.latency
    );
  }

  function syncWeightControl(metric, value) {
    const clamped = clamp(parseNumber(value, DEFAULT_WEIGHTS[metric]), 0, 100);
    refs.controls[metric].range.value = String(clamped);
    refs.controls[metric].number.value = String(clamped);
    if (refs.controls[metric].value) {
      refs.controls[metric].value.textContent = String(clamped);
    }
  }

  function buildDefaultPayload(summary) {
    return {
      generated_at: summary.generated_at,
      default_weights: DEFAULT_WEIGHTS,
      candidate_count: summary.candidate_count,
      scorer_count: summary.scorer_count,
      canon_example_count: summary.canon_example_count,
      winners: {
        overall: summary.winners?.overall?.candidate_model_key || null,
        open_weight: summary.winners?.open_weight?.candidate_model_key || null,
        closed_source: summary.winners?.closed_source?.candidate_model_key || null,
      },
    };
  }

  function setText(element, value) {
    if (element) {
      element.textContent = value;
    }
  }

  function setHTML(element, value) {
    if (element) {
      element.innerHTML = value;
    }
  }

  function displayLabel(row) {
    const label = String(row?.label || "").trim();
    if (label.includes(":")) {
      return label.split(":").slice(1).join(":").trim() || label;
    }
    return label || String(row?.candidate_model_key || "Unknown model");
  }

  function buildMetricMarkup(metrics) {
    return metrics
      .map(
        (metric) => `
          <div class="pfb-card-metric">
            <div class="pfb-card-metric-key">${metric.key}</div>
            <div class="pfb-card-metric-value">${metric.value}</div>
          </div>
        `,
      )
      .join("");
  }

  function renderWinnerCard(element, label, row) {
    if (!element) {
      return;
    }
    if (!row) {
      element.innerHTML = "";
      return;
    }
    const badgeMap = {
      overall: "01",
      open_weight: "02",
      closed_source: "03",
    };
    const role = element.getAttribute("data-role");
    const badge = badgeMap[role] || "00";

    setHTML(
      element,
      `
        <div class="pfb-card-label"><span class="pfb-card-rank">${badge}</span>${label}</div>
        <div class="pfb-card-model-id">${row.candidate_model_key || row.candidate_model_id || ""}</div>
        <div class="pfb-card-model">${displayLabel(row)}</div>
        <div class="pfb-card-metrics">
          ${buildMetricMarkup([
            { key: "Composite", value: formatScore(row.composite_score) },
            { key: "Quality", value: formatScore(row.quality_mean) },
            { key: "Cost / req", value: formatCurrency(row.response_cost_mean) },
            { key: "Latency", value: formatLatency(row.response_latency_ms_mean) },
          ])}
        </div>
      `,
    );
  }

  function renderStaticSummary(summary) {
    setText(refs.generatedAt, formatTimestamp(summary.generated_at));
    setText(refs.candidateCount, String(summary.candidate_count || 0));
    setText(refs.canonCount, String(summary.canon_example_count || 0));
    setText(refs.scorerCount, String(summary.scorer_count || 0));
    refs.defaultJson.textContent = JSON.stringify(buildDefaultPayload(summary), null, 2);
    if (refs.methodologyPrompt) {
      refs.methodologyPrompt.textContent = PLAIN_ENGLISH_SCORING_PROMPT;
    }
    renderWinnerCard(refs.winnerCards.overall, "Default Overall Winner", summary.winners?.overall);
    renderWinnerCard(refs.winnerCards.open_weight, "Default Open-Weight Winner", summary.winners?.open_weight);
    renderWinnerCard(refs.winnerCards.closed_source, "Default Closed-Source Winner", summary.winners?.closed_source);
    renderMethodologyScorers(summary.scorers || []);
  }

  function renderMethodologyScorers(scorers) {
    if (!refs.methodologyScorers) {
      return;
    }

    refs.methodologyScorers.innerHTML = "";
    if (!scorers.length) {
      refs.methodologyScorers.innerHTML = '<div class="pfb-empty">Judge panel metadata is unavailable for this run.</div>';
      return;
    }

    const fragment = document.createDocumentFragment();
    scorers.forEach((scorer) => {
      const card = document.createElement("article");
      card.className = "pfb-judge-card";

      const model = document.createElement("div");
      model.className = "pfb-judge-model";
      model.textContent = scorer.model_id || scorer.label || "Unknown scorer";

      const label = document.createElement("div");
      label.className = "pfb-judge-label";
      label.textContent = scorer.label || "";

      const meta = document.createElement("div");
      meta.className = "pfb-judge-meta";
      meta.innerHTML = [
        `LiveBench rank ${scorer.livebench_rank ?? "n/a"}`,
        `Reasoning score ${formatLivebenchScore(scorer.livebench_reasoning_score)}`,
      ]
        .map((item) => `<span>${item}</span>`)
        .join("");

      card.append(model, label, meta);
      fragment.appendChild(card);
    });

    refs.methodologyScorers.appendChild(fragment);
  }

  function filteredRows() {
    const query = (refs.search.value || "").trim().toLowerCase();
    const scope = refs.scope.value || "all";
    const limit = parseNumber(refs.limit.value, 150);
    const weights = getNormalizedWeights().normalized;

    const rows = state.rows
      .filter((row) => {
        if (scope === "open" && !row.open_weight) {
          return false;
        }
        if (scope === "closed" && row.open_weight) {
          return false;
        }
        if (query && !row.searchableText.includes(query)) {
          return false;
        }
        return true;
      })
      .map((row) => ({
        ...row,
        dynamicScore: computeDynamicScore(row, weights),
      }))
      .sort((left, right) => {
        if (right.dynamicScore !== left.dynamicScore) {
          return right.dynamicScore - left.dynamicScore;
        }
        return String(left.candidate_model_key).localeCompare(String(right.candidate_model_key));
      });

    return rows.slice(0, Math.max(1, limit));
  }

  function renderLiveLeader(rows, normalizedWeights) {
    if (!refs.liveLeader) {
      return;
    }
    if (!rows.length) {
      refs.liveLeader.innerHTML = '<div class="pfb-card-label"><span class="pfb-card-rank">LIVE</span>Live Reweighted Leader</div><div class="pfb-card-model">No rows match the current filters.</div>';
      return;
    }

    const leader = rows[0];
    setHTML(
      refs.liveLeader,
      `
        <div class="pfb-card-label"><span class="pfb-card-rank">LIVE</span>Live Reweighted Leader</div>
        <div class="pfb-card-model-id">${leader.candidate_model_key || leader.candidate_model_id || ""}</div>
        <div class="pfb-card-model">${displayLabel(leader)}</div>
        <div class="pfb-card-metrics">
          ${buildMetricMarkup([
            { key: "Score", value: formatScore(leader.dynamicScore) },
            { key: "Quality", value: formatScore(leader.quality_mean) },
            { key: "Cost / req", value: formatCurrency(leader.response_cost_mean) },
            { key: "Latency", value: formatLatency(leader.response_latency_ms_mean) },
          ])}
        </div>
      `,
    );
  }

  function renderWeightSummary(normalizedWeights) {
    setHTML(
      refs.weightSummary,
      `Effective · Q <b>${formatScore(normalizedWeights.quality * 100)}%</b> · C <b>${formatScore(normalizedWeights.cost * 100)}%</b> · L <b>${formatScore(normalizedWeights.latency * 100)}%</b>`,
    );
  }

  function renderTable() {
    const weightState = getNormalizedWeights();
    const rows = filteredRows();
    const fragment = document.createDocumentFragment();

    refs.tableBody.innerHTML = "";

    rows.forEach((row, index) => {
      const rank = index + 1;
      const rowDiv = document.createElement("div");
      const topClass = rank === 1 ? " is-top-1" : rank === 2 ? " is-top-2" : rank === 3 ? " is-top-3" : "";
      const badgeClass = row.open_weight ? "pfb-tag pfb-tag-open" : "pfb-tag pfb-tag-closed";
      const badgeText = row.open_weight ? "Open" : "Closed";

      rowDiv.className = `pfb-row${topClass}`;
      rowDiv.innerHTML = `
        <div class="pfb-rank">${String(rank).padStart(2, "0")}</div>
        <div class="pfb-model">
          <span class="pfb-model-id"></span>
          <span class="pfb-model-label"></span>
        </div>
        <div class="pfb-cell">
          <span class="pfb-cell-value is-score">${formatScore(row.dynamicScore)}</span>
          <div class="pfb-bar"><div class="pfb-bar-fill is-score" style="width:${formatScore(row.dynamicScore)}%"></div></div>
        </div>
        <div class="pfb-default-rank">${String(row.defaultRank).padStart(2, "0")}</div>
        <div class="pfb-cell">
          <span class="pfb-cell-value">${formatScore(row.quality_mean)}</span>
          <div class="pfb-bar"><div class="pfb-bar-fill is-quality" style="width:${formatScore(row.qualityNormClient)}%"></div></div>
        </div>
        <div class="pfb-cell">
          <span class="pfb-cell-value">${formatCurrency(row.response_cost_mean)}</span>
          <div class="pfb-bar"><div class="pfb-bar-fill is-cost" style="width:${formatScore(row.costNormClient)}%"></div></div>
        </div>
        <div class="pfb-cell">
          <span class="pfb-cell-value">${formatLatency(row.response_latency_ms_mean)}</span>
          <div class="pfb-bar"><div class="pfb-bar-fill is-latency" style="width:${formatScore(row.latencyNormClient)}%"></div></div>
        </div>
        <div class="pfb-cell">
          <span class="pfb-cell-value">${formatPercent(row.success_rate)}</span>
          <div class="pfb-bar"><div class="pfb-bar-fill is-success" style="width:${formatScore(Number(row.success_rate || 0) * 100)}%"></div></div>
        </div>
        <div><span class="${badgeClass}">${badgeText}</span></div>
      `;

      rowDiv.querySelector(".pfb-model-id").textContent = row.candidate_model_key || "";
      rowDiv.querySelector(".pfb-model-label").textContent = row.label || "";
      fragment.appendChild(rowDiv);
    });

    refs.tableBody.appendChild(fragment);
    setText(refs.displayedCount, `${rows.length} rows shown`);
    renderWeightSummary(weightState.normalized);
    renderLiveLeader(rows, weightState.normalized);
  }

  function renderError(message) {
    if (!refs.stateMessage) {
      return;
    }
    refs.stateMessage.innerHTML = "";
    const error = document.createElement("div");
    error.className = "pfb-error";
    error.textContent = message;
    refs.stateMessage.appendChild(error);
  }

  function clearMessage() {
    if (refs.stateMessage) {
      refs.stateMessage.innerHTML = "";
    }
  }

  function bindEvents() {
    Object.keys(refs.controls).forEach((metric) => {
      const control = refs.controls[metric];
      control.range.addEventListener("input", () => {
        syncWeightControl(metric, control.range.value);
        renderTable();
      });
      control.number.addEventListener("input", () => {
        syncWeightControl(metric, control.number.value);
        renderTable();
      });
    });

    refs.search.addEventListener("input", renderTable);
    refs.scope.addEventListener("change", renderTable);
    refs.limit.addEventListener("change", renderTable);
    refs.reset.addEventListener("click", () => {
      Object.keys(DEFAULT_WEIGHTS).forEach((metric) => syncWeightControl(metric, DEFAULT_WEIGHTS[metric]));
      renderTable();
    });
  }

  function syncMethodologyAnchor() {
    if (!refs.methodology) {
      return;
    }
    if (window.location.hash === "#methodology") {
      refs.methodology.open = true;
    }
  }

  async function init() {
    const summaryUrl = root.getAttribute("data-summary-url");
    if (!summaryUrl) {
      renderError("Benchmark summary URL is not configured.");
      return;
    }

    Object.keys(DEFAULT_WEIGHTS).forEach((metric) => syncWeightControl(metric, DEFAULT_WEIGHTS[metric]));
    syncMethodologyAnchor();
    window.addEventListener("hashchange", syncMethodologyAnchor);

    try {
      const response = await fetch(summaryUrl, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to load summary (${response.status})`);
      }
      const summary = await response.json();
      state.summary = summary;
      state.rows = prepareRows(summary.model_aggregates || []);
      renderStaticSummary(summary);
      clearMessage();
      renderTable();
    } catch (error) {
      renderError(`Unable to load benchmark data: ${error.message}`);
    }
  }

  bindEvents();
  init();
})();
