// Motor de movimiento de la web: scroll suave, apariciones, efectos ligados al scroll y microinteracciones.
import Lenis from 'lenis';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/* ---------- Scroll suave ---------- */

if (!reduce) {
  const lenis = new Lenis({ lerp: 0.075, anchors: { offset: -72 }, autoRaf: true });
  (window as unknown as { lenis: Lenis }).lenis = lenis;
}

/* ---------- Contadores ---------- */

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  const prefix = el.dataset.prefix ?? '';
  if (reduce || Number.isNaN(target)) {
    el.textContent = prefix + target;
    return;
  }
  const start = performance.now();
  const duration = 1600;
  const tick = (now: number) => {
    const t = clamp01((now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = prefix + Math.round(target * eased);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- Apariciones al entrar en pantalla ---------- */

// Lo que entra a la vez aparece en orden de lectura, uno tras otro; lo que entra solo, al momento.
// Si un elemento ya trae su retardo (--delay en línea, coreografía de la portada), se respeta y
// lo que va detrás en el documento espera a que termine.
// El recorte (clip-path) de .clip-reveal cuenta para IntersectionObserver y nunca "entraría":
// se observa su contenedor y se marca el hijo.
const proxies = new Map<Element, HTMLElement>();

const STEP = 110; // ms entre un elemento y el siguiente
const MAX_STAGGER = 900; // una tanda larga se comprime para no hacer esperar

// Cuánto ocupa cada elemento en la secuencia: un titular, lo que tardan sus palabras
function stepOf(el: HTMLElement) {
  if (el.classList.contains('split')) {
    return Math.min(160 + el.querySelectorAll('.w').length * 40, 480);
  }
  if (el.classList.contains('clip-reveal')) return 180;
  return STEP;
}

const baseOf = (el: HTMLElement) =>
  root.classList.contains('intro') && el.closest('.hero') ? 1600 : 0;

let pending: HTMLElement[] = [];
let slot = 0; // momento (performance.now) en que puede empezar el siguiente
let firstPaint = true; // la coreografía fija (--delay) solo vale al cargar la página

function flush() {
  if (!pending.length) return;
  const batch = pending.sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  );
  pending = [];
  const now = performance.now();
  let cursor = Math.max(0, slot - now);

  // Primera pasada: el orden y el hueco de cada uno
  const plan = batch.map((el) => {
    const own = parseFloat(el.style.getPropertyValue('--delay'));
    const fixed = firstPaint && !Number.isNaN(own);
    const delay = fixed ? own : cursor;
    cursor = Math.max(cursor, delay + stepOf(el));
    return { el, delay, fixed };
  });
  const autoMax = Math.max(0, ...plan.filter((p) => !p.fixed).map((p) => p.delay));
  const scale = autoMax > MAX_STAGGER ? MAX_STAGGER / autoMax : 1;
  slot = now + cursor * scale;
  firstPaint = false;

  for (const p of plan) {
    const { el } = p;
    let delay = p.delay;
    if (!p.fixed) {
      delay = Math.round(delay * scale);
      el.style.setProperty('--delay', '0ms');
      el.style.setProperty('--stagger', `${delay}ms`);
    }
    el.classList.add('is-visible');

    // Las cifras cuentan cuando su bloque ya está a la vista, desde cero
    const counters = el.matches('[data-count]') ? [el] : [...el.querySelectorAll<HTMLElement>('[data-count]')];
    for (const c of counters) {
      if (c.dataset.counted) continue;
      c.dataset.counted = 'true';
      c.classList.add('is-visible');
      if (!reduce) c.textContent = (c.dataset.prefix ?? '') + '0';
      setTimeout(() => countUp(c), baseOf(el) + delay + 300);
    }
  }
}

const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      pending.push(proxies.get(entry.target) ?? (entry.target as HTMLElement));
      io.unobserve(entry.target);
    }
    if (pending.length) requestAnimationFrame(flush);
  },
  { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
);

document
  .querySelectorAll<HTMLElement>('.reveal, .split')
  .forEach((el) => io.observe(el));

// Cifras sueltas, fuera de un bloque que aparece
document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
  if (!el.closest('.reveal')) io.observe(el);
});

document.querySelectorAll<HTMLElement>('.clip-reveal').forEach((el) => {
  const target = el.parentElement ?? el;
  proxies.set(target, el);
  io.observe(target);
});

/* ---------- Efectos ligados al scroll ---------- */

const header = document.querySelector<HTMLElement>('[data-header]');
const scrubs = [...document.querySelectorAll<HTMLElement>('[data-scrub]')];
const parallax = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
const marquees = [...document.querySelectorAll<HTMLElement>('[data-marquee]')];
const expands = [...document.querySelectorAll<HTMLElement>('[data-expand]')];
const rotators = [...document.querySelectorAll<SVGElement>('[data-rotate]')];
const checks = [...document.querySelectorAll<HTMLElement>('[data-check]')];
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('.header__nav a, .menu__nav a')]
  .map((a) => ({ a, id: a.hash.slice(1) }))
  .filter(({ a, id }) => id && a.pathname === location.pathname);
