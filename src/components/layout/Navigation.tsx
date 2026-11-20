'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import type { SiteConfig } from '@/lib/config';

const chapters = [
  ['main', 'Introduction'], ['about', 'About me'], ['research', 'Selected research'],
  ['experience', 'Experience'], ['news', 'Recent updates'], ['contact', 'Get in touch'],
];

export default function Navigation({ items, siteTitle }: { items: SiteConfig['navigation']; siteTitle: string; enableOnePageMode?: boolean }) {
  const pathname = usePathname().replace(/\/$/, '') || '/';
  const menu = useRef<HTMLDetailsElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [chapter, setChapter] = useState('main');
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(scrollY > 24);
      if (pathname === '/') {
        let current = 'main';
        chapters.forEach(([id]) => {
          const section = document.getElementById(id);
          if (section && section.getBoundingClientRect().top < innerHeight * .36) current = id;
        });
        setChapter(current);
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !menu.current?.contains(event.target)) menu.current?.removeAttribute('open');
    };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    document.addEventListener('pointerdown', dismiss);
    update();
    return () => {
      cancelAnimationFrame(frame); removeEventListener('scroll', schedule); removeEventListener('resize', schedule);
      document.removeEventListener('pointerdown', dismiss);
    };
  }, [pathname]);
  return <header className="site-header" data-scrolled={scrolled}><div className="nav-shell">
    <Link className="wordmark" href="/" aria-label={`${siteTitle}, home`}>YW<span>.</span></Link>
    <nav aria-label="Main navigation">{items.map(item => {
      const href = item.href === '/' ? '/' : `${item.href.replace(/\/$/, '')}/`;
      const active = pathname === (href.replace(/\/$/, '') || '/');
      if (href === '/' && pathname === '/') return <details className="explore-menu" key={item.target} ref={menu} onKeyDown={event => {
        if (event.key === 'Escape') { menu.current?.removeAttribute('open'); menu.current?.querySelector('summary')?.focus(); }
      }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) menu.current?.removeAttribute('open'); }}>
        <summary className="nav-link active">Explore <ChevronDown size={13} /></summary>
        <div className="explore-panel"><p className="eyebrow">On this page</p>{chapters.map(([id, label], index) => <a key={id} href={`#${id}`} aria-current={chapter === id ? 'location' : undefined} onClick={() => menu.current?.removeAttribute('open')}><span className="chapter-number">{String(index + 1).padStart(2, '0')}</span>{label}<ArrowUpRight size={15} /></a>)}</div>
      </details>;
      return <Link key={item.target} href={href} className={active ? 'nav-link active' : 'nav-link'} aria-current={active ? 'page' : undefined}>{item.title}</Link>;
    })}</nav><ThemeToggle />
  </div></header>;
}
