(() => {
  "use strict";
  const root = document.querySelector("[data-routine]");
  if (!root) return;

  const $ = (sel, el = root) => el.querySelector(sel);
  const $$ = (sel, el = root) => Array.from(el.querySelectorAll(sel));
  const SVGNS = "http://www.w3.org/2000/svg";
  const fmt = (n, d = 0) => Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const num = (n) => (Math.round(n * 10) / 10).toLocaleString("en-US", { maximumFractionDigits: 1 });
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  };

  /* ------------------------------------------------------------------ */
  /* Plan data                                                           */
  /* ------------------------------------------------------------------ */
  const START = Date.UTC(2026, 10, 2); // Monday, Nov 2, 2026
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const SESSIONS = [
    { title: "Chest / Triceps", ex: [["Bench press (barbell)"], ["Incline bench (barbell)"], ["Incline press (DB)"], ["Cable flys"], ["Tricep extensions"], ["Overhead tricep ext (rope)", null, true]] },
    { title: "Back / Biceps", ex: [["Lat pulldowns"], ["Seated rows"], ["Dumbbell rows"], ["Face pulls"], ["Standing DB curls"], ["Preacher curls", null, true]] },
    { title: "Legs A (quads)", ex: [["Squats", "12–15"], ["Leg press"], ["Walking lunges (DB)"], ["Leg extensions"], ["Wall sits", "30–60 s", true], ["Bike cool-down", "10 min", true]] },
    { title: "Shoulders", ex: [["Shoulder press (DB)"], ["Standing single-leg shoulder press"], ["Lateral raises"], ["Rear delt flys (DB)"], ["Upright rows (cable)"], ['"Y" raises', "30 s holds", true]] },
    { title: "Legs B (hinge) + arms", ex: [["Romanian deadlift (DB or barbell)"], ["Hamstring curls"], ["Hip thrust (barbell or machine)"], ["DB curls"], ["Overhead tricep ext (rope)"], ["Finisher: bi/tri drop set", "1 set", true]] },
  ];

  // [name, amount, kcal, protein, carbs, fat, fiber]
  const DINNER = {
    steak: ["Kirkland top sirloin", "8 oz raw", 312, 48, 0, 13, 0],
    salmon: ["Wild sockeye salmon (Kirkland, frozen)", "8 oz raw", 297, 50, 0, 10.6, 0],
    chicken: ["Kirkland chicken breast", "8 oz raw", 220, 48, 0, 2, 0],
  };
  const MEALS = [
    { time: "09:30", name: "Oat and yogurt bowl", note: "Breakfast · the eating window opens", items: [
      ["Kirkland rolled oats", "1 cup dry (80 g)", 300, 10, 54, 6, 8],
      ["Kirkland Three Berry Blend, frozen", "1 cup (126 g)", 70, 2, 16, 0, 5],
      ["Vital Proteins collagen peptides", "2 scoops (20 g)", 70, 18, 0, 0, 0],
      ["Kirkland Greek nonfat yogurt", "1 cup (255 g)", 150, 27, 10, 0, 0],
      ["Optimum Nutrition creatine", "5 g", 0, 0, 0, 0, 0],
    ] },
    { time: "13:30", name: "Chicken bowl and shake", note: "Lunch · straight after lifting", items: [
      ["Kirkland chicken breast", "8 oz raw", 220, 48, 0, 2, 0],
      ["Kirkland organic broccoli, frozen", "170 g", 50, 6, 8, 0, 4],
      ["White mushrooms", "1 cup sliced (70 g)", 15, 2, 2, 0, 1],
      ["Tasty Bite brown rice & lentils", "1 pouch (250 g)", 390, 6, 78, 6, 9],
      ["Optimum Nutrition Gold Standard whey", "1 scoop, in water", 120, 24, 3, 1.5, 0],
    ] },
    { time: "17:30", name: "Steak salad", note: "Dinner with family · the window closes 18:00", items: [
      "DINNER",
      ["Kirkland organic spring mix", "3 cups (85 g)", 20, 2, 3, 0, 2],
      ["Grape tomatoes", "1 cup (150 g)", 27, 1, 6, 0, 2],
      ["Kirkland pumpkin seeds", "16 g (about 1½ Tbsp)", 90, 5, 2, 8, 1],
      ["Kirkland extra virgin olive oil", "1 Tbsp", 120, 0, 0, 14, 0],
      ["Kirkland balsamic vinegar", "1 Tbsp", 45, 0, 10, 0, 0],
    ] },
  ];
  const OATS = ["Kirkland rolled oats", "+½ cup dry (40 g)", 150, 5, 27, 3, 4];
  const RICE = ["Tasty Bite brown rice & lentils", "+½ pouch", 195, 3, 39, 3, 4.5];
  const INC = {
    "-1": [[1, ["Tasty Bite brown rice & lentils", "−½ pouch (eat half)", -195, -3, -39, -3, -4.5]]],
    1: [[0, OATS]],
    2: [[1, RICE]],
    3: [[0, ["Kirkland Greek nonfat yogurt", "+1 cup (255 g)", 150, 27, 10, 0, 0]]],
    4: [[0, OATS]],
    5: [[1, RICE]],
    6: [[2, ["Kirkland extra virgin olive oil", "+1 Tbsp", 120, 0, 0, 14, 0]]],
  };
  const LADDER = [
    { lv: 6, add: "+1 Tbsp olive oil (dinner)", kcal: 2960, p: 242 },
    { lv: 5, add: "+½ pouch rice (lunch; 2 pouches in total)", kcal: 2840, p: 242 },
    { lv: 4, add: "+½ cup oats (breakfast; 2 cups in total)", kcal: 2645, p: 239 },
    { lv: 3, add: "+1 cup Greek yogurt (breakfast)", kcal: 2495, p: 234 },
    { lv: 2, add: "+½ pouch rice (lunch)", kcal: 2345, p: 207 },
    { lv: 1, add: "+½ cup oats (breakfast)", kcal: 2150, p: 204 },
    { lv: 0, add: "Base menu", kcal: 2000, p: 199 },
    { lv: -1, add: "Base − ½ pouch rice", kcal: 1805, p: 196 },
  ];
  const lvl = (n) => LADDER.find((r) => r.lv === n);
  const lvName = (n) => (n > 0 ? "+" + n : n < 0 ? "−" + Math.abs(n) : "0");

  /* ------------------------------------------------------------------ */
  /* Time                                                                */
  /* ------------------------------------------------------------------ */
  const prFmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Puerto_Rico", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  function prNow() {
    const p = {};
    prFmt.formatToParts(new Date()).forEach((x) => { p[x.type] = x.value; });
    return { y: +p.year, m: +p.month, d: +p.day, min: (+p.hour % 24) * 60 + +p.minute, sec: +p.second };
  }
  function nthSunday(y, m, n) { // m 1-12
    const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
    return 1 + ((7 - first) % 7) + (n - 1) * 7;
  }
  function usDST(y, m, d) {
    const t = Date.UTC(y, m - 1, d);
    return t >= Date.UTC(y, 2, nthSunday(y, 3, 2)) && t < Date.UTC(y, 10, nthSunday(y, 11, 1));
  }
  const hm = (mins) => { const h = Math.floor(mins / 60) % 24; const m = Math.round(mins % 60); return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0"); };
  const t = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };

  function dayInfo(y, m, d) {
    const utc = Date.UTC(y, m - 1, d);
    const dow = (new Date(utc).getUTCDay() + 6) % 7; // 0 = Monday
    const days = Math.round((utc - START) / 86400000);
    const week = days >= 0 ? Math.floor(days / 7) + 1 : 0;
    const dst = usDST(y, m, d);
    const weekday = dow < 5;
    const market = weekday ? (dst ? { open: t("09:30"), close: t("16:00") } : { open: t("10:30"), close: t("17:00") }) : null;
    return { y, m, d, utc, dow, days, week, dst, market, lift: liftFor(week, dow, days) };
  }

  function liftFor(week, dow, days) {
    if (days < 0) return { none: true, pre: true };
    if (dow > 4) return { none: true };
    const deload = week % 6 === 0;
    if (week <= 3) {
      const slot = { 0: 0, 2: 1, 4: 2 }[dow];
      if (slot === undefined) return { none: true, calib: true };
      return { idx: ((week - 1) * 3 + slot) % 5, sets: 2, step: 1, deload: false };
    }
    return { idx: dow, sets: deload || week === 4 ? 2 : 3, step: week === 4 ? 2 : 3, deload };
  }

  function cardioFor(info) {
    if (info.dow === 5) return { start: t("06:15"), end: t("07:15"), text: info.week >= 4 ? "06:15, 45–60 min easy + 6 × 30 s hard / 90 s easy" : "06:15, 45–60 min easy" };
    if (info.dow === 6) return { start: t("06:15"), end: t("07:00"), text: "06:15, 30–45 min walk" };
    return { start: t("06:15"), end: t("06:45"), text: "06:15, 30 min easy" };
  }

  function events(info) {
    const c = cardioFor(info);
    const ev = [
      { at: t("06:00"), label: "Wake, weigh in; 1 L water with electrolytes; black coffee" },
      { at: c.start, end: c.end, label: "Easy cardio", kind: "cardio" },
      { at: t("07:15"), label: info.market ? "L1 deep work (no market screens)" : "L1 deep work" },
      { at: t("09:30"), label: "Meal 1: oat and yogurt bowl · eating window opens", kind: "food" },
    ];
    if (info.market) {
      ev.push({ at: info.market.open - 15, label: "Market prep" });
      ev.push({ at: info.market.open, label: "Market open", kind: "market" });
    }
    ev.push({ at: t("12:15"), label: "Last caffeine (pre-lift coffee)" });
    if (!info.lift.none) ev.push({ at: t("12:30"), end: t("13:20"), label: "Lift: " + SESSIONS[info.lift.idx].title, kind: "lift" });
    ev.push({ at: t("13:30"), label: "Meal 2: chicken bowl and shake", kind: "food" });
    if (info.market) ev.push({ at: info.market.close, label: "Market close; sear the steak", kind: "market" });
    else ev.push({ at: t("17:15"), label: "Sear the steak" });
    ev.push({ at: t("17:30"), label: "Meal 3: dinner · window closes 18:00", kind: "food" });
    ev.push({ at: t("18:00"), label: "Kitchen closed" });
    ev.push({ at: t("21:30"), label: "Screens off; magnesium" });
    ev.push({ at: t("22:00"), label: "Lights out", kind: "sleep" });
    return ev.sort((a, b) => a.at - b.at);
  }

  /* ------------------------------------------------------------------ */
  /* 01 Today: dial, now/next, today's session, timeline                 */
  /* ------------------------------------------------------------------ */
  const dateInput = $("[data-date-input]");
  let viewDate = null; // {y,m,d} when previewing; null = live

  function el(tag, attrs = {}, parent) {
    const n = document.createElementNS(SVGNS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    if (parent) parent.appendChild(n);
    return n;
  }
  const ang = (mins) => (mins / 1440) * Math.PI * 2 - Math.PI / 2;
  const pt = (mins, r) => [Math.cos(ang(mins)) * r, Math.sin(ang(mins)) * r];
  function arc(a, b, r) {
    if (b <= a) b += 1440;
    const [x1, y1] = pt(a, r); const [x2, y2] = pt(b, r);
    const large = b - a > 720 ? 1 : 0;
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }

  function drawDial(info, nowMin, live) {
    const svg = $("[data-dial]");
    svg.innerHTML = "";
    const g = el("g", {}, svg);
    [142, 118, 97].forEach((r, i) => el("circle", { r, class: "dial-track", "stroke-width": [18, 12, 8][i] }, g));
    for (let h = 0; h < 24; h++) {
      const [x1, y1] = pt(h * 60, 156); const [x2, y2] = pt(h * 60, h % 6 === 0 ? 164 : 160);
      el("line", { x1, y1, x2, y2, class: "dial-tick" + (h % 6 === 0 ? " major" : "") }, g);
      if (h % 3 === 0) {
        const [lx, ly] = pt(h * 60, 172);
        const tx = el("text", { x: lx, y: ly, class: "dial-hour", "text-anchor": "middle", "dominant-baseline": "central" }, g);
        tx.textContent = String(h).padStart(2, "0");
      }
    }
    const seg = (a, b, r, w, cls, title) => {
      const p = el("path", { d: arc(a, b, r), class: "dial-seg " + cls, "stroke-width": w }, g);
      const ti = el("title", {}, p); ti.textContent = title;
    };
    const c = cardioFor(info);
    seg(t("22:00"), t("06:00"), 142, 18, "seg-sleep", "Sleep 22:00–06:00");
    seg(c.start, c.end, 142, 18, "seg-cardio", "Cardio " + hm(c.start) + "–" + hm(c.end));
    if (!info.lift.none) seg(t("12:30"), t("13:20"), 142, 18, "seg-lift", "Lift 12:30–13:20 · " + SESSIONS[info.lift.idx].title);
    seg(t("09:30"), t("18:00"), 118, 12, "seg-food", "Eating window 09:30–18:00");
    if (info.market) seg(info.market.open, info.market.close, 97, 8, "seg-market", "US market " + hm(info.market.open) + "–" + hm(info.market.close) + " Puerto Rico time");
    [["09:30", "Breakfast"], ["13:30", "Lunch + shake"], ["17:30", "Dinner"]].forEach(([s, name]) => {
      const [x, y] = pt(t(s), 118);
      const dot = el("circle", { cx: x, cy: y, r: 6.5, class: "dial-meal" }, g);
      el("title", {}, dot).textContent = name + " " + s;
    });
    if (live) {
      const [x0, y0] = pt(nowMin, 74);
      const [x, y] = pt(nowMin, 154);
      el("line", { x1: x0, y1: y0, x2: x, y2: y, class: "dial-hand" }, g);
      el("circle", { cx: x, cy: y, r: 5, class: "dial-hand-dot" }, g);
    }
    const st = statusAt(info, live ? Math.floor(nowMin) : null);
    const t1 = el("text", { x: 0, y: -18, class: "dial-center-k", "text-anchor": "middle" }, g); t1.textContent = st.k;
    const t2 = el("text", { x: 0, y: 12, class: "dial-center-v", "text-anchor": "middle" }, g); t2.textContent = st.v;
    const t3 = el("text", { x: 0, y: 34, class: "dial-center-s", "text-anchor": "middle" }, g); t3.textContent = st.s;
  }

  function untilText(mins) {
    if (mins < 1) return "now";
    const h = Math.floor(mins / 60), m = Math.round(mins % 60);
    return h ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`;
  }

  function statusAt(info, nowMin) {
    if (nowMin === null) return { k: DAYS[info.dow].toUpperCase(), v: info.week > 0 ? "Week " + info.week : "Preview", s: info.lift.none ? "No lift" : "Lift " + SESSIONS[info.lift.idx].title };
    if (nowMin >= t("22:00") || nowMin < t("06:00")) {
      const left = nowMin >= t("22:00") ? 1440 - nowMin + t("06:00") : t("06:00") - nowMin;
      return { k: "SLEEP", v: hm(nowMin), s: "wake in " + untilText(left) };
    }
    if (nowMin >= t("09:30") && nowMin < t("18:00")) return { k: "EATING WINDOW", v: hm(nowMin), s: "closes in " + untilText(t("18:00") - nowMin) };
    if (nowMin < t("09:30")) return { k: "FASTING", v: hm(nowMin), s: "breakfast in " + untilText(t("09:30") - nowMin) };
    return { k: "KITCHEN CLOSED", v: hm(nowMin), s: "lights out in " + untilText(t("22:00") - nowMin) };
  }

  function renderToday() {
    const now = prNow();
    const live = !viewDate || (viewDate.y === now.y && viewDate.m === now.m && viewDate.d === now.d);
    const day = viewDate || now;
    const info = dayInfo(day.y, day.m, day.d);
    const nowMin = now.min + now.sec / 60;
    const dateLabel = new Date(info.utc).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

    drawDial(info, nowMin, live);
    $('[data-field="pr-date"]').textContent = (live ? "Puerto Rico · " : "Preview · ") + dateLabel;
    $('[data-field="pr-time"]').textContent = live ? hm(now.min) : "—";

    const ev = events(info);
    let cur = null, nxt = null;
    if (live) {
      ev.forEach((e) => { if (e.at <= nowMin) cur = e; });
      nxt = ev.find((e) => e.at > nowMin) || null;
      if (cur && cur.end && nowMin >= cur.end) cur = { label: cur.label.replace(/^Lift: /, "") + " done" };
      if (!cur || nowMin >= t("22:00")) cur = { label: "Sleep" };
    }
    $('[data-field="now-item"]').textContent = live ? cur.label : "—";
    $('[data-field="next-item"]').textContent = live ? (nxt ? `${hm(nxt.at)} · ${nxt.label} (in ${untilText(nxt.at - nowMin)})` : "06:00 · Wake") : "—";

    // plan day card
    const L = info.lift;
    let weekLabel;
    if (info.days < 0) weekLabel = `Starts Monday, November 2 · in ${-info.days} day${info.days === -1 ? "" : "s"}`;
    else weekLabel = `Week ${info.week} · ${DAYS[info.dow]}` + (info.week <= 3 ? " · Calibrate" : "") + (L.deload ? " · Deload week" : "");
    $('[data-field="plan-week"]').textContent = weekLabel;
    const list = $('[data-field="lift-list"]');
    list.innerHTML = "";
    let note = "";
    if (L.pre) {
      $('[data-field="lift-title"]').textContent = "Week 1 opens with Chest / Triceps";
      note = "Pick a date on or after November 2 to preview any day of the plan.";
    } else if (L.none) {
      $('[data-field="lift-title"]').textContent = info.dow === 5 ? "Saturday: no lifting" : info.dow === 6 ? "Sunday: check-in day" : "No lifting today";
      note = info.dow === 6 ? "Run the Sunday check-in below and prep chicken for the week (60 min)." : info.dow === 5 ? "Long easy cardio this morning; nothing else to train." : "Calibration weeks lift Monday, Wednesday and Friday only.";
    } else {
      const s = SESSIONS[L.idx];
      $('[data-field="lift-title"]').textContent = `12:30 · ${s.title} · ${L.sets} sets`;
      s.ex.forEach(([name, reps], i) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${name}</span><em>${L.sets} × ${reps || "10–12"}${i < 2 ? " · 2 min rest" : ""}</em>`;
        list.appendChild(li);
      });
      note = (info.week >= 4 ? "Assumes each step's gate passed. " : "") + (info.dow === 2 ? "Prep tonight: bake the second chicken batch (30 min)." : "");
    }
    $('[data-field="lift-note"]').textContent = note;
    $('[data-field="cardio-today"]').textContent = cardioFor(info).text;
    $('[data-field="market-today"]').textContent = info.market ? `${hm(info.market.open)}–${hm(info.market.close)} Puerto Rico time` : "Closed";

    // timeline
    const tl = $("[data-timeline]");
    tl.innerHTML = "";
    ev.forEach((e) => {
      const li = document.createElement("li");
      li.className = "rt-tl-item" + (e.kind ? " k-" + e.kind : "");
      if (live && cur && e === cur) li.classList.add("is-now");
      if (live && nxt && e === nxt) li.classList.add("is-next");
      li.innerHTML = `<time>${hm(e.at)}${e.end ? "–" + hm(e.end) : ""}</time><span>${e.label}</span>`;
      tl.appendChild(li);
    });
    if (dateInput && !dateInput.value) {
      dateInput.value = `${day.y}-${String(day.m).padStart(2, "0")}-${String(day.d).padStart(2, "0")}`;
    }
  }

  if (dateInput) {
    dateInput.addEventListener("change", () => {
      const v = dateInput.value;
      if (!v) { viewDate = null; renderToday(); return; }
      const [y, m, d] = v.split("-").map(Number);
      viewDate = { y, m, d };
      renderToday();
    });
  }
  const todayBtn = $("[data-date-today]");
  if (todayBtn) todayBtn.addEventListener("click", () => { viewDate = null; dateInput.value = ""; renderToday(); });
  renderToday();
  setInterval(renderToday, 20000);

  /* ------------------------------------------------------------------ */
  /* 03 Food                                                             */
  /* ------------------------------------------------------------------ */
  let level = store.get("rt-level", 0);
  let swap = store.get("rt-swap", "steak");
  const levelSeg = $("[data-level-seg]");
  [-1, 0, 1, 2, 3, 4, 5, 6].forEach((n) => {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.level = n; b.textContent = lvName(n);
    b.title = lvl(n).add + " · ≈" + fmt(lvl(n).kcal) + " kcal";
    levelSeg.appendChild(b);
  });

  function mealRows(level, swap) {
    const meals = MEALS.map((m) => ({ ...m, rows: m.items.map((it) => (it === "DINNER" ? { v: DINNER[swap], swap: true } : { v: it })) }));
    const incs = level < 0 ? INC["-1"] : Array.from({ length: level }, (_, i) => INC[i + 1]).flat();
    incs.forEach(([mi, v]) => meals[mi].rows.push({ v, add: true }));
    return meals;
  }

  function renderFood() {
    if (level < 0 && swap === "chicken") swap = "steak";
    $$("button", levelSeg).forEach((b) => { b.classList.toggle("is-on", +b.dataset.level === level); b.setAttribute("aria-checked", +b.dataset.level === level); });
    $$("[data-swap]").forEach((b) => {
      b.classList.toggle("is-on", b.dataset.swap === swap);
      b.disabled = b.dataset.swap === "chicken" && level < 0;
    });
    const meals = mealRows(level, swap);
    const day = [0, 0, 0, 0, 0];
    const wrap = $("[data-meals]");
    wrap.innerHTML = "";
    meals.forEach((m, i) => {
      const tot = [0, 0, 0, 0, 0];
      const rows = m.rows.map((r) => {
        r.v.slice(2).forEach((x, k) => { tot[k] += x; });
        const cls = r.add ? (r.v[2] < 0 ? "is-cut" : "is-add") : r.swap && swap !== "steak" ? "is-swap" : "";
        return `<tr class="${cls}"><td>${r.v[0]}${r.add ? ` <b class="rt-tag">${r.v[2] < 0 ? "level −1" : "ladder"}</b>` : ""}</td><td>${r.v[1]}</td>${r.v.slice(2).map((x) => `<td class="num">${num(x)}</td>`).join("")}</tr>`;
      }).join("");
      tot.forEach((x, k) => { day[k] += x; });
      const name = i === 2 ? (swap === "salmon" ? "Salmon salad" : swap === "chicken" ? "Chicken salad" : m.name) : m.name;
      const card = document.createElement("div");
      card.className = "rt-meal";
      card.innerHTML = `<div class="rt-meal-head"><span class="rt-meal-time">${m.time}</span><div><h3>Meal ${i + 1} · ${name}</h3><p>${m.note}</p></div><div class="rt-meal-kcal"><b>${fmt(tot[0])}</b><span>kcal · ${num(tot[1])} g protein</span></div></div>
        <div class="rt-table-wrap"><table class="rt-table rt-meal-table"><thead><tr><th>Food (Costco)</th><th>Amount</th><th class="num">kcal</th><th class="num">Protein</th><th class="num">Carbs</th><th class="num">Fat</th><th class="num">Fiber</th></tr></thead><tbody>${rows}</tbody>
        <tfoot><tr><td>Meal total</td><td></td>${tot.map((x) => `<td class="num">${num(x)}</td>`).join("")}</tr></tfoot></table></div>`;
      wrap.appendChild(card);
    });
    const pk = day[1] * 4, ck = day[2] * 4, fk = day[3] * 9, all = pk + ck + fk;
    $("[data-totals]").innerHTML = `
      <div class="rt-total"><span>Level ${lvName(level)}</span><b>${fmt(day[0])}</b><em>kcal a day</em></div>
      <div class="rt-total"><span>Protein</span><b>${num(day[1])} g</b><em>${num(day[1] / 188 * 1)} g per lb at 188</em></div>
      <div class="rt-total"><span>Carbs</span><b>${num(day[2])} g</b><em>fiber ${num(day[4])} g</em></div>
      <div class="rt-total"><span>Fat</span><b>${num(day[3])} g</b><em>one Tbsp oil at dinner</em></div>
      <div class="rt-macro-bar" aria-label="Share of calories by macro">
        <i class="mb-p" style="width:${(pk / all * 100).toFixed(1)}%"><span>Protein ${Math.round(pk / all * 100)}%</span></i>
        <i class="mb-c" style="width:${(ck / all * 100).toFixed(1)}%"><span>Carbs ${Math.round(ck / all * 100)}%</span></i>
        <i class="mb-f" style="width:${(fk / all * 100).toFixed(1)}%"><span>Fat ${Math.round(fk / all * 100)}%</span></i>
      </div>`;
    store.set("rt-level", level); store.set("rt-swap", swap);
  }
  levelSeg.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; level = +b.dataset.level; renderFood(); });
  $("[data-swap-seg]").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b || b.disabled) return; swap = b.dataset.swap; renderFood(); });
  renderFood();

  /* ------------------------------------------------------------------ */
  /* 04 Training                                                         */
  /* ------------------------------------------------------------------ */
  let step = 1;
  function renderTraining() {
    $$("[data-step]").forEach((b) => b.classList.toggle("is-on", +b.dataset.step === step));
    const sets = step === 3 ? 3 : 2;
    const grid = $("[data-week-grid]");
    const head = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    grid.classList.toggle("is-calib", step === 1);
    let html = `<div class="rt-wg-row rt-wg-head"><span></span>${head.map((h, i) => `<span${i === 1 || i === 3 ? ' class="wg-tt"' : ""}>${h}</span>`).join("")}</div>`;
    if (step === 1) {
      [1, 2, 3].forEach((w) => {
        html += `<div class="rt-wg-row"><span>Week ${w}</span>` + [0, 1, 2, 3, 4].map((dow) => {
          const L = liftFor(w, dow, 0);
          return L.none ? `<span class="rt-wg-off wg-tt">Cardio only</span>` : `<span class="rt-wg-on"><b>${L.idx + 1}</b>${SESSIONS[L.idx].title}</span>`;
        }).join("") + `</div>`;
      });
    } else {
      html += `<div class="rt-wg-row"><span>Every week</span>` + SESSIONS.map((s, i) => `<span class="rt-wg-on"><b>${i + 1}</b>${s.title}</span>`).join("") + `</div>`;
    }
    grid.innerHTML = html;
    const wrap = $("[data-sessions]");
    wrap.innerHTML = SESSIONS.map((s, i) => `<div class="rt-session"><div class="rt-session-head"><span>${step === 1 ? "Session " + (i + 1) : DAYS[i]}</span><h3>${s.title}</h3></div><ol>${s.ex.map(([n, reps, drop], k) => `<li class="${k < 2 ? "is-heavy" : ""}"><span>${n}</span><em>${sets} × ${reps || "10–12"}</em>${k < 2 ? `<b class="rt-tag">2 min rest</b>` : ""}${drop ? `<b class="rt-tag rt-tag-quiet">drop first if late</b>` : ""}</li>`).join("")}</ol></div>`).join("");
  }
  $("[data-steps]").addEventListener("click", (e) => { const b = e.target.closest("[data-step]"); if (!b) return; step = +b.dataset.step; renderTraining(); });
  renderTraining();

  const gate = $("[data-gate]");
  gate.addEventListener("change", () => {
    const ok = $$("input", gate).every((i) => i.checked);
    const out = $("[data-gate-out]");
    out.textContent = ok ? "All four hold: move up one step from Monday." : "Stay at your current step and recheck next Sunday.";
    out.classList.toggle("is-ok", ok);
  });

  /* ------------------------------------------------------------------ */
  /* 06 Sunday check-in                                                  */
  /* ------------------------------------------------------------------ */
  const form = $("[data-calc]");
  const levelSelect = $("[data-level-select]");
  LADDER.slice().reverse().forEach((r) => {
    const o = document.createElement("option");
    o.value = r.lv; o.textContent = `${lvName(r.lv)} · ≈${fmt(r.kcal)} kcal`;
    levelSelect.appendChild(o);
  });
  levelSelect.value = "0";
  const ladderBody = $("[data-ladder-table] tbody");
  ladderBody.innerHTML = LADDER.map((r) => `<tr${r.lv === 0 ? ' class="is-base"' : ""}><td>${lvName(r.lv)}${r.lv === 6 ? " (top)" : r.lv === 0 ? " (start)" : r.lv === -1 ? " (floor)" : ""}</td><td>${r.add}</td><td class="num">≈${fmt(r.kcal)}</td><td class="num">${r.p} g</td></tr>`).join("");
  const nowInfo = (() => { const n = prNow(); return dayInfo(n.y, n.m, n.d); })();
  form.elements.week.value = Math.max(1, nowInfo.week || 1);
  if (nowInfo.week < 4) { form.elements.week.value = 4; }

  const MENU_CHANGE = {
    "-1": "eat half the rice pouch at lunch",
    1: "add ½ cup oats at breakfast",
    2: "add ½ pouch rice at lunch",
    3: "add 1 cup Greek yogurt at breakfast",
    4: "add another ½ cup oats at breakfast (2 cups in total)",
    5: "add another ½ pouch rice at lunch (2 pouches in total)",
    6: "add 1 Tbsp olive oil at dinner",
  };
  function menuChange(from, to) {
    if (to === from) return "";
    if (to > from) {
      const steps = [];
      for (let k = from + 1; k <= to; k++) steps.push(k === 0 ? "go back to the full rice pouch" : MENU_CHANGE[k]);
      return steps.join("; then ");
    }
    const steps = [];
    for (let k = from; k > to; k--) steps.push(k === 0 ? MENU_CHANGE["-1"] : "drop the level " + lvName(k) + " item (" + MENU_CHANGE[k].replace(/^add (another )?/, "").replace(/ \(.*\)$/, "") + ")");
    return steps.join("; then ");
  }

  function decide(f) {
    const L = +f.level, week = +f.week, since = +f.since, menu = +f.menu, nights = +f.shortnights;
    const nowW = parseFloat(f.now), prior = parseFloat(f.prior);
    const hold = !!f.hold;
    const trace = [];
    const fixes = [];
    if (!isFinite(nowW) || !isFinite(prior)) return { error: "Enter both 7-day averages." };
    const loss = (prior - nowW) / 2;   // positive = losing
    const change = -loss;               // positive = gaining
    const sleepShort = nights >= 3;
    const anySign = sleepShort || f.liftdown || f.after2 || f.hunger;

    // Step 1
    if (sleepShort) fixes.push("Train at 2 sets per exercise this week and fix the sleep routine: caffeine by 12:15, screens off 21:30, lights out 22:00.");
    if (f.liftdown && !sleepShort) fixes.push("Train at 2 sets per exercise for one week.");
    if (f.persist && anySign) fixes.push("These signs have lasted two weeks: see your doctor.");
    trace.push({ n: 1, name: "Recovery fixes", state: fixes.length ? "fired" : "pass", text: fixes.length ? fixes.join(" ") : "Nothing to fix." });

    const result = (to, n, why) => {
      let note = "";
      if (to > 6 || to < -1) { note = "That would move past the ladder, so stay and see a doctor or dietitian."; to = L; }
      return { to, n, why, note };
    };
    let res = null;

    // Step 2
    const under = (f.after2 || f.hunger) && menu >= 6 && !sleepShort && loss > 0;
    if (under) res = result(L + 1, 2, "Under-fueling: recovery signs while on the menu, sleeping 7+ hours and still losing.");
    trace.push({ n: 2, name: "Under-fueling", state: under ? "decided" : res ? "skip" : "pass", text: under ? "Up one level, without waiting." : (f.after2 || f.hunger) ? "Signs present, but " + (menu < 6 ? "fewer than 6 days on the menu" : sleepShort ? "sleep is short; fix sleep first" : "weight is not falling") + ", so no food change here." : "No under-fueling signs." });

    // Step 3
    if (!res) {
      if (!hold && nowW <= 166) {
        const deficit = Math.max(loss, 0) * 500;
        const target = lvl(L).kcal + deficit;
        let best = LADDER[0];
        LADDER.forEach((r) => { if (Math.abs(r.kcal - target) < Math.abs(best.kcal - target)) best = r; });
        res = result(best.lv, 3, `Hold entry: losing ${num(loss)} lb a week ≈ ${fmt(deficit)} kcal a day of remaining deficit; ${fmt(lvl(L).kcal)} + ${fmt(deficit)} ≈ ${fmt(target)} kcal, closest to level ${lvName(best.lv)}.`);
        res.holdEntry = true;
        trace.push({ n: 3, name: "Hold entry", state: "decided", text: "You reached 166 lb. Move straight to estimated maintenance; expect a 1–3 lb rebound over two weeks, mostly glycogen and water. Tick “Already in Hold” from next week." });
      } else trace.push({ n: 3, name: "Hold entry", state: hold ? "pass" : "pass", text: hold ? "Already in Hold." : "Not at 166 lb yet." });
    } else trace.push({ n: 3, name: "Hold entry", state: "skip", text: "Skipped: a calorie decision was already made." });

    // Step 4
    if (!res) {
      const why = [];
      if (week < 4) why.push("it is before week 4");
      if (since < 2) why.push("your last change was less than two weeks ago");
      if (menu < 6) why.push("you were on the full menu fewer than 6 of 7 days");
      if (why.length) {
        res = { to: L, n: 4, why: "Wait: " + why.join("; ") + "." };
        trace.push({ n: 4, name: "Wait", state: "decided", text: "No calorie change this week." });
      } else trace.push({ n: 4, name: "Wait", state: "pass", text: "Eligible for a weight-based change." });
    } else trace.push({ n: 4, name: "Wait", state: "skip", text: "Skipped." });

    // Step 5
    if (!res) {
      let to = L, why = "";
      if (!hold) {
        if (loss > 1.5) { to = L + 1; why = `Losing ${num(loss)} lb a week: faster than 1.5, so up one level.`; }
        else if (loss >= 1.0) { why = `Losing ${num(loss)} lb a week: on target, stay.`; }
        else if (loss >= 0.5 && f.waist === "down") { why = `Losing ${num(loss)} lb a week with the waist down: stay.`; }
        else if (loss >= 0.5) { to = L - 1; why = `Losing ${num(loss)} lb a week with the waist flat or up: down one level.`; }
        else { to = L - 1; why = loss >= 0 ? `Losing only ${num(loss)} lb a week: down one level.` : `Gaining ${num(-loss)} lb a week: down one level.`; }
      } else {
        const c = change;
        if (nowW > 168) {
          if (c < 0) why = `Above 168 lb and falling ${num(-c)} lb a week: stay, you are heading back to the band.`;
          else if (f.abovetwice) { to = L - 1; why = "Above 168 lb and flat or rising for two checks in a row: down one level."; }
          else why = "Above 168 lb and flat or rising for the first time: stay and recheck in two weeks.";
        } else if (nowW >= 163) {
          if (c < -0.5) { to = L + 1; why = `In the band but falling ${num(-c)} lb a week: up one level.`; }
          else if (c > 0.5) { to = L - 1; why = `In the band but rising ${num(c)} lb a week: down one level.`; }
          else why = "In the band and within ±0.5 lb a week: stay, this is your maintenance level.";
        } else {
          if (c > 0) why = `Below 163 lb and rising ${num(c)} lb a week: stay, you are heading back to the band.`;
          else { to = L + 1; why = "Below 163 lb and flat or falling: up one level."; }
        }
      }
      res = result(to, 5, why);
      trace.push({ n: 5, name: "Weight action", state: "decided", text: why });
    } else trace.push({ n: 5, name: "Weight action", state: "skip", text: "Skipped." });

    return { res, trace, fixes, loss, change, hold, L };
  }

  function renderCalc() {
    const f = {};
    Array.from(form.elements).forEach((x) => { if (!x.name) return; f[x.name] = x.type === "checkbox" ? x.checked : x.value; });
    $$("[data-hold-only]").forEach((n) => { n.hidden = !f.hold; });
    const out = $("[data-verdict]");
    const d = decide(f);
    if (d.error) { out.innerHTML = `<p class="rt-small">${d.error}</p>`; return; }
    const { res, trace, L } = d;
    const moved = res.to - L;
    const head = moved > 0 ? (res.holdEntry ? `Move to level ${lvName(res.to)}` : "Up one level") : moved < 0 ? "Down one level" : res.n === 4 ? "Wait" : "Stay";
    const target = lvl(res.to);
    const change = menuChange(L, res.to);
    out.innerHTML = `
      <div class="rt-verdict-main ${moved > 0 ? "up" : moved < 0 ? "down" : "stay"}">
        <span class="rt-card-label">This Sunday · step ${res.n} decides</span>
        <strong>${head}</strong>
        <p>Level ${lvName(res.to)} · ≈${fmt(target.kcal)} kcal · ${target.p} g protein${change ? ` · <b>${change}</b>` : ""}</p>
        <p class="rt-small">${res.why}${res.note ? " " + res.note : ""}</p>
        <p class="rt-small">${d.hold ? "Weekly change" : "Weekly loss"}: <b>${num(d.hold ? d.change : d.loss)} lb</b> (two-week average${d.hold ? ", positive = gaining" : ", positive = losing"}).</p>
      </div>
      <ol class="rt-trace">${trace.map((s) => `<li class="st-${s.state}"><span class="rt-trace-n">${s.n}</span><div><b>${s.name}</b><p>${s.text}</p></div><em>${s.state === "fired" ? "action" : s.state === "decided" ? "decides" : s.state === "skip" ? "skipped" : "passes"}</em></li>`).join("")}</ol>`;
  }
  form.addEventListener("input", renderCalc);
  form.addEventListener("change", renderCalc);
  form.addEventListener("submit", (e) => e.preventDefault());
  renderCalc();

  /* ------------------------------------------------------------------ */
  /* 07 Progress chart + log                                             */
  /* ------------------------------------------------------------------ */
  const chart = $("[data-chart]");
  const logForm = $("[data-log]");
  let log = store.get("rt-log", {});
  function drawChart() {
    chart.innerHTML = "";
    const weeks = Object.keys(log).map(Number);
    const maxW = Math.max(20, ...weeks.map((w) => Math.ceil((w + 1) / 2) * 2));
    const W = 720, H = 340, ml = 46, mr = 16, mt = 16, mb = 34;
    const x = (w) => ml + (w / maxW) * (W - ml - mr);
    const ylo = 160, yhi = 190;
    const vals = Object.values(log);
    const lo = Math.min(ylo, ...vals.map((v) => Math.floor(v / 5) * 5));
    const hi = Math.max(yhi, ...vals.map((v) => Math.ceil(v / 5) * 5));
    const y = (v) => mt + ((hi - v) / (hi - lo)) * (H - mt - mb);
    const g = el("g", {}, chart);
    for (let v = lo; v <= hi; v += 5) {
      el("line", { x1: ml, x2: W - mr, y1: y(v), y2: y(v), class: "ch-grid" }, g);
      const tx = el("text", { x: ml - 8, y: y(v), class: "ch-label", "text-anchor": "end", "dominant-baseline": "central" }, g); tx.textContent = v;
    }
    for (let w = 0; w <= maxW; w += 2) {
      const tx = el("text", { x: x(w), y: H - mb + 18, class: "ch-label", "text-anchor": "middle" }, g); tx.textContent = w === 0 ? "wk 0" : w;
    }
    // hold band
    el("rect", { x: x(16), y: y(168), width: x(maxW) - x(16), height: y(163) - y(168), class: "ch-band" }, g);
    const bt = el("text", { x: x(maxW) - 6, y: y(168) - 6, class: "ch-label", "text-anchor": "end" }, g); bt.textContent = "Hold band 163–168";
    el("line", { x1: ml, x2: W - mr, y1: y(165), y2: y(165), class: "ch-goal" }, g);
    const gt = el("text", { x: ml + 6, y: y(165) - 6, class: "ch-label ch-goal-label" }, g); gt.textContent = "Goal 165";
    // milestones
    [[4, 4, 182, 184], [8, 8, 176, 179], [12, 12, 171, 174], [16, 20, 165, 168]].forEach(([a, b, l, h]) => {
      const r = el("rect", { x: x(a) - 12, y: y(h), width: x(b) - x(a) + 24, height: y(l) - y(h), rx: 3, class: "ch-mile" }, g);
      el("title", {}, r).textContent = `Week ${a === b ? a : a + "–" + b}: ${l}–${h} lb`;
    });
    // guide
    const guide = [[0, 188], [4, 183], [8, 177.5], [12, 172.5], [18, 166.5]];
    el("path", { d: guide.map(([w, v], i) => (i ? "L" : "M") + x(w).toFixed(1) + " " + y(v).toFixed(1)).join(" "), class: "ch-guide" }, g);
    // log
    const pts = Object.entries(log).map(([w, v]) => [+w, +v]).sort((a, b) => a[0] - b[0]);
    if (pts.length > 1) el("path", { d: pts.map(([w, v], i) => (i ? "L" : "M") + x(w).toFixed(1) + " " + y(v).toFixed(1)).join(" "), class: "ch-line" }, g);
    pts.forEach(([w, v]) => {
      el("circle", { cx: x(w), cy: y(v), r: 9, class: "ch-hit" }, g);
      const c = el("circle", { cx: x(w), cy: y(v), r: 4.5, class: "ch-pt" }, g);
      el("title", {}, c).textContent = `Week ${w}: ${num(v)} lb`;
    });
    if (!pts.length) {
      const tx = el("text", { x: x(maxW / 2), y: y(186), class: "ch-label", "text-anchor": "middle" }, g);
      tx.textContent = "Add your weekly 7-day averages to plot them here";
    }
  }
  logForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const w = parseInt(logForm.elements.week.value, 10), v = parseFloat(logForm.elements.avg.value);
    if (!isFinite(w) || !isFinite(v) || v < 100 || v > 300) return;
    log[w] = Math.round(v * 10) / 10; store.set("rt-log", log);
    logForm.elements.week.value = w + 1; logForm.elements.avg.value = "";
    drawChart();
  });
  $("[data-log-clear]").addEventListener("click", () => { log = {}; store.set("rt-log", log); drawChart(); });
  if (nowInfo.week > 0) logForm.elements.week.value = nowInfo.week;
  drawChart();

  /* ------------------------------------------------------------------ */
  /* 08 Shopping                                                         */
  /* ------------------------------------------------------------------ */
  const SHOP = [
    ["Chicken breast", "3.5 lb", "weekly"], ["Top sirloin", "3.5 lb", "weekly"], ["Tasty Bite brown rice & lentils", "7 pouches", "weekly"],
    ["Greek nonfat yogurt", "4 lb", "weekly"], ["Spring mix", "1.5 lb", "weekly"], ["Grape tomatoes", "2.5 lb", "weekly"], ["Mushrooms", "1.25 lb", "weekly"],
    ["Organic broccoli, frozen", "4 × 1 lb pack", "every 10 days"], ["Three Berry Blend, frozen", "4 lb bag", "every 2 weeks"], ["Rolled oats", "10 lb bag", "every 8 weeks"],
    ["Wild sockeye salmon, frozen", "up to 1.5 lb", "for swaps"], ["Pumpkin seeds, olive oil, balsamic", "restock", "monthly"], ["Collagen, creatine, whey, electrolytes, magnesium", "restock", "monthly"],
  ];
  let ticks = store.get("rt-shop", {});
  const shop = $("[data-shop]");
  function renderShop() {
    shop.innerHTML = SHOP.map(([n, q, when], i) => `<li class="${ticks[i] ? "is-done" : ""}"><label><input type="checkbox" data-i="${i}"${ticks[i] ? " checked" : ""}><span>${n}</span><em>${q} · ${when}</em></label></li>`).join("");
  }
  shop.addEventListener("change", (e) => { const i = e.target.dataset.i; if (i === undefined) return; ticks[i] = e.target.checked; store.set("rt-shop", ticks); renderShop(); });
  $("[data-shop-reset]").addEventListener("click", () => { ticks = {}; store.set("rt-shop", ticks); renderShop(); });
  renderShop();
})();
