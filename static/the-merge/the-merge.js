(function () {
  var config = window.THE_MERGE_CONFIG || {};
  var telemetryUrl = config.telemetryUrl || "/the-merge/telemetry.json";
  var githubUser = config.githubUser || "goodalexander";
  var refreshSeconds = Number(config.refreshSeconds || 30);
  var githubRefreshSeconds = Number(config.githubRefreshSeconds || 300);
  var maxGithubCommits = Number(config.maxGithubCommits || 24);
  var lastGithubFetch = 0;
  var state = {
    telemetry: null,
    github: {
      ok: false,
      commits: [],
      series: [],
      error: ""
    },
    redactions: []
  };
  var chartHover = {
    active: false,
    index: null,
    cssX: 0,
    cssY: 0
  };

  var fallbackTelemetry = {
    generated_at: new Date().toISOString(),
    refresh_seconds: refreshSeconds,
    profile: {
      handle: "goodalexander",
      display_name: "goodalexander",
      nft_image: "/the-merge/profile-nft-full.jpg",
      main_wallet: "redacted"
    },
    metrics: {
      tasknode_dau: 0,
      x_followers: null,
      commits_today: 0,
      loc_today: null,
      task_requests_24h: 0,
      task_verifications_24h: 0,
      task_updates_24h: 0,
      tasks_completed_24h: 0,
      rewards_delivered_24h: 0,
      pft_rewards_24h: 0,
      context_updates_24h: 0,
      wallet_interactions_24h: null,
      merge_pressure: null
    },
    series: [],
    events: [],
    private_github: null,
    wallet: { recent: [] },
    redactions: []
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function text(id, value) {
    var el = byId(id);
    if (el) el.textContent = value == null ? "" : String(value);
  }

  function formatNumber(value) {
    var numeric = Number(value || 0);
    if (!Number.isFinite(numeric)) return "0";
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(numeric);
  }

  function formatCompact(value) {
    var numeric = Number(value || 0);
    if (!Number.isFinite(numeric)) return "0";
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(numeric);
  }

  function dateKey(value) {
    var parsed = value ? new Date(value) : new Date();
    if (Number.isNaN(parsed.getTime())) return new Date().toISOString().slice(0, 10);
    return parsed.toISOString().slice(0, 10);
  }

  function timestampMs(value) {
    var parsed = value ? new Date(value) : null;
    return parsed && !Number.isNaN(parsed.getTime()) ? parsed.getTime() : null;
  }

  function isFreshTimestamp(value, referenceValue, maxHours) {
    var timestamp = timestampMs(value);
    var reference = timestampMs(referenceValue) || Date.now();
    if (timestamp == null) return false;
    var maxAgeMs = maxHours * 60 * 60 * 1000;
    return timestamp <= reference + (5 * 60 * 1000) && reference - timestamp <= maxAgeMs;
  }

  function formatTime(value) {
    var parsed = value ? new Date(value) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) return "";
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(parsed);
    } catch (err) {
      return parsed.toISOString();
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function redactWallet(value) {
    var textValue = String(value || "");
    if (textValue.length <= 10) return textValue || "redacted";
    return textValue.slice(0, 4) + "..." + textValue.slice(-4);
  }

  function redactText(value) {
    var textValue = String(value == null ? "" : value);
    textValue = textValue.replace(/\br[1-9A-HJ-NP-Za-km-z]{24,34}\b/g, function (match) {
      return redactWallet(match);
    });
    textValue = textValue.replace(/\b[0-9a-f]{32,}\b/gi, function (match) {
      return "[hash:" + match.slice(0, 6) + "]";
    });
    textValue = textValue.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email redacted]");
    textValue = textValue.replace(/https?:\/\/[^\s)]+/gi, "[external link]");
    state.redactions.forEach(function (term) {
      var cleaned = String(term || "").trim();
      if (!cleaned) return;
      var pattern = new RegExp(cleaned.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      textValue = textValue.replace(pattern, "[redacted]");
    });
    return textValue;
  }

  function metric(data, key) {
    var value = finiteMetric(data, key);
    return value == null ? 0 : value;
  }

  function finiteMetric(data, key) {
    var raw = (data.metrics || {})[key];
    if (raw === null || raw === undefined || raw === "") return null;
    var parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function formatNullableMetric(data, key, formatter) {
    var value = finiteMetric(data, key);
    if (value == null) return "n/a";
    return (formatter || formatNumber)(value);
  }

  function asFiniteNumber(value) {
    if (value === null || value === undefined || value === "") return null;
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function formatDecimal(value, maximumFractionDigits) {
    var numeric = Number(value || 0);
    if (!Number.isFinite(numeric)) return "0";
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: maximumFractionDigits == null ? 1 : maximumFractionDigits
    }).format(numeric);
  }

  function formatAverageValue(value) {
    var numeric = Number(value || 0);
    if (!Number.isFinite(numeric)) return "0";
    if (Math.abs(numeric) >= 1000) return formatCompact(numeric);
    return formatDecimal(numeric, Number.isInteger(numeric) ? 0 : 1);
  }

  function overlayCurrentMetrics(series, data) {
    var today = dateKey(new Date());
    var rows = Array.isArray(series) ? series.slice() : [];
    var row = rows.find(function (entry) { return entry && entry.date === today; });
    if (!row) {
      row = { date: today };
      rows.push(row);
    }
    [
      ["dau", "tasknode_dau"],
      ["x_followers", "x_followers"],
      ["tasks_completed", "tasks_completed_24h"],
      ["rewards", "rewards_delivered_24h"],
      ["pft_rewards", "pft_rewards_24h"],
      ["context_updates", "context_updates_24h"],
      ["wallet_interactions", "wallet_interactions_24h"]
    ].forEach(function (mapping) {
      var value = finiteMetric(data, mapping[1]);
      if (value != null) row[mapping[0]] = value;
    });
    return rows.sort(function (left, right) {
      return String(left.date || "").localeCompare(String(right.date || ""));
    });
  }

  function summarizeWindow(rows, key, mode) {
    if (!Array.isArray(rows) || !rows.length) return null;
    if (mode === "point") {
      for (var index = rows.length - 1; index >= 0; index -= 1) {
        var pointValue = asFiniteNumber(rows[index] && rows[index][key]);
        if (pointValue != null) return pointValue;
      }
      return null;
    }
    var total = rows.reduce(function (sum, row) {
      var value = asFiniteNumber(row && row[key]);
      return sum + (value == null ? 0 : value);
    }, 0);
    return mode === "average" ? total / rows.length : total;
  }

  function computeWeekOverWeek(series, key, mode) {
    var rows = (Array.isArray(series) ? series : []).filter(function (row) { return row && row.date; }).slice(-14);
    if (rows.length < 14) return null;
    var previousRows = rows.slice(0, 7);
    var currentRows = rows.slice(7);
    var current = summarizeWindow(currentRows, key, mode);
    var previous = summarizeWindow(previousRows, key, mode);
    if (current == null || previous == null) return null;
    return { current: current, previous: previous };
  }

  function formatGrowth(current, previous) {
    if (previous === 0) {
      if (current === 0) return "flat WoW";
      return "new WoW";
    }
    var percent = ((current - previous) / Math.abs(previous)) * 100;
    var absolute = Math.abs(percent);
    var digits = absolute > 99 ? 0 : absolute >= 10 ? 1 : 1;
    var formatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: digits
    }).format(percent);
    return (percent > 0 ? "+" : "") + formatted + "% WoW";
  }

  function formatWoW(series, key, mode, label, formatter) {
    var comparison = computeWeekOverWeek(series, key, mode);
    if (!comparison) return "WoW history pending";
    var growth = formatGrowth(comparison.current, comparison.previous);
    if (!label) return growth;
    return label + " " + (formatter || formatNumber)(comparison.current) + ", " + growth;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function privateGithub(data) {
    return data && data.private_github && typeof data.private_github === "object"
      ? data.private_github
      : {};
  }

  function privateGithubMetric(data, key) {
    var raw = privateGithub(data)[key];
    if (raw === null || raw === undefined || raw === "") return 0;
    var parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function rowMetric(row, key) {
    var value = asFiniteNumber(row && row[key]);
    return value == null ? 0 : value;
  }

  function todayVelocity() {
    var today = dateKey(new Date());
    return mergedSeries().find(function (row) { return row.date === today; }) || null;
  }

  function deriveMergePressure(data, locToday, commitsToday) {
    var configured = finiteMetric(data, "merge_pressure");
    if (configured != null) return Math.max(0, Math.min(100, configured));
    var pressure = 24;
    pressure += Math.min(28, metric(data, "tasknode_dau"));
    pressure += Math.min(18, Number(locToday || 0) / 90);
    pressure += Math.min(12, Number(commitsToday || 0) * 2);
    pressure += Math.min(8, metric(data, "task_requests_24h") * 2);
    pressure += Math.min(8, metric(data, "context_updates_24h") * 4);
    pressure += Math.min(10, metric(data, "wallet_interactions_24h") * 2);
    return Math.round(Math.max(0, Math.min(100, pressure)));
  }

  function cloneJson(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  async function fetchJson(url) {
    var resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error("HTTP " + String(resp.status));
    return resp.json();
  }

  function commitCacheKey(commit) {
    return "the-merge:commit:" + String(commit.url || commit.sha || "");
  }

  function readCommitCache(commit) {
    if (!window.localStorage || (!commit.sha && !commit.url)) return null;
    try {
      var raw = window.localStorage.getItem(commitCacheKey(commit));
      if (!raw) return null;
      var cached = JSON.parse(raw);
      var maxAgeMs = 30 * 24 * 60 * 60 * 1000;
      if (!cached.cached_at || Date.now() - Number(cached.cached_at) > maxAgeMs) return null;
      return Object.assign({}, commit, cached.detail || {});
    } catch (err) {
      return null;
    }
  }

  function writeCommitCache(commit, detail) {
    if (!window.localStorage || (!commit.sha && !commit.url)) return;
    try {
      window.localStorage.setItem(commitCacheKey(commit), JSON.stringify({
        cached_at: Date.now(),
        detail: {
          url: detail.url || "",
          additions: Number(detail.additions || 0),
          deletions: Number(detail.deletions || 0),
          total: Number(detail.total || 0),
          count: Number(detail.count || 1)
        }
      }));
    } catch (err) {
      // localStorage can be disabled or full; the dashboard still works without it.
    }
  }

  async function fetchTelemetry() {
    try {
      var data = await fetchJson(telemetryUrl + "?t=" + encodeURIComponent(String(Date.now())));
      state.telemetry = data && typeof data === "object" ? data : fallbackTelemetry;
      state.redactions = Array.isArray(state.telemetry.redactions) ? state.telemetry.redactions : [];
      text("source-status", "telemetry linked");
    } catch (err) {
      state.telemetry = cloneJson(fallbackTelemetry);
      state.telemetry.notes = { error: String(err && err.message ? err.message : err) };
      state.redactions = [];
      text("source-status", "telemetry fallback");
    }
  }

  function collectPushCommits(events) {
    var commits = [];
    (Array.isArray(events) ? events : []).forEach(function (event) {
      if (event.type !== "PushEvent") return;
      var repoName = event.repo && event.repo.name ? event.repo.name : "unknown";
      var createdAt = event.created_at || "";
      var payload = event.payload || {};
      var payloadCommits = event.payload && Array.isArray(event.payload.commits)
        ? event.payload.commits
        : [];
      if (payloadCommits.length) {
        payloadCommits.forEach(function (commit) {
          commits.push({
            sha: commit.sha || "",
            message: commit.message || "",
            repo: repoName,
            url: commit.url || "",
            ts: createdAt,
            count: 1
          });
        });
        return;
      }
      if (!payload.head) return;
      var before = String(payload.before || "");
      var head = String(payload.head || "");
      var branch = String(payload.ref || "").replace(/^refs\/heads\//, "");
      var zeroBefore = /^0+$/.test(before);
      var apiUrl = zeroBefore || !before
        ? "https://api.github.com/repos/" + repoName + "/commits/" + encodeURIComponent(head)
        : "https://api.github.com/repos/" + repoName + "/compare/" + encodeURIComponent(before) + "..." + encodeURIComponent(head);
      commits.push({
        sha: head,
        message: "Push to " + (branch || "repository"),
        repo: repoName,
        url: apiUrl,
        ts: createdAt,
        compare: !zeroBefore && Boolean(before),
        count: 1
      });
    });
    return commits;
  }

  async function enrichCommit(commit) {
    if (!commit.url) return commit;
    var cached = readCommitCache(commit);
    if (cached) return cached;
    try {
      var detail = await fetchJson(commit.url);
      if (commit.compare) {
        var files = Array.isArray(detail.files) ? detail.files : [];
        var additions = files.reduce(function (sum, file) { return sum + Number(file.additions || 0); }, 0);
        var deletions = files.reduce(function (sum, file) { return sum + Number(file.deletions || 0); }, 0);
        var total = files.reduce(function (sum, file) { return sum + Number(file.changes || 0); }, 0);
        var detailCommits = Array.isArray(detail.commits) ? detail.commits : [];
        var lastCommit = detailCommits.length ? detailCommits[detailCommits.length - 1] : null;
        var enrichedCompare = {
          sha: commit.sha,
          message: lastCommit && lastCommit.commit && lastCommit.commit.message
            ? lastCommit.commit.message
            : commit.message,
          repo: commit.repo,
          url: detail.html_url || "",
          ts: commit.ts,
          additions: additions,
          deletions: deletions,
          total: total || additions + deletions,
          count: Number(detail.total_commits || detailCommits.length || commit.count || 1)
        };
        writeCommitCache(commit, enrichedCompare);
        return enrichedCompare;
      }
      var stats = detail && detail.stats ? detail.stats : {};
      var enriched = {
        sha: commit.sha,
        message: commit.message,
        repo: commit.repo,
        url: detail.html_url || "",
        ts: commit.ts,
        additions: Number(stats.additions || 0),
        deletions: Number(stats.deletions || 0),
        total: Number(stats.total || 0),
        count: Number(commit.count || 1)
      };
      writeCommitCache(commit, enriched);
      return enriched;
    } catch (err) {
      return readCommitCache(commit) || {
        sha: commit.sha,
        message: commit.message,
        repo: commit.repo,
        url: "",
        ts: commit.ts,
        additions: 0,
        deletions: 0,
        total: 0,
        count: Number(commit.count || 1)
      };
    }
  }

  async function fetchGithub() {
    try {
      var events = await fetchJson("https://api.github.com/users/" + encodeURIComponent(githubUser) + "/events/public?per_page=100");
      var baseCommits = collectPushCommits(events).slice(0, Math.max(1, maxGithubCommits));
      var enriched = await Promise.all(baseCommits.map(enrichCommit));
      var grouped = {};
      enriched.forEach(function (commit) {
        var key = dateKey(commit.ts);
        if (!grouped[key]) grouped[key] = { date: key, commits: 0, loc: 0, additions: 0, deletions: 0 };
        grouped[key].commits += Number(commit.count || 1);
        grouped[key].loc += Number(commit.total || 0);
        grouped[key].additions += Number(commit.additions || 0);
        grouped[key].deletions += Number(commit.deletions || 0);
      });
      state.github = {
        ok: true,
        commits: enriched,
        series: Object.keys(grouped).sort().map(function (key) { return grouped[key]; }),
        error: ""
      };
      text("github-status", "GitHub live");
    } catch (err) {
      state.github = {
        ok: false,
        commits: [],
        series: [],
        error: String(err && err.message ? err.message : err)
      };
      text("github-status", "GitHub fallback");
    }
  }

  async function refreshGithubIfDue(force) {
    var intervalMs = Math.max(60, githubRefreshSeconds) * 1000;
    if (!force && Date.now() - lastGithubFetch < intervalMs) return;
    lastGithubFetch = Date.now();
    await fetchGithub();
  }

  function mergedSeries() {
    var data = state.telemetry || fallbackTelemetry;
    var seriesByDate = {};
    (Array.isArray(data.series) ? data.series : []).forEach(function (row) {
      if (!row || !row.date) return;
      var next = Object.assign({}, row);
      var privateLoc = rowMetric(next, "github_private_loc");
      var privateCommits = rowMetric(next, "github_private_commits");
      var publicLoc = rowMetric(next, "github_public_loc");
      var publicCommits = rowMetric(next, "github_public_commits");
      var totalLoc = asFiniteNumber(next.github_total_loc);
      var totalCommits = asFiniteNumber(next.github_total_commits);
      var githubLoc = totalLoc == null ? privateLoc + publicLoc : totalLoc;
      var githubCommits = totalCommits == null ? privateCommits + publicCommits : totalCommits;
      next.loc = rowMetric(next, "loc") + githubLoc;
      next.commits = rowMetric(next, "commits") + githubCommits;
      seriesByDate[row.date] = next;
    });
    state.github.series.forEach(function (row) {
      if (!seriesByDate[row.date]) seriesByDate[row.date] = { date: row.date };
      var existing = seriesByDate[row.date];
      var previousPublicLoc = rowMetric(existing, "github_public_loc");
      var previousPublicCommits = rowMetric(existing, "github_public_commits");
      var livePublicLoc = Number(row.loc || 0);
      var livePublicCommits = Number(row.commits || 0);
      var nextPublicLoc = Math.max(previousPublicLoc, livePublicLoc);
      var nextPublicCommits = Math.max(previousPublicCommits, livePublicCommits);
      var previousTotalLoc = asFiniteNumber(existing.github_total_loc);
      var previousTotalCommits = asFiniteNumber(existing.github_total_commits);
      existing.github_public_loc = nextPublicLoc;
      existing.github_public_commits = nextPublicCommits;
      existing.github_total_loc = previousTotalLoc == null
        ? rowMetric(existing, "github_private_loc") + nextPublicLoc
        : previousTotalLoc - previousPublicLoc + nextPublicLoc;
      existing.github_total_commits = previousTotalCommits == null
        ? rowMetric(existing, "github_private_commits") + nextPublicCommits
        : previousTotalCommits - previousPublicCommits + nextPublicCommits;
      existing.loc = rowMetric(existing, "loc") - previousPublicLoc + nextPublicLoc;
      existing.commits = rowMetric(existing, "commits") - previousPublicCommits + nextPublicCommits;
    });
    var rows = Object.keys(seriesByDate).sort().map(function (key) {
      return seriesByDate[key];
    });
    return overlayCurrentMetrics(rows, data).slice(-14);
  }

  function todayGithub() {
    var today = dateKey(new Date());
    return state.github.series.find(function (row) { return row.date === today; }) || null;
  }

  function renderMetrics() {
    var data = state.telemetry || fallbackTelemetry;
    var profile = data.profile || {};
    var today = todayVelocity();
    var locToday = today ? today.loc : finiteMetric(data, "loc_today");
    var commitsToday = today ? today.commits : finiteMetric(data, "commits_today");
    var dau = metric(data, "tasknode_dau");
    var mergePressure = deriveMergePressure(data, locToday, commitsToday);
    var priorSeries = mergedSeries();
    var prev = priorSeries.length > 1 ? Number(priorSeries[priorSeries.length - 2].dau || 0) : 0;
    var delta = prev ? dau - prev : 0;
    var image = byId("profile-nft");
    if (image && profile.nft_image) image.src = profile.nft_image;
    text("operator-name", profile.display_name || profile.handle || "goodalexander");
    text("wallet-line", redactWallet(profile.main_wallet || ""));
    text("last-updated", "last sync " + formatTime(data.generated_at || new Date().toISOString()));
    text("metric-dau", formatNumber(dau));
    text("metric-dau-delta", (delta >= 0 ? "+" : "") + formatNumber(delta) + " vs prior");
    text("metric-dau-growth", formatWoW(priorSeries, "dau", "average", "7d avg", formatAverageValue));
    text("metric-followers", formatNullableMetric(data, "x_followers", formatCompact));
    text("metric-followers-source", data.x_profile && data.x_profile.source === "x_api_v2_users_by_username" ? "official X API" : "source pending");
    text("metric-followers-growth", formatWoW(priorSeries, "x_followers", "point", "", formatCompact));
    text("metric-loc", locToday == null ? "n/a" : formatNumber(locToday));
    text("metric-commits", commitsToday == null ? "GitHub pending" : formatNumber(commitsToday) + " commits today incl redacted");
    text("metric-loc-growth", formatWoW(priorSeries, "loc", "average", "7d avg", formatAverageValue));
    text("metric-tasks", formatNumber(metric(data, "tasks_completed_24h")));
    text("metric-tasks-growth", formatWoW(priorSeries, "tasks_completed", "sum", "7d total", formatNumber));
    text("metric-rewards", formatNumber(metric(data, "rewards_delivered_24h")));
    text("metric-pft", formatCompact(metric(data, "pft_rewards_24h")) + " PFT");
    text("metric-rewards-growth", formatWoW(priorSeries, "rewards", "sum", "7d total", formatNumber));
    text("metric-context", formatNumber(metric(data, "context_updates_24h")));
    text("metric-context-growth", formatWoW(priorSeries, "context_updates", "sum", "7d total", formatNumber));
    text("merge-pressure", formatNumber(mergePressure));
    text("wallet-count", finiteMetric(data, "wallet_interactions_24h") == null ? "pending" : formatNumber(metric(data, "wallet_interactions_24h")) + " / 24h");
  }

  function renderModalityBars() {
    var data = state.telemetry || fallbackTelemetry;
    var rows = [
      ["task request", metric(data, "task_requests_24h"), "var(--cyan)"],
      ["verification", metric(data, "task_verifications_24h"), "var(--green)"],
      ["task update", metric(data, "task_updates_24h"), "var(--steel)"],
      ["reward", metric(data, "rewards_delivered_24h"), "var(--gold)"],
      ["context doc", metric(data, "context_updates_24h"), "var(--red)"],
      ["wallet", metric(data, "wallet_interactions_24h"), "var(--violet)"]
    ];
    var max = Math.max.apply(null, rows.map(function (row) { return row[1]; }).concat([1]));
    var html = rows.map(function (row) {
      var pct = Math.max(4, Math.round((row[1] / max) * 100));
      return [
        '<div class="modality-row">',
        "<span>" + escapeHtml(row[0]) + "</span>",
        '<div class="bar-track"><div class="bar-fill" style="width:' + pct + "%; color:" + row[2] + '; background:' + row[2] + '"></div></div>',
        "<strong>" + escapeHtml(formatNumber(row[1])) + "</strong>",
        "</div>"
      ].join("");
    }).join("");
    byId("modality-bars").innerHTML = html;
  }

  function eventTone(type) {
    var tones = {
      task_request: "var(--cyan)",
      task_verification: "var(--green)",
      task_update: "var(--steel)",
      reward_delivered: "var(--gold)",
      context_update: "var(--red)",
      context_rewrite: "var(--red)",
      wallet_interaction: "var(--violet)",
      github_commit: "var(--green)",
      github_private: "var(--violet)",
      chat_interaction: "var(--cyan)"
    };
    return tones[type] || "var(--cyan)";
  }

  function renderSubjectFeed(data) {
    var subjectFeed = data && data.subject_feed && typeof data.subject_feed === "object" ? data.subject_feed : null;
    var entries = subjectFeed && Array.isArray(subjectFeed.entries) ? subjectFeed.entries.slice() : [];
    if (!entries.length) return false;
    entries = entries.filter(function (entry) {
      return isFreshTimestamp(entry && entry.ts, data && data.generated_at, 48);
    });
    if (!entries.length || !isFreshTimestamp(subjectFeed.generated_at, data && data.generated_at, 48)) return false;
    entries.sort(function (a, b) {
      return new Date(b.ts || 0).getTime() - new Date(a.ts || 0).getTime();
    });
    text("event-count", formatNumber(entries.length) + " clear updates");
    byId("event-feed").innerHTML = entries.slice(0, 18).map(function (entry) {
      var tone = eventTone(entry.type);
      var signal = entry.signal ? '<span class="subject-signal">category: ' + escapeHtml(redactText(entry.signal)) + "</span>" : "";
      var magnitudeText = String(entry.magnitude || "").trim();
      var showMagnitude = magnitudeText && !/^(actual|recorded|completed)$/i.test(magnitudeText) && !/^llm:/i.test(magnitudeText);
      var magnitudeLabel = showMagnitude ? magnitudeText : "";
      var magnitude = magnitudeLabel ? '<span class="subject-model">' + escapeHtml(redactText(magnitudeLabel)) + "</span>" : "";
      return [
        '<article class="event-item subject-event" style="border-left:3px solid ' + tone + '">',
        '<span class="subject-node" style="color:' + tone + '"></span>',
        '<div class="subject-body">',
        '<div class="event-top">',
        '<span class="event-type" style="color:' + tone + '">' + escapeHtml(redactText(entry.label || entry.type || "subject signal")) + "</span>",
        '<span class="event-time">' + escapeHtml(formatTime(entry.ts)) + "</span>",
        "</div>",
        '<p class="event-detail">' + escapeHtml(redactText(entry.detail || "")) + "</p>",
        '<div class="subject-meta">' + signal + magnitude + "</div>",
        "</div>",
        "</article>"
      ].join("");
    }).join("");
    return true;
  }

  function renderEvents() {
    var data = state.telemetry || fallbackTelemetry;
    if (renderSubjectFeed(data)) return;
    var events = (Array.isArray(data.events) ? data.events : []).filter(function (event) {
      return event && (
        event.type === "github_private"
        || isFreshTimestamp(event.ts, data.generated_at, 48)
      );
    });
    var privateStats = privateGithub(data);
    var hasPrivateEvent = events.some(function (event) { return event && event.type === "github_private"; });
    if (!hasPrivateEvent && (privateGithubMetric(data, "total_commits_today") || privateGithubMetric(data, "total_loc_today"))) {
      events.push({
        ts: privateStats.generated_at || data.generated_at,
        type: "github_private",
        label: "GitHub aggregate",
        detail: "Authenticated public and private GitHub activity included as redacted aggregate.",
        magnitude: formatNumber(privateGithubMetric(data, "total_commits_today")) + " commits / " + formatNumber(privateGithubMetric(data, "total_loc_today")) + " LOC"
      });
    }
    state.github.commits.slice(0, 6).forEach(function (commit) {
      events.push({
        ts: commit.ts,
        type: "github_commit",
        label: "GitHub commit",
        detail: commit.repo + ": " + commit.message,
        magnitude: commit.total ? formatNumber(commit.total) + " LOC" : formatNumber(commit.count || 1) + " commits"
      });
    });
    events.sort(function (a, b) {
      return new Date(b.ts || 0).getTime() - new Date(a.ts || 0).getTime();
    });
    text("event-count", formatNumber(events.length) + " fresh events");
    if (!events.length) {
      byId("event-feed").innerHTML = '<article class="event-item"><p class="event-detail">No fresh redacted operator events in the current telemetry window.</p></article>';
      return;
    }
    byId("event-feed").innerHTML = events.slice(0, 14).map(function (event) {
      var tone = eventTone(event.type);
      return [
        '<article class="event-item" style="border-left:3px solid ' + tone + '">',
        '<div class="event-top">',
        '<span class="event-type" style="color:' + tone + '">' + escapeHtml(redactText(event.label || event.type || "event")) + "</span>",
        '<span class="event-time">' + escapeHtml(formatTime(event.ts)) + "</span>",
        "</div>",
        '<p class="event-detail">' + escapeHtml(redactText(event.detail || "")) + "</p>",
        event.magnitude ? '<span class="event-time">' + escapeHtml(redactText(event.magnitude)) + "</span>" : "",
        "</article>"
      ].join("");
    }).join("");
  }

  function renderGithub() {
    var commits = state.github.commits.slice(0, 10);
    var target = byId("commit-list");
    var data = state.telemetry || fallbackTelemetry;
    var privateStats = privateGithub(data);
    var hasPrivateStats = Boolean(
      privateGithubMetric(data, "total_author_commits_in_window")
      || privateGithubMetric(data, "total_author_loc_in_window")
      || privateGithubMetric(data, "total_commits_today")
      || privateGithubMetric(data, "total_loc_today")
      || privateGithubMetric(data, "public_author_commits_in_window")
      || privateGithubMetric(data, "public_author_loc_in_window")
      || privateGithubMetric(data, "public_commits_today")
      || privateGithubMetric(data, "public_loc_today")
      || privateGithubMetric(data, "private_author_commits_in_window")
      || privateGithubMetric(data, "private_author_loc_in_window")
      || privateGithubMetric(data, "private_commits_today")
      || privateGithubMetric(data, "private_loc_today")
    );
    if (!commits.length && !hasPrivateStats) {
      target.innerHTML = '<article class="commit-item"><p class="commit-title">Waiting for public GitHub pulse.</p><span class="commit-meta">' + escapeHtml(state.github.error || "no commits in current window") + "</span></article>";
      return;
    }
    var privateHtml = hasPrivateStats ? [
      '<article class="commit-item">',
      '<div class="commit-top">',
      '<strong>redacted GitHub aggregate</strong>',
      '<span class="commit-meta">' + escapeHtml(formatTime(privateStats.generated_at || data.generated_at)) + "</span>",
      "</div>",
      '<p class="commit-title">Persisted aggregate omits repo names and commit messages.</p>',
      '<span class="commit-meta">' + formatNumber(privateGithubMetric(data, "total_commits_today")) + " total commits today / " + formatNumber(privateGithubMetric(data, "total_loc_today")) + " LOC today</span>",
      '<span class="commit-meta">' + formatNumber(privateGithubMetric(data, "public_commits_today")) + " public / " + formatNumber(privateGithubMetric(data, "private_commits_today")) + " private commits today</span>",
      '<span class="commit-meta">' + formatNumber(privateGithubMetric(data, "total_author_commits_in_window")) + " commits / " + formatNumber(privateGithubMetric(data, "total_author_loc_in_window")) + " LOC over " + formatNumber(privateGithubMetric(data, "window_days") || 14) + "d</span>",
      "</article>"
    ].join("") : "";
    var publicHtml = commits.map(function (commit) {
      var loc = Number(commit.total || 0);
      return [
        '<article class="commit-item">',
        '<div class="commit-top">',
        '<strong>' + escapeHtml(redactText(commit.repo || "repo")) + "</strong>",
        '<span class="commit-meta">' + escapeHtml(formatTime(commit.ts)) + "</span>",
        "</div>",
        '<p class="commit-title">' + escapeHtml(redactText(String(commit.message || "").split("\n")[0])) + "</p>",
        '<span class="commit-meta">' + formatNumber(commit.count || 1) + " commits / +" + formatNumber(commit.additions || 0) + " / -" + formatNumber(commit.deletions || 0) + " / " + formatNumber(loc) + " LOC</span>",
        "</article>"
      ].join("");
    }).join("");
    target.innerHTML = privateHtml + publicHtml;
  }

  function renderWallet() {
    var data = state.telemetry || fallbackTelemetry;
    var wallet = data.wallet || {};
    var recent = Array.isArray(wallet.recent)
      ? wallet.recent.filter(function (item) {
        return isFreshTimestamp(item && item.ts, data.generated_at, 24);
      })
      : [];
    var target = byId("wallet-events");
    if (!recent.length) {
      var count = metric(data, "wallet_interactions_24h");
      target.innerHTML = count
        ? '<article class="wallet-item"><p class="wallet-value">' + escapeHtml(formatNumber(count)) + ' wallet interactions counted in the last 24h. Redacted transaction rows are pending from public telemetry.</p></article>'
        : '<article class="wallet-item"><p class="wallet-value">No public wallet interactions in the last 24h.</p></article>';
      return;
    }
    target.innerHTML = recent.slice(0, 8).map(function (item) {
      return [
        '<article class="wallet-item">',
        '<div class="wallet-top">',
        '<strong>' + escapeHtml(redactText(item.label || item.kind || "wallet action")) + "</strong>",
        '<span class="wallet-meta">' + escapeHtml(formatTime(item.ts)) + "</span>",
        "</div>",
        '<p class="wallet-value">' + escapeHtml(redactText(item.value || "")) + "</p>",
        "</article>"
      ].join("");
    }).join("");
  }

  function sizeCanvas(canvas) {
    var rect = canvas.getBoundingClientRect();
    var ratio = window.devicePixelRatio || 1;
    var width = Math.max(1, Math.floor(rect.width * ratio));
    var height = Math.max(1, Math.floor(rect.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    return { width: width, height: height, ratio: ratio };
  }

  function velocityMetrics() {
    return [
      { key: "dau", label: "DAU", color: "#42f2e8" },
      { key: "loc", label: "LOC", color: "#66f0a8" },
      { key: "tasks_completed", label: "TASKS", color: "#f3c75f" }
    ];
  }

  function movingAverage(values, index, windowSize) {
    var start = Math.max(0, index - windowSize + 1);
    var slice = values.slice(start, index + 1);
    if (!slice.length) return 0;
    return slice.reduce(function (sum, value) { return sum + Number(value || 0); }, 0) / slice.length;
  }

  function formatChartValue(key, value) {
    if (key === "loc") return formatNumber(value);
    return formatDecimal(value, Number.isInteger(Number(value)) ? 0 : 1);
  }

  function updateVelocityTooltip(data, metrics, valuesByMetric, averagesByMetric) {
    var tooltip = byId("velocity-tooltip");
    var panel = tooltip ? tooltip.closest(".chart-panel") : null;
    if (!tooltip || !panel || !chartHover.active || chartHover.index == null || !data[chartHover.index]) {
      if (tooltip) tooltip.classList.remove("is-visible");
      return;
    }

    var row = data[chartHover.index];
    var canvas = byId("velocity-chart");
    var canvasRect = canvas ? canvas.getBoundingClientRect() : null;
    var html = ['<div class="tooltip-date">' + escapeHtml(row.date || "") + "</div>"];
    metrics.forEach(function (metricDef, metricIndex) {
      var value = valuesByMetric[metricIndex][chartHover.index] || 0;
      var average = averagesByMetric[metricIndex][chartHover.index] || 0;
      html.push([
        '<div class="tooltip-row">',
        '<span class="tooltip-dot" style="background:' + metricDef.color + '; color:' + metricDef.color + '"></span>',
        "<span>" + escapeHtml(metricDef.label) + " <span class=\"tooltip-average\">7d " + escapeHtml(formatChartValue(metricDef.key, average)) + "</span></span>",
        "<strong>" + escapeHtml(formatChartValue(metricDef.key, value)) + "</strong>",
        "</div>"
      ].join(""));
    });
    tooltip.innerHTML = html.join("");

    var panelRect = panel.getBoundingClientRect();
    var tooltipWidth = tooltip.offsetWidth || 240;
    var rawLeft = (canvasRect ? canvasRect.left - panelRect.left : 0) + chartHover.cssX;
    var rawTop = (canvasRect ? canvasRect.top - panelRect.top : 0) + chartHover.cssY;
    var left = clamp(rawLeft, tooltipWidth / 2 + 12, panelRect.width - tooltipWidth / 2 - 12);
    var top = clamp(rawTop, 84, panelRect.height - 14);
    tooltip.style.left = String(left) + "px";
    tooltip.style.top = String(top) + "px";
    tooltip.classList.add("is-visible");
  }

  function handleVelocityPointerMove(event) {
    var canvas = byId("velocity-chart");
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    var data = mergedSeries();
    if (!data.length) return;
    var padLeft = 54;
    var padRight = 30;
    var plotWidth = Math.max(1, rect.width - padLeft - padRight);
    var cssX = event.clientX - rect.left;
    var cssY = event.clientY - rect.top;
    var index = data.length === 1
      ? 0
      : Math.round(((cssX - padLeft) / plotWidth) * (data.length - 1));
    chartHover = {
      active: true,
      index: clamp(index, 0, data.length - 1),
      cssX: cssX,
      cssY: cssY
    };
    drawVelocityChart();
  }

  function handleVelocityPointerLeave() {
    chartHover = {
      active: false,
      index: null,
      cssX: 0,
      cssY: 0
    };
    var tooltip = byId("velocity-tooltip");
    if (tooltip) tooltip.classList.remove("is-visible");
    drawVelocityChart();
  }

  function bindVelocityChartInteractions() {
    var canvas = byId("velocity-chart");
    if (!canvas) return;
    canvas.addEventListener("pointermove", handleVelocityPointerMove);
    canvas.addEventListener("pointerleave", handleVelocityPointerLeave);
    canvas.addEventListener("pointercancel", handleVelocityPointerLeave);
  }

  function drawVelocityChart() {
    var canvas = byId("velocity-chart");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var size = sizeCanvas(canvas);
    var data = mergedSeries();
    ctx.clearRect(0, 0, size.width, size.height);
    if (!data.length) {
      updateVelocityTooltip([], [], [], []);
      return;
    }
    var ratio = size.ratio;
    var left = 54 * ratio;
    var right = 30 * ratio;
    var top = 42 * ratio;
    var bottom = 42 * ratio;
    var w = size.width - left - right;
    var h = size.height - top - bottom;
    var metrics = velocityMetrics();
    var valuesByMetric = metrics.map(function (metricDef) {
      return data.map(function (row) { return Number(row[metricDef.key] || 0); });
    });
    var averagesByMetric = valuesByMetric.map(function (values) {
      return values.map(function (_value, index) { return movingAverage(values, index, 7); });
    });
    var gradient = ctx.createLinearGradient(0, top, 0, top + h);
    gradient.addColorStop(0, "rgba(66,242,232,0.08)");
    gradient.addColorStop(0.48, "rgba(102,240,168,0.025)");
    gradient.addColorStop(1, "rgba(255,79,95,0.045)");
    ctx.fillStyle = gradient;
    ctx.fillRect(left, top, w, h);

    ctx.strokeStyle = "rgba(237,247,244,0.07)";
    ctx.lineWidth = 1 * ratio;
    for (var i = 0; i <= 4; i += 1) {
      var y = top + (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(size.width - right, y);
      ctx.stroke();
    }
    data.forEach(function (_row, index) {
      if (index % Math.max(1, Math.ceil(data.length / 7)) !== 0 && index !== data.length - 1) return;
      var x = left + (data.length === 1 ? 0 : (w * index) / (data.length - 1));
      ctx.strokeStyle = "rgba(237,247,244,0.04)";
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, top + h);
      ctx.stroke();
    });

    metrics.forEach(function (metricDef, metricIndex) {
      var values = valuesByMetric[metricIndex];
      var averages = averagesByMetric[metricIndex];
      var max = Math.max.apply(null, values.concat(averages).concat([1]));
      function pointFor(value, index) {
        return {
          x: left + (data.length === 1 ? 0 : (w * index) / (data.length - 1)),
          y: top + h - (Number(value || 0) / max) * h
        };
      }
      ctx.save();
      ctx.globalAlpha = 0.74;
      ctx.strokeStyle = metricDef.color;
      ctx.lineWidth = 1.7 * ratio;
      ctx.setLineDash([4 * ratio, 7 * ratio]);
      ctx.beginPath();
      averages.forEach(function (value, index) {
        var point = pointFor(value, index);
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = metricDef.color;
      ctx.lineWidth = 2.6 * ratio;
      ctx.shadowColor = metricDef.color;
      ctx.shadowBlur = 7 * ratio;
      ctx.beginPath();
      values.forEach(function (value, index) {
        var point = pointFor(value, index);
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = metricDef.color;
      ctx.font = String(12 * ratio) + "px ui-monospace, monospace";
      ctx.fillText(metricDef.label, left + metricIndex * 86 * ratio, 20 * ratio);
    });

    if (w > 440 * ratio) {
      ctx.fillStyle = "rgba(237,247,244,0.54)";
      ctx.font = String(11 * ratio) + "px ui-monospace, monospace";
      ctx.fillText("solid actual", left + 260 * ratio, 20 * ratio);
      ctx.setLineDash([4 * ratio, 6 * ratio]);
      ctx.strokeStyle = "rgba(237,247,244,0.38)";
      ctx.beginPath();
      ctx.moveTo(left + 348 * ratio, 16 * ratio);
      ctx.lineTo(left + 394 * ratio, 16 * ratio);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText("7d moving avg", left + 404 * ratio, 20 * ratio);
    }

    if (chartHover.active && chartHover.index != null && data[chartHover.index]) {
      var hoverX = left + (data.length === 1 ? 0 : (w * chartHover.index) / (data.length - 1));
      ctx.strokeStyle = "rgba(237,247,244,0.42)";
      ctx.lineWidth = 1 * ratio;
      ctx.beginPath();
      ctx.moveTo(hoverX, top);
      ctx.lineTo(hoverX, top + h);
      ctx.stroke();
      metrics.forEach(function (metricDef, metricIndex) {
        var values = valuesByMetric[metricIndex];
        var averages = averagesByMetric[metricIndex];
        var max = Math.max.apply(null, values.concat(averages).concat([1]));
        var value = values[chartHover.index] || 0;
        var y = top + h - (value / max) * h;
        ctx.fillStyle = "rgba(5,6,7,0.92)";
        ctx.strokeStyle = metricDef.color;
        ctx.lineWidth = 2 * ratio;
        ctx.beginPath();
        ctx.arc(hoverX, y, 5 * ratio, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }

    ctx.fillStyle = "rgba(237,247,244,0.62)";
    ctx.font = String(11 * ratio) + "px ui-monospace, monospace";
    data.forEach(function (row, index) {
      if (index % Math.max(1, Math.ceil(data.length / 6)) !== 0 && index !== data.length - 1) return;
      var x = left + (data.length === 1 ? 0 : (w * index) / (data.length - 1));
      ctx.fillText(String(row.date || "").slice(5), x - 14 * ratio, size.height - 14 * ratio);
    });
    updateVelocityTooltip(data, metrics, valuesByMetric, averagesByMetric);
  }

  function renderAll() {
    renderMetrics();
    renderModalityBars();
    renderEvents();
    renderGithub();
    renderWallet();
    drawVelocityChart();
  }

  async function refreshAll(forceGithub) {
    await fetchTelemetry();
    await refreshGithubIfDue(Boolean(forceGithub));
    renderAll();
  }

  function animateBackground() {
    var canvas = byId("merge-field");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    function frame(now) {
      var width = window.innerWidth;
      var height = window.innerHeight;
      var ratio = window.devicePixelRatio || 1;
      var targetWidth = Math.floor(width * ratio);
      var targetHeight = Math.floor(height * ratio);
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(ratio, ratio);
      var gap = 74;
      for (var x = -gap; x < width + gap; x += gap) {
        for (var y = -gap; y < height + gap; y += gap) {
          var wave = Math.sin((x * 0.015) + (y * 0.01) + now * 0.0008);
          var px = x + wave * 10;
          var py = y + Math.cos(now * 0.0007 + x * 0.01) * 8;
          ctx.fillStyle = wave > 0.2 ? "rgba(66,242,232,0.16)" : "rgba(255,79,95,0.1)";
          ctx.fillRect(px, py, 2, 2);
          if (wave > 0.72) {
            ctx.strokeStyle = "rgba(66,242,232,0.08)";
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + gap * 0.7, py + Math.sin(now * 0.001) * 16);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
      window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  function animateMergeCore() {
    var canvas = byId("merge-core-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    function frame(now) {
      var data = state.telemetry || fallbackTelemetry;
      var today = todayVelocity();
      var locToday = today ? today.loc : finiteMetric(data, "loc_today");
      var commitsToday = today ? today.commits : finiteMetric(data, "commits_today");
      var pressure = deriveMergePressure(data, locToday, commitsToday);
      var size = sizeCanvas(canvas);
      var ratio = size.ratio;
      var width = size.width;
      var height = size.height;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, width, height);
      var centerX = width / 2;
      var centerY = height / 2;
      var radius = Math.min(width, height) * 0.28;
      var nodes = 30;
      for (var i = 0; i < nodes; i += 1) {
        var angle = (Math.PI * 2 * i) / nodes + now * 0.00018;
        var drift = Math.sin(now * 0.001 + i) * 18 * ratio;
        var leftX = centerX - radius - Math.cos(angle) * radius * 0.42 - drift;
        var rightX = centerX + radius + Math.cos(angle) * radius * 0.42 + drift;
        var y = centerY + Math.sin(angle) * radius;
        var mix = pressure / 100;
        var linkX = leftX + (rightX - leftX) * mix;
        ctx.strokeStyle = i % 3 === 0 ? "rgba(255,79,95,0.35)" : "rgba(66,242,232,0.26)";
        ctx.lineWidth = 1 * ratio;
        ctx.beginPath();
        ctx.moveTo(leftX, y);
        ctx.quadraticCurveTo(centerX, centerY + Math.sin(angle + now * 0.001) * 80 * ratio, rightX, y);
        ctx.stroke();
        ctx.fillStyle = i % 2 === 0 ? "#42f2e8" : "#ff4f5f";
        ctx.fillRect(linkX - 2 * ratio, y - 2 * ratio, 4 * ratio, 4 * ratio);
      }
      ctx.strokeStyle = "rgba(237,247,244,0.74)";
      ctx.lineWidth = 2 * ratio;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * (0.68 + pressure / 500), 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(237,247,244,0.86)";
      ctx.font = String(34 * ratio) + "px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText("MERGE " + formatNumber(pressure), centerX, centerY + 11 * ratio);
      ctx.font = String(12 * ratio) + "px ui-monospace, monospace";
      ctx.fillStyle = "rgba(138,160,157,0.85)";
      ctx.fillText("HUMAN ATTENTION / MODEL EXECUTION", centerX, centerY + 38 * ratio);
      window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  function init() {
    animateBackground();
    animateMergeCore();
    bindVelocityChartInteractions();
    refreshAll(true);
    window.setInterval(function () { refreshAll(false); }, Math.max(10, refreshSeconds) * 1000);
    window.addEventListener("resize", drawVelocityChart);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
