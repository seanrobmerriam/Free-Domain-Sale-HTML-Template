import { logoutAction } from './actions';
import styles from './admin.module.css';

function formatMoney(n) {
    if (typeof n !== 'number') return '—';
    return '$' + n.toLocaleString();
}

function formatTime(iso) {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
}

export default function OffersTable({ offers, error }) {
    return (
        <div className={styles.adminWrap}>
            <header className={styles.adminHeader}>
                <div>
                    <h1 className={styles.adminH1}>Offers</h1>
                    <span className={styles.adminCount}>{offers.length} total</span>
                </div>
                <form action={logoutAction}>
                    <button type="submit" className={styles.logoutBtn}>Log out</button>
                </form>
            </header>

            {error && <div className={styles.errorBox}>Failed to load offers: {error}</div>}

            {offers.length === 0 && !error ? (
                <p className={styles.empty}>No offers yet. They&apos;ll show up here as they come in.</p>
            ) : (
                <div className={styles.tableScroll}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>When</th>
                                <th>Domain</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Offer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.map((o) => (
                                <tr key={o.id}>
                                    <td>{formatTime(o.created_at)}</td>
                                    <td>{o.domain || '—'}</td>
                                    <td>{o.name}</td>
                                    <td><a href={`mailto:${o.email}`}>{o.email}</a></td>
                                    <td className={styles.amount}>{formatMoney(o.offer)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
