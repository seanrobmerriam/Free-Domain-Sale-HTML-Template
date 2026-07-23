'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import ThemeSwitcher from './ThemeSwitcher';
import { useTheme } from './ThemeProvider';
import styles from './DomainSalePage.module.css';

const STATUS = {
  IDLE: 'idle',
  SENDING: 'sending',
  SUCCESS: 'success',
  ERROR: 'error',
};

const BUTTON_LABEL = {
  [STATUS.IDLE]: 'Send My Offer',
  [STATUS.SENDING]: 'Sending...',
  [STATUS.SUCCESS]: '✓ Offer Sent!',
  [STATUS.ERROR]: 'Try Again',
};

// Public env var (NEXT_PUBLIC_ prefix → exposed to the browser)
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function DomainSalePage({ domain }) {
  const [status, setStatus] = useState(STATUS.IDLE);
  const { layout } = useTheme();
  const [turnstileToken, setTurnstileToken] = useState('');

  const message = `Hi, I'm interested in ${domain.name}. Is it still available?`;
  const waLink = `https://wa.me/${domain.whatsapp}?text=${encodeURIComponent(message)}`;
  const tgLink = `https://t.me/${domain.telegram}?text=${encodeURIComponent(message)}`;

  const requiresTurnstile = Boolean(TURNSTILE_SITE_KEY);
  const canSubmit = !requiresTurnstile || Boolean(turnstileToken);

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === STATUS.SENDING || !canSubmit) return;

    const form = event.target;
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      offer: Number(form.offer.value),
      domain: domain.name,
      turnstileToken: turnstileToken || undefined,
    };

    setStatus(STATUS.SENDING);

    try {
      const res = await fetch('/api/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Request failed');
      }
      form.reset();
      setTurnstileToken('');
      setStatus(STATUS.SUCCESS);
    } catch (err) {
      console.error(err);
      setStatus(STATUS.ERROR);
    } finally {
      setTimeout(() => setStatus(STATUS.IDLE), 4000);
    }
  }

  // Split name into base + TLD for styling (e.g. "MyDomain" + ".com")
  const dotIndex = domain.name.lastIndexOf('.');
  const nameBase = dotIndex > 0 ? domain.name.slice(0, dotIndex) : domain.name;
  const tld = dotIndex > 0 ? domain.name.slice(dotIndex) : '';

  return (
    <>
      <ThemeSwitcher />

      <div className={styles.container} data-layout={layout.id}>
        <div className={styles.leftContent}>
          <div className={styles.forSaleBadge}>For Sale!</div>
          <h1 className={styles.domainName}>
            {nameBase}
            <span className={styles.tld}>{tld}</span>
          </h1>

          <div className={styles.valueSection}>
            <span className={styles.estimatedText}>Estimated value</span>
            <span className={styles.valueBadge}>
              ${domain.estimatedValue}
            </span>
          </div>

          <p className={styles.description}>{domain.description}</p>

          <div className={styles.contactInfo}>
            <a href={`tel:${domain.phone.replace(/[^\d+]/g, '')}`} className={styles.contactItem}>
              <i className="fas fa-phone-alt" />
              <span>{domain.phone}</span>
            </a>
            <a href={`mailto:${domain.email}`} className={styles.contactItem}>
              <i className="fas fa-envelope" />
              <span>{domain.email}</span>
            </a>
            <Link href="/domains" className={styles.contactItem}>
              <i className="fas fa-globe" />
              <span>More Domains</span>
            </Link>
          </div>
        </div>

        <div className={styles.rightContent}>
          <div className={styles.offerCard}>
            <h2 className={styles.offerTitle}>Make Your offer</h2>
            <p className={styles.subtitle}>
              Please fill out the form below so that the seller receive your offer.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <i className="fas fa-user" />
                <input name="name" type="text" placeholder="Enter Your Name" required />
              </div>
              <div className={styles.inputGroup}>
                <i className="fas fa-envelope" />
                <input name="email" type="email" placeholder="Enter Your Email" required />
              </div>
              <div className={styles.inputGroup}>
                <i className="fas fa-dollar-sign" />
                <input
                  name="offer"
                  type="number"
                  min="1"
                  placeholder="Enter Your Offer"
                  required
                />
              </div>

              {TURNSTILE_SITE_KEY && (
                <div className={styles.turnstile}>
                  <Turnstile
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => setTurnstileToken('')}
                    onExpire={() => setTurnstileToken('')}
                    options={{ theme: 'light' }}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={status === STATUS.SENDING || !canSubmit}
                className={`${styles.submitBtn} ${
                  status === STATUS.SUCCESS ? styles.submitSuccess : ''
                } ${status === STATUS.ERROR ? styles.submitError : ''}`}
              >
                {BUTTON_LABEL[status]}
              </button>
            </form>
          </div>
        </div>
      </div>

      <a
        href={waLink}
        className={styles.whatsappFloat}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <i className="fab fa-whatsapp" />
        <span className={styles.whatsappTooltip}>Chat with us on WhatsApp</span>
      </a>

      <a
        href={tgLink}
        className={styles.telegramFloat}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on Telegram"
      >
        <i className="fab fa-telegram" />
        <span className={styles.telegramTooltip}>Chat with us on Telegram</span>
      </a>
    </>
  );
}
