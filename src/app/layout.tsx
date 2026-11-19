import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { getConfig } from '@/lib/config';
export function generateMetadata(): Metadata {
  const config = getConfig();
  return {
    metadataBase: new URL('https://yeezie6.github.io'),
    title: { default: `${config.site.title} — Robotics & Learning`, template: `%s | ${config.site.title}` },
    description: config.site.description,
    authors: [{ name: config.author.name }], icons: { icon: config.site.favicon },
    openGraph: { type: 'website', locale: 'en_US', title: config.site.title, description: config.site.description, siteName: config.site.title },
  };
}
const themeScript = `try{var p=JSON.parse(localStorage.getItem('theme-storage')||'null');var t=p?.state?.theme||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.add(d?'dark':'light')}catch{}`;
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const config = getConfig();
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><ThemeProvider>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation items={config.navigation} siteTitle={config.site.title} />
    <main id="main" tabIndex={-1}>{children}</main><Footer lastUpdated={config.site.last_updated} />
  </ThemeProvider></body></html>;
}
