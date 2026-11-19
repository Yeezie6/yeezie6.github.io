import Image from 'next/image';
import type { CardPageConfig } from '@/types/page';
export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
  const Heading = embedded ? 'h3' : 'h2';
  return <div>
    {!embedded && <div className="page-heading"><p className="eyebrow">{config.items.some(item => item.image) ? 'Learning through collaboration' : 'Milestones along the way'}</p><h1>{config.title}<span className="accent">.</span></h1>{config.description && <p>{config.description}</p>}</div>}
    <div className={`experience-grid ${config.items.some(item => item.image) ? '' : 'awards-grid'}`}>{config.items.map((item, index) => <article className="experience-card" key={`${item.title}-${index}`}>
      <div className="experience-top">{item.image ? <div className="company-logo"><Image src={item.image} width={140} height={56} alt={`${item.title} logo`} /></div> : <span className="award-number">{String(index + 1).padStart(2, '0')}</span>}<span className="date-label">{item.date}</span></div>
      <Heading>{item.link ? <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title} ↗</a> : item.title}</Heading>
      {item.subtitle && <p className="experience-role">{item.subtitle}</p>}{item.content && <p className="experience-description">{item.content}</p>}{item.tags && <div className="tag-list">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
    </article>)}</div>
  </div>;
}
