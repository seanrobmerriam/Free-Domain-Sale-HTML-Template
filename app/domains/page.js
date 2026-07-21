import Link from 'next/link';
import { domains } from '@/lib/domains';

export const metadata = {
  title: 'Available Domains',
  description: 'Browse every premium domain currently for sale.',
};

export default function DomainsIndex() {
  return (
    <main
      style={{
        minHeight: '100vh',
        color: 'white',
        padding: '80px 20px',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '40px', marginBottom: '12px' }}>
        Available Domains
      </h1>
      <p style={{ opacity: 0.9, marginBottom: '40px' }}>
        Premium domains available for instant purchase. Click one to make an
        offer.
      </p>

      <ul style={{ listStyle: 'none', display: 'grid', gap: '16px' }}>
        {domains.map((d) => (
          <li key={d.slug}>
            <Link
              href={`/${d.slug}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(4px)',
                padding: '24px 28px',
                borderRadius: '10px',
                transition: 'background 0.2s',
              }}
            >
              <span style={{ fontSize: '22px', fontWeight: 700 }}>
                {d.name}
              </span>
              <span
                style={{
                  background: '#2dc653',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '15px',
                }}
              >
                ${d.estimatedValue}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
