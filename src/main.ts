import './styles/main.scss';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------------- Header: solid background after scrolling ---------------- */
function initHeader(): void {
  const header = document.querySelector<HTMLElement>('.header');
  if (!header) return;

  const update = (): void => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ---------------- Mobile menu ---------------- */
function initMenu(): void {
  const header = document.querySelector<HTMLElement>('.header');
  const burger = document.querySelector<HTMLButtonElement>('.burger');
  const nav = document.querySelector<HTMLElement>('#site-nav');
  if (!header || !burger || !nav) return;

  const setOpen = (open: boolean): void => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('is-locked', open);
  };

  burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      burger.focus();
    }
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

/* ---------------- Search: jump to the catalogue ---------------- */
function initSearch(): void {
  const form = document.querySelector<HTMLFormElement>('.search');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('products')?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  });
}

/* ---------------- Hero colour swatches (radio group) ---------------- */
function initSwatches(): void {
  const group = document.querySelector<HTMLElement>('.swatches');
  if (!group) return;
  const swatches = Array.from(group.querySelectorAll<HTMLButtonElement>('.swatch'));

  const select = (index: number, focus = false): void => {
    swatches.forEach((s, i) => {
      const active = i === index;
      s.classList.toggle('is-active', active);
      s.setAttribute('aria-checked', String(active));
      s.tabIndex = active ? 0 : -1;
    });
    if (focus) swatches[index].focus();
  };

  swatches.forEach((s, i) => {
    s.addEventListener('click', () => select(i));
    s.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') select((i + 1) % swatches.length, true);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') select((i - 1 + swatches.length) % swatches.length, true);
    });
  });
  select(0);
}

/* ---------------- Category tabs (WAI-ARIA tabs pattern) ---------------- */
function initTabs(onChange: () => void): void {
  const list = document.querySelector<HTMLElement>('[role="tablist"]');
  if (!list) return;
  const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]'));

  const activate = (tab: HTMLButtonElement, focus = false): void => {
    for (const t of tabs) {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls') ?? '');
      if (panel) panel.hidden = !selected;
    }
    if (focus) tab.focus();
    onChange();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', (e) => {
      const keys: Record<string, number> = {
        ArrowRight: (i + 1) % tabs.length,
        ArrowLeft: (i - 1 + tabs.length) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      };
      if (e.key in keys) {
        e.preventDefault();
        activate(tabs[keys[e.key]], true);
      }
    });
  });
}

/* ---------------- Carousels (scroll-snap + arrow buttons) ---------------- */
function initCarousels(): () => void {
  const updaters: Array<() => void> = [];

  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((carousel) => {
    const prev = carousel.querySelector<HTMLButtonElement>('[data-prev]');
    const next = carousel.querySelector<HTMLButtonElement>('[data-next]');

    const visibleTrack = (): HTMLElement | null =>
      Array.from(carousel.querySelectorAll<HTMLElement>('[data-track]')).find((t) => t.offsetParent !== null) ?? null;

    const update = (): void => {
      const track = visibleTrack();
      const max = track ? track.scrollWidth - track.clientWidth : 0;
      carousel.classList.toggle('is-static', max <= 2);
      if (prev) prev.disabled = !track || track.scrollLeft <= 2;
      if (next) next.disabled = !track || track.scrollLeft >= max - 2;
    };

    const step = (dir: 1 | -1): void => {
      const track = visibleTrack();
      const item = track?.firstElementChild as HTMLElement | null;
      if (!track || !item) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.scrollBy({ left: dir * (item.offsetWidth + gap), behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    };

    prev?.addEventListener('click', () => step(-1));
    next?.addEventListener('click', () => step(1));
    carousel.querySelectorAll('[data-track]').forEach((t) => t.addEventListener('scroll', update, { passive: true }));
    new ResizeObserver(update).observe(carousel);
    updaters.push(update);
    update();
  });

  return () => updaters.forEach((fn) => fn());
}

/* ---------------- Cart counter ---------------- */
function initCart(): void {
  const cart = document.querySelector<HTMLAnchorElement>('.cart');
  const count = cart?.querySelector<HTMLElement>('.cart__count');
  const status = document.getElementById('cart-status');
  if (!cart || !count) return;
  let items = 0;

  document.querySelectorAll<HTMLButtonElement>('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      items += 1;
      count.textContent = String(items);
      cart.setAttribute('aria-label', `Cart, ${items} ${items === 1 ? 'item' : 'items'}`);
      const name = btn.closest('.product')?.querySelector('.product__name')?.textContent ?? 'Item';
      if (status) status.textContent = `${name} added to cart`;

      cart.classList.remove('is-bumped');
      void cart.offsetWidth; // restart the animation
      cart.classList.add('is-bumped');

      btn.classList.add('is-added');
      window.setTimeout(() => btn.classList.remove('is-added'), 600);
    });
  });
}

/* ---------------- Reveal on scroll ---------------- */
function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal');

  // stagger siblings inside the same section
  document.querySelectorAll('section').forEach((section) => {
    section.querySelectorAll<HTMLElement>('.reveal').forEach((el, i) => el.style.setProperty('--i', String(i % 5)));
  });

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  items.forEach((el) => observer.observe(el));
}

initHeader();
initMenu();
initSearch();
initSwatches();
const refreshCarousels = initCarousels();
initTabs(refreshCarousels);
initCart();
initReveal();
