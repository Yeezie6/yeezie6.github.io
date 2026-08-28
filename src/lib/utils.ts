import { type ClassValue, clsx } from "clsx";
import type { Publication } from "@/types/publication";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

export function formatYear(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric'
  }).format(new Date(date));
}

export function formatPublicationVenue(publication: Publication): string {
  const venue = publication.journal || publication.conference || '';

  if (!publication.arxivId || venue.includes(publication.arxivId)) {
    return venue || String(publication.year);
  }

  return [venue, `arXiv:${publication.arxivId}`].filter(Boolean).join(' · ');
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
