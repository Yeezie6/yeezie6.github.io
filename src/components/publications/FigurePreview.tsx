'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { Maximize2, X } from 'lucide-react';

export default function FigurePreview({ src, title }: { src: string; title: string }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = previousOverflow; };
  }, [open]);
  return <>
    <button className="figure-trigger" type="button" onClick={() => setOpen(true)} aria-label={`Enlarge ${title} research figure`} aria-haspopup="dialog">
      <Image src={src} alt={`${title} research overview`} width={1000} height={600} className="paper-image" sizes="(max-width: 760px) 90vw, 44vw" />
      <span className="figure-zoom"><Maximize2 size={15} /> Explore figure</span>
    </button>
    <dialog ref={dialog} className="figure-dialog" aria-labelledby={headingId} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="figure-dialog-content"><header><div><p className="eyebrow">A closer look</p><h2 id={headingId}>{title}</h2></div><button type="button" className="icon-button" aria-label="Close research figure" onClick={() => setOpen(false)} autoFocus><X size={22} /></button></header>
        {open && <Image src={src} alt={`${title} full research figure`} width={1600} height={1000} className="expanded-figure" sizes="95vw" />}
        <p className="figure-dialog-caption">Research overview · {title}<span>Esc to close</span></p>
      </div>
    </dialog>
  </>;
}
