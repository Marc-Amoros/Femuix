// Motor de movimiento de la web: scroll suave, apariciones, efectos ligados al scroll y microinteracciones.
import Lenis from 'lenis';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
root.dataset.motion = 'ready'; // avisa a Base.astro de que el motor ha arrancado

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/* ---------- Scroll suave ---------- */

if (!reduce) {
  window.lenis = new Lenis({ lerp: 0.075, anchors: { offset: -72 }, autoRaf: true });
}

/* ---------- Contadores ---------- */

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  if (Number.isNaN(target)) return; // sin cifra que contar, el texto se queda como está
  const prefix = el.dataset.prefix ?? '';
  if (reduce) {
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

// Todo aparece en orden de lectura (el del documento: columna de texto antes que la imagen o el
// formulario de al lado), uno tras otro, y cada tanda espera a que termine la anterior.
// - Cuando algo entra, lo que ya está a la vista en su misma sección entra con él: el rótulo, el
//   titular y la entradilla salen juntos y en orden, no a trozos según cruzan la línea.
// - Un bloque compacto marcado con data-reveal-unit (una tarjeta del método, el cierre del pie) se
//   presenta entero y de arriba abajo, aunque su parte de abajo aún no se vea.
// - Al llegar al final de la página aparece lo que queda pendiente (ya no puede cruzar la línea).
// - Durante un desplazamiento rápido (un salto con el menú) se espera a que la página se pare: lo
//   que se ha quedado fuera de pantalla aparece al momento y no hace esperar a lo que sí se ve.
// - Si un elemento trae su retardo (--delay en línea, coreografía de la portada), se respeta al
//   cargar la página y lo que va detrás en el documento espera a que termine.
// El recorte (clip-path) de .clip-reveal cuenta para IntersectionObserver y nunca "entraría":
// se observa su contenedor y se marca el hijo.
// - Un contenedor con data-stagger-scope recibe también el --stagger de lo que entra dentro, para
//   que sus otras piezas (el paspartú y la firma del retrato) vayan a su compás.
const waiting = new Map<Element, HTMLElement>(); // lo observado → lo que aparece

const STEP = 110; // ms entre un elemento y el siguiente
const MAX_STAGGER = 900; // una tanda larga se comprime para no hacer esperar
const DURATION = 1300; // lo que dura una entrada (.reveal, --t-enter 1,1 s) con margen

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

const scopeOf = (el: Element) => el.closest('section, footer') ?? document.body;
const unitOf = (el: Element) => el.closest('[data-reveal-unit]');
const inUnit = new Set<HTMLElement>(); // entran con su bloque aunque estén por debajo de la pantalla

let pending: HTMLElement[] = [];
let slot = 0; // momento (performance.now) en que puede empezar el siguiente
let firstPaint = true; // la coreografía fija (--delay) solo vale al cargar la página
let scheduled = false;

// Solo cuenta el desplazamiento suave (rueda, saltos del menú). En el móvil el dedo mueve la página
// de forma nativa y lo que entra aparece en cuanto entra, también durante el gesto.
const FAST = 24; // px por fotograma: por encima, la página «vuela» y aún no se lee
const speed = () => {
  const { lenis } = window;
  return lenis?.isScrolling === 'smooth' ? Math.abs(lenis.velocity) : 0;
};

function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    flush();
  });
}

function take(target: Element) {
  const el = waiting.get(target);
  if (!el) return;
  waiting.delete(target);
  io.unobserve(target);
  pending.push(el);
}

function setStagger(el: HTMLElement, ms: number) {
  el.style.setProperty('--stagger', `${ms}ms`);
  el.parentElement?.closest<HTMLElement>('[data-stagger-scope]')?.style.setProperty('--stagger', `${ms}ms`);
}

