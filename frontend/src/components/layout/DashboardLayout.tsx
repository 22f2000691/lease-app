'use client';
import { useState } from 'react';
import { AuthGuard } from './AuthGuard';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="app-container">
        <button 
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰ Menu
        </button>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content" onClick={() => { if (sidebarOpen) setSidebarOpen(false) }}>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
