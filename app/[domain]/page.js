import { notFound } from 'next/navigation';
import { getDomainBySlug, getAllSlugs } from '@/lib/domains';
import DomainSalePage from '@/components/DomainSalePage';

// Pre-render every known slug at build time
export function generateStaticParams() {
  return getAllSlugs();
}

// Unknown slugs render on-demand (set false to force 404 for unknowns)
export const dynamicParams = true;

export function generateMetadata({ params }) {
  const domain = getDomainBySlug(params.domain);
  if (!domain) return { title: 'Domain not found' };
  return {
    title: `${domain.name} — For Sale`,
    description: domain.description,
  };
}

export default function DomainPage({ params }) {
  const domain = getDomainBySlug(params.domain);
  if (!domain) notFound();
  return <DomainSalePage domain={domain} />;
}
