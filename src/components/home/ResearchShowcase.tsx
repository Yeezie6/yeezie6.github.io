'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PublicationCard from '@/components/publications/PublicationCard';
import type { Publication } from '@/types/publication';

export default function ResearchShowcase({ publications }: { publications: Publication[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
    const element = rail.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const left = element.getBoundingClientRect().left;
      const children = Array.from(element.children);
      let nearest = 0;
      children.forEach((slide, index) => {
        if (Math.abs(slide.getBoundingClientRect().left - left) < Math.abs(children[nearest].getBoundingClientRect().left - left)) nearest = index;
      });
      setActive(nearest);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    element.addEventListener('scroll', schedule, { passive: true });
    const resize = new ResizeObserver(schedule); resize.observe(element);
    return () => { element.removeEventListener('scroll', schedule); resize.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  function goTo(index: number) {
    const element = rail.current;
    const target = element?.children[index];
    if (!element || !target) return;
    const left = element.scrollLeft + target.getBoundingClientRect().left - element.getBoundingClientRect().left;
    element.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  return <div className="research-showcase" role="region" aria-roledescription="carousel" aria-label="Selected research">
    <div className="research-rail" ref={rail} tabIndex={0} aria-label="Research cards. Use left and right arrow keys to browse." onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(Math.min(active + 1, publications.length - 1)); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(Math.max(active - 1, 0)); }
      if (event.key === 'Home') { event.preventDefault(); goTo(0); }
      if (event.key === 'End') { event.preventDefault(); goTo(publications.length - 1); }
    }}>
      {publications.map((publication, index) => <div className="research-slide" key={publication.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${publications.length}: ${publication.title.split(':')[0]}`}><PublicationCard publication={publication} index={index} /></div>)}
    </div>
    {ready && <div className="showcase-controls">
      <div className="showcase-picker" role="group" aria-label="Choose a publication">{publications.map((publication, index) => <button key={publication.id} type="button" onClick={() => goTo(index)} aria-pressed={active === index} aria-label={`Show ${publication.title.split(':')[0]}`}><span className="picker-number">{String(index + 1).padStart(2, '0')}</span><span>{publication.title.split(':')[0]}</span></button>)}</div>
      <div className="showcase-arrows"><button type="button" className="icon-button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous publication"><ArrowLeft size={19} /></button><button type="button" className="icon-button" onClick={() => goTo(active + 1)} disabled={active === publications.length - 1} aria-label="Next publication"><ArrowRight size={19} /></button></div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">Publication {active + 1} of {publications.length}: {publications[active]?.title.split(':')[0]}</p>
    </div>}
    <p className="showcase-hint">Swipe or use the arrows to explore. Select a figure for a closer look.</p>
  </div>;
}
