import { Publication } from '@/types/publication';

interface PublicationVenueProps {
    publication: Publication;
}

export default function PublicationVenue({ publication }: PublicationVenueProps) {
    const venue = publication.journal || publication.conference || String(publication.year);
    const arxiv = publication.arxivId && !venue.includes(publication.arxivId)
        ? `arXiv:${publication.arxivId}`
        : null;

    return (
        <>
            {venue}
            {publication.awards?.map((award) => (
                <span key={award} className="font-semibold text-accent">
                    {' '}{award}
                </span>
            ))}
            {arxiv && ` · ${arxiv}`}
        </>
    );
}
