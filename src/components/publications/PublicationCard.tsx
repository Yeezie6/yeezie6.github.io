'use client';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import type { Publication } from '@/types/publication';
export default function PublicationCard({ publication: pub, index = 0, headingLevel = 3 }: { publication: Publication; index?: number; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const paper = pub.url || pub.pdfUrl || (pub.arxivId ? `https://arxiv.org/abs/${pub.arxivId}` : undefined);
  const venue = pub.conference || (pub.journal?.toLowerCase().includes('arxiv') ? `arXiv · ${pub.year}` : pub.journal) || String(pub.year);
  const shortTitle = pub.title.includes(':') ? pub.title.split(':')[0] : pub.title;
  const subtitle = pub.title.includes(':') ? pub.title.slice(pub.title.indexOf(':') + 1).trim() : '';
  async function copyCitation() {
    try { await navigator.clipboard.writeText(pub.bibtex || ''); setCopyState('copied'); }
    catch { setCopyState('failed'); }
  }
  return <article className="publication-card">
    <div className="publication-visual"><span className="work-number">{String(index + 1).padStart(2, '0')} / RESEARCH</span>
      {pub.preview && <Image src={`/papers/${pub.preview}`} alt={`${shortTitle} research overview`} width={1000} height={600} className="paper-image" sizes="(max-width: 760px) 90vw, 44vw" />}
      <span className="visual-caption">{shortTitle}<span>{pub.year}</span></span>
    </div>
    <div className="publication-body">
      <div className="publication-meta"><span>{venue}</span>{pub.awards?.map(award => <span className="award-badge" key={award}>{award}</span>)}</div>
      <Heading>{paper ? <a href={paper} target="_blank" rel="noopener noreferrer">{shortTitle}<ArrowUpRight size={22} /></a> : shortTitle}</Heading>
      {subtitle && <p className="paper-subtitle">{subtitle}</p>}
      <p className="authors">{pub.authors.map((author, i) => <span key={`${author.name}-${i}`}>{i > 0 && ', '}<span className={author.isHighlighted ? 'author-highlight' : undefined}>{author.name}</span>{author.isCoAuthor && <sup>*</sup>}{author.isCorresponding && <sup>†</sup>}</span>)}</p>
      {pub.description && <p className="paper-description">{pub.description}</p>}
      <div className="paper-links">{[[paper, 'Paper'], [pub.code, 'Code'], [pub.website, 'Project'], [pub.doi ? `https://doi.org/${pub.doi}` : undefined, 'DOI']].map(([href, label]) => href && <a className="text-link" href={href} key={label} target="_blank" rel="noopener noreferrer">{label} <ArrowUpRight size={15} /></a>)}</div>
      {pub.abstract && <details className="paper-details"><summary>Abstract</summary><p>{pub.abstract}</p></details>}
      {pub.bibtex && <details className="paper-details" onToggle={() => setCopyState('idle')}><summary>Cite this work</summary><div className="citation"><button className="copy-button" onClick={copyCitation} type="button">{copyState === 'copied' ? <Check size={15} /> : <Copy size={15} />}{copyState === 'copied' ? 'Copied' : 'Copy BibTeX'}</button><p className="copy-status" role="status">{copyState === 'failed' ? 'Copy unavailable. Select and copy the citation below.' : ''}</p><pre tabIndex={0} aria-label={`${shortTitle} BibTeX citation`}>{pub.bibtex}</pre></div></details>}
    </div>
  </article>;
}
