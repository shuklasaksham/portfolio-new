// Scroll and focus on navigation:
// - a new page (link click) opens at the top, with focus on its h1;
// - Back/Forward restores where that history entry was scrolled to;
// - a #section link lands on the section, even after a direct open or refresh
//   (the html scroll-padding keeps the heading clear of the sticky header).

import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const INSTANT = { behavior: 'instant' as ScrollBehavior };
const storeKey = (key: string, path: string) => `scroll:${key}:${path}`;

let current = '';
// While a navigation is in flight the old page can be clamped by the new, shorter one;
// those scroll events must not overwrite the old entry's saved position.
let frozen = false;
// On the first render of a page load (direct open or refresh) a #section in the URL wins
// over any remembered position; afterwards Back/Forward restores positions.
let firstLoad = true;

function save() {
  if (frozen || !current) return;
  try {
    sessionStorage.setItem(current, String(Math.round(scrollY)));
  } catch {
    /* storage unavailable: Back simply opens at the top */
  }
}

function read(k: string): number | null {
  try {
    const v = sessionStorage.getItem(k);
    return v === null ? null : Number(v);
  } catch {
    return null;
  }
}

/** Run `go` once `ready()` holds, or after 3 s, so lazily loaded pages can render first.
 *  Uses timers, not requestAnimationFrame, so it also works in tabs opened in the background. */
function when(ready: () => boolean, go: () => void) {
  const end = performance.now() + 3000;
  let t = 0;
  const tick = () => {
    if (ready() || performance.now() > end) go();
    else t = window.setTimeout(tick, 30);
  };
  tick();
  return () => clearTimeout(t);
}

function focusEl(el: HTMLElement | null) {
  if (!el) return;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

/** Smooth in-page jump used by "See the work" and "On this page" links. */
export function jumpTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
  history.replaceState(history.state, '', `#${id}`);
  focusEl(el.querySelector<HTMLElement>('h2') ?? el);
}

export function useRouteScroll() {
  const { key, pathname, hash } = useLocation();
  const type = useNavigationType();

  useEffect(() => {
    history.scrollRestoration = 'manual';
    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; save(); });
    };
    const freeze = () => { save(); frozen = true; };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href]');
      const href = a?.getAttribute('href') ?? '';
      if (href.startsWith('/') && !a!.hasAttribute('download') && a!.getAttribute('target') !== '_blank') freeze();
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('popstate', freeze);
    document.addEventListener('click', onClick, true);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('popstate', freeze);
      document.removeEventListener('click', onClick, true);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    current = storeKey(key, pathname);
    const done = () => { frozen = false; firstLoad = false; save(); };
    const id = decodeURIComponent(hash.slice(1));
    const saved = type === 'POP' && !(firstLoad && id) ? read(current) : null;

    if (saved !== null) {
      return when(
        () => document.documentElement.scrollHeight - innerHeight >= saved,
        () => { scrollTo({ top: saved, ...INSTANT }); done(); },
      );
    }
    if (id) {
      return when(
        () => !!document.getElementById(id),
        () => { document.getElementById(id)?.scrollIntoView(INSTANT); done(); },
      );
    }
    scrollTo({ top: 0, ...INSTANT });
    if (type === 'POP') { done(); return; }
    return when(
      () => !!document.querySelector('main h1'),
      () => { focusEl(document.querySelector<HTMLElement>('main h1')); done(); },
    );
  }, [key, pathname, hash, type]);
}
