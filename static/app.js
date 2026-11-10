(() => {
  // Newsletter: Beehiiv, via the goodalexander-subscribe forwarder on Fly (holds the API key server-side).
  const NEWSLETTER = { provider: 'beehiiv', endpoint: 'https://goodalexander-subscribe.fly.dev/subscribe' };

  const D = window.GA_DATA || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const parseDate = s => { const [y, m, d] = s.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
  const dayMonYear = s => { const d = parseDate(s); return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
  const fmt = (n, dp = 0) => n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });


  document.documentElement.dataset.type = 'e';   // house type: Jost (matches the GA mark)

  // ---------- data bindings (all values come from data.js, built by build_data.py) ----------
  const { audience: aud } = D;
  const binds = {};
  if (aud) binds.xFollowers = `${Math.round(aud.x_followers / 1000)}K`;
  $$('[data-bind]').forEach(el => { const v = binds[el.dataset.bind]; if (v != null) el.textContent = v; });
  const today = $('[data-today]');
  if (today) today.textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // ---------- video grid: featured uploads first, then the channel feed ----------
  const grid = $('#videos');
  if (grid && D.videos && D.videos.length) {
    const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    grid.innerHTML = D.videos.map((v) => {
      const meta = v.featured ? 'Film' : 'Talk';   // same field on every card (dates/views aren't available for all)
      const r = v.ratio || 16 / 9;
      return `<a class="vcard" style="--r:${r}" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener" data-vid="${v.id}" data-title="${esc(v.title)}">
        <span class="vcard__frame"><img src="https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg" alt="" loading="lazy" width="1280" height="720"
          onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${v.id}/hqdefault.jpg'"><span class="video__play" aria-hidden="true"></span></span>
        <span class="vcard__title">${esc(v.title)}</span><span class="label">${meta}</span></a>`;
    }).join('');
    // Click opens a viewer over the page; nothing loads from YouTube until then.
    grid.addEventListener('click', (e) => {
      const a = e.target.closest('.vcard');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      openViewer(a.dataset.vid, a.dataset.title, parseFloat(a.style.getPropertyValue('--r')) || 16 / 9, a);
    });
  }


  // ---------- video viewer (lightbox) ----------
  let lastFocus = null;
  function closeViewer() {
    const box = $('.viewer');
    if (!box) return;
    box.remove();  // removing the iframe stops playback
    document.documentElement.classList.remove('has-viewer');
    if (lastFocus) lastFocus.focus();
  }
  function openViewer(id, title, ratio, from) {
    closeViewer();
    lastFocus = from || null;
    const box = document.createElement('div');
    box.className = 'viewer';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', title);
    box.style.setProperty('--r', ratio);
    box.innerHTML = `<div class="viewer__inner">
        <button class="viewer__close" type="button" aria-label="Close video">Close &times;</button>
        <div class="viewer__frame"><iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1" title="${title.replace(/"/g, '&quot;')}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>
        <div class="viewer__meta"><span class="viewer__title"></span><a class="more" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">Watch on YouTube</a></div>
      </div>`;
    $('.viewer__title', box).textContent = title;
    box.addEventListener('click', (e) => { if (e.target === box || e.target.closest('.viewer__close')) closeViewer(); });
    document.body.appendChild(box);
    document.documentElement.classList.add('has-viewer');
    $('.viewer__close', box).focus();
  }
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeViewer(); });

  // ---------- footer data note ----------
  const note = $('#dataNote');
  if (note && D.generated_at) {
    note.textContent = aud ? `X follower count as of ${dayMonYear(aud.as_of)}.` : '';
  }

  // ---------- API request form lives inside <details> ----------
  $$('.reveal-form').forEach(d => d.addEventListener('toggle', () => d.open && $('input', d).focus()));

  // ---------- newsletter ----------
  async function subscribe(email, label, trap) {
    const res = await fetch(NEWSLETTER.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, label: label || '', website: trap || '' }),
    });
    if (!res.ok) throw new Error(`subscribe ${res.status}`);
  }
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  $$('[data-signup]').forEach(form => {
    const input = $('input[type=email]', form), btn = $('button[type=submit]', form), status = $('.signup__status', form);
    const say = (msg, cls) => { status.className = `signup__status ${cls || ''}`; status.innerHTML = msg; };
    const trap = document.createElement('input');           // honeypot: hidden from people, filled by bots
    Object.assign(trap, { type: 'text', name: 'website', tabIndex: -1, autocomplete: 'off', className: 'sr' });
    trap.setAttribute('aria-hidden', 'true');
    form.appendChild(trap);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = input.value.trim();
      if (!EMAIL.test(email)) { say('Please enter a valid email address.', 'is-error'); input.focus(); return; }
      btn.disabled = true; say('Sending…');
      try {
        await subscribe(email, form.dataset.label, trap.value);
        form.classList.add('is-done');
        say(form.dataset.label.startsWith('api')
          ? 'Your address has joined the newsletter list. The API is being prepared.'
          : 'You’re subscribed. The next note goes straight to your inbox.', 'is-ok');
      } catch {
        say('That didn’t go through. Please try again in a moment.', 'is-error');
      } finally {
        btn.disabled = false;
      }
    });
  });

})();
