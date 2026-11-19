/* =========================================================
   1. INTERACTIVE STARFIELD & COSMIC CANVAS SYSTEM
   ========================================================= */
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');

let stars = [];
let cursorParticles = [];
let clickExplosions = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  const count = Math.floor((canvas.width * canvas.height) / 3200);
  const colors = ['#FFFFFF', '#0072CE', '#70B5FF', '#FF8D80', '#FC3D21'];

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.3,
      baseAlpha: Math.random() * 0.7 + 0.2,
      alpha: 0,
      twinkleSpeed: Math.random() * 0.03 + 0.008,
      twinklePhase: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      parallaxFactor: Math.random() * 0.04 + 0.01
    });
  }
}

// Mouse movement handling
window.addEventListener('mousemove', (e) => {
  mouse.targetX = e.clientX;
  mouse.targetY = e.clientY;

  // Generate cursor stardust particles
  for (let i = 0; i < 2; i++) {
    cursorParticles.push({
      x: e.clientX + (Math.random() - 0.5) * 10,
      y: e.clientY + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      size: Math.random() * 2.5 + 1,
      alpha: 1,
      color: Math.random() > 0.4 ? '#0072CE' : '#FC3D21'
    });
  }
});

// Click wave supernova effect
window.addEventListener('click', (e) => {
  // Spawn supernova particle shockwave
  const particleCount = 36;
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const speed = Math.random() * 4 + 2;
    clickExplosions.push({
      x: e.clientX,
      y: e.clientY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 3.5 + 1.5,
      alpha: 1,
      color: i % 2 === 0 ? '#0072CE' : '#FC3D21'
    });
  }
});

