import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="glass-panel" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <h1 className="title">Lease Management System</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Your automated operational ledger for commercial real estate.
        </p>
        <Link href="/dashboard">
          <button className="btn-primary">Go to Dashboard</button>
        </Link>
      </div>
    </main>
  );
}