const spySections = [...new Set(navLinks.map(({ id }) => id))]
  .map((id) => document.getElementById(id))
  .filter((el): el is HTMLElement => !!el);
const fills = [...document.querySelectorAll<HTMLElement>('[data-fill]')].map((el) => ({
  el,
  words: [...el.querySelectorAll<HTMLElement>('.fw')],
}));

let lastY = window.scrollY;
let ticking = false;

function update() {
  ticking = false;
  const y = window.scrollY;
  const vh = window.innerHeight;

  // Cabecera: fondo, barra de progreso y ocultar al bajar
  if (header) {
    const max = root.scrollHeight - vh;
    header.style.setProperty('--scroll', String(max > 0 ? y / max : 0));
    header.classList.toggle('is-scrolled', y > 24);
    const goingDown = y > lastY;
    header.classList.toggle('is-hidden', goingDown && y > vh * 0.6);
  }
  lastY = y;

  // Menú: marca la sección que cruza la línea de lectura (40 % de la pantalla); fuera de ellas, ninguna
  if (spySections.length) {
    let current = '';
    for (const sec of spySections) {
      const r = sec.getBoundingClientRect();
      if (r.top < vh * 0.4 && r.bottom > vh * 0.4) current = sec.id;
    }
    for (const { a, id } of navLinks) {
      if (id === current) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    }
  }

  // «¿Te suena?»: cada frase se marca al cruzar el centro de la pantalla, y se desmarca al volver
  for (const el of checks) {
    const r = el.getBoundingClientRect();
    el.classList.toggle('is-on', reduce || r.top + r.height / 2 < vh * 0.6);
  }

  if (reduce) return;

  // --p de 0 (entra por abajo) a 1 (centrado en pantalla)
  for (const el of scrubs) {
    const r = el.getBoundingClientRect();
    const start = vh;
    const end = vh / 2 - r.height / 2;
    el.style.setProperty('--p', clamp01((start - r.top) / (start - end)).toFixed(4));
  }

  // Parallax de las fotos: se mueve la imagen dentro de su marco (--py), no el marco, y nunca
  // más del margen que la foto tiene de sobra (4 % de 6 %), para que no asome un hueco
  for (const el of parallax) {
    const r = el.getBoundingClientRect();
    const factor = Number(el.dataset.parallax) || 0.1;
    const limit = r.height * 0.04;
    const offset = Math.max(-limit, Math.min(limit, (r.top + r.height / 2 - vh / 2) * -factor));
    el.style.setProperty('--py', `${offset.toFixed(1)}px`);
  }

  // Secciones verdes: de tarjeta con márgenes a ancho completo mientras entran
  for (const el of expands) {
    const top = el.getBoundingClientRect().top;
    el.style.setProperty('--e', clamp01((vh - top) / (vh * 0.75)).toFixed(4));
  }

  // Sello de la portada: gira con el scroll, nunca solo
  for (const el of rotators) el.style.setProperty('--rot', `${(y * 0.12).toFixed(1)}deg`);

  // Franjas de fases: avanzan en sentidos opuestos mientras cruzan la pantalla.
  // El desplazamiento siempre es negativo para que nunca asome el borde izquierdo.
  for (const el of marquees) {
    const r = el.getBoundingClientRect();
    const range = (vh + r.height) * 0.6;
    const t = Math.min(vh + r.height, Math.max(0, vh - r.top)) * 0.6;
    const offset = Number(el.dataset.marquee) > 0 ? t - range : -t;
    el.style.setProperty('--sx', `${offset.toFixed(1)}px`);
  }

  // Frases que se "encienden" palabra a palabra
  for (const { el, words } of fills) {
    const r = el.getBoundingClientRect();
    const p = clamp01((vh * 0.85 - r.top) / (r.height + vh * 0.35));
    const lit = p * words.length;
    words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
  }
}

function requestUpdate() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}

window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);
update();

if (reduce) {
  scrubs.forEach((el) => el.style.setProperty('--p', '1'));
  fills.forEach(({ words }) => words.forEach((w) => w.classList.add('is-lit')));
}

/* ---------- Texto que rueda en los botones ---------- */

// Cada etiqueta se duplica: al pasar el ratón sube y entra la copia desde abajo.
function roll(text: string) {
  const wrap = document.createElement('span');
  wrap.className = 'roll';
  const inner = document.createElement('span');
  inner.className = 'roll__in';
  const a = document.createElement('span');
  a.textContent = text;
  const b = document.createElement('span');
  b.textContent = text;
  b.setAttribute('aria-hidden', 'true');
  inner.append(a, b);
  wrap.append(inner);
  return wrap;
}

if (!reduce) {
  document.querySelectorAll<HTMLElement>('.btn').forEach((btn) => {
    for (const node of [...btn.childNodes]) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        node.replaceWith(roll(node.textContent.trim()));
      } else if (node instanceof HTMLSpanElement && !node.querySelector('svg')) {
        const text = node.textContent?.trim() ?? '';
        node.textContent = '';
        node.append(roll(text));
      }
    }
  });
}
