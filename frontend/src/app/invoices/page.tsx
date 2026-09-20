'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/utils/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const loadInvoices = () => {
    setLoading(true);
    fetchApi('/invoices')
      .then(setInvoices)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    const [year, month] = selectedMonth.split('-');
    try {
      await fetchApi('/invoices/generate', {
        method: 'POST',
        body: JSON.stringify({ targetMonth: parseInt(month, 10), targetYear: parseInt(year, 10) })
      });
      loadInvoices();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePay = async (id: string) => {
    try {
      await fetchApi(`/invoices/${id}/pay`, {
        method: 'POST',
        body: JSON.stringify({ paymentMode: 'Bank Transfer' })
      });
      loadInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title" style={{ margin: 0 }}>Billing & Ledger</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--surface-color)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <Button onClick={handleGenerate} isLoading={generating}>+ Generate</Button>
        </div>
      </div>

      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <div className="glass-panel" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Month/Year</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Tenant</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Amount</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((i: any) => (
                <tr key={i.id} style={{ borderTop: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{i.targetMonth}/{i.targetYear}</td>
                  <td style={{ padding: '1rem' }}>{i.lease?.tenant?.name}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>₹{i.amount.toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px', 
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      background: i.status === 'Paid' ? 'rgba(16, 185, 129, 0.2)' : i.status === 'Overdue' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: i.status === 'Paid' ? 'var(--success-color)' : i.status === 'Overdue' ? 'var(--danger-color)' : 'var(--warning-color)'
                    }}>
                      {i.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {i.status !== 'Paid' && (
                      <button 
                        onClick={() => handlePay(i.id)}
                        style={{ background: 'transparent', border: '1px solid var(--success-color)', color: 'var(--success-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Mark Paid
                      </button>
                    )}
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
