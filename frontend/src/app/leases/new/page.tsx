'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/utils/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';

export default function NewLease() {
  const router = useRouter();
  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  
  const [tenantId, setTenantId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [baseRent, setBaseRent] = useState('');
  const [incrementPercentage, setIncrementPercentage] = useState('5');
  const [dueDay, setDueDay] = useState('1');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetchApi('/tenants'),
      fetchApi('/units')
    ]).then(([t, u]) => {
      setTenants(t);
      // Only show vacant units
      setUnits(u.filter((unit: any) => unit.status === 'Vacant'));
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await fetchApi('/leases', {
        method: 'POST',
        body: JSON.stringify({
          tenantId,
          unitId,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          baseRent: parseFloat(baseRent),
          incrementPercentage: parseFloat(incrementPercentage),
          dueDay: parseInt(dueDay, 10),
          status: 'Active'
        })
      });
      router.push('/leases');
    } catch (err: any) {
      setError(err.message || 'Failed to create lease contract');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="title">New Lease Contract</h1>
        <div className="glass-panel">
          {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Tenant</label>
              <select 
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(128,128,128,0.1)', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value="">Select a tenant...</option>
                {tenants.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Vacant Unit</label>
              <select 
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(128,128,128,0.1)', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value="">Select a unit...</option>
                {units.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.property.name} - Shop {u.shopNumber}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(128,128,128,0.1)', color: 'var(--text-primary)', outline: 'none', colorScheme: 'dark' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>End Date</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(128,128,128,0.1)', color: 'var(--text-primary)', outline: 'none', colorScheme: 'dark' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Base Rent (₹)</label>
              <input 
                type="number" 
                value={baseRent}
                onChange={(e) => setBaseRent(e.target.value)}
                required
                min="0"
                placeholder="0"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(128,128,128,0.1)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Annual Escalation (%)</label>
              <input 
                type="number" 
                value={incrementPercentage}
                onChange={(e) => setIncrementPercentage(e.target.value)}
                required
                min="0"
                step="0.1"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(128,128,128,0.1)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Rent Due Day (1-31)</label>
              <input 
                type="number" 
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                required
                min="1"
                max="31"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(128,128,128,0.1)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Button type="button" variant="secondary" onClick={() => router.back()} style={{ flex: 1 }}>Cancel</Button>
              <Button type="submit" isLoading={loading} style={{ flex: 2 }}>Create Lease Contract</Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
