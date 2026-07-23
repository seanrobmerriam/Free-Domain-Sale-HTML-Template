'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';
import styles from './admin.module.css';

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, { error: '' });

    return (
        <div className={styles.loginWrap}>
            <form action={formAction} className={styles.loginCard}>
                <h1 className={styles.loginTitle}>Admin sign in</h1>
                <p className={styles.loginSub}>Enter ADMIN_PASSWORD to view offers.</p>
                <input
                    className={styles.loginInput}
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    autoFocus
                />
                {state?.error && <p className={styles.loginError}>{state.error}</p>}
                <button type="submit" disabled={isPending} className={styles.loginBtn}>
                    {isPending ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </div>
    );
}