function show(el: HTMLElement, delay: number) {
  el.classList.add('is-visible');
  // Al terminar la entrada vuelven las transiciones propias del componente (hover, abrir…)
  setTimeout(() => el.classList.add('is-done'), baseOf(el) + delay + DURATION);

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

function flush() {
  if (!pending.length) return;
  if (speed() > FAST) {
    schedule();
    return;
  }
  const batch = pending.sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  );
  pending = [];
  const now = performance.now();
  const start = Math.max(0, slot - now); // espera a que termine la tanda anterior
  let cursor = start;

  // Primera pasada: el orden y el hueco de cada uno
  const plan: { el: HTMLElement; delay: number; fixed: boolean }[] = [];
  const vh = window.innerHeight;
  for (const el of batch) {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || (r.top > vh && !inUnit.has(el))) {
      el.style.setProperty('--delay', '0ms');
      setStagger(el, 0);
      show(el, 0);
      continue;
    }
    const own = parseFloat(el.style.getPropertyValue('--delay'));
    const fixed = firstPaint && !Number.isNaN(own);
    const delay = fixed ? own : cursor;
    cursor = Math.max(cursor, delay + stepOf(el));
    plan.push({ el, delay, fixed });
  }
  // Una tanda larga se comprime, pero solo su propio reparto: la espera heredada se mantiene
  // para que nada empiece antes que lo último de la tanda anterior
  const spread = Math.max(0, ...plan.filter((p) => !p.fixed).map((p) => p.delay - start));
  const scale = spread > MAX_STAGGER ? MAX_STAGGER / spread : 1;
  const squeeze = (d: number) => start + (d - start) * scale;
  if (plan.length) slot = now + squeeze(cursor);
  firstPaint = false;

  for (const p of plan) {
    let delay = p.delay;
    if (!p.fixed) {
      delay = Math.round(squeeze(delay));
      p.el.style.setProperty('--delay', '0ms');
      setStagger(p.el, delay);
    }
    show(p.el, delay);
  }
}

const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) take(entry.target);
    }
    if (!pending.length) return;

    // Lo que ya se ve en la misma sección entra en la misma tanda
    const scopes = new Set(pending.map(scopeOf));
    const vh = window.innerHeight;
    for (const target of [...waiting.keys()]) {
      if (!scopes.has(scopeOf(target))) continue;
      const r = target.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) take(target);
    }

    // Y todo lo de su mismo bloque compacto, en orden
    const units = new Set(pending.map(unitOf).filter(Boolean));
    for (const target of [...waiting.keys()]) {
      const unit = unitOf(target);
      if (!unit || !units.has(unit)) continue;
      const el = waiting.get(target);
      if (el) inUnit.add(el);
      take(target);
    }
    schedule();
  },
  { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
);

function watch(target: Element, el = target as HTMLElement) {
  waiting.set(target, el);
  io.observe(target);
}

document.querySelectorAll<HTMLElement>('.reveal, .split').forEach((el) => watch(el));

// Cifras sueltas, fuera de un bloque que aparece
document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
  if (!el.closest('.reveal')) watch(el);
});

document.querySelectorAll<HTMLElement>('.clip-reveal').forEach((el) => {
  watch(el.parentElement ?? el, el);
});

// Al final de la página lo último ya no puede cruzar la línea de entrada: aparece lo que se vea
function revealRest() {
  if (!waiting.size) return;
  const vh = window.innerHeight;
  for (const target of [...waiting.keys()]) {
    const r = target.getBoundingClientRect();
    if (r.top < vh && r.bottom > 0) take(target);
  }
  if (pending.length) schedule();
}

/* ---------- Efectos ligados al scroll ---------- */

const header = document.querySelector<HTMLElement>('[data-header]');
const scrubs = [...document.querySelectorAll<HTMLElement>('[data-scrub]')];
const parallax = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
const marquees = [...document.querySelectorAll<HTMLElement>('[data-marquee]')];
const expands = [...document.querySelectorAll<HTMLElement>('[data-expand]')];
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

let ticking = false;

