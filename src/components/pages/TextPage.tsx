import ReactMarkdown from 'react-markdown';
import type { TextPageConfig } from '@/types/page';
export default function TextPage({ config, content, embedded = false }: { config: TextPageConfig; content: string; embedded?: boolean }) {
  const Heading = embedded ? 'h2' : 'h1';
  return <section><div className="page-heading"><Heading>{config.title}<span className="accent">.</span></Heading>{config.description && <p>{config.description}</p>}</div><div className="prose"><ReactMarkdown>{content}</ReactMarkdown></div></section>;
}
