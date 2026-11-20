import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Github, GraduationCap, Mail } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getConfig } from '@/lib/config';
import { getMarkdownContent, getBibtexContent, getTomlContent } from '@/lib/content';
import { parseBibTeX } from '@/lib/bibtexParser';
import ResearchShowcase from '@/components/home/ResearchShowcase';
import CardPage from '@/components/pages/CardPage';
import { CardPageConfig } from '@/types/page';

export default function Home() {
  const config = getConfig();
  const about = getTomlContent<{ profile: { research_interests: string[] } }>('about.toml');
  const interests = about?.profile?.research_interests || [];
  const publications = parseBibTeX(getBibtexContent('publications.bib')).filter(p => p.selected);
  const experience = getTomlContent<CardPageConfig>('teaching.toml');
  const news = getTomlContent<{ news: { date: string; content: string }[] }>('news.toml');
  return <div className="site-shell">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow" data-reveal data-reveal-delay="1">Robotics · Embodied pretraining · Agentic AI</p>
        <h1 id="hero-title" data-reveal data-reveal-delay="2">{config.author.name}<span className="accent">.</span></h1>
        <p className="hero-statement" data-reveal data-reveal-delay="3">Embodied intelligence.<br /><span>From human and robot data.</span></p>
        <p className="hero-description" data-reveal data-reveal-delay="4">{config.author.title} at {config.author.institution}.{' '}<br />Building data pipelines for embodied pretraining and dexterous manipulation.</p>
        <div className="hero-actions" data-reveal data-reveal-delay="5">
          <a className="button primary" href="#research">Explore my research <ArrowDown size={17} /></a>
          {config.social.email && <a className="button secondary" href={`mailto:${config.social.email}`}>Get in touch <Mail size={17} /></a>}
        </div>
        <div className="social-links" data-reveal data-reveal-delay="6">
          {config.social.google_scholar && <a href={config.social.google_scholar} target="_blank" rel="noopener noreferrer"><GraduationCap size={18} /> Google Scholar <ArrowUpRight size={14} /></a>}
          {config.social.github && <a href={config.social.github} target="_blank" rel="noopener noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={14} /></a>}
        </div>
      </div>
      <aside className="profile-note" aria-label="Research interests" data-reveal="card" data-reveal-delay="3">
        <div className="profile-note-top"><Image src={config.author.avatar} width={80} height={80} priority alt="Yiqing's yellow character avatar" /><span>Curiosity, in motion.</span></div>
        <p className="eyebrow">Research focus</p>
        <ul className="focus-list">
          {interests.map((interest, index) => <li key={interest}><span>{String(index + 1).padStart(2, '0')}</span>{interest}</li>)}
        </ul>
        <p className="profile-note-bottom">Egocentric human videos and robot data.<br />Embodied foundation models and agentic AI.</p>
      </aside>
    </section>
    <section className="about-section section" id="about" aria-labelledby="about-title">
      <div data-reveal><p className="eyebrow">A little background</p><h2 id="about-title">People, robots,<br />and the space between.</h2></div>
      <div className="prose"><ReactMarkdown components={{ p: ({ children }) => <p data-reveal>{children}</p> }}>{getMarkdownContent('bio.md')}</ReactMarkdown></div>
    </section>
    <section className="section research-section" id="research" aria-labelledby="research-title">
      <div className="section-heading" data-reveal><div><p className="eyebrow">Selected work</p><h2 id="research-title">Research in practice.</h2></div><Link className="text-link" href="/publications/">All publications <ArrowUpRight size={18} /></Link></div>
      <ResearchShowcase publications={publications} />
    </section>
    {experience && <section className="section" id="experience" aria-labelledby="experience-title"><div className="section-heading" data-reveal><div><p className="eyebrow">Along the way</p><h2 id="experience-title">Research, together.</h2></div><Link className="text-link" href="/teaching/">Experience <ArrowUpRight size={18} /></Link></div><CardPage config={experience} embedded /></section>}
    {news?.news?.length ? <section className="section news-section" id="news" aria-labelledby="news-title"><div data-reveal><p className="eyebrow">Recent updates</p><h2 id="news-title">What’s new.</h2></div><ol className="news-list">{news.news.map((item, i) => <li data-reveal key={`${item.date}-${i}`}><time dateTime={item.date}>{new Date(`${item.date}-01T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })}</time><p>{item.content}</p></li>)}</ol></section> : null}
    <section className="contact-section" id="contact" aria-labelledby="contact-title" data-reveal="card"><p className="eyebrow">Keep in touch</p><h2 id="contact-title">Good research starts<br />with a conversation.</h2>{config.social.email && <a className="text-link" href={`mailto:${config.social.email}`}>{config.social.email} <ArrowUpRight size={22} /></a>}</section>
  </div>;
}
