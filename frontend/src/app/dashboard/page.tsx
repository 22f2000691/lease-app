'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/utils/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLeases: 0,
    renewalsDue: 0,
    rentScheduled: 0,
    rentCollected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be a single dashboard endpoint.
    // For now, we fetch the data we need.
    const loadDashboard = async () => {
      try {
        const [leases, invoices] = await Promise.all([
          fetchApi('/leases'),
          fetchApi('/invoices')
        ]);
        
        const activeLeases = leases.filter((l: any) => l.status === 'Active');
        
        // Calculate renewals due within 30 days
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        const renewals = activeLeases.filter((l: any) => {
          const end = new Date(l.endDate);
          return end <= thirtyDaysFromNow && end >= today;
        });

        // Calculate rent scheduled vs collected for the current month
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        
        const currentMonthInvoices = invoices.filter((i: any) => 
          i.targetMonth === currentMonth && i.targetYear === currentYear
        );

        const scheduled = currentMonthInvoices.reduce((sum: number, i: any) => sum + i.amount, 0);
        const collected = currentMonthInvoices
          .filter((i: any) => i.status === 'Paid')
          .reduce((sum: number, i: any) => sum + i.amount, 0);

        setStats({
          totalLeases: activeLeases.length,
          renewalsDue: renewals.length,
          rentScheduled: scheduled,
          rentCollected: collected
        });
      } catch (error) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title" style={{ margin: 0 }}>Operations Dashboard</h1>
      </div>

      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          
          <div className="glass-panel" style={{ borderLeft: '4px solid var(--primary-color)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Leases</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{stats.totalLeases}</div>
          </div>

          <div className="glass-panel" style={{ borderLeft: `4px solid ${stats.renewalsDue > 0 ? 'var(--warning-color)' : 'var(--success-color)'}` }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Renewals Due (30d)</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{stats.renewalsDue}</div>
          </div>

          <div className="glass-panel" style={{ borderLeft: '4px solid #8B5CF6' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Rent Scheduled (This Month)</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem' }}>₹{stats.rentScheduled.toLocaleString()}</div>
          </div>

          <div className="glass-panel" style={{ borderLeft: '4px solid var(--success-color)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Rent Collected (This Month)</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem' }}>₹{stats.rentCollected.toLocaleString()}</div>
          </div>
          
        </div>
      )}
      
      {/* Expiration Early Warning Feed could go here */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Early Warning Feed</h2>
      <div className="glass-panel">
        <p style={{ color: 'var(--text-secondary)' }}>All systems operational. No immediate actions required.</p>
      </div>

    </DashboardLayout>
  );
}
