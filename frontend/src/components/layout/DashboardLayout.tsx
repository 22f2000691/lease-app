'use client';
import { AuthGuard } from './AuthGuard';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background-color)' }}>
        <Sidebar />
        <main style={{ 
          marginLeft: '260px', 
          flex: 1, 
          padding: '2rem',
          maxWidth: '1200px',
        }}>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
