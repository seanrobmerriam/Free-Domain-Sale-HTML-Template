/**
 * Domain listings — add a new object to sell another domain.
 * `slug` becomes the URL path: /your-slug
 */
export const domains = [
  {
    slug: 'domain-1',
    name: 'domain-1.com',
    estimatedValue: 3650,
    description:
      'Premium domain name for sale. Invest in a premium domain name and launch your brand.',
    phone: '(+1)333-333-3333',
    email: 'email@example.com',
    whatsapp: '13333333333',
    telegram: 'username',
  },
  {
    slug: 'domain-2',
    name: 'domain-2.com',
    estimatedValue: 3650,
    description:
      'Premium domain name for sale. Invest in a premium domain name and launch your brand.',
    phone: '(+1)333-333-3333',
    email: 'email@example.com',
    whatsapp: '13333333333',
    telegram: 'username',
  },
  {
    slug: 'domain-3',
    name: 'domain-3.com',
    estimatedValue: 3650,
    description:
      'Premium domain name for sale. Invest in a premium domain name and launch your brand.',
    phone: '(+1)333-333-3333',
    email: 'email@example.com',
    whatsapp: '13333333333',
    telegram: 'username',
  },
];

export function getDomainBySlug(slug) {
  return domains.find((d) => d.slug === slug);
}

export function getAllSlugs() {
  return domains.map((d) => ({ domain: d.slug }));
}