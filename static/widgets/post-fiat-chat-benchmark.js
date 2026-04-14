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
    winnerCards: {
      overall: root.querySelector('[data-role="winner-overall"]'),
      open_weight: root.querySelector('[data-role="winner-open-weight"]'),
      closed_source: root.querySelector('[data-role="winner-closed-source"]'),
    },
    controls: {
      quality: {
        range: root.querySelector('[data-role="quality-range"]'),
        number: root.querySelector('[data-role="quality-number"]'),
      },
      cost: {
        range: root.querySelector('[data-role="cost-range"]'),
        number: root.querySelector('[data-role="cost-number"]'),
      },
      latency: {
        range: root.querySelector('[data-role="latency-range"]'),
        number: root.querySelector('[data-role="latency-number"]'),
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

  function renderWinnerCard(element, label, row) {
    if (!element) {
      return;
    }
    if (!row) {
      element.innerHTML = "";
      return;
    }
    element.innerHTML = "";

    const labelNode = document.createElement("div");
    labelNode.className = "pfb-card-label";
    labelNode.textContent = label;

    const modelNode = document.createElement("div");
    modelNode.className = "pfb-card-model";
    modelNode.textContent = row.candidate_model_key || row.label || "Unknown model";

    const metricsNode = document.createElement("div");
    metricsNode.className = "pfb-card-metrics";
    metricsNode.innerHTML = [
      `Composite ${formatScore(row.composite_score)}`,
      `Quality ${formatScore(row.quality_mean)}`,
      `Cost ${formatCurrency(row.response_cost_mean)}`,
      `Latency ${formatLatency(row.response_latency_ms_mean)}`,
    ]
      .map((item) => `<span>${item}</span>`)
      .join("");

    element.append(labelNode, modelNode, metricsNode);
  }

  function renderStaticSummary(summary) {
    setText(refs.generatedAt, `Run: ${formatTimestamp(summary.generated_at)}`);
    setText(refs.candidateCount, `${summary.candidate_count || 0} candidates`);
    setText(refs.canonCount, `${summary.canon_example_count || 0} canon examples`);
    setText(refs.scorerCount, `${summary.scorer_count || 0} scorers`);
    refs.defaultJson.textContent = JSON.stringify(buildDefaultPayload(summary), null, 2);
    renderWinnerCard(refs.winnerCards.overall, "Default Overall Winner", summary.winners?.overall);
    renderWinnerCard(refs.winnerCards.open_weight, "Default Open-Weight Winner", summary.winners?.open_weight);
    renderWinnerCard(refs.winnerCards.closed_source, "Default Closed-Source Winner", summary.winners?.closed_source);
  }

  function filteredRows() {
    const query = (refs.search.value || "").trim().toLowerCase();
    const scope = refs.scope.value || "all";
    const limit = parseNumber(refs.limit.value, 25);
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
      refs.liveLeader.innerHTML = '<div class="pfb-card-label">Live Reweighted Leader</div><div class="pfb-card-model">No rows match the current filters.</div>';
      return;
    }

    const leader = rows[0];
    refs.liveLeader.innerHTML = "";

    const labelNode = document.createElement("div");
    labelNode.className = "pfb-card-label";
    labelNode.textContent = "Live Reweighted Leader";

    const modelNode = document.createElement("div");
    modelNode.className = "pfb-card-model";
    modelNode.textContent = leader.candidate_model_key;

    const metricsNode = document.createElement("div");
    metricsNode.className = "pfb-card-metrics";
    metricsNode.innerHTML = [
      `Score ${formatScore(leader.dynamicScore)}`,
      `Quality ${formatScore(leader.quality_mean)}`,
      `Cost ${formatCurrency(leader.response_cost_mean)}`,
      `Latency ${formatLatency(leader.response_latency_ms_mean)}`,
      `Q ${formatScore(normalizedWeights.quality * 100)}% / C ${formatScore(normalizedWeights.cost * 100)}% / L ${formatScore(normalizedWeights.latency * 100)}%`,
    ]
      .map((item) => `<span>${item}</span>`)
      .join("");

    refs.liveLeader.append(labelNode, modelNode, metricsNode);
  }

  function renderWeightSummary(normalizedWeights) {
    const text = `Effective weighting: quality ${formatScore(normalizedWeights.quality * 100)}% | cost ${formatScore(normalizedWeights.cost * 100)}% | latency ${formatScore(normalizedWeights.latency * 100)}%`;
    setText(refs.weightSummary, text);
  }

  function renderTable() {
    const weightState = getNormalizedWeights();
    const rows = filteredRows();
    const fragment = document.createDocumentFragment();

    refs.tableBody.innerHTML = "";

    rows.forEach((row, index) => {
      const tr = document.createElement("tr");

      const badgeClass = row.open_weight ? "pfb-badge pfb-badge-open" : "pfb-badge pfb-badge-closed";
      const badgeText = row.open_weight ? "Open" : "Closed";

      tr.innerHTML = `
        <td class="pfb-rank">${index + 1}</td>
        <td class="pfb-model">
          <span class="pfb-model-id"></span>
          <span class="pfb-model-label"></span>
        </td>
        <td class="pfb-metric">${formatScore(row.dynamicScore)}</td>
        <td class="pfb-rank">${row.defaultRank}</td>
        <td class="pfb-metric">${formatScore(row.quality_mean)}</td>
        <td class="pfb-metric">${formatCurrency(row.response_cost_mean)}</td>
        <td class="pfb-metric">${formatLatency(row.response_latency_ms_mean)}</td>
        <td class="pfb-metric">${formatPercent(row.success_rate)}</td>
        <td><span class="${badgeClass}">${badgeText}</span></td>
      `;

      tr.querySelector(".pfb-model-id").textContent = row.candidate_model_key || "";
      tr.querySelector(".pfb-model-label").textContent = row.label || "";
      fragment.appendChild(tr);
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

  async function init() {
    const summaryUrl = root.getAttribute("data-summary-url");
    if (!summaryUrl) {
      renderError("Benchmark summary URL is not configured.");
      return;
    }

    Object.keys(DEFAULT_WEIGHTS).forEach((metric) => syncWeightControl(metric, DEFAULT_WEIGHTS[metric]));

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
