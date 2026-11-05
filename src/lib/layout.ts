import { useEffect, useLayoutEffect, useState } from 'react';

// Pages are built at the Figma artboard widths (1440 desktop, 390 mobile)
// and scaled uniformly with CSS `zoom`, so at 1440 × 900 the site is pixel-identical to Figma.
export const DESKTOP_W = 1440;
export const MOBILE_W = 390;
export const MOBILE_BREAK = 900;

export type Layout = 'desktop' | 'mobile';

// Dev QA: `?layout=mobile` forces the 390 layout at 1:1 scale.
const FORCED = new URLSearchParams(location.search).get('layout') as Layout | null;

function measure() {
  const w = window.innerWidth;
  if (FORCED) return { layout: FORCED, zoom: 1 };
  const layout: Layout = w < MOBILE_BREAK ? 'mobile' : 'desktop';
  // A hidden/zero-size window reports innerWidth 0, which would make zoom 0 and heights NaN.
  const zoom = w > 0 ? w / (layout === 'mobile' ? MOBILE_W : DESKTOP_W) : 1;
  return { layout, zoom };
}

export function getZoom() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom')) || 1;
}

/** Applies --zoom and data-layout on <html>; call once at the app root. */
export function useZoomRoot() {
  useLayoutEffect(() => {
    const apply = () => {
      const { layout, zoom } = measure();
      const root = document.documentElement;
      root.style.setProperty('--zoom', String(zoom));
      // Full-screen artboards (1440×900 / 390×844) shrink to fit windows shorter than the Figma frame.
      const artH = layout === 'mobile' ? 844 : 900;
      root.style.setProperty('--fit', String(Math.min(1, innerHeight / zoom / artH) || 1));
      root.dataset.layout = layout;
      window.dispatchEvent(new CustomEvent('layout', { detail: layout }));
    };
    apply();
    addEventListener('resize', apply);
    return () => removeEventListener('resize', apply);
  }, []);
}

export function useLayout(): Layout {
  const [layout, setLayout] = useState<Layout>(() => measure().layout);
  useEffect(() => {
    const on = () => setLayout(measure().layout);
    addEventListener('resize', on);
    addEventListener('layout', on);
    return () => {
      removeEventListener('resize', on);
      removeEventListener('layout', on);
    };
  }, []);
  return layout;
}

/** Viewport height in design units (px inside the zoomed root). */
export function useViewportH() {
  const [h, setH] = useState(() => window.innerHeight / measure().zoom);
  useEffect(() => {
    const on = () => setH(window.innerHeight / measure().zoom);
    addEventListener('resize', on);
    return () => removeEventListener('resize', on);
  }, []);
  return h;
}
