/**
 * Domain listings — add a new object to sell another domain.
 * `slug` becomes the URL path: /your-slug
 */
export const domains = [
  {
    slug: 'momsfantasy',
    name: 'MomsFantasy.com',
    estimatedValue: 3650,
    description:
      'Premium domain name for sale. Invest in a premium domain name and launch your brand.',
    phone: '(+1)831-677-2776',
    email: 'funtren88@proton.me',
    whatsapp: '18316772776',
    telegram: 'robertsean',
  },
  {
    // EDIT ME: your second domain
    slug: 'daddysfantasy',
    name: 'daddysfantasy.com',
    estimatedValue: 3200,
    description:
      'A brandable .com with strong industry fit. Acquire it before someone else does.',
    phone: '(+1)831-677-2776',
    email: 'funtren88@proton.me',
    whatsapp: '18316772776',
    telegram: 'robertsean',
  },
  {
    // EDIT ME: your third domain
    slug: 'sudmanager',
    name: 'sudmanager.com',
    estimatedValue: 850,
    description:
      'Industry .com perfect for healthcare SaaS. Buy it today.',
    phone: '(+1)831-677-2776',
    email: 'funtren88@proton.me',
    whatsapp: '18316772776',
    telegram: 'robertsean',
  },
];

export function getDomainBySlug(slug) {
  return domains.find((d) => d.slug === slug);
}

export function getAllSlugs() {
  return domains.map((d) => ({ domain: d.slug }));
}
