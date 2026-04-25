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

  var fallbackTelemetry = {
    generated_at: new Date().toISOString(),
    refresh_seconds: refreshSeconds,
    profile: {
      handle: "goodalexander",
      display_name: "goodalexander",
      nft_image: "/the-merge/profile-nft.png",
      main_wallet: "redacted"
    },
    metrics: {
      tasknode_dau: 0,
      x_followers: 0,
      commits_today: 0,
      loc_today: 0,
      task_requests_24h: 0,
      task_verifications_24h: 0,
      task_updates_24h: 0,
      tasks_completed_24h: 0,
      rewards_delivered_24h: 0,
      pft_rewards_24h: 0,
      context_updates_24h: 0,
      wallet_interactions_24h: 0,
      merge_pressure: 50
    },
    series: [],
    events: [],
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
    return Number((data.metrics || {})[key] || 0);
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
      seriesByDate[row.date] = Object.assign({}, row);
    });
    state.github.series.forEach(function (row) {
      if (!seriesByDate[row.date]) seriesByDate[row.date] = { date: row.date };
      seriesByDate[row.date].loc = row.loc;
      seriesByDate[row.date].commits = row.commits;
    });
    return Object.keys(seriesByDate).sort().map(function (key) {
      return seriesByDate[key];
    }).slice(-14);
  }

  function todayGithub() {
    var today = dateKey(new Date());
    return state.github.series.find(function (row) { return row.date === today; }) || null;
  }

  function renderMetrics() {
    var data = state.telemetry || fallbackTelemetry;
    var profile = data.profile || {};
    var today = todayGithub();
    var locToday = today ? today.loc : metric(data, "loc_today");
    var commitsToday = today ? today.commits : metric(data, "commits_today");
    var dau = metric(data, "tasknode_dau");
    var priorSeries = mergedSeries();
    var prev = priorSeries.length > 1 ? Number(priorSeries[priorSeries.length - 2].dau || 0) : 0;
    var delta = prev ? dau - prev : 0;
    var image = byId("profile-nft");
    if (image && profile.nft_image) image.src = profile.nft_image;
    text("operator-name", profile.display_name || profile.handle || "goodalexander");
    text("wallet-line", redactWallet(profile.main_wallet || ""));
    text("last-updated", "last sync " + formatTime(data.generated_at || new Date().toISOString()));
    text("refresh-rate", String(Number(data.refresh_seconds || refreshSeconds)) + "s refresh");
    text("metric-dau", formatNumber(dau));
    text("metric-dau-delta", (delta >= 0 ? "+" : "") + formatNumber(delta) + " vs prior");
    text("metric-followers", formatCompact(metric(data, "x_followers")));
    text("metric-loc", formatNumber(locToday));
    text("metric-commits", formatNumber(commitsToday) + " commits today");
    text("metric-tasks", formatNumber(metric(data, "tasks_completed_24h")));
    text("metric-rewards", formatNumber(metric(data, "rewards_delivered_24h")));
    text("metric-pft", formatCompact(metric(data, "pft_rewards_24h")) + " PFT");
    text("metric-context", formatNumber(metric(data, "context_updates_24h")));
    text("merge-pressure", formatNumber(metric(data, "merge_pressure")));
    text("wallet-count", formatNumber(metric(data, "wallet_interactions_24h")) + " / 24h");
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
      wallet_interaction: "var(--violet)",
      github_commit: "var(--green)"
    };
    return tones[type] || "var(--cyan)";
  }

  function renderEvents() {
    var data = state.telemetry || fallbackTelemetry;
    var events = (Array.isArray(data.events) ? data.events : []).slice();
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
    text("event-count", formatNumber(events.length) + " events");
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
    if (!commits.length) {
      target.innerHTML = '<article class="commit-item"><p class="commit-title">Waiting for public GitHub pulse.</p><span class="commit-meta">' + escapeHtml(state.github.error || "no commits in current window") + "</span></article>";
      return;
    }
    target.innerHTML = commits.map(function (commit) {
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
  }

  function renderWallet() {
    var data = state.telemetry || fallbackTelemetry;
    var wallet = data.wallet || {};
    var recent = Array.isArray(wallet.recent) ? wallet.recent : [];
    var target = byId("wallet-events");
    if (!recent.length) {
      target.innerHTML = '<article class="wallet-item"><p class="wallet-value">No public wallet interactions in feed.</p></article>';
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

  function drawVelocityChart() {
    var canvas = byId("velocity-chart");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var size = sizeCanvas(canvas);
    var data = mergedSeries();
    ctx.clearRect(0, 0, size.width, size.height);
    if (!data.length) return;
    var pad = 42 * size.ratio;
    var w = size.width - pad * 2;
    var h = size.height - pad * 2;
    var metrics = [
      { key: "dau", label: "DAU", color: "#42f2e8" },
      { key: "loc", label: "LOC", color: "#66f0a8" },
      { key: "tasks_completed", label: "TASKS", color: "#f3c75f" }
    ];
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1 * size.ratio;
    for (var i = 0; i <= 4; i += 1) {
      var y = pad + (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(size.width - pad, y);
      ctx.stroke();
    }
    metrics.forEach(function (metricDef, metricIndex) {
      var values = data.map(function (row) { return Number(row[metricDef.key] || 0); });
      var max = Math.max.apply(null, values.concat([1]));
      ctx.strokeStyle = metricDef.color;
      ctx.lineWidth = 3 * size.ratio;
      ctx.beginPath();
      values.forEach(function (value, index) {
        var x = pad + (data.length === 1 ? 0 : (w * index) / (data.length - 1));
        var y = pad + h - (value / max) * h;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.fillStyle = metricDef.color;
      ctx.font = String(12 * size.ratio) + "px ui-monospace, monospace";
      ctx.fillText(metricDef.label, pad + metricIndex * 78 * size.ratio, 20 * size.ratio);
    });
    ctx.fillStyle = "rgba(237,247,244,0.62)";
    ctx.font = String(11 * size.ratio) + "px ui-monospace, monospace";
    data.forEach(function (row, index) {
      if (index % Math.max(1, Math.ceil(data.length / 6)) !== 0 && index !== data.length - 1) return;
      var x = pad + (data.length === 1 ? 0 : (w * index) / (data.length - 1));
      ctx.fillText(String(row.date || "").slice(5), x - 14 * size.ratio, size.height - 14 * size.ratio);
    });
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
      var pressure = Math.max(0, Math.min(100, metric(data, "merge_pressure")));
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
    refreshAll(true);
    window.setInterval(function () { refreshAll(false); }, Math.max(10, refreshSeconds) * 1000);
    window.addEventListener("resize", drawVelocityChart);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
