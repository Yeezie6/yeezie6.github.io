'use client';

import { useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

/** The head script arms motion before paint; without it, all content stays visible. */
export default function PageMotion() {
  const path = usePathname();
  const progress = useRef<HTMLDivElement>(null);
  const backToTop = useRef<HTMLAnchorElement>(null);
  useLayoutEffect(() => {
    const root = document.documentElement;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const elements = new Set<HTMLElement>();
    let observer: IntersectionObserver | undefined;
    let mutations: MutationObserver | undefined;
    let firstFrame = 0;
    let secondFrame = 0;
    const reveal = (element: HTMLElement, immediate = false) => {
      if (immediate) element.dataset.revealImmediate = '';
      element.dataset.revealed = '';
      observer?.unobserve(element);
    };
    const settle = () => {
      elements.forEach(element => reveal(element, true));
      delete root.dataset.motion;
    };
    // Do not hide an already-visible page if the pre-paint bootstrap timed out.
    if (root.dataset.motion && !preference.matches && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
      const collect = () => {
        document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
          if (elements.has(element)) return;
          elements.add(element);
          if (element.hasAttribute('data-revealed')) return;
          if (element.getBoundingClientRect().bottom <= 0 || element.contains(document.activeElement)) reveal(element, true);
          else observer?.observe(element);
        });
      };
      root.dataset.motion = 'ready';
      // Commit the hidden style for a frame before observing even on a cached reload.
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          collect();
          mutations = new MutationObserver(collect);
          mutations.observe(document.getElementById('main')!, { childList: true, subtree: true });
        });
      });
    }
    const onFocus = (event: FocusEvent) => {
      // Reveal only the focused branch; navigation focus must not cancel the intro.
      let element = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-reveal]') : null;
      while (element) { reveal(element, true); element = element.parentElement?.closest<HTMLElement>('[data-reveal]') || null; }
    };
    const preferenceChanged = () => { if (preference.matches) settle(); };
    const onPageShow = (event: PageTransitionEvent) => { if (event.persisted) settle(); };
    preference.addEventListener('change', preferenceChanged);
    document.addEventListener('focusin', onFocus);
    addEventListener('pageshow', onPageShow);

    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = root.scrollHeight - innerHeight;
      const value = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${value})`;
      if (backToTop.current) backToTop.current.hidden = scrollY < innerHeight * .85;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    update();
    return () => {
      observer?.disconnect(); mutations?.disconnect(); resize.disconnect();
      cancelAnimationFrame(firstFrame); cancelAnimationFrame(secondFrame); cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule); removeEventListener('resize', schedule);
      removeEventListener('pageshow', onPageShow);
      document.removeEventListener('focusin', onFocus);
      preference.removeEventListener('change', preferenceChanged);
    };
  }, [path]);
  return <>
    <div className="reading-progress" aria-hidden="true"><div ref={progress} /></div>
    <a ref={backToTop} className="back-to-top icon-button" href="#main" aria-label="Back to top" hidden><ArrowUp size={19} /></a>
  </>;
}
