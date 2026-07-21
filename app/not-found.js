import Link from 'next/link';
import { domains } from '@/lib/domains';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>404</h1>
      <p style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.9 }}>
        That domain isn&apos;t listed for sale.
      </p>
      <Link
        href="/domains"
        style={{
          background: 'white',
          color: '#1864f0',
          padding: '12px 24px',
          borderRadius: '6px',
          fontWeight: 600,
        }}
      >
        View available domains
      </Link>
    </main>
  );
}
