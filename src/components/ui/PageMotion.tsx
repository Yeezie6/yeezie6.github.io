'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/** Progressive motion: the server-rendered page is always visible without JavaScript. */
export default function PageMotion() {
  const path = usePathname();
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    const seen = new WeakSet<Element>();
    const reveal = (element: Element, delay = 0) => {
      if (preference.matches || seen.has(element)) return;
      seen.add(element);
      const animation = element.animate([
        { opacity: 0, transform: 'translateY(16px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 580, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { reveal(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: .12 });
    document.querySelectorAll('.section-heading, .about-section > div, .news-section > div, .news-list li, .experience-card, .contact-section, .page-heading').forEach(element => observer.observe(element));
    document.querySelectorAll('.hero-copy > *, .profile-note').forEach((element, index) => reveal(element, Math.min(index, 5) * 65));
    // Never leave a focused control moving, and cancel immediately if the OS preference changes.
    const settle = () => { animations.forEach(animation => animation.cancel()); animations.clear(); };
    const preferenceChanged = () => { if (preference.matches) settle(); };
    preference.addEventListener('change', preferenceChanged);
    document.addEventListener('focusin', settle);
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - innerHeight;
      const value = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${value})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    update();
    return () => {
      observer.disconnect(); resize.disconnect(); settle(); cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule); removeEventListener('resize', schedule);
      document.removeEventListener('focusin', settle);
      preference.removeEventListener('change', preferenceChanged);
    };
  }, [path]);
  return <div className="reading-progress" aria-hidden="true"><div ref={progress} /></div>;
}
