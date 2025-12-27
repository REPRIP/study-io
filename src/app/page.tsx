'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const TickerItem = ({ text }: { text: string }) => (
    <div className={styles.tickerItem}>
      <span className="mono">{text}</span>
      <span style={{ fontSize: '0.5rem', opacity: 0.3 }}>●</span>
    </div>
  );

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={`${styles.section} ${styles.hero}`}>
        <div className="container">
          <div className="mono reveal-up">
            Open Source Knowledge Commons
          </div>
          <h1 className={`${styles.heroTitle} reveal-up`}>
            STUDY.IO
          </h1>
          <p className={`${styles.heroSub} reveal-up`}>
            A sanctuary for peer-verified notes and communal knowledge growth.
            Built by students, for the future of learning.
          </p>
          <div className="reveal-up">
            <Link href="/login" className={styles.cta}>
              Join the Community
            </Link>
            <Link href="/login" className={`${styles.cta} ${styles.ctaSecondary}`}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Ticker Section */}
      <div className={styles.ticker}>
        <div className={styles.tickerInner}>
          <TickerItem text="Open Source" />
          <TickerItem text="Peer Verified" />
          <TickerItem text="Community Driven" />
          <TickerItem text="Free Forever" />
          <TickerItem text="No Corporate Slop" />
          <TickerItem text="Open Source" />
          <TickerItem text="Peer Verified" />
          <TickerItem text="Community Driven" />
          <TickerItem text="Free Forever" />
          <TickerItem text="No Corporate Slop" />
        </div>
      </div>

      {/* Narrative Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.narrativeGrid}>
            <div className="mono reveal-up">The Philosophy</div>
            <div className={`${styles.narrativeText} reveal-up`}>
              We believe knowledge shouldn&apos;t be trapped in silos.
              Study.io breaks the cycle of isolated notes and expensive
              shared drives by creating a living, breathing archive
              accessible to every student.
            </div>
          </div>
        </div>
      </section>

      {/* Technical Differentiators */}
      <section className={styles.section} style={{ background: 'var(--accent)', color: 'var(--background)', '--border': 'rgba(253, 252, 240, 0.1)' } as any}>
        <div className="container">
          <div className="mono reveal-up">Technical Foundation</div>
          <div className={styles.featureGrid}>
            {[
              { title: 'Peer Verification', desc: 'Every note is vetted by the community. Quality is enforced by the many, not the few.' },
              { title: 'Open Architecture', desc: 'Our codebase is public. Contribute to the tools you use for your education.' },
              { title: 'Semantic Search', desc: 'Find exactly what you need with tagging and high-fidelity search across subjects.' }
            ].map((feature, i) => (
              <div key={i} className={`${styles.featureCard} reveal-up`}>
                <h3>{feature.title}</h3>
                <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conversion Section */}
      <footer className={styles.footer}>
        <div className="container">
          <div className="mono reveal-up">Begin your journey</div>
          <h2 className="reveal-up">Join 0+ students</h2>
          <div className="reveal-up">
            <Link href="/login" className={styles.cta} style={{ padding: '1.5rem 4rem', fontSize: '1rem' }}>
              Create Free Account
            </Link>
          </div>
          <p className="mono reveal-up" style={{ marginTop: '4rem', opacity: 0.5 }}>
            © 2025 Study.io — The Collegiate knowledge commons
          </p>
        </div>
      </footer>
    </main>
  );
}
