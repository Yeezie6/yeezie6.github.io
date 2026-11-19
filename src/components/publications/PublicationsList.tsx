'use client';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import type { Publication } from '@/types/publication';
import type { PublicationPageConfig } from '@/types/page';
import PublicationCard from './PublicationCard';
export default function PublicationsList({ config, publications, embedded = false }: { config: PublicationPageConfig; publications: Publication[]; embedded?: boolean }) {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const years = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a);
  const filtered = publications.filter(pub => (year === 'all' || String(pub.year) === year) && `${pub.title} ${pub.authors.map(a => a.name).join(' ')} ${pub.conference || ''} ${pub.journal || ''} ${pub.awards?.join(' ') || ''}`.toLowerCase().includes(query.trim().toLowerCase()));
  const Heading = embedded ? 'h2' : 'h1';
  return <section>
    <div className="page-heading"><p className="eyebrow">Ideas into practice</p><Heading>{config.title}<span className="accent">.</span></Heading><p>{config.description}</p></div>
    <div className="publication-tools"><label className="search-field"><Search size={19} /><span className="sr-only">Search publications</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search title, author, or venue…" />{query && <button type="button" className="icon-button" aria-label="Clear search" onClick={() => setQuery('')}><X size={17} /></button>}</label><label className="year-filter"><span className="sr-only">Publication year</span><select value={year} onChange={event => setYear(event.target.value)}><option value="all">All years</option>{years.map(value => <option key={value} value={value}>{value}</option>)}</select></label></div>
    <p className="result-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'publication' : 'publications'}</p>
    <div className="publication-list">{filtered.map((pub, index) => <PublicationCard publication={pub} index={index} headingLevel={embedded ? 3 : 2} key={pub.id} />)}</div>
    {!filtered.length && <div className="empty-state"><h2>No matching publications.</h2><p>Try another title, author, venue, or year.</p><button className="button secondary" onClick={() => { setQuery(''); setYear('all'); }}>Clear filters</button></div>}
  </section>;
}
