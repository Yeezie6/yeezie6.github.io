'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import type { SiteConfig } from '@/lib/config';
export default function Navigation({ items, siteTitle }: { items: SiteConfig['navigation']; siteTitle: string; enableOnePageMode?: boolean }) {
  const pathname = usePathname().replace(/\/$/, '') || '/';
  return <header className="site-header"><div className="nav-shell">
    <Link className="wordmark" href="/" aria-label={`${siteTitle}, home`}>YW<span>.</span></Link>
    <nav aria-label="Main navigation">{items.map(item => {
      const href = item.href === '/' ? '/' : `${item.href.replace(/\/$/, '')}/`;
      const active = pathname === (href.replace(/\/$/, '') || '/');
      return <Link key={item.target} href={href} className={active ? 'nav-link active' : 'nav-link'} aria-current={active ? 'page' : undefined}>{item.title}</Link>;
    })}</nav><ThemeToggle />
  </div></header>;
}