function update() {
  ticking = false;
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = root.scrollHeight - vh;

  // Primero se lee todo el layout y se apunta qué cambiar; después se escribe de golpe. Intercalar
  // lecturas (getBoundingClientRect) y escrituras (setProperty, classList) obligaría al navegador a
  // recalcular la página en cada elemento, en cada fotograma del scroll.
  const writes: (() => void)[] = [];

  // Cabecera: siempre fija y visible; solo cambian el fondo y la barra de progreso
  if (header) {
    const progress = String(max > 0 ? y / max : 0);
    writes.push(() => {
      header.style.setProperty('--scroll', progress);
      header.classList.toggle('is-scrolled', y > 24);
    });
  }

  if (y + vh >= root.scrollHeight - 4) revealRest();
  writes.push(() => root.classList.toggle('is-end', y > max / 2));

  // Menú: marca la sección que cruza la línea de lectura (40 % de la pantalla); fuera de ellas, ninguna
  if (spySections.length) {
    let current = '';
    for (const sec of spySections) {
      const r = sec.getBoundingClientRect();
      if (r.top < vh * 0.4 && r.bottom > vh * 0.4) current = sec.id;
    }
    writes.push(() => {
      for (const { a, id } of navLinks) {
        if (id === current) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      }
    });
  }

  // «¿Te suena?»: cada frase se marca al cruzar el centro de la pantalla, y se desmarca al volver
  for (const el of checks) {
    const r = el.getBoundingClientRect();
    const on = reduce || r.top + r.height / 2 < vh * 0.6;
    writes.push(() => el.classList.toggle('is-on', on));
  }

  if (!reduce) {
    // --p de 0 (entra por abajo) a 1 (centrado en pantalla)
    for (const el of scrubs) {
      const r = el.getBoundingClientRect();
      const start = vh;
      const end = vh / 2 - r.height / 2;
      const p = clamp01((start - r.top) / (start - end)).toFixed(4);
      writes.push(() => el.style.setProperty('--p', p));
    }

    // Parallax de las fotos: se mueve la imagen dentro de su marco (--py), no el marco, y nunca
    // más del margen que la foto tiene de sobra (4 % de 6 %), para que no asome un hueco
    for (const el of parallax) {
      const r = el.getBoundingClientRect();
      const factor = Number(el.dataset.parallax) || 0.1;
      const limit = r.height * 0.04;
      const offset = Math.max(-limit, Math.min(limit, (r.top + r.height / 2 - vh / 2) * -factor));
      writes.push(() => el.style.setProperty('--py', `${offset.toFixed(1)}px`));
    }

    // Secciones verdes: de tarjeta con márgenes a ancho completo mientras entran
    for (const el of expands) {
      const e = clamp01((vh - el.getBoundingClientRect().top) / (vh * 0.75)).toFixed(4);
      writes.push(() => el.style.setProperty('--e', e));
    }

    // Franjas de fases: avanzan en sentidos opuestos mientras cruzan la pantalla.
    // El desplazamiento siempre es negativo para que nunca asome el borde izquierdo.
    for (const el of marquees) {
      const r = el.getBoundingClientRect();
      const range = (vh + r.height) * 0.6;
      const t = Math.min(vh + r.height, Math.max(0, vh - r.top)) * 0.6;
      const offset = Number(el.dataset.marquee) > 0 ? t - range : -t;
      writes.push(() => el.style.setProperty('--sx', `${offset.toFixed(1)}px`));
    }

    // Frases que se "encienden" palabra a palabra
    for (const { el, words } of fills) {
      const r = el.getBoundingClientRect();
      const lit = clamp01((vh * 0.85 - r.top) / (r.height + vh * 0.35)) * words.length;
      writes.push(() => words.forEach((w, i) => w.classList.toggle('is-lit', i < lit)));
    }
  }

  for (const write of writes) write();
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

/* ---------- Toques en pantallas táctiles ---------- */

// Sin ratón no hay hover: al tocar un botón o un enlace, hace durante un instante la misma
// animación que al pasar el ratón (relleno, texto que rueda, flecha que avanza).
if (!reduce) {
  const TAPPABLE = '.btn, .more-link, .reto__alt-link, .ask__mail, .faq__item summary, .vpanel__alt summary';
  let pointer = 'mouse';
  document.addEventListener('pointerdown', (e) => (pointer = e.pointerType), { passive: true });
  document.addEventListener('click', (e) => {
    if (pointer !== 'touch') return;
    const el = (e.target as Element | null)?.closest<HTMLElement>(TAPPABLE);
    if (!el) return;
    el.classList.add('is-tapped');
    setTimeout(() => el.classList.remove('is-tapped'), 650);
  });
}
