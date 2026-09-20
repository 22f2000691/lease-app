'use client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/properties', label: 'Properties', icon: '🏢' },
    { href: '/units', label: 'Units/Shops', icon: '🏬' },
    { href: '/tenants', label: 'Tenants', icon: '👥' },
    { href: '/leases', label: 'Lease Contracts', icon: '📝' },
    { href: '/invoices', label: 'Billing & Ledger', icon: '💰' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      background: 'rgba(15, 23, 42, 0.95)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
    }}>
      <h2 style={{ color: 'white', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 600 }}>
        Lease System
      </h2>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map(link => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link 
              key={link.href} 
              href={link.href}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: isActive ? 'white' : 'var(--text-secondary)',
                background: isActive ? 'var(--primary-color)' : 'transparent',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={handleLogout}
        style={{
          background: 'transparent',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: 'var(--danger-color)',
          padding: '0.75rem',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
      >
        🚪 Logout
      </button>
    </div>
  );
}
