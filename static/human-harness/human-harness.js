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
    const grid = document.getElementById('day-grid');
    const readout = document.getElementById('protocol-readout');
    const days = [
      ['Install the harness.', 'Write context, link identity, select the first concrete task set, and begin logging output.'],
      ['Stabilize the morning loop.', 'Refresh context, review yesterday, pick 3-4 artifact tasks, and start before negotiating.'],
      ['Force visible output.', 'Move from chat to artifacts: code, memos, calls, submissions, or published work.'],
      ['Cut vague work.', 'Reject tasks that do not produce evidence. Replace them with measurable artifacts.'],
      ['Use the field terminal.', 'Ask Telegram for live coaching when away from the desk, especially during trading or drift.'],
      ['Run the first brutal review.', 'Compare stated priorities against task history, calendar reality, body state, and market response.'],
      ['Rewrite the plan.', 'Use Full Rewrite or Sprint Planner to update context from observed behavior.'],
      ['Restart with higher standards.', 'Begin week two with a sharper context doc and fewer excuses.'],
      ['Increase throughput.', 'Push code, research, content, or calls through the task lifecycle faster.'],
      ['Exploit multiplayer pressure.', 'Use leaderboard, messages, and public contribution to make output socially real.'],
      ['Attack the bottleneck.', 'Ask the system what you are avoiding, then create the task that removes the bottleneck.'],
      ['Measure the reward loop.', 'Review completed tasks, rewards, refused tasks, and what the verification layer taught you.'],
      ['Prepare the final rewrite.', 'Ask whether the strategy still deserves belief after two weeks of contact with reality.'],
      ['Decide whether to stay harnessed.', 'Keep the loop if it outperformed native judgment. Change it if the evidence says otherwise.'],
    ];

    function render(index) {
      if (readout) {
        readout.innerHTML = `<span>Day ${index + 1}</span><h3>${days[index][0]}</h3><p>${days[index][1]}</p>`;
      }
      grid?.querySelectorAll('button').forEach((button, buttonIndex) => {
        button.classList.toggle('is-selected', buttonIndex === index);
      });
    }

    if (!grid) return;
    days.forEach((_, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(index + 1);
      button.setAttribute('aria-label', `Show day ${index + 1}`);
      button.addEventListener('click', () => render(index));
      grid.appendChild(button);
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
  setupTelegramTerminal();
  setupProtocol();
  setupCanvas();
  syncSlide();
})();
