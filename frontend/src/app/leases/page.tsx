'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/utils/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';

export default function Leases() {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/leases')
      .then(setLeases)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title" style={{ margin: 0 }}>Lease Contracts</h1>
        <Button>+ New Lease</Button>
      </div>

      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Tenant</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Unit</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Duration</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Base Rent</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Escalation</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leases.map((l: any) => (
                <tr key={l.id} style={{ borderTop: '1px solid var(--border-color)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{l.tenant.name}</td>
                  <td style={{ padding: '1rem' }}>{l.unit.property.name} - Shop {l.unit.shopNumber}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {new Date(l.startDate).toLocaleDateString()} <br/>to<br/> {new Date(l.endDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>₹{l.baseRent.toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>{l.incrementPercentage}% /yr</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px', 
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      background: l.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: l.status === 'Active' ? 'var(--success-color)' : 'var(--danger-color)'
                    }}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
