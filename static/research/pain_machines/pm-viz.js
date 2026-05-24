(function () {
  'use strict';

  const C = {
    bg: '#040506',
    panel: '#0a0b0d',
    ink: '#ebe4dc',
    muted: '#8a9199',
    dim: '#555c64',
    gold: '#b89a6a',
    pain: '#b85c55',
    pleasure: '#7a9a8c',
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas(canvas, wrap) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(wrap.clientWidth || wrap.getBoundingClientRect().width || 320, 280);
    const ratio = window.innerWidth <= 720 ? 0.78 : 0.62;
    const h = Math.max(wrap.clientHeight || Math.round(w * ratio), 200);
    wrap.style.height = h + 'px';
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  function loop(fn) {
    let id = 0;
    let t0 = performance.now();
    let running = true;
    function frame(now) {
      if (!running) return;
      const t = (now - t0) / 1000;
      fn(t, now);
      id = requestAnimationFrame(frame);
    }
    id = requestAnimationFrame(frame);
    return {
      stop() {
        running = false;
        cancelAnimationFrame(id);
      },
    };
  }

  function particles(n, w, h, seed) {
    return Array.from({ length: n }, (_, i) => ({
      x: (Math.sin(seed + i * 1.7) * 0.5 + 0.5) * w,
      y: (Math.cos(seed + i * 2.3) * 0.5 + 0.5) * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 2 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function drawGlow(ctx, x, y, r, color, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color.replace(')', `,${a})`).replace('rgb', 'rgba').replace('#', ''));
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function hexA(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  const VIZ = {};

  VIZ.neuromatrix = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    const pts = particles(28, geom.w, geom.h, 1.2);
    const cx = geom.w * 0.5;
    const cy = geom.h * 0.48;
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = hexA(C.pain, 0.15 + 0.08 * Math.sin(t * 2));
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 34 + 4 * Math.sin(t * 1.5), 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = hexA(C.pain, 0.35 + 0.15 * Math.sin(t * 3));
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();
      pts.forEach((p, i) => {
        const ang = t * 0.6 + p.phase + i * 0.4;
        const tx = cx + Math.cos(ang) * (60 + 20 * Math.sin(t + i));
        const ty = cy + Math.sin(ang) * (40 + 15 * Math.cos(t * 0.8 + i));
        p.x += (tx - p.x) * 0.03;
        p.y += (ty - p.y) * 0.03;
        ctx.strokeStyle = hexA(i % 3 ? C.gold : C.pain, 0.35);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        ctx.fillStyle = hexA(i % 2 ? C.gold : C.muted, 0.7);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  };

  VIZ.iasp = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      const y = h * 0.5;
      const pulse = 0.5 + 0.5 * Math.sin(t * 4);
      [[0.22, C.pain], [0.78, C.gold]].forEach(([fx, col], i) => {
        const x0 = w * fx;
        ctx.strokeStyle = hexA(col, 0.5);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x0, h * 0.25);
        ctx.lineTo(w * 0.5, y - 20);
        ctx.stroke();
        ctx.fillStyle = hexA(col, 0.8);
        ctx.beginPath();
        ctx.arc(x0, h * 0.25, 8, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = hexA(C.pain, 0.4 + pulse * 0.4);
      ctx.beginPath();
      ctx.arc(w * 0.5, y, 22 + pulse * 8, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 5; i++) {
        const p = ((t * 0.4 + i * 0.2) % 1);
        ctx.fillStyle = hexA(C.pain, 1 - p);
        ctx.beginPath();
        ctx.arc(w * 0.22 + (w * 0.28) * p, h * 0.25 + (y - 20 - h * 0.25) * p, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  VIZ.icd11 = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      const branches = 7;
      for (let i = 0; i < branches; i++) {
        const prog = Math.min(1, (t * 0.35 + i * 0.12) % 1.5);
        const x0 = w * 0.5;
        const y0 = h * 0.15;
        const x1 = w * (0.12 + (0.76 * i) / (branches - 1));
        const y1 = h * 0.85;
        ctx.strokeStyle = hexA(C.pain, 0.15 + prog * 0.5);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(w * 0.5 + Math.sin(i + t) * 30, h * 0.5, x0 + (x1 - x0) * prog, y0 + (y1 - y0) * prog);
        ctx.stroke();
        if (prog > 0.8) {
          ctx.fillStyle = hexA(C.pain, 0.6);
          ctx.beginPath();
          ctx.arc(x1, y1, 5 + Math.sin(t * 3 + i) * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  };

  VIZ.mcgill = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    const painDots = particles(48, geom.w * 0.5, geom.h, 2);
    const pleasDots = particles(12, geom.w * 0.5, geom.h, 3);
    return loop((t) => {
      geom = resizeCanvas(canvas, wrap);
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = hexA(C.pleasure, 0.15);
      ctx.fillRect(w * 0.52, 0, w * 0.48, h);
      pleasDots.forEach((p, i) => {
        p.x = w * 0.72 + Math.sin(t + i) * 20;
        p.y = h * 0.2 + (i / 12) * h * 0.6;
        ctx.fillStyle = hexA(C.pleasure, 0.65);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      painDots.forEach((p, i) => {
        p.x = w * 0.25 + Math.sin(t * 0.8 + i * 0.5) * (30 + i);
        p.y = h * 0.1 + (i / 48) * h * 0.8 + Math.cos(t + i) * 8;
        ctx.fillStyle = hexA(C.pain, 0.5 + 0.3 * Math.sin(t * 2 + i));
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      });
    });
  };

  VIZ.price = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      const layers = [0.35, 0.55, 0.75];
      layers.forEach((frac, i) => {
        const bh = (h * 0.55 * frac) * (0.85 + 0.15 * Math.sin(t * 2 + i));
        ctx.fillStyle = hexA(C.pain, 0.25 + i * 0.15);
        ctx.fillRect(w * 0.15, h * 0.85 - bh, w * 0.28, bh);
      });
      const ph = h * 0.22 * (0.9 + 0.1 * Math.sin(t));
      ctx.fillStyle = hexA(C.pleasure, 0.5);
      ctx.fillRect(w * 0.62, h * 0.85 - ph, w * 0.28, ph);
    });
  };

  VIZ.berridge = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      const hotspots = [[0.35, 0.55], [0.48, 0.62], [0.42, 0.42]];
      hotspots.forEach(([x, y], i) => {
        const r = 12 + 4 * Math.sin(t * 3 + i);
        ctx.fillStyle = hexA(C.pleasure, 0.35);
        ctx.beginPath();
        ctx.arc(w * x, h * y, r * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = hexA(C.pleasure, 0.85);
        ctx.beginPath();
        ctx.arc(w * x, h * y, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });
      for (let i = 0; i < 24; i++) {
        const ang = t * 0.5 + i * 0.5;
        const r = 40 + i * 4;
        ctx.strokeStyle = hexA(C.gold, 0.12);
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.52, r, ang, ang + 0.8);
        ctx.stroke();
      }
    });
  };

  VIZ.leknes = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = hexA(C.muted, 0.4);
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.5);
      ctx.bezierCurveTo(w * 0.35, h * 0.2, w * 0.65, h * 0.8, w * 0.9, h * 0.5);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const p = ((t * 0.35 + i * 0.12) % 1);
        ctx.fillStyle = hexA(i % 2 ? C.pleasure : C.pain, 0.9 - p * 0.5);
        const x = w * (0.1 + 0.8 * p);
        const y = h * 0.5 + Math.sin(p * Math.PI * 2) * h * 0.25;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  VIZ.baumeister = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      const tilt = 0.15 * Math.sin(t * 0.8) + 0.22;
      ctx.save();
      ctx.translate(w * 0.5, h * 0.55);
      ctx.rotate(tilt);
      ctx.fillStyle = hexA(C.dim, 0.5);
      ctx.fillRect(-w * 0.35, -4, w * 0.7, 8);
      ctx.fillStyle = hexA(C.pain, 0.7);
      ctx.beginPath();
      ctx.arc(-w * 0.28, 0, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = hexA(C.pleasure, 0.5);
      ctx.beginPath();
      ctx.arc(w * 0.28, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };

  VIZ.rozin = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    const bad = particles(28, 200, 200, 4);
    return loop((t) => {
      geom = resizeCanvas(canvas, wrap);
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      bad.forEach((p, i) => {
        p.x = w * 0.68 + Math.sin(t * 0.7 + i * 0.6) * (35 + i * 0.8);
        p.y = h * 0.15 + (i / 28) * h * 0.7 + Math.cos(t + i) * 10;
        ctx.fillStyle = hexA(C.pain, 0.55 + 0.25 * Math.sin(t * 2 + i));
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + (i % 4), 0, Math.PI * 2);
        ctx.fill();
      });
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = hexA(C.pleasure, 0.65);
        ctx.beginPath();
        ctx.arc(w * 0.22 + (i % 4) * 14, h * 0.45 + Math.sin(t + i) * 18, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  VIZ.eisenberger = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      const cx = w * 0.5;
      const cy = h * 0.5;
      ctx.strokeStyle = hexA(C.muted, 0.35);
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + t * 0.2;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * 55, cy + Math.sin(a) * 55, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = hexA(C.muted, 0.4);
        ctx.fill();
      }
      const ox = cx + 90 + Math.sin(t) * 5;
      ctx.fillStyle = hexA(C.pain, 0.85);
      ctx.beginPath();
      ctx.arc(ox, cy, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = hexA(C.pain, 0.25 + 0.2 * Math.sin(t * 4));
      ctx.beginPath();
      ctx.arc(cx, cy, 35 + 10 * Math.sin(t * 3), 0, Math.PI * 2);
      ctx.fill();
    });
  };

  VIZ.lazarus = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      const x0 = w * 0.5;
      const y0 = h * 0.2;
      ctx.fillStyle = hexA(C.ink, 0.5);
      ctx.beginPath();
      ctx.arc(x0, y0, 10, 0, Math.PI * 2);
      ctx.fill();
      [[0.2, 0.55, 1], [0.5, 0.35, 0.7], [0.8, 0.65, 1.2]].forEach(([fx, fy, mul], i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 2 + i * 2);
        ctx.strokeStyle = hexA(C.pain, 0.3 + pulse * 0.4);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(w * fx, h * fy);
        ctx.stroke();
        ctx.fillStyle = hexA(C.pain, 0.4 + pulse * 0.4);
        ctx.beginPath();
        ctx.arc(w * fx, h * fy, 14 * mul * pulse, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  };

  VIZ.warranty = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = hexA(C.pain, 0.8);
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < w; x += 4) {
        const y = h * 0.35 + Math.sin((x / w) * Math.PI * 8 + t * 6) * h * 0.08;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      const stamp = 0.5 + 0.5 * Math.sin(t * 1.5);
      ctx.strokeStyle = hexA(C.gold, 0.3 + stamp * 0.5);
      ctx.lineWidth = 3;
      ctx.strokeRect(w * 0.15, h * 0.55, w * 0.7, h * 0.28);
      ctx.fillStyle = hexA(C.gold, 0.15 + stamp * 0.25);
      ctx.fillRect(w * 0.15, h * 0.55, w * 0.7, h * 0.28);
    });
  };

  VIZ.ledger = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      geom = resizeCanvas(canvas, wrap);
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      const mid = w * 0.5;
      ctx.fillStyle = hexA(C.pleasure, 0.08);
      ctx.fillRect(mid, 0, w - mid, h);
      const pleas = [0.35, 0.42, 0.38, 0.4];
      pleas.forEach((frac, i) => {
        const bh = h * 0.12 * frac;
        ctx.fillStyle = hexA(C.pleasure, 0.55 + 0.1 * Math.sin(t + i));
        ctx.fillRect(mid + 24 + i * 22, h * 0.82 - bh, 16, bh);
      });
      const pains = [0.5, 0.65, 0.72, 0.85, 0.78, 0.92];
      pains.forEach((frac, i) => {
        const bh = h * 0.55 * frac * (0.92 + 0.08 * Math.sin(t * 1.5 + i));
        ctx.fillStyle = hexA(C.pain, 0.45 + i * 0.06);
        ctx.fillRect(24 + i * 18, h * 0.88 - bh, 14, bh);
        if (i > 2) {
          ctx.strokeStyle = hexA(C.pain, 0.35);
          ctx.beginPath();
          ctx.moveTo(24 + i * 18 + 7, h * 0.88 - bh);
          ctx.lineTo(24 + i * 18 + 7 + 12, h * 0.88 - bh - 20);
          ctx.stroke();
        }
      });
    });
  };

  VIZ.stack = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      const n = 7;
      for (let i = 0; i < n; i++) {
        const lit = (Math.sin(t * 2 - i * 0.8) + 1) / 2;
        const y = h * 0.12 + i * (h * 0.11);
        ctx.fillStyle = hexA(C.pain, 0.1 + lit * 0.5);
        ctx.fillRect(w * 0.12, y, w * 0.76, h * 0.08);
        if (lit > 0.7) {
          ctx.fillStyle = hexA(C.pain, 0.9);
          ctx.beginPath();
          ctx.arc(w * 0.88, y + h * 0.04, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  };

  VIZ.genesis = VIZ.icd11;

  VIZ.inversion = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 6; i++) {
        const p = ((t * 0.25 + i * 0.15) % 1);
        ctx.fillStyle = hexA(C.muted, 0.8 - p);
        ctx.beginPath();
        ctx.arc(w * 0.25, h * (0.25 + p * 0.5), 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = hexA(C.pain, 0.8 - p);
        ctx.beginPath();
        ctx.arc(w * 0.75, h * (0.75 - p * 0.5), 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  VIZ.ladder = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      const steps = 8;
      const climb = (t * 0.3) % steps;
      for (let i = 0; i < steps; i++) {
        const y = h * 0.88 - i * (h * 0.09);
        const on = i <= climb;
        ctx.fillStyle = hexA(on ? C.gold : C.dim, on ? 0.6 : 0.2);
        ctx.fillRect(w * 0.38, y, w * 0.24, h * 0.06);
      }
      ctx.fillStyle = hexA(C.gold, 0.9);
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.88 - climb * (h * 0.09), 8, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  VIZ.christian = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = hexA(C.gold, 0.4);
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, 40 + 5 * Math.sin(t), 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * 0.15;
        ctx.strokeStyle = hexA(i % 2 ? C.pleasure : C.pain, 0.35);
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.5);
        ctx.lineTo(w * 0.5 + Math.cos(a) * 70, h * 0.5 + Math.sin(a) * 50);
        ctx.stroke();
      }
    });
  };

  VIZ.islam = VIZ.christian;

  VIZ.secular = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      const pts = [[0.5, 0.15], [0.15, 0.82], [0.85, 0.82]];
      ctx.strokeStyle = hexA(C.muted, 0.4);
      ctx.beginPath();
      pts.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(w * x, h * y);
        else ctx.lineTo(w * x, h * y);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = hexA(C.gold, 0.3 + 0.2 * Math.sin(t * 2));
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.52, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = hexA(C.pain, 0.7);
      ctx.beginPath();
      ctx.moveTo(w * 0.85, h * 0.82);
      ctx.lineTo(w * 0.95 + Math.sin(t * 3) * 8, h * 0.92);
      ctx.stroke();
    });
  };

  VIZ.regimes = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      [0.25, 0.5, 0.75].forEach((fx, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 2 + i);
        ctx.fillStyle = hexA(C.gold, 0.15 + pulse * 0.25);
        ctx.fillRect(w * (fx - 0.12), h * 0.3, w * 0.24, h * 0.4);
        ctx.strokeStyle = hexA(C.pain, 0.5);
        ctx.strokeRect(w * (fx - 0.12), h * 0.72, w * 0.24, h * 0.08);
      });
    });
  };

  VIZ.roadmap = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = hexA(C.gold, 0.5);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.05, h * 0.55);
      ctx.lineTo(w * 0.95, h * 0.55);
      ctx.stroke();
      const n = 7;
      for (let i = 0; i < n; i++) {
        const x = w * (0.05 + (0.9 * i) / (n - 1));
        const on = i <= (t * 0.5) % (n + 1);
        ctx.fillStyle = hexA(on ? C.gold : C.dim, on ? 0.9 : 0.3);
        ctx.beginPath();
        ctx.arc(x, h * 0.55, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  VIZ.audit = function (canvas, wrap) {
    let geom = resizeCanvas(canvas, wrap);
    return loop((t) => {
      const { ctx, w, h } = geom;
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = hexA(C.gold, 0.6);
      ctx.lineWidth = 2;
      ctx.beginPath();
      const pts = 8;
      for (let i = 0; i <= pts; i++) {
        const x = w * (0.08 + (0.84 * i) / pts);
        const y = h * (0.78 - (i / pts) * 0.55 * (0.7 + 0.3 * Math.sin(t * 0.5)));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      [0.25, 0.5, 0.75].forEach((fx, i) => {
        const v = Math.max(0, 1 - (t * 0.15 + i * 0.2) % 1.2);
        ctx.fillStyle = hexA(C.pain, 0.3 + v * 0.5);
        ctx.fillRect(w * (fx - 0.1), h * 0.12, w * 0.2, h * 0.06 * v + 0.02);
      });
    });
  };

  const ID_MAP = {
    'fig-neuromatrix': 'neuromatrix',
    'fig-iasp': 'iasp',
    'fig-icd11': 'icd11',
    'fig-mcgill': 'mcgill',
    'fig-price': 'price',
    'fig-berridge': 'berridge',
    'fig-leknes': 'leknes',
    'fig-baumeister': 'baumeister',
    'fig-rozin': 'rozin',
    'fig-eisenberger': 'eisenberger',
    'fig-lazarus': 'lazarus',
    'pmx-00': 'warranty',
    'pmx-01': 'ledger',
    'pmx-02': 'stack',
    'pmx-03': 'genesis',
    'pmx-04': 'inversion',
    'pmx-05': 'ladder',
    'pmx-06': 'christian',
    'pmx-07': 'islam',
    'pmx-08': 'secular',
    'pmx-09': 'regimes',
    'pmx-10': 'roadmap',
    'pmx-11': 'audit',
  };

  function initOne(el) {
    if (el.dataset.ready) return;
    el.dataset.ready = '1';
    const wrap = el.closest('.pm-viz-wrap') || el.parentElement;
    let viz = el.dataset.viz;
    if (!viz) {
      const fig = el.closest('figure');
      if (fig && fig.id) viz = ID_MAP[fig.id];
    }
    if (!viz || !VIZ[viz]) return;
    const fn = VIZ[viz];
    let runner = null;
    const start = () => {
      if (runner) return;
      runner = fn(el, wrap);
    };
    const stop = () => {
      if (runner) {
        runner.stop();
        runner = null;
      }
    };
    if (reduced) {
      const { ctx, w, h } = resizeCanvas(el, wrap);
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, w, h);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? start() : stop()));
      },
      { rootMargin: '80px' },
    );
    io.observe(el);
    window.addEventListener(
      'resize',
      () => {
        stop();
        start();
      },
      { passive: true },
    );
    start();
  }

  function boot() {
    document.querySelectorAll('.pm-viz').forEach(initOne);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
