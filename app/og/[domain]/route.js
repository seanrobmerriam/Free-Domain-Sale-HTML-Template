import { ImageResponse } from 'next/og';
import { getDomainBySlug } from '@/lib/domains';

export const runtime = 'nodejs'; // next/og works with both Edge and Node; Node keeps deps simple
export const contentType = 'image/png';

export async function GET(_request, { params }) {
    const { domain } = await params;
    const data = getDomainBySlug(domain);

    if (!data) {
        return new Response('Domain not found', { status: 404 });
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, #1864f0 0%, #1455d4 100%)',
                    color: 'white',
                    padding: '60px',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        fontSize: 32,
                        fontWeight: 700,
                        color: 'white',
                        background: '#e63946',
                        padding: '10px 22px',
                        alignSelf: 'flex-start',
                        borderRadius: 8,
                        marginBottom: 40,
                        display: 'flex',
                    }}
                >
                    For Sale!
                </div>
                <div
                    style={{
                        fontSize: 96,
                        fontWeight: 800,
                        marginBottom: 30,
                        lineHeight: 1.05,
                        letterSpacing: '-0.02em',
                    }}
                >
                    {data.name}
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        marginTop: 'auto',
                    }}
                >
                    <span style={{ fontSize: 28, opacity: 0.9 }}>Estimated value</span>
                    <span
                        style={{
                            fontSize: 36,
                            fontWeight: 700,
                            background: '#2dc653',
                            padding: '10px 22px',
                            borderRadius: 8,
                            marginLeft: 12,
                            display: 'flex',
                        }}
                    >
                        {formatMoney(data.estimatedValue)}
                    </span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}

function formatMoney(n) {
    if (typeof n !== 'number') return '$' + n;
    return '$' + n.toLocaleString();
}
