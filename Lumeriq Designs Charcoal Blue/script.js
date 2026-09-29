// ============================================
// LUMERIQ DESIGNS — shared interactions
// ============================================

// IMPORTANT: set this to your deployed chat backend URL (see /chatbot-backend/README.md)
// Leave as-is and the widget will politely fall back to WhatsApp/email until it's set.
const CHAT_API_ENDPOINT = "https://chatbot-backend-seven-rosy.vercel.app/api/chat";

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Mobile nav toggle ----------
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.classList.toggle('is-active', isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // ---------- Header reacts to scroll ----------
  const header = document.querySelector('.header');
  if (header) {
    const updateHeader = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  // ---------- Portfolio filters (with fade transition) ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('[data-category]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.dataset.filter;

        portfolioCards.forEach(card => {
          const show = cat === 'all' || card.dataset.category === cat;
          if (show) {
            card.style.display = '';
            requestAnimationFrame(() => card.classList.remove('is-fading'));
          } else {
            card.classList.add('is-fading');
            setTimeout(() => {
              if (card.classList.contains('is-fading')) card.style.display = 'none';
            }, prefersReducedMotion ? 0 : 260);
          }
        });
      });
    });
  }

  // ---------- Contact form (submits to Web3Forms — https://web3forms.com) ----------
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const statusEl = form.querySelector('#form-status');
      const original = btn.textContent;

      const accessKey = form.querySelector('input[name="access_key"]').value;
      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
        statusEl.textContent = "This form isn't fully set up yet — please reach out on WhatsApp or email instead (see the panel to the right) and I'll follow up as soon as it's connected.";
        statusEl.className = 'form-status is-error';
        return;
      }

      btn.textContent = 'Sending...';
      btn.disabled = true;
      statusEl.className = 'form-status';

      try {
        const formData = new FormData(form);
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        const data = await res.json();

        if (data.success) {
          statusEl.textContent = "Thanks! Your message has been sent — I'll get back to you within one business day.";
          statusEl.className = 'form-status is-success';
          form.reset();
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        statusEl.textContent = "Something went wrong sending your message. Please try again, or reach out directly on WhatsApp or email.";
        statusEl.className = 'form-status is-error';
      } finally {
        btn.textContent = original;
        btn.disabled = false;
      }
    });
  }

  // ---------- Hero entrance (single orchestrated reveal, not scattered) ----------
  const heroEls = document.querySelectorAll('.hero [data-reveal]');
  heroEls.forEach((el, i) => {
    if (prefersReducedMotion) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.style.transitionDelay = `${i * 90}ms`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });

  // ---------- Trust strip: convert to seamless marquee ----------
  const trustRow = document.querySelector('.trust__row');
  if (trustRow && !prefersReducedMotion) {
    const track = document.createElement('div');
    track.className = 'trust__track is-marquee';
    trustRow.parentNode.insertBefore(track, trustRow);
    const clone = trustRow.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(trustRow);
    track.appendChild(clone);
  }

  // ---------- Animated stat counters ----------
  const statNums = document.querySelectorAll('.stat__num');
  const animateCount = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/[\d.]+/);
    if (!match) return;
    const target = parseFloat(match[0]);
    const suffix = raw.replace(match[0], '');
    if (prefersReducedMotion) { el.textContent = raw; return; }
    let start = null;
    const duration = 1100;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased * 10) / 10;
      el.textContent = (Number.isInteger(target) ? Math.round(current) : current) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = raw;
    };
    requestAnimationFrame(step);
  };

  // ---------- Generic scroll-reveal, applied across common component types ----------
  const revealSelectors = [
    '.section-head', '.stat__num', '.service-card', '.work-card',
    '.feature', '.testi-card', '.philosophy-card', '.process-item',
    '.capability-item', '.portfolio-card', '.split__visual', '.split > div',
    '.cta-band', '.service-block', '.contact-info-card', '#contact-form'
  ];
  const revealTargets = new Set();
  revealSelectors.forEach(sel => document.querySelectorAll(sel).forEach(el => revealTargets.add(el)));

  revealTargets.forEach(el => el.classList.add('reveal'));

  const groupSelectors = [
    '.stats__grid', '.services-grid', '.work-grid', '.feature-list',
    '.testi-grid', '.philosophy-grid', '.process-list', '.capability-list',
    '.portfolio-grid', '.split'
  ];

  const staggerIndex = (el) => {
    const container = el.closest(groupSelectors.join(','));
    if (!container) return 0;
    const groupMembers = Array.from(container.querySelectorAll('*')).filter(c => revealTargets.has(c));
    const idx = groupMembers.indexOf(el);
    return idx === -1 ? 0 : idx;
  };

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = staggerIndex(el) * 70;
        setTimeout(() => {
          el.classList.add('is-visible');
          if (el.classList.contains('stat__num')) animateCount(el);
        }, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => {
      el.classList.add('is-visible');
      if (el.classList.contains('stat__num')) el.textContent = el.textContent.trim();
    });
  }

  // ---------- AI Chat widget ----------
  const chatFloat = document.querySelector('.chat-float');
  const chatWindow = document.querySelector('.chat-window');
  const chatMessages = document.querySelector('.chat-window__messages');
  const chatForm = document.querySelector('.chat-window__form');
  const chatInput = document.querySelector('.chat-window__input');

  if (chatFloat && chatWindow && chatForm) {
    let chatHistory = []; // { role: 'user' | 'assistant', content: '...' }
    let hasGreeted = false;

    const addMessage = (role, text) => {
      const div = document.createElement('div');
      div.className = 'chat-msg ' + (role === 'user' ? 'chat-msg--user' : 'chat-msg--bot');
      div.textContent = text;
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const addTypingIndicator = () => {
      const div = document.createElement('div');
      div.className = 'chat-msg chat-msg--bot chat-msg--typing';
      div.innerHTML = '<span></span><span></span><span></span>';
      div.dataset.typing = 'true';
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return div;
    };

    chatFloat.addEventListener('click', () => {
      const isOpen = chatWindow.classList.toggle('is-open');
      chatFloat.classList.toggle('is-open', isOpen);
      if (isOpen && !hasGreeted) {
        hasGreeted = true;
        addMessage('assistant', "Hi! I'm the Lumeriq Designs assistant. Ask me about web development, SEO, Google Business Profile, pricing, or anything else, and I'll do my best to help.");
      }
    });

    // Local helpful replies when the AI backend is offline
    const localReply = (msg) => {
      const m = msg.toLowerCase();
      if (/price|pricing|cost|how much|quote|budget|fee/.test(m)) {
        return "Pricing depends on project scope (pages, features, SEO, and Google Business Profile work). Share a quick brief on WhatsApp (+234 903 151 2760) or the contact form and you'll get an accurate quote.";
      }
      if (/seo|search|rank|google search/.test(m)) {
        return "We handle on-page SEO, technical SEO, and local SEO so your site can be found on Google. For local businesses we also set up and optimize Google Business Profile. Want details for your niche? Message us on WhatsApp.";
      }
      if (/google business|gbp|maps|local/.test(m)) {
        return "Yes — Google Business Profile setup and optimization is one of our core services (categories, photos, posts, attributes, Q&A, and local visibility). WhatsApp +234 903 151 2760 to get started.";
      }
      if (/web|website|develop|design|build|site/.test(m)) {
        return "We design and develop fast, mobile-first custom websites focused on results — not templates. See recent work like Lumina Dental and FlowPro Plumbing on this site, or ask for a quote on WhatsApp.";
      }
      if (/contact|whatsapp|email|reach|call|phone/.test(m)) {
        return "You can reach Lumeriq Designs on WhatsApp at +234 903 151 2760 (https://wa.me/2349031512760) or email lumeriqdesigns@gmail.com. We're based in Ilorin, Nigeria and work remotely worldwide.";
      }
      if (/hello|hi|hey|good (morning|afternoon|evening)/.test(m)) {
        return "Hello! I can help with questions about web development, SEO, Google Business Profile, or how to start a project. What would you like to know?";
      }
      return "Thanks for your message. For a fast personal reply about your project, reach us on WhatsApp +234 903 151 2760 or email lumeriqdesigns@gmail.com — we'll respond quickly.";
    };

    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      addMessage('user', text);
      chatHistory.push({ role: 'user', content: text });
      chatInput.value = '';
      const submitBtn = chatForm.querySelector('button');
      submitBtn.disabled = true;

      const typingEl = addTypingIndicator();

      const finish = (reply) => {
        typingEl.remove();
        addMessage('assistant', reply);
        chatHistory.push({ role: 'assistant', content: reply });
        submitBtn.disabled = false;
        chatInput.focus();
      };

      if (!CHAT_API_ENDPOINT) {
        setTimeout(() => finish(localReply(text)), 500);
        return;
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);
        const res = await fetch(CHAT_API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: chatHistory }),
          signal: controller.signal
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error('Bad response ' + res.status);
        const data = await res.json();
        const reply = (data && data.reply) ? data.reply : localReply(text);
        finish(reply);
      } catch (err) {
        // Backend down / CORS / timeout → still answer helpfully
        finish(localReply(text));
      }
    });
  }

});


