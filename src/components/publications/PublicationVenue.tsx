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
                <span
                    key={award}
                    className="ml-1.5 inline-flex items-center rounded-md px-2 py-1 align-middle text-xs font-bold uppercase leading-none tracking-wide text-white bg-red-600 shadow-sm dark:bg-red-500"
                >
                    {award}
                </span>
            ))}
            {arxiv && ` · ${arxiv}`}
        </>
    );
}
