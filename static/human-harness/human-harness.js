(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsRoot = document.getElementById('slide-dots');
  const status = document.getElementById('slide-status');
  const progress = document.getElementById('progress-bar');
  const prevButton = document.getElementById('prev-slide');
  const nextButton = document.getElementById('next-slide');
  const deck = document.getElementById('deck');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let activeIndex = readInitialIndex();
  let touchStartX = 0;
  let touchStartY = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function readInitialIndex() {
    const raw = window.location.hash.replace('#slide-', '');
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed)) {
      return clamp(parsed - 1, 0, slides.length - 1);
    }
    return 0;
  }

  function renderDots() {
    if (!dotsRoot) return;
    dotsRoot.innerHTML = '';
    slides.forEach((slide, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Go to slide ${index + 1}: ${slide.dataset.title || 'Untitled'}`);
      button.addEventListener('click', () => goTo(index));
      dotsRoot.appendChild(button);
    });
  }

  function syncSlide() {
    slides.forEach((slide, index) => {
      const active = index === activeIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    const dots = dotsRoot ? Array.from(dotsRoot.querySelectorAll('button')) : [];
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === activeIndex);
      dot.setAttribute('aria-current', index === activeIndex ? 'step' : 'false');
    });

    const title = slides[activeIndex]?.dataset.title || `Slide ${activeIndex + 1}`;
    if (status) {
      status.textContent = `${activeIndex + 1}/${slides.length} - ${title}`;
    }
    if (progress) {
      progress.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
    }
    if (prevButton) {
      prevButton.disabled = activeIndex === 0;
    }
    if (nextButton) {
      nextButton.textContent = activeIndex === slides.length - 1 ? 'Restart' : 'Next';
    }
    window.history.replaceState(null, '', `#slide-${activeIndex + 1}`);
    deck?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  function goTo(index) {
    activeIndex = clamp(index, 0, slides.length - 1);
    syncSlide();
  }

  function next() {
    if (activeIndex >= slides.length - 1) {
      goTo(0);
      return;
    }
    goTo(activeIndex + 1);
  }

  function prev() {
    goTo(activeIndex - 1);
  }

  function setupNavigation() {
    renderDots();
    prevButton?.addEventListener('click', prev);
    nextButton?.addEventListener('click', next);
    document.querySelectorAll('[data-go-next]').forEach((button) => {
      button.addEventListener('click', next);
    });

    document.addEventListener('keydown', (event) => {
      const target = event.target;
      const tagName = target?.tagName?.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || target?.isContentEditable) {
        return;
      }
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        next();
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        prev();
      }
      if (event.key === 'Home') {
        event.preventDefault();
        goTo(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        goTo(slides.length - 1);
      }
    });

    document.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });

    document.addEventListener('touchend', (event) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) {
        return;
      }
      if (deltaX < 0) next();
      if (deltaX > 0) prev();
    }, { passive: true });
  }

  function setupProblemTabs() {
    const output = document.getElementById('problem-output');
    const copy = {
      rules: {
        label: 'Problem 01',
        title: 'The model follows your stated frame too obediently.',
        body: 'If your context is stale or self-protective, the model can help you execute the wrong plan. The Task Node needs context regeneration, blind-spot analysis, and task history that proves what you actually did.',
      },
      ethics: {
        label: 'Problem 02',
        title: 'A system that governs action cannot outsource your moral frame.',
        body: 'The AI should show consequences, tradeoffs, and contradictions. It should not quietly replace your values with a vendor policy layer or a generic therapeutic posture.',
      },
      multiplayer: {
        label: 'Problem 03',
        title: 'Private promises are weak. Social consequence is stronger.',
        body: 'Behavior change usually works better in groups: logs, artifacts, visible wins, visible misses, and people who notice whether you did the thing.',
      },
    };
    document.querySelectorAll('[data-problem]').forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.dataset.problem;
        const selected = copy[key] || copy.rules;
        document.querySelectorAll('[data-problem]').forEach((item) => {
          item.classList.toggle('is-selected', item === button);
        });
        if (output) {
          output.innerHTML = `<span>${selected.label}</span><h3>${selected.title}</h3><p>${selected.body}</p>`;
        }
      });
    });
  }

  function setupTaskLanes() {
    const output = document.getElementById('lane-output');
    const copy = {
      personal: {
        badge: 'Personal',
        title: 'Produce the artifact your strategy requires.',
        body: 'Daily execution pressure: write, ship, call, test, submit evidence.',
      },
      network: {
        badge: 'Network',
        title: 'Contribute to the shared machine.',
        body: 'Work is selected against network context, board priorities, and coordination value.',
      },
      alpha: {
        badge: 'Alpha',
        title: 'Turn domain knowledge into market signal.',
        body: 'Expertise becomes structured intelligence: tickers, hypotheses, evidence, confidence, and checks.',
      },
    };

    document.querySelectorAll('[data-lane]').forEach((button) => {
      button.addEventListener('click', () => {
        const lane = copy[button.dataset.lane] || copy.personal;
        document.querySelectorAll('[data-lane]').forEach((item) => {
          item.classList.toggle('is-selected', item === button);
        });
        if (output) {
          output.innerHTML = `<span class="lane-badge">${lane.badge}</span><h3>${lane.title}</h3><p>${lane.body}</p>`;
        }
      });
    });

    const steps = Array.from(document.querySelectorAll('.life-step'));
    let stepIndex = 0;
    const advance = () => {
      steps.forEach((step, index) => step.classList.toggle('is-active', index === stepIndex));
      stepIndex = (stepIndex + 1) % steps.length;
    };
    steps.forEach((step, index) => {
      step.addEventListener('click', () => {
        stepIndex = index;
        advance();
      });
    });
    if (!prefersReducedMotion && steps.length) {
      setInterval(advance, 1800);
    }
  }

  function setupModules() {
    const readout = document.getElementById('module-readout');
    document.querySelectorAll('[data-module]').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('[data-module]').forEach((item) => {
          item.classList.toggle('is-selected', item === button);
        });
        if (readout) {
          readout.innerHTML = `<span>Selected module</span><h3>${button.dataset.module}</h3><p>${button.dataset.copy}</p>`;
        }
      });
    });
  }

  function setupCurveCanvas() {
    const canvas = document.getElementById('curve-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const modes = {
      human: {
        label: 'Human baseline',
        number: '1.0x',
        caption: 'unrouted cognition',
        color: 'rgba(180, 192, 202, 0.95)',
        accent: 'rgba(180, 192, 202, 0.16)',
      },
      model: {
        label: 'Model decision curve',
        number: '9.4x',
        caption: 'judgment routed through improving models',
        color: 'rgba(77, 231, 220, 0.95)',
        accent: 'rgba(77, 231, 220, 0.18)',
      },
      collective: {
        label: 'Collective compounding',
        number: '31.7x',
        caption: 'users + task signal + capital loop',
        color: 'rgba(110, 229, 143, 0.95)',
        accent: 'rgba(245, 200, 95, 0.16)',
      },
    };
    let modeKey = 'human';
    let raf = 0;

    function setMode(nextMode) {
      modeKey = modes[nextMode] ? nextMode : 'human';
      const mode = modes[modeKey];
      document.getElementById('curve-label').textContent = mode.label;
      document.getElementById('curve-number').textContent = mode.number;
      document.getElementById('curve-caption').textContent = mode.caption;
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return rect;
    }

    function plotCurve(rect, progress) {
      const mode = modes[modeKey];
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = 'rgba(5, 6, 6, 0.54)';
      ctx.fillRect(0, 0, rect.width, rect.height);
      const pad = 58;
      const width = rect.width - pad * 2;
      const height = rect.height - pad * 2;
      ctx.strokeStyle = 'rgba(237, 239, 232, 0.12)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i += 1) {
        const y = pad + (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(rect.width - pad, y);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(166, 170, 160, 0.9)';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('decision quality', pad, pad - 18);
      ctx.fillText('time / model release cadence', rect.width - pad - 170, rect.height - 24);

      function yFor(xNorm) {
        if (modeKey === 'human') return 0.72 - xNorm * 0.22;
        if (modeKey === 'model') return 0.82 - Math.pow(xNorm, 2.3) * 0.72;
        return 0.86 - Math.pow(xNorm, 2.8) * 0.82;
      }

      ctx.lineWidth = 5;
      ctx.strokeStyle = mode.color;
      ctx.shadowColor = mode.color;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      const max = Math.max(2, Math.floor(120 * progress));
      for (let i = 0; i <= max; i += 1) {
        const xNorm = i / 120;
        const x = pad + xNorm * width;
        const y = pad + clamp(yFor(xNorm), 0.04, 0.9) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (modeKey !== 'human') {
        ctx.fillStyle = mode.accent;
        for (let i = 0; i < 8; i += 1) {
          const xNorm = (i + 1) / 9;
          const x = pad + xNorm * width;
          const y = pad + clamp(yFor(xNorm), 0.04, 0.9) * height;
          ctx.beginPath();
          ctx.arc(x, y, 7 + i * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function draw(time) {
      const rect = resizeCanvas();
      if (rect) {
        const progress = prefersReducedMotion ? 1 : Math.min(1, ((time || 0) % 2600) / 1800);
        plotCurve(rect, progress);
      }
      raf = requestAnimationFrame(draw);
    }

    document.querySelectorAll('[data-curve-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('[data-curve-mode]').forEach((item) => {
          item.classList.toggle('is-selected', item === button);
        });
        setMode(button.dataset.curveMode);
      });
    });

    setMode('human');
    draw(0);
    window.addEventListener('pagehide', () => cancelAnimationFrame(raf));
  }

  function setupDecisionRouter() {
    const output = document.getElementById('router-output');
    const value = document.getElementById('bandwidth-value');
    const fill = document.getElementById('bandwidth-fill');
    const routes = {
      trade: ['Generate trading task', '42%'],
      code: ['Spawn Codex implementation path', '71%'],
      life: ['Run Five Mirrors', '58%'],
      network: ['Issue network contribution task', '64%'],
    };

    function activate(routeKey) {
      const route = routes[routeKey] || routes.trade;
      if (output) output.textContent = route[0];
      if (value) value.textContent = route[1];
      if (fill) fill.style.width = route[1];
      document.querySelectorAll('[data-thought]').forEach((item) => {
        item.classList.toggle('is-active', item.dataset.thought === routeKey);
      });
    }

    document.querySelectorAll('[data-route]').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('[data-route]').forEach((item) => {
          item.classList.toggle('is-selected', item === button);
        });
        activate(button.dataset.route);
      });
    });
    activate('trade');
  }

  function setupCodexStream() {
    const linesRoot = document.getElementById('codex-lines');
    const locCounter = document.getElementById('loc-counter');
    const promptCounter = document.getElementById('prompt-counter');
    const artifactCounter = document.getElementById('artifact-counter');
    if (!linesRoot) return;

    const events = [
      ['TASK', 'Patch reward feedback payload', '+214 LOC'],
      ['PROMPT', 'Route vague anxiety into concrete task', '+1'],
      ['CODEX', 'Refactor verification guard', '+488 LOC'],
      ['TEST', 'Add regression for single artifact method', '+96 LOC'],
      ['SHIP', 'Deploy dev surface for review', 'artifact'],
      ['CODEX', 'Build interactive presentation slide', '+327 LOC'],
    ];
    let index = 0;
    let loc = 1200;
    let prompts = 8;
    let artifacts = 2;

    function tick() {
      const event = events[index % events.length];
      index += 1;
      if (event[2].includes('LOC')) loc += Number.parseInt(event[2].replace(/\D/g, ''), 10) || 0;
      if (event[0] === 'PROMPT' || event[0] === 'CODEX') prompts += 1;
      if (event[0] === 'SHIP') artifacts += 1;
      locCounter.textContent = loc.toLocaleString();
      promptCounter.textContent = prompts.toLocaleString();
      artifactCounter.textContent = artifacts.toLocaleString();

      const line = document.createElement('div');
      line.className = 'codex-line';
      line.innerHTML = `<strong>${escapeHtml(event[0])}</strong><span>${escapeHtml(event[1])}</span><small>${escapeHtml(event[2])}</small>`;
      linesRoot.prepend(line);
      while (linesRoot.children.length > 8) {
        linesRoot.lastElementChild.remove();
      }
    }

    for (let i = 0; i < 5; i += 1) tick();
    if (!prefersReducedMotion) {
      setInterval(tick, 1500);
    }
  }

  function setupCapitalCanvas() {
    const canvas = document.getElementById('capital-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const label = document.getElementById('capital-label');
    const value = document.getElementById('capital-value');
    const modes = {
      users: ['1000 DAUs', 'humans produce task evidence'],
      signals: ['signal graph', 'alpha and execution traces densify'],
      capital: ['capital loop', 'collective intelligence compounds'],
    };
    let modeKey = 'users';
    let raf = 0;

    function setMode(nextMode) {
      modeKey = modes[nextMode] ? nextMode : 'users';
      if (label) label.textContent = modes[modeKey][0];
      if (value) value.textContent = modes[modeKey][1];
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return rect;
    }

    function draw(time) {
      const rect = resizeCanvas();
      if (!rect) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const t = (time || 0) / 1000;
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = 'rgba(5, 6, 6, 0.54)';
      ctx.fillRect(0, 0, rect.width, rect.height);
      const cx = rect.width * 0.48;
      const cy = rect.height * 0.52;
      const count = modeKey === 'users' ? 18 : modeKey === 'signals' ? 28 : 36;
      const radius = Math.min(rect.width, rect.height) * 0.32;
      const nodes = [];
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2 + t * 0.06;
        const r = radius * (0.46 + ((i * 37) % 53) / 100);
        nodes.push({
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle * 1.23) * r * 0.78,
          hot: i % 5 === 0,
        });
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > (modeKey === 'users' ? 95 : 135)) continue;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(77, 231, 220, ${0.18 * (1 - dist / 135)})`;
          ctx.stroke();
        }
      }
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.hot ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = node.hot ? 'rgba(245, 200, 95, 0.95)' : 'rgba(77, 231, 220, 0.82)';
        ctx.fill();
      });
      ctx.strokeStyle = modeKey === 'capital' ? 'rgba(110, 229, 143, 0.95)' : 'rgba(245, 200, 95, 0.68)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      const pad = 60;
      for (let i = 0; i <= 80; i += 1) {
        const xNorm = i / 80;
        const x = pad + xNorm * (rect.width - pad * 2);
        const y = rect.height - pad - Math.pow(xNorm, modeKey === 'capital' ? 2.7 : 1.6) * (rect.height * 0.42);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    }

    document.querySelectorAll('[data-capital-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('[data-capital-mode]').forEach((item) => {
          item.classList.toggle('is-selected', item === button);
        });
        setMode(button.dataset.capitalMode);
      });
    });
    setMode('users');
    draw(0);
    window.addEventListener('pagehide', () => cancelAnimationFrame(raf));
  }

  function setupTelegramTerminal() {
    const feed = document.getElementById('phone-feed');
    const steps = [
      [
        { role: 'user', text: '/linkwallet rPo8...HxNx' },
        { role: 'bot', text: 'Send the unique PFT proof amount from that wallet, then return with /verifywallet <tx_hash>.', meta: 'wallet ownership proof' },
      ],
      [
        { role: 'user', text: '/verifywallet 9B2A...' },
        { role: 'bot', text: 'Wallet verified. Loading Task Node context doc, recent task history, and rewarded PFT signal.', meta: 'context bridge active' },
        { role: 'bot', text: 'CONTEXT_DOC: life goals, strategy, operating constraints, workflows. TASK_HISTORY: latest commitments.', meta: 'bounded prompt pack' },
      ],
      [
        { role: 'user', text: 'Review this trade before I add risk.' },
        { role: 'bot', text: 'Trading Coach: separate thesis, timing, sizing, and invalidation. If the setup depends on emotional revenge, reduce size first.', meta: 'journal + context + recent tasks' },
      ],
      [
        { role: 'user', text: '/refreshcredits' },
        { role: 'bot', text: 'Credits refreshed from verified Task Node work. Completed tasks increase mobile coaching allowance.', meta: 'reward loop closed' },
      ],
    ];

    function render(stepIndex) {
      if (!feed) return;
      feed.innerHTML = '';
      steps[stepIndex].forEach((message) => {
        const item = document.createElement('div');
        item.className = `message ${message.role}`;
        item.innerHTML = `${escapeHtml(message.text)}${message.meta ? `<small>${escapeHtml(message.meta)}</small>` : ''}`;
        feed.appendChild(item);
      });
    }

    document.querySelectorAll('[data-terminal-step]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number.parseInt(button.dataset.terminalStep, 10) || 0;
        document.querySelectorAll('[data-terminal-step]').forEach((item) => {
          item.classList.toggle('is-selected', item === button);
        });
        render(index);
      });
    });
    render(0);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setupProtocol() {
    const sequence = document.getElementById('product-sequence');
    const stage = document.getElementById('product-flow-stage');
    const steps = [
      {
        label: 'Context',
        route: '/context',
        title: 'Refresh the operating document.',
        user: 'What changed since yesterday? Keep the plan honest before we generate work.',
        system: 'Task Node loads values, strategy, workflows, constraints, linked wallet history, and recent execution deltas.',
        artifact: 'Active context: what matters, what changed, what cannot be forgotten.',
        output: 'Working memory offloaded',
      },
      {
        label: 'Sprint Chat',
        route: '/module-chat?module=sprint_planner',
        title: 'Ask the system what deserves action.',
        user: 'Given my context and last tasks, what are the highest leverage artifacts for today?',
        system: 'Sprint Planner turns the life strategy and execution log into a bounded set of task candidates.',
        artifact: 'Three to four artifact-grade objectives instead of another free-form conversation.',
        output: 'Decision load routed',
      },
      {
        label: 'Task Request',
        route: '/module-chat?surface=task&task_tab=personal',
        title: 'Convert intention into a proposal card.',
        user: 'Create a task to make the Human Harness presentation feel like real in-app usage.',
        system: 'The chat returns a task with reward, deadline, alignment, concrete steps, and one verification artifact.',
        artifact: 'A task proposal that can be accepted, refused, verified, and remembered.',
        output: 'Intent becomes object',
      },
      {
        label: 'Dashboard',
        route: '/dashboard',
        title: 'Accept the bounded execution object.',
        user: 'Accept it. Show me the exact proof I need to submit.',
        system: 'The dashboard makes the task visible, time-bounded, economically weighted, and socially legible.',
        artifact: 'Accepted task with deadline, reward, and one evidence mode.',
        output: 'Commitment becomes public',
      },
      {
        label: 'Codex',
        route: 'local repo + Codex',
        title: 'Use AI for the artifact, not just advice.',
        user: 'Implement the task in the repo, test it, commit it, and keep the patch tight.',
        system: 'Codex reads the codebase, edits the deck, verifies the route, and ships the diff.',
        artifact: 'Working code, deployed page, commit hash, or a clean unified diff.',
        output: 'LOC explodes',
      },
      {
        label: 'Telegram',
        route: '@TaskNode bot',
        title: 'Keep the loop alive away from the desk.',
        user: 'I am on my phone. Keep me aligned to the accepted task and my trading rules.',
        system: 'Telegram loads context, task history, journal mode, and recent work so the mobile chat is not amnesiac.',
        artifact: 'A field terminal for drift, trading coaching, and task continuity.',
        output: 'No context loss',
      },
      {
        label: 'Evidence',
        route: '/tasks/:id/submit',
        title: 'Submit proof, not vibes.',
        user: 'Here is the deployed URL and the diff that proves the task is done.',
        system: 'Task Node packages the evidence against the original verification requirement.',
        artifact: 'One artifact submitted to one verification mode.',
        output: 'Execution becomes record',
      },
      {
        label: 'Verify',
        route: '/tasks/:id/verify',
        title: 'Let the system close the loop.',
        user: 'Answer the verification follow-up from the actual patch, not memory.',
        system: 'The verifier checks the artifact, records the result, updates rewards, and preserves the task history.',
        artifact: 'Completed task, reward state, and a machine-readable execution trace.',
        output: 'Work becomes ledger',
      },
      {
        label: 'Rewrite',
        route: '/module-chat?module=context_full_rewrite',
        title: 'Regenerate tomorrow from what actually happened.',
        user: 'What should my context doc learn from this task, the blockers, and the result?',
        system: 'Mega or Ultra Rewrite proposes a context patch from evidence, task history, and strategic drift.',
        artifact: 'Approved context update. The next chat starts smarter than the last one.',
        output: 'Self-model updates',
      },
    ];

    function render(index) {
      const step = steps[index];
      if (stage) {
        stage.innerHTML = `
          <div class="browser-frame">
            <div class="browser-top">
              <span></span><span></span><span></span>
              <code>${escapeHtml(step.route)}</code>
            </div>
            <div class="product-chat-demo">
              <div class="flow-node">
                <small>${escapeHtml(String(index + 1).padStart(2, '0'))} / ${escapeHtml(step.label)}</small>
                <h3>${escapeHtml(step.title)}</h3>
              </div>
              <div class="chat-bubble user">
                <strong>User</strong>
                <p>${escapeHtml(step.user)}</p>
              </div>
              <div class="chat-bubble system">
                <strong>Task Node</strong>
                <p>${escapeHtml(step.system)}</p>
              </div>
              <div class="artifact-card">
                <span>Artifact</span>
                <p>${escapeHtml(step.artifact)}</p>
              </div>
              <div class="loop-meter">
                <span>${escapeHtml(step.output)}</span>
                <i style="--progress:${((index + 1) / steps.length) * 100}%"></i>
              </div>
            </div>
          </div>
        `;
      }
      sequence?.querySelectorAll('button').forEach((button, buttonIndex) => {
        button.classList.toggle('is-selected', buttonIndex === index);
      });
    }

    if (!sequence) return;
    sequence.innerHTML = '';
    steps.forEach((step, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(step.label)}</strong><small>${escapeHtml(step.output)}</small>`;
      button.setAttribute('aria-label', `Show product loop step ${index + 1}: ${step.label}`);
      button.addEventListener('click', () => render(index));
      sequence.appendChild(button);
    });
    render(0);
  }

  function setupCanvas() {
    const canvas = document.getElementById('harness-field');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let raf = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = clamp(Math.floor((width * height) / 18000), 34, 88);
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.36,
        vy: (Math.random() - 0.5) * 0.36,
        r: 1.2 + (index % 4) * 0.38,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(8, 9, 9, 0.22)';
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fillStyle = i % 5 === 0 ? 'rgba(255, 91, 102, 0.42)' : 'rgba(77, 231, 220, 0.42)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 132) continue;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(243, 244, 238, ${0.12 * (1 - distance / 132)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('pagehide', () => cancelAnimationFrame(raf));
  }

  setupNavigation();
  setupProblemTabs();
  setupTaskLanes();
  setupModules();
  setupCurveCanvas();
  setupDecisionRouter();
  setupCodexStream();
  setupCapitalCanvas();
  setupTelegramTerminal();
  setupProtocol();
  setupCanvas();
  syncSlide();
})();
