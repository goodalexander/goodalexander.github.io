(() => {
  "use strict";
  const root = document.querySelector("[data-routine]");
  if (!root) return;

  const $ = (sel, el = root) => el.querySelector(sel);
  const $$ = (sel, el = root) => Array.from(el.querySelectorAll(sel));
  const SVGNS = "http://www.w3.org/2000/svg";
  const fmt = (n) => Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const num = (n) => (Math.round(n * 10) / 10).toLocaleString("en-US", { maximumFractionDigits: 1 });
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  };

  /* ---------------- Plan data ---------------- */
  const START = Date.UTC(2026, 10, 2); // week 1 begins Monday, Nov 2, 2026
  const DAY1 = Date.UTC(2026, 9, 30); // the plan starts Friday, Oct 30 (start days Fri–Sun)
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const DAY3 = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // [name, reps, dropFirst, single] — single items are done once, not per set
  const SESSIONS = [
    { title: "Chest and triceps", ex: [["Bench press (barbell)"], ["Incline bench (barbell)"], ["Incline press (dumbbell)"], ["Cable flys"], ["Tricep extensions"], ["Overhead tricep extension (rope)", null, true]] },
    { title: "Back and biceps", ex: [["Lat pulldowns"], ["Seated rows"], ["Dumbbell rows"], ["Face pulls"], ["Standing dumbbell curls"], ["Preacher curls", null, true]] },
    { title: "Legs (quads)", ex: [["Squats", "12–15"], ["Leg press"], ["Walking lunges (dumbbell)"], ["Leg extensions"], ["Wall sits", "30–60 s", true], ["Bike cool-down", "10 min", true, true]] },
    { title: "Shoulders", ex: [["Shoulder press (dumbbell)"], ["Standing single-leg shoulder press"], ["Lateral raises"], ["Rear delt flys (dumbbell)"], ["Upright rows (cable)"], ['"Y" raises', "30 s holds", true]] },
    { title: "Legs (hinge) and arms", ex: [["Romanian deadlift"], ["Hamstring curls"], ["Hip thrust"], ["Dumbbell curls"], ["Overhead tricep extension (rope)"], ["Finisher: biceps/triceps drop set", "1 drop set", true, true]] },
  ];
  const exText = ([, reps, , single], sets) => (single ? reps : `${sets} × ${reps || "10–12"}`);

  // NYSE holidays and early closes (1:00 p.m. New York) from nyse.com
  const CLOSED = {
    "2026-11-26": "Thanksgiving", "2026-12-25": "Christmas", "2027-01-01": "New Year's Day", "2027-01-18": "Martin Luther King Jr. Day",
    "2027-02-15": "Washington's Birthday", "2027-03-26": "Good Friday", "2027-05-31": "Memorial Day", "2027-06-18": "Juneteenth",
    "2027-07-05": "Independence Day", "2027-09-06": "Labor Day", "2027-11-25": "Thanksgiving", "2027-12-24": "Christmas",
  };
  const EARLY = { "2026-11-27": "day after Thanksgiving", "2026-12-24": "Christmas Eve", "2027-11-26": "day after Thanksgiving" };

  // [name, amount, kcal, protein, carbs, fat, fiber]
  const DINNER = {
    steak: ["Top sirloin", "8 oz raw", 312, 48, 0, 13, 0],
    salmon: ["Wild sockeye salmon", "8 oz raw", 297, 50, 0, 10.6, 0],
    chicken: ["Chicken breast", "8 oz raw", 220, 48, 0, 2, 0],
  };
  const MEALS = [
    { time: "09:30", name: "Oat and yogurt bowl", items: [
      ["Rolled oats", "1 cup dry (80 g)", 300, 10, 54, 6, 8],
      ["Three Berry Blend", "1 cup (126 g)", 70, 2, 16, 0, 5],
      ["Collagen (Vital Proteins)", "2 scoops (20 g)", 70, 18, 0, 0, 0],
      ["Greek nonfat yogurt", "1 cup (255 g)", 150, 27, 10, 0, 0],
      ["Creatine (ON)", "5 g", 0, 0, 0, 0, 0],
    ] },
    { time: "13:30", name: "Chicken bowl and shake", items: [
      ["Chicken breast", "8 oz raw", 220, 48, 0, 2, 0],
      ["Broccoli, frozen", "170 g", 50, 6, 8, 0, 4],
      ["Mushrooms", "1 cup (70 g)", 15, 2, 2, 0, 1],
      ["Rice & lentils (Tasty Bite)", "1 pouch", 390, 6, 78, 6, 9],
      ["Whey (ON)", "1 scoop", 120, 24, 3, 1.5, 0],
    ] },
    { time: "17:30", name: "Steak salad", items: [
      "DINNER",
      ["Spring mix", "3 cups (85 g)", 20, 2, 3, 0, 2],
      ["Grape tomatoes", "1 cup (150 g)", 27, 1, 6, 0, 2],
      ["Pumpkin seeds", "16 g (1½ Tbsp)", 90, 5, 2, 8, 1],
      ["Olive oil", "1 Tbsp", 120, 0, 0, 14, 0],
      ["Balsamic vinegar", "1 Tbsp", 45, 0, 10, 0, 0],
    ] },
  ];
  const OATS = ["Rolled oats", "+½ cup dry (40 g)", 150, 5, 27, 3, 4];
  const RICE = ["Rice & lentils (Tasty Bite)", "+½ pouch", 195, 3, 39, 3, 4.5];
  const INC = {
    "-1": [[1, ["Rice & lentils (Tasty Bite)", "eat ½ pouch", -195, -3, -39, -3, -4.5]]],
    1: [[0, OATS]], 2: [[1, RICE]], 3: [[0, ["Greek nonfat yogurt", "+1 cup (255 g)", 150, 27, 10, 0, 0]]],
    4: [[0, OATS]], 5: [[1, RICE]], 6: [[2, ["Olive oil", "+1 Tbsp", 120, 0, 0, 14, 0]]],
  };
  const LADDER = [
    { lv: 6, add: "+1 Tbsp olive oil at dinner", kcal: 2960, p: 242 },
    { lv: 5, add: "+½ pouch rice at lunch", kcal: 2840, p: 242 },
    { lv: 4, add: "+½ cup oats at breakfast", kcal: 2645, p: 239 },
    { lv: 3, add: "+1 cup Greek yogurt at breakfast", kcal: 2495, p: 234 },
    { lv: 2, add: "+½ pouch rice at lunch", kcal: 2345, p: 207 },
    { lv: 1, add: "+½ cup oats at breakfast", kcal: 2150, p: 204 },
    { lv: 0, add: "The base menu", kcal: 2000, p: 199 },
    { lv: -1, add: "Half the rice pouch at lunch", kcal: 1805, p: 196 },
  ];
  const lvl = (n) => LADDER.find((r) => r.lv === n);
  const lvName = (n) => (n > 0 ? "+" + n : n < 0 ? "−" + Math.abs(n) : "0");

  /* ---------------- Time ---------------- */
  const prFmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Puerto_Rico", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  function prNow() {
    const p = {};
    prFmt.formatToParts(new Date()).forEach((x) => { p[x.type] = x.value; });
    return { y: +p.year, m: +p.month, d: +p.day, min: (+p.hour % 24) * 60 + +p.minute };
  }
  const nthSunday = (y, m, n) => 1 + ((7 - new Date(Date.UTC(y, m - 1, 1)).getUTCDay()) % 7) + (n - 1) * 7;
  const usDST = (y, m, d) => { const t = Date.UTC(y, m - 1, d); return t >= Date.UTC(y, 2, nthSunday(y, 3, 2)) && t < Date.UTC(y, 10, nthSunday(y, 11, 1)); };
  const hm = (mins) => String(Math.floor(mins / 60) % 24).padStart(2, "0") + ":" + String(Math.floor(mins % 60)).padStart(2, "0");
  const t = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
  const iso = (y, m, d) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const fromUTC = (ms) => { const d = new Date(ms); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() }; };
  const longDate = (ms) => new Date(ms).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });

  function liftFor(week, dow, started) {
    if (!started || dow > 4) return null;
    const deload = week > 0 && week % 6 === 0;
    return { idx: dow, sets: deload ? 2 : 3, deload };
  }

  function dayInfo(y, m, d) {
    const utc = Date.UTC(y, m - 1, d);
    const dow = (new Date(utc).getUTCDay() + 6) % 7;
    const days = Math.round((utc - START) / 86400000);
    const week = days >= 0 ? Math.floor(days / 7) + 1 : 0;
    const started = utc >= DAY1;
    const key = iso(y, m, d);
    const dst = usDST(y, m, d);
    let market = null, marketNote = "";
    if (dow < 5 && CLOSED[key]) marketNote = "Market closed for " + CLOSED[key];
    else if (dow < 5) {
      market = dst ? { open: t("09:30"), close: t("16:00") } : { open: t("10:30"), close: t("17:00") };
      if (EARLY[key]) { market.close = dst ? t("13:00") : t("14:00"); marketNote = "Market closes early, " + EARLY[key]; }
    }
    return { y, m, d, utc, key, dow, days, week, started, market, marketNote, lift: liftFor(week, dow, started) };
  }

  function cardioFor(info) {
    if (info.dow === 5) return { end: t("07:15"), text: info.week >= 4 ? "45–60 min easy, then 6 × 30 s hard" : "45–60 min easy" };
    if (info.dow === 6) return { end: t("07:00"), text: "30–45 min walk" };
    return { end: t("06:45"), text: "30 min easy" };
  }

  function events(info) {
    const c = cardioFor(info);
    const ev = [
      { at: t("06:00"), label: "Wake, weigh in, electrolytes, black coffee" },
      { at: t("06:15"), end: c.end, label: "Cardio: " + c.text, kind: "cardio" },
      { at: t("07:15"), label: "L1 work" },
      { at: t("09:30"), label: "Breakfast: oat and yogurt bowl, creatine", kind: "food" },
    ];
    if (info.market) ev.push({ at: info.market.open, label: "Market open", kind: "market" });
    ev.push({ at: t("12:15"), label: "Last coffee" });
    if (info.lift) ev.push({ at: t("12:30"), end: t("13:20"), label: SESSIONS[info.lift.idx].title + `, ${info.lift.sets} sets` + (info.lift.deload ? " (deload)" : ""), kind: "lift", lift: info.lift });
    else if (!info.started && info.dow < 5) ev.push({ at: t("12:30"), label: "Lifting starts Friday, October 30", kind: "muted" });
    ev.push({ at: t("13:30"), label: "Lunch: chicken bowl and whey shake", kind: "food" });
    if (info.market) ev.push({ at: info.market.close, label: info.marketNote ? "Market closes early" : "Market close", kind: "market" });
    ev.push({ at: t("17:15"), label: "Sear the steak" });
    ev.push({ at: t("17:30"), label: "Dinner with family: steak salad", kind: "food" });
    ev.push({ at: t("18:00"), label: "Kitchen closed" });
    ev.push({ at: t("21:30"), label: "Screens off, magnesium" });
    ev.push({ at: t("22:00"), label: "Lights out", kind: "sleep" });
    return ev.sort((a, b) => a.at - b.at);
  }

  function extras(info) {
    const x = [];
    if (!info.started) return x;
    if (info.utc === DAY1) x.push("first Costco run", "bake chicken (60 min)");
    if (info.dow === 6) x.push(...(info.week >= 1 ? ["Sunday check-in"] : []), "bake chicken (60 min)", "wash greens");
    if (info.dow === 2) x.push("bake chicken (30 min)");
    if (info.marketNote) x.push(info.marketNote);
    return x;
  }

  /* ---------------- Dial ---------------- */
  function el(tag, attrs, parent) {
    const n = document.createElementNS(SVGNS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v));
    if (parent) parent.appendChild(n);
    return n;
  }
  const ang = (mins) => (mins / 1440) * Math.PI * 2 - Math.PI / 2;
  const pt = (mins, r) => [Math.cos(ang(mins)) * r, Math.sin(ang(mins)) * r];
  function arc(a, b, r) {
    if (b <= a) b += 1440;
    const [x1, y1] = pt(a, r), [x2, y2] = pt(b, r);
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${b - a > 720 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }
  const until = (mins) => { const h = Math.floor(mins / 60), m = Math.round(mins % 60); return h ? `${h} h ${m} min` : `${m} min`; };

  function drawDial(info, nowMin) {
    const svg = $("[data-dial]");
    svg.innerHTML = "";
    const g = el("g", {}, svg);
    [[142, 18], [118, 12], [97, 8]].forEach(([r, w]) => el("circle", { r, class: "dial-track", "stroke-width": w }, g));
    for (let h = 0; h < 24; h++) {
      const [x1, y1] = pt(h * 60, 156), [x2, y2] = pt(h * 60, h % 6 ? 160 : 164);
      el("line", { x1, y1, x2, y2, class: "dial-tick" + (h % 6 ? "" : " major") }, g);
      if (h % 6 === 0) { const [lx, ly] = pt(h * 60, 172); el("text", { x: lx, y: ly, class: "dial-hour", "text-anchor": "middle", "dominant-baseline": "central" }, g).textContent = String(h).padStart(2, "0"); }
    }
    const seg = (a, b, r, w, cls, title) => { const p = el("path", { d: arc(a, b, r), class: "dial-seg " + cls, "stroke-width": w }, g); el("title", {}, p).textContent = title; };
    const c = cardioFor(info);
    seg(t("22:00"), t("06:00"), 142, 18, "seg-sleep", "Sleep 22:00–06:00");
    seg(t("06:15"), c.end, 142, 18, "seg-cardio", "Cardio from 06:15");
    if (info.lift) seg(t("12:30"), t("13:20"), 142, 18, "seg-lift", "Lift 12:30–13:20");
    seg(t("09:30"), t("18:00"), 118, 12, "seg-food", "Eating 09:30–18:00");
    if (info.market) seg(info.market.open, info.market.close, 97, 8, "seg-market", `Market ${hm(info.market.open)}–${hm(info.market.close)} Puerto Rico time`);
    ["09:30", "13:30", "17:30"].forEach((s) => { const [x, y] = pt(t(s), 118); el("circle", { cx: x, cy: y, r: 6.5, class: "dial-meal" }, g); });
    let k, v, s;
    if (nowMin !== null) {
      const [x0, y0] = pt(nowMin, 74), [x, y] = pt(nowMin, 154);
      el("line", { x1: x0, y1: y0, x2: x, y2: y, class: "dial-hand" }, g);
      el("circle", { cx: x, cy: y, r: 5, class: "dial-hand-dot" }, g);
      v = hm(nowMin);
      if (nowMin >= t("22:00") || nowMin < t("06:00")) { k = "SLEEP"; s = "up in " + until(nowMin >= t("22:00") ? 1440 - nowMin + t("06:00") : t("06:00") - nowMin); }
      else if (nowMin < t("09:30")) { k = "NOT EATING YET"; s = "breakfast in " + until(t("09:30") - nowMin); }
      else if (nowMin < t("18:00")) { k = "EATING WINDOW"; s = "closes in " + until(t("18:00") - nowMin); }
      else { k = "KITCHEN CLOSED"; s = "lights out in " + until(t("22:00") - nowMin); }
    } else { k = DAYS[info.dow].toUpperCase(); v = info.week > 0 ? "Week " + info.week : info.started ? "Start days" : "Preview"; s = info.lift ? "Lift day" : "No lift"; }
    el("text", { x: 0, y: -20, class: "dial-k", "text-anchor": "middle" }, g).textContent = k;
    el("text", { x: 0, y: 12, class: "dial-v", "text-anchor": "middle" }, g).textContent = v;
    el("text", { x: 0, y: 34, class: "dial-s", "text-anchor": "middle" }, g).textContent = s;
  }

  /* ---------------- Today + week ---------------- */
  const dateInput = $("[data-date-input]");
  const todayBtn = $("[data-date-today]");
  let viewDate = null;

  function render() {
    const now = prNow();
    const day = viewDate || now;
    const live = !viewDate || iso(day.y, day.m, day.d) === iso(now.y, now.m, now.d);
    const info = dayInfo(day.y, day.m, day.d);
    const nowMin = live ? now.min : null;
    drawDial(info, nowMin);
    $('[data-field="day-label"]').textContent = longDate(info.utc) + (live ? ` · ${hm(now.min)} in Puerto Rico` : "") + (!info.started ? " · plan starts " + (info.utc + 86400000 === DAY1 ? "tomorrow" : "Friday, October 30") : "");
    todayBtn.hidden = live;
    dateInput.value = info.key;

    const ev = events(info);
    const box = $("[data-nownext]");
    box.hidden = !live;
    let cur = null, nxt = null;
    if (live) {
      ev.forEach((e) => { if (e.at <= nowMin) cur = e; });
      nxt = ev.find((e) => e.at > nowMin) || null;
      const curLabel = !cur || nowMin >= t("22:00") ? "Sleep" : cur.end && nowMin >= cur.end ? "Done: " + cur.label.split(",")[0] : cur.label;
      $('[data-field="now-item"]').textContent = curLabel;
      $('[data-field="next-item"]').textContent = nxt ? `${hm(nxt.at)} ${nxt.label} (in ${until(nxt.at - nowMin)})` : "06:00 Wake";
    }
    const list = $("[data-day-list]");
    list.innerHTML = ev.map((e) => {
      const cls = ["rt-day-item", e.kind ? "k-" + e.kind : "", live && e === cur ? "is-now" : ""].join(" ");
      const sub = e.lift ? `<ol class="rt-day-ex">${SESSIONS[e.lift.idx].ex.map((x) => `<li><span>${x[0]}</span><em>${exText(x, e.lift.sets)}</em></li>`).join("")}</ol>` : "";
      return `<li class="${cls}"><time>${hm(e.at)}</time><div>${e.label}${sub}</div></li>`;
    }).join("");
    const ex = extras(info);
    if (ex.length) list.insertAdjacentHTML("beforeend", `<li class="rt-day-item k-extra"><time>Also</time><div>${ex.join(" · ")}</div></li>`);

    // week strip
    const weekStart = info.utc - info.dow * 86400000;
    const wk = Math.round((weekStart - START) / (7 * 86400000)) + 1;
    $('[data-field="week-label"]').textContent = wk >= 1
      ? `Week ${wk}` + (wk % 6 === 0 ? " · deload, 2 sets" : " · every weekday, 3 sets")
      : wk === 0 ? "Start week · week 1 begins Monday, November 2" : "Before the plan starts";
    let html = "";
    for (let i = 0; i < 7; i++) {
      const ms = weekStart + i * 86400000, p = fromUTC(ms), di = dayInfo(p.y, p.m, p.d);
      const date = new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
      const liftTxt = !di.started ? `<b class="is-off">Before start</b>` : di.lift ? `<b>${SESSIONS[di.lift.idx].title}</b><em>${di.lift.sets} sets</em>` : `<b class="is-off">No lift</b><em>${i === 5 ? "Long cardio" : "Walk"}</em>`;
      const ext = extras(di);
      html += `<button type="button" class="rt-wday${di.key === info.key ? " is-sel" : ""}${di.lift ? " has-lift" : ""}" data-day="${di.key}"><span class="rt-wday-d">${DAY3[i]} <small>${date}</small></span>${liftTxt}${ext.length ? `<i>${ext.join(" · ")}</i>` : ""}</button>`;
    }
    $("[data-week]").innerHTML = html;
    $("[data-week-note]").textContent = "Lift every weekday at 12:30, 3 sets per exercise. Weeks 6, 12 and 18 are deloads: one set fewer. Tap a day to see it above.";
  }

  dateInput.addEventListener("change", () => {
    if (!dateInput.value) { viewDate = null; render(); return; }
    const [y, m, d] = dateInput.value.split("-").map(Number);
    viewDate = { y, m, d }; render();
  });
  todayBtn.addEventListener("click", () => { viewDate = null; render(); });
  $("[data-week]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-day]"); if (!b) return;
    const [y, m, d] = b.dataset.day.split("-").map(Number);
    viewDate = { y, m, d }; render();
    $("#today").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  render();
  setInterval(() => { if (!viewDate) render(); }, 30000);

  /* ---------------- Meals ---------------- */
  let level = store.get("rt-level", 0);
  let swap = store.get("rt-swap", "steak");
  const levelSeg = $("[data-level-seg]");
  [-1, 0, 1, 2, 3, 4, 5, 6].forEach((n) => {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.level = n; b.textContent = lvName(n); b.title = `≈${fmt(lvl(n).kcal)} kcal`;
    levelSeg.appendChild(b);
  });
  function renderFood() {
    if (level < 0 && swap === "chicken") swap = "steak";
    $$("button", levelSeg).forEach((b) => b.classList.toggle("is-on", +b.dataset.level === level));
    $$("[data-swap]").forEach((b) => { b.classList.toggle("is-on", b.dataset.swap === swap); b.disabled = b.dataset.swap === "chicken" && level < 0; });
    const meals = MEALS.map((m) => ({ ...m, rows: m.items.map((it) => (it === "DINNER" ? { v: DINNER[swap] } : { v: it })) }));
    (level < 0 ? INC["-1"] : Array.from({ length: level }, (_, i) => INC[i + 1]).flat()).forEach(([mi, v]) => meals[mi].rows.push({ v, add: true }));
    const day = [0, 0, 0, 0, 0];
    $("[data-meals]").innerHTML = meals.map((m, i) => {
      const tot = [0, 0, 0, 0, 0];
      const rows = m.rows.map((r) => { r.v.slice(2).forEach((x, k) => { tot[k] += x; }); return `<tr${r.add ? ' class="is-add"' : ""}><td>${r.v[0]}</td><td>${r.v[1]}</td><td class="num">${num(r.v[2])}</td><td class="num">${num(r.v[3])}</td></tr>`; }).join("");
      tot.forEach((x, k) => { day[k] += x; });
      const name = i === 2 && swap !== "steak" ? (swap === "salmon" ? "Salmon salad" : "Chicken salad") : m.name;
      return `<div class="rt-meal"><div class="rt-meal-head"><span>${m.time}</span><h3>${name}</h3><em>${fmt(tot[0])} kcal · ${num(tot[1])} g protein</em></div>
        <table class="rt-table rt-meal-table"><thead><tr><th>Food</th><th>Amount</th><th class="num">kcal</th><th class="num">Protein</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    }).join("");
    $("[data-totals]").innerHTML = `<div><span>Per day</span><b>≈${fmt(Math.round(day[0] / 10) * 10)} kcal</b></div><div><span>Protein</span><b>${num(day[1])} g</b></div><div><span>Carbs</span><b>${num(day[2])} g</b></div><div><span>Fat</span><b>${num(day[3])} g</b></div><div><span>Fiber</span><b>${num(day[4])} g</b></div>`;
    store.set("rt-level", level); store.set("rt-swap", swap);
  }
  levelSeg.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { level = +b.dataset.level; renderFood(); } });
  $("[data-swap-seg]").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b && !b.disabled) { swap = b.dataset.swap; renderFood(); } });
  renderFood();

  /* ---------------- Sessions ---------------- */
  $("[data-sessions]").innerHTML = SESSIONS.map((s, i) => `<div class="rt-session"><span>${DAYS[i]}</span><h3>${s.title}</h3><ol>${s.ex.map((x, k) => `<li><span>${x[0]}</span><em>${x[3] ? x[1] : x[1] || "10–12 reps"}</em>${k < 2 ? '<b class="rt-tag">2 min rest</b>' : ""}${x[2] ? '<b class="rt-tag rt-tag-quiet">drop first</b>' : ""}</li>`).join("")}</ol></div>`).join("");

  /* ---------------- Sunday check-in ---------------- */
  const form = $("[data-calc]");
  const levelSelect = $("[data-level-select]");
  LADDER.slice().reverse().forEach((r) => { const o = document.createElement("option"); o.value = r.lv; o.textContent = `${lvName(r.lv)} · ≈${fmt(r.kcal)} kcal`; levelSelect.appendChild(o); });
  levelSelect.value = String(store.get("rt-level", 0));
  $("[data-levels] tbody").innerHTML = LADDER.map((r) => `<tr${r.lv === 0 ? ' class="is-base"' : ""}><td>${lvName(r.lv)}</td><td>${r.add}</td><td class="num">≈${fmt(r.kcal)}</td></tr>`).join("");
  const n0 = prNow(), i0 = dayInfo(n0.y, n0.m, n0.d);
  form.elements.week.value = Math.max(1, i0.week);

  const CHANGE = { 1: "add ½ cup oats at breakfast", 2: "add ½ pouch rice at lunch", 3: "add 1 cup Greek yogurt at breakfast", 4: "add another ½ cup oats at breakfast", 5: "add another ½ pouch rice at lunch", 6: "add 1 Tbsp olive oil at dinner" };
  function menuChange(from, to) {
    const out = [];
    for (let k = from + 1; k <= to; k++) out.push(k === 0 ? "go back to the full rice pouch" : CHANGE[k]);
    for (let k = from; k > to; k--) out.push(k === 0 ? "eat half the rice pouch at lunch" : "drop the " + CHANGE[k].replace(/^add (another )?/, ""));
    return out.join(", then ");
  }

  function decide(f) {
    const L = +f.level, week = +f.week || 1, since = +f.since, menu = +f.menu;
    const nowW = parseFloat(f.now), prior = parseFloat(f.prior);
    const steps = [], fixes = [];
    if (f.sleep) fixes.push("2 sets this week and fix sleep: last coffee 12:15, screens off 21:30, lights out 22:00.");
    if (f.liftdown && !f.sleep) fixes.push("2 sets for one week.");
    if (f.persist && (f.sleep || f.liftdown || f.after2 || f.hunger)) fixes.push("These have lasted two weeks: see your doctor.");
    steps.push(["Recovery", fixes.length ? fixes.join(" ") : "Nothing to fix.", fixes.length ? "action" : ""]);
    if (!isFinite(nowW) || !isFinite(prior)) return { empty: true, fixes };
    const loss = (prior - nowW) / 2;
    const bound = (to) => (to > 6 || to < -1 ? { to: L, note: "That would go past the ladder, so stay and talk to a doctor or dietitian." } : { to });
    let res = null;
    if ((f.after2 || f.hunger) && menu >= 6 && !f.sleep && loss > 0) {
      res = { ...bound(L + 1), why: "You're on the menu, sleeping enough and still losing, but recovery is suffering. Eat more." };
      steps.push(["Under-fueling", "Up one level, no waiting.", "decides"]);
    } else steps.push(["Under-fueling", (f.after2 || f.hunger) ? (menu < 6 ? "Signs present, but you were off the menu." : f.sleep ? "Signs present, but sleep comes first." : "Signs present, but weight isn't falling.") : "No signs.", ""]);
    if (!res && !f.hold && nowW <= 166) {
      const target = lvl(L).kcal + Math.max(loss, 0) * 500;
      let best = LADDER[0];
      LADDER.forEach((r) => { if (Math.abs(r.kcal - target) < Math.abs(best.kcal - target)) best = r; });
      res = { to: best.lv, why: `Your 7-day average reached 166 lb. Losing ${num(loss)} lb a week means about ${fmt(Math.max(loss, 0) * 500)} kcal a day of deficit left, so move straight to maintenance. Expect 1–3 lb of water back over two weeks. Tick "In maintenance" from next Sunday.` };
      steps.push(["Maintenance", `Reached 166 lb: move to level ${lvName(best.lv)}.`, "decides"]);
    } else if (!res) steps.push(["Maintenance", f.hold ? "Already in maintenance." : "Not at 166 lb yet.", ""]);
    if (!res) {
      const why = [];
      if (week < 4) why.push("it's before week 4 (early weight changes are mostly water)");
      if (since < 2) why.push("your last food change was under two weeks ago");
      if (menu < 6) why.push("you were on the menu fewer than 6 days");
      if (why.length) { res = { to: L, wait: true, why: "No change because " + why.join(" and ") + "." }; steps.push(["Wait", "No food change this week.", "decides"]); }
      else steps.push(["Wait", "OK to change.", ""]);
    }
    if (!res) {
      let to = L, why;
      if (!f.hold) {
        if (loss > 1.5) { to = L + 1; why = `Losing ${num(loss)} lb a week is faster than the 1.5 lb limit.`; }
        else if (loss >= 1) why = `Losing ${num(loss)} lb a week is on target.`;
        else if (loss >= 0.5 && f.waist === "down") why = `Losing ${num(loss)} lb a week with your waist down is fine.`;
        else { to = L - 1; why = loss >= 0 ? `Losing only ${num(loss)} lb a week${loss >= 0.5 ? " and your waist isn't shrinking" : ""}.` : `Gaining ${num(-loss)} lb a week.`; }
      } else {
        const c = -loss;
        if (nowW > 168) { if (c < 0) why = "Above 168 lb but falling, so you're heading back."; else if (f.abovetwice) { to = L - 1; why = "Above 168 lb and not falling for two checks."; } else why = "Above 168 lb and not falling. Check again in two weeks."; }
        else if (nowW >= 163) { if (c < -0.5) { to = L + 1; why = `In the 163–168 lb band but still losing ${num(-c)} lb a week.`; } else if (c > 0.5) { to = L - 1; why = `In the band but gaining ${num(c)} lb a week.`; } else why = "In the 163–168 lb band and steady. This is your maintenance level."; }
        else { if (c > 0) why = "Below 163 lb but rising, so you're heading back."; else { to = L + 1; why = "Below 163 lb and not rising."; } }
      }
      res = { ...bound(to), why };
      steps.push(["Weight", why, "decides"]);
    }
    return { res, steps, fixes, loss, L };
  }

  function renderCalc() {
    const f = {};
    Array.from(form.elements).forEach((x) => { if (x.name) f[x.name] = x.type === "checkbox" ? x.checked : x.value; });
    $$("[data-hold-only]").forEach((n) => { n.hidden = !f.hold; });
    const out = $("[data-verdict]");
    const d = decide(f);
    if (d.empty) {
      out.innerHTML = `<div class="rt-answer is-empty"><strong>Enter your two 7-day averages</strong><p>Weigh every morning after waking. On Sunday, average the last 7 days.</p>${d.fixes.length ? `<p><b>Training:</b> ${d.fixes.join(" ")}</p>` : ""}</div>`;
      return;
    }
    const { res, steps, L } = d;
    const moved = res.to - L;
    const head = moved > 0 ? (moved > 1 ? `Move up to level ${lvName(res.to)}` : "Eat a bit more") : moved < 0 ? "Eat a bit less" : res.wait ? "No change yet" : "Keep going";
    const change = menuChange(L, res.to);
    const target = lvl(res.to);
    out.innerHTML = `<div class="rt-answer ${moved > 0 ? "up" : moved < 0 ? "down" : ""}">
        <strong>${head}</strong>
        ${change ? `<p class="rt-answer-do">${change[0].toUpperCase() + change.slice(1)}.</p>` : ""}
        <p>${res.why}${res.note ? " " + res.note : ""}</p>
        <p class="rt-answer-meta">Level ${lvName(res.to)} · ≈${fmt(target.kcal)} kcal · ${target.p} g protein · ${d.loss >= 0 ? "losing " + num(d.loss) : "gaining " + num(-d.loss)} lb a week</p>
        ${d.fixes.length ? `<p><b>Training:</b> ${d.fixes.join(" ")}</p>` : ""}
      </div>
      <details class="rt-how"><summary>How this was decided</summary><ol>${steps.map(([n, txt, st]) => `<li class="${st}"><b>${n}.</b> ${txt}</li>`).join("")}</ol></details>`;
  }
  form.addEventListener("input", renderCalc);
  form.addEventListener("change", renderCalc);
  form.addEventListener("submit", (e) => e.preventDefault());
  renderCalc();

  /* ---------------- Progress ---------------- */
  const chart = $("[data-chart]");
  const logForm = $("[data-log]");
  let log = store.get("rt-log", {});
  function drawChart() {
    chart.innerHTML = "";
    const weeks = Object.keys(log).map(Number), vals = Object.values(log);
    const maxW = Math.max(24, ...weeks.map((w) => Math.ceil((w + 1) / 4) * 4));
    const W = 720, H = 320, ml = 44, mr = 14, mt = 14, mb = 30;
    const lo = Math.min(160, ...vals.map((v) => Math.floor(v / 5) * 5)), hi = Math.max(190, ...vals.map((v) => Math.ceil(v / 5) * 5));
    const x = (w) => ml + (w / maxW) * (W - ml - mr), y = (v) => mt + ((hi - v) / (hi - lo)) * (H - mt - mb);
    const g = el("g", {}, chart);
    for (let v = lo; v <= hi; v += 5) { el("line", { x1: ml, x2: W - mr, y1: y(v), y2: y(v), class: "ch-grid" }, g); el("text", { x: ml - 8, y: y(v), class: "ch-label", "text-anchor": "end", "dominant-baseline": "central" }, g).textContent = v; }
    for (let w = 0; w <= maxW; w += 4) el("text", { x: x(w), y: H - 8, class: "ch-label", "text-anchor": "middle" }, g).textContent = w ? "wk " + w : "start";
    el("line", { x1: ml, x2: W - mr, y1: y(165), y2: y(165), class: "ch-goal" }, g);
    el("text", { x: W - mr - 4, y: y(165) - 6, class: "ch-label ch-goal-label", "text-anchor": "end" }, g).textContent = "165 lb goal";
    [[4, 4, 182, 184], [8, 8, 176, 179], [12, 12, 171, 174], [16, 20, 165, 168]].forEach(([a, b, l, h]) => {
      const r = el("rect", { x: x(a) - 10, y: y(h), width: x(b) - x(a) + 20, height: y(l) - y(h), rx: 3, class: "ch-mile" }, g);
      el("title", {}, r).textContent = `Week ${a === b ? a : a + "–" + b}: ${l}–${h} lb`;
    });
    const pts = Object.entries(log).map(([w, v]) => [+w, +v]).sort((a, b) => a[0] - b[0]);
    if (pts.length > 1) el("path", { d: pts.map(([w, v], i) => (i ? "L" : "M") + x(w).toFixed(1) + " " + y(v).toFixed(1)).join(" "), class: "ch-line" }, g);
    pts.forEach(([w, v]) => { const c = el("circle", { cx: x(w), cy: y(v), r: 4.5, class: "ch-pt" }, g); el("title", {}, c).textContent = `Week ${w}: ${num(v)} lb`; });
    if (!pts.length) el("text", { x: x(maxW / 2), y: y(187), class: "ch-label", "text-anchor": "middle" }, g).textContent = "Boxes are the milestones. Add your weekly averages to plot them.";
  }
  logForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const w = parseInt(logForm.elements.week.value, 10), v = parseFloat(logForm.elements.avg.value);
    if (!isFinite(w) || !isFinite(v) || v < 100 || v > 300) return;
    log[w] = Math.round(v * 10) / 10; store.set("rt-log", log);
    logForm.elements.week.value = w + 1; logForm.elements.avg.value = "";
    drawChart();
  });
  $("[data-log-clear]").addEventListener("click", () => { if (Object.keys(log).length && !confirm("Clear your saved weekly averages?")) return; log = {}; store.set("rt-log", log); drawChart(); });
  if (i0.week > 0) logForm.elements.week.value = i0.week;
  drawChart();

  /* ---------------- Shopping ---------------- */
  const SHOP = [
    ["Chicken breast", "3.5 lb a week"], ["Top sirloin", "3.5 lb a week"], ["Rice & lentils (Tasty Bite)", "7 pouches a week"],
    ["Greek nonfat yogurt", "4 lb a week"], ["Spring mix", "1.5 lb a week"], ["Grape tomatoes", "2.5 lb a week"], ["Mushrooms", "1.25 lb a week"],
    ["Organic broccoli, frozen", "4 × 1 lb every 10 days"], ["Three Berry Blend, frozen", "4 lb every 2 weeks"], ["Rolled oats", "10 lb every 8 weeks"],
    ["Wild sockeye salmon, frozen", "for swaps"], ["Pumpkin seeds, olive oil, balsamic", "monthly"], ["Collagen, creatine, whey, electrolytes, magnesium", "monthly"],
  ];
  let ticks = store.get("rt-shop", {});
  const shop = $("[data-shop]");
  const renderShop = () => { shop.innerHTML = SHOP.map(([n, q], i) => `<li class="${ticks[i] ? "is-done" : ""}"><label><input type="checkbox" data-i="${i}"${ticks[i] ? " checked" : ""}><span>${n}</span><em>${q}</em></label></li>`).join(""); };
  shop.addEventListener("change", (e) => { const i = e.target.dataset.i; if (i === undefined) return; ticks[i] = e.target.checked; store.set("rt-shop", ticks); renderShop(); });
  $("[data-shop-reset]").addEventListener("click", () => { ticks = {}; store.set("rt-shop", ticks); renderShop(); });
  renderShop();
})();