function animateCanvas(time) {
  // Smooth mouse lerp
  mouse.x += (mouse.targetX - mouse.x) * 0.05;
  mouse.y += (mouse.targetY - mouse.y) * 0.05;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Deep Space Background Nebula Glows
  const bgGrad = ctx.createRadialGradient(
    canvas.width * 0.5, canvas.height * 0.3, 10,
    canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
  );
  bgGrad.addColorStop(0, '#070D2A');
  bgGrad.addColorStop(0.6, '#020514');
  bgGrad.addColorStop(1, '#00020A');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // NASA Blue & Red subtle nebulas
  const blueNebula = ctx.createRadialGradient(mouse.x, mouse.y, 20, mouse.x, mouse.y, 400);
  blueNebula.addColorStop(0, 'rgba(0, 114, 206, 0.08)');
  blueNebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = blueNebula;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Render Twinkling Stars with Parallax Shift
  const offsetX = (mouse.x - canvas.width / 2);
  const offsetY = (mouse.y - canvas.height / 2);

  stars.forEach(s => {
    s.twinklePhase += s.twinkleSpeed;
    s.alpha = s.baseAlpha + Math.sin(s.twinklePhase) * 0.3;
    
    const posX = s.x + offsetX * s.parallaxFactor;
    const posY = s.y + offsetY * s.parallaxFactor;

    ctx.beginPath();
    ctx.fillStyle = s.color;
    ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
    ctx.arc(posX, posY, s.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. Render Cursor Stardust Particles
  ctx.globalAlpha = 1;
  for (let i = cursorParticles.length - 1; i >= 0; i--) {
    const p = cursorParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.025;

    if (p.alpha <= 0) {
      cursorParticles.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Render Click Supernova Particles
  for (let i = clickExplosions.length - 1; i >= 0; i--) {
    const ep = clickExplosions[i];
    ep.x += ep.vx;
    ep.y += ep.vy;
    ep.alpha -= 0.02;

    if (ep.alpha <= 0) {
      clickExplosions.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.fillStyle = ep.color;
    ctx.globalAlpha = ep.alpha;
    ctx.arc(ep.x, ep.y, ep.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
requestAnimationFrame(animateCanvas);

/* =========================================================
   6. AI MISSION ASSISTANT WIDGET LOGIC
   ========================================================= */
const aiKnowledge = [
  { keys: ['camera', 'photo', 'picture', 'image'], reply: 'NASA space cameras capture optical and multispectral imagery to analyze surface minerals and planetary terrain.' },
  { keys: ['antenna', 'signal', 'radio', 'communicate'], reply: 'High-gain antennas transmit telemetry across deep space to NASA Deep Space Network dishes on Earth.' },
  { keys: ['wheel', 'rover', 'drive', 'mars'], reply: 'Rover wheels feature custom treads engineered to endure razor-sharp rocks and loose dust dunes.' },
  { keys: ['moon', 'lunar'], reply: 'The Moon has no atmosphere, meaning lunar impact craters remain preserved for billions of years.' },
  { keys: ['mars', 'red planet'], reply: 'Mars gets its iconic reddish hue from oxidized iron (rust) covering its surface rocks and soil.' }
];

function toggleAIChat() {
  document.getElementById('aiPanel').classList.toggle('hidden');
}

function handleAISubmit(e) {
  e.preventDefault();
  const input = document.getElementById('aiInput');
  const text = input.value.trim();
  if (!text) return;

  appendAIMessage(text, 'user');
  input.value = '';

  setTimeout(() => {
    const reply = getAIReply(text);
    appendAIMessage(reply, 'bot');
  }, 400);
}

function sendQuickQ(text) {
  appendAIMessage(text, 'user');
  setTimeout(() => {
    const reply = getAIReply(text);
    appendAIMessage(reply, 'bot');
  }, 400);
}

function getAIReply(query) {
  const q = query.toLowerCase();
  const match = aiKnowledge.find(k => k.keys.some(key => q.includes(key)));
  if (match) return match.reply;
  return "That is a great space question! I recommend checking out official NASA mission logs for more deep space archives.";
}

function appendAIMessage(text, sender, allowHTML = false) {
  const msgs = document.getElementById('aiMessages');
  const div = document.createElement('div');

  if (sender === 'user') {
    div.className = 'p-3 rounded-xl bg-nasa-blue text-white ml-auto max-w-[85%] font-sans';
  } else {
    div.className = 'p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-gray-200 max-w-[85%] font-sans';
  }

  if (allowHTML) div.innerHTML = text;
  else div.textContent = text;

  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

/* =========================================================
   7. SHARED PAGE CHROME (header, nav, counter, chat widget)
   ========================================================= */
(function () {
  const page = document.body.dataset.page;
  const PAGES = [
    { id: 'home',    href: 'home.html',    label: 'Home',    icon: 'fa-house' },
    { id: 'journey', href: 'journey.html', label: 'Journey', icon: 'fa-rocket' },
    { id: 'worlds',  href: 'worlds.html',  label: 'Worlds',  icon: 'fa-globe' },
    { id: 'quiz',    href: 'quiz.html',    label: 'Quiz',    icon: 'fa-graduation-cap' },
    { id: 'comic',   href: 'comic.html',   label: 'Comic',   icon: 'fa-book-open' }
  ];
  const KEY = 'spaceMemoryFound';
  const ITEMS = ['lm','ssm','arm','seis','rotor','rtg','mag','ccd'];
  let found = [];
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); if (Array.isArray(v)) found = v.filter(k => ITEMS.includes(k)); } catch (e) {}
  const paint = () => { const el = document.getElementById('foundCount'); if (el) el.textContent = found.length; };

  // Discovered items are remembered across pages
  window.SM = {
    addFound(key) {
      if (ITEMS.includes(key) && !found.includes(key)) {
        found.push(key);
        try { localStorage.setItem(KEY, JSON.stringify(found)); } catch (e) {}
        paint();
      }
      return found.length;
    }
  };

  if (page === 'index') return; // choice screen: no header, no chat

  const LOGO = "      <svg class=\"w-10 h-10 hover:rotate-12 transition-transform duration-300 cursor-pointer\" viewBox=\"0 0 100 100\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <circle cx=\"50\" cy=\"50\" r=\"46\" fill=\"#0B3D91\"/>\n        <path d=\"M12 50 C 30 20, 70 20, 88 50 C 70 80, 30 80, 12 50 Z\" fill=\"#FC3D21\" opacity=\"0.85\"/>\n        <ellipse cx=\"50\" cy=\"50\" rx=\"42\" ry=\"14\" transform=\"rotate(-25 50 50)\" stroke=\"#FFFFFF\" stroke-width=\"2.5\" fill=\"none\"/>\n        <text x=\"50\" y=\"58\" font-family=\"'Titillium Web', sans-serif\" font-weight=\"900\" font-size=\"22\" fill=\"#FFFFFF\" text-anchor=\"middle\" letter-spacing=\"2\">NASA</text>\n        <circle cx=\"28\" cy=\"35\" r=\"1.5\" fill=\"#FFF\"/>\n        <circle cx=\"72\" cy=\"65\" r=\"2\" fill=\"#FFF\"/>\n        <circle cx=\"68\" cy=\"30\" r=\"1\" fill=\"#FFF\"/>\n        <circle cx=\"32\" cy=\"68\" r=\"1.5\" fill=\"#FFF\"/>\n      </svg>";
  const CHAT = "<div class=\"fixed bottom-6 right-6 z-[1000]\">\n  \n  <!-- Toggle Bot Button -->\n  <button id=\"aiToggle\" onclick=\"toggleAIChat()\" aria-label=\"Open NASA Mission AI\" class=\"w-16 h-16 rounded-full bg-gradient-to-r from-nasa-blue to-nasa-red text-white flex items-center justify-center text-2xl shadow-xl shadow-nasa-blue/50 hover:scale-110 transition-transform\">\n    <i class=\"fa-solid fa-robot\"></i>\n  </button>\n\n  <!-- Chat Panel Widget -->\n  <div id=\"aiPanel\" class=\"hidden fixed bottom-24 right-6 w-[min(380px,calc(100vw-30px))] h-[460px] max-h-[70vh] rounded-2xl nasa-glass border border-nasa-lightBlue/60 shadow-2xl overflow-hidden flex flex-col z-[1001]\">\n    \n    <!-- Header -->\n    <div class=\"p-3.5 bg-nasa-darkBg/90 border-b border-nasa-blue/30 flex items-center justify-between text-xs font-mono\">\n      <span class=\"flex items-center gap-2 text-white font-bold\">\n        <span class=\"w-2 h-2 rounded-full bg-emerald-400 animate-ping\"></span>\n        NASA MISSION AI ASSISTANT\n      </span>\n      <button onclick=\"toggleAIChat()\" class=\"text-gray-400 hover:text-white\"><i class=\"fa-solid fa-xmark\"></i></button>\n    </div>\n\n    <!-- Messages Window -->\n    <div id=\"aiMessages\" class=\"flex-1 p-4 overflow-y-auto space-y-3 text-xs\">\n      <div class=\"p-3 rounded-xl bg-nasa-blue/20 border border-nasa-blue/40 text-blue-100\">\n        Greetings Explorer! I am your NASA Mission AI. Ask me about cameras, antennas, rovers, the Moon, or Mars! \ud83d\ude80\n      </div>\n      <div class=\"p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200\">\n        \ud83d\udca1 After 2 wrong quiz answers, I can explain your mistakes and help you learn them.\n      </div>\n    </div>\n\n    <!-- Quick Prompts -->\n    <div class=\"px-3 py-2 bg-black/40 border-t border-slate-800 flex flex-wrap gap-1.5\">\n      <button onclick=\"sendQuickQ('What does the camera do?')\" class=\"text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-nasa-blue text-gray-300\">Camera?</button>\n      <button onclick=\"sendQuickQ('Why do we need antennas?')\" class=\"text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-nasa-blue text-gray-300\">Antenna?</button>\n      <button onclick=\"sendQuickQ('Tell me about Mars rovers')\" class=\"text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-nasa-blue text-gray-300\">Mars Rovers?</button>\n    </div>\n\n    <!-- Input Form -->\n    <form id=\"aiForm\" onsubmit=\"handleAISubmit(event)\" class=\"p-2.5 bg-nasa-darkBg/90 border-t border-nasa-blue/30 flex gap-2\">\n      <input id=\"aiInput\" type=\"text\" placeholder=\"Ask a space question...\" class=\"flex-1 bg-slate-900 border border-slate-700 rounded-full px-3 py-1.5 text-xs text-white focus:outline-none focus:border-nasa-lightBlue\" autocomplete=\"off\">\n      <button type=\"submit\" class=\"w-8 h-8 rounded-full bg-nasa-blue hover:bg-nasa-red text-white flex items-center justify-center text-xs transition-colors\">\n        <i class=\"fa-solid fa-paper-plane\"></i>\n      </button>\n    </form>\n\n  </div>\n</div>";
  const desk = p => `<a href="${p.href}" ${p.id === page ? 'aria-current="page"' : ''} class="hover:text-nasa-lightBlue transition-colors flex items-center gap-1 ${p.id === page ? 'text-nasa-lightBlue border-b border-nasa-red' : ''}"><i class="fa-solid ${p.icon} text-xs"></i> ${p.label}</a>`;
  const mob = p => `<a href="${p.href}" class="px-3 py-2 rounded-lg nasa-glass flex items-center gap-2 ${p.id === page ? 'text-nasa-lightBlue border-nasa-red/60' : ''}"><i class="fa-solid ${p.icon} text-xs"></i> ${p.label}</a>`;

  document.body.insertAdjacentHTML('afterbegin', `
  <header class="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-opacity-90 bg-nasa-darkBg backdrop-blur-md border-b border-nasa-blue/30">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <a href="index.html" title="Choose your path" aria-label="Back to start" class="flex items-center space-x-3">${LOGO}</a>
      <nav class="hidden md:flex items-center space-x-6 font-nasa text-sm tracking-wide">${PAGES.map(desk).join('')}</nav>
      <div class="flex items-center space-x-3">
        <div class="nasa-glass px-3 py-1.5 rounded-full flex items-center space-x-2 text-xs font-mono border border-nasa-blue/40">
          <span class="w-2 h-2 rounded-full bg-nasa-red animate-ping"></span>
          <span class="text-gray-300">DISCOVERED:</span>
          <span id="foundCount" class="text-nasa-lightBlue font-bold text-sm">0</span>
          <span class="text-gray-400">/ ${ITEMS.length}</span>
        </div>
        <button id="navToggle" aria-label="Menu" aria-expanded="false" class="md:hidden w-9 h-9 rounded-full nasa-glass flex items-center justify-center"><i class="fa-solid fa-bars"></i></button>
      </div>
    </div>
    <nav id="mobileNav" class="hidden md:hidden max-w-7xl mx-auto mt-3 grid grid-cols-2 gap-2 font-nasa text-sm">${PAGES.map(mob).join('')}</nav>
    <div class="w-full bg-gray-900/60 h-1 mt-2.5 rounded-full overflow-hidden">
      <div id="progressFill" class="bg-gradient-to-r from-nasa-blue via-nasa-lightBlue to-nasa-red h-full w-0 transition-all duration-300"></div>
    </div>
  </header>`);
  document.body.insertAdjacentHTML('beforeend', CHAT);
  paint();

  const toggle = document.getElementById('navToggle'), mobileNav = document.getElementById('mobileNav');
  toggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('hidden') === false;
    toggle.setAttribute('aria-expanded', open);
  });

  const fill = document.getElementById('progressFill');
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    fill.style.width = (max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0) + '%';
  });
})();


/* =========================================================
   cosmo-chat.js  —  COSMO AI + live NASA data for the chat widget
   Paste at the END of js/shared.js (or load it right after shared.js).
   ========================================================= */
(() => {
  /* ---------- 1) COSMO settings ---------- */
  const COSMO = {
    // Your Cloudflare Worker address (it holds the secret key and adds CORS):
    url: 'https://cosmo-proxy.omarelkady-val.workers.dev', // e.g. https://cosmo-proxy.yourname.workers.dev
    key: '', // keep empty: the key lives in the Worker, not in the page
    model: 'cosmo',
    timeoutMs: 50000
  };

  /* ---------- 2) Your NASA data (the 8 hardware items) ----------
     q  = what we search for on NASA's public library (edit freely)
     kw = words that tell us the user is asking about this item     */
  const HARDWARE = [
    { world: 'Moon',       name: 'Lunar Module Descent Stage',  q: 'Apollo lunar module descent stage',        kw: ['lunar module', 'descent stage', 'apollo'] },
    { world: 'Moon',       name: 'Surface Sampler',             q: 'Surveyor 3 surface sampler',               kw: ['surface sampler', 'surveyor'] },
    { world: 'Mars',       name: 'Remote Sampler Arm',          q: 'Viking lander surface sampler arm',        kw: ['sampler arm', 'remote sampler', 'viking'] },
    { world: 'Mars',       name: 'Seismometer',                 q: 'Viking lander seismometer',                kw: ['seismometer', 'seismic', 'marsquake'] },
    { world: 'Mars',       name: 'Damaged Rotor Blade',         q: 'Ingenuity helicopter rotor blade',         kw: ['rotor', 'ingenuity', 'helicopter'] },
    { world: 'Deep Space', name: 'Radioisotope Generator',      q: 'Pioneer radioisotope thermoelectric generator', kw: ['radioisotope', 'rtg', 'generator'] },
    { world: 'Deep Space', name: 'Helium Vector Magnetometer',  q: 'Pioneer helium vector magnetometer',       kw: ['magnetometer', 'magnetic'] },
    { world: 'Deep Space', name: 'Photometer / CCD Camera',     q: 'Kepler photometer CCD',                    kw: ['photometer', 'ccd', 'kepler'] }
  ];

  /* ---------- 3) Live NASA data (no key needed) ---------- */
  const cache = new Map();
  const strip = s => (s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  async function nasaFacts(query) {
    if (cache.has(query)) return cache.get(query);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    try {
      const url = 'https://images-api.nasa.gov/search?media_type=image&page_size=3&q=' + encodeURIComponent(query);
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error('NASA ' + res.status);
      const json = await res.json();
      const facts = (json.collection?.items || []).slice(0, 3).map(it => {
        const d = it.data?.[0] || {};
        return `${strip(d.title)} (${(d.date_created || '').slice(0, 4)}): ${strip(d.description).slice(0, 300)}`;
      });
      cache.set(query, facts);
      return facts;
    } catch (err) {
      console.warn('NASA data unavailable:', err);
      return [];
    } finally {
      clearTimeout(timer);
    }
  }

  /* ---------- 4) Build the prompt (NASA data goes in here) ---------- */
  const history = []; // last few turns, so follow-up questions work

  function buildPrompt(question, item, facts) {
    const list = HARDWARE.map(h => `- ${h.world}: ${h.name}`).join('\n');
    return [
      'You are "NASA Mission AI", the friendly guide of the Space Memory website about hardware NASA left on the Moon, Mars and deep space. Your audience is school students.',
      'Answer in the same language as the question. Use at most 4 short sentences. Use ONLY the data below for facts; if it is not there, say you are not sure and point to the NASA archive. Never invent numbers or dates.',
      '',
      'HARDWARE ON THE SITE:\n' + list,
      item ? `\nUSER IS ASKING ABOUT: ${item.name} (${item.world})` : '',
      facts.length ? '\nLIVE NASA DATA (images-api.nasa.gov):\n' + facts.map((f, i) => `${i + 1}. ${f}`).join('\n') : '',
      history.length ? '\nRECENT CHAT:\n' + history.slice(-6).join('\n') : '',
      '\nQUESTION: ' + question
    ].filter(Boolean).join('\n');
  }

  /* ---------- 5) Call COSMO ---------- */
  async function askCosmo(prompt) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), COSMO.timeoutMs);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (COSMO.key) headers.Authorization = 'Bearer ' + COSMO.key;
      const res = await fetch(COSMO.url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ model: COSMO.model, message: prompt }),
        signal: ctrl.signal
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error?.message || 'COSMO ' + res.status);
      return data.answer || data.choices?.[0]?.message?.content || '';
    } finally {
      clearTimeout(timer);
    }
  }

  /* ---------- 6) Wire it into the existing widget ---------- */
  let busy = false;

  async function answer(question) {
    if (busy) return;
    busy = true;
    appendAIMessage('…', 'bot');
    const bubble = document.getElementById('aiMessages').lastElementChild;
    try {
      if (!/^https?:/.test(COSMO.url)) throw new Error('COSMO.url not set yet');
      const q = question.toLowerCase();
      const item = HARDWARE.find(h => h.kw.some(k => q.includes(k)));
      const facts = await nasaFacts(item ? item.q : question);
      const reply = (await askCosmo(buildPrompt(question, item, facts))).trim();
      if (!reply) throw new Error('empty reply');
      bubble.textContent = reply;
      history.push('User: ' + question, 'AI: ' + reply.slice(0, 200));
    } catch (err) {
      console.warn('COSMO failed, using offline answer:', err);
      bubble.textContent = getAIReply(question); // old keyword reply as a safety net
    } finally {
      busy = false;
      const box = document.getElementById('aiMessages');
      box.scrollTop = box.scrollHeight;
    }
  }

  window.handleAISubmit = function (e) {
    e.preventDefault();
    const input = document.getElementById('aiInput');
    const text = input.value.trim();
    if (!text || busy) return;
    appendAIMessage(text, 'user');
    input.value = '';
    answer(text);
  };

  window.sendQuickQ = function (text) {
    if (busy) return;
    appendAIMessage(text, 'user');
    answer(text);
  };
})();