// ---------- Spoken welcome (HOME PAGE ONLY, once per session) ----------
if (window.location.pathname === '/' || /\/index\.html$/.test(window.location.pathname)) {
  const LUMERIQ_WELCOME_KEY = 'lumeriqWelcomePlayed';
  const LUMERIQ_WELCOME_AUDIO = new Audio('welcome-voice.mp3');
  LUMERIQ_WELCOME_AUDIO.preload = 'auto';
  LUMERIQ_WELCOME_AUDIO.volume = 1;
  let welcomeStarted = false;

  function playLumeriqWelcome() {
    if (welcomeStarted || sessionStorage.getItem(LUMERIQ_WELCOME_KEY)) return;
    welcomeStarted = true;
    const playPromise = LUMERIQ_WELCOME_AUDIO.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.then(() => {
        sessionStorage.setItem(LUMERIQ_WELCOME_KEY, '1');
      }).catch(() => {
        welcomeStarted = false;
      });
    } else {
      sessionStorage.setItem(LUMERIQ_WELCOME_KEY, '1');
    }
  }

  // Start the recorded welcome during the home-page opening experience.
  window.setTimeout(playLumeriqWelcome, 450);

  // Browsers may block autoplay with sound. If so, play it on the visitor's
  // first intentional interaction, still only once per session.
  const resumeWelcomeOnInteraction = () => {
    playLumeriqWelcome();
    window.removeEventListener('pointerdown', resumeWelcomeOnInteraction);
    window.removeEventListener('keydown', resumeWelcomeOnInteraction);
  };
  window.addEventListener('pointerdown', resumeWelcomeOnInteraction, { once: true, passive: true });
  window.addEventListener('keydown', resumeWelcomeOnInteraction, { once: true });
}

// ---------- Opening page loader ----------
const pageLoader = document.querySelector('.page-loader');
if (pageLoader) {
  const startTime = performance.now();
  const minimumDisplay = 2300;
  const hideLoader = () => {
    const elapsed = performance.now() - startTime;
    const delay = Math.max(0, minimumDisplay - elapsed);
    setTimeout(() => {
      pageLoader.classList.add('is-hidden');
      window.setTimeout(() => pageLoader.remove(), 850);
    }, delay);
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, { once: true });
  }
}
