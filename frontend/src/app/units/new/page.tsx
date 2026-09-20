'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/utils/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';

export default function NewUnit() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [propertyId, setPropertyId] = useState('');
  const [shopNumber, setShopNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApi('/properties').then(setProperties).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await fetchApi('/units', {
        method: 'POST',
        body: JSON.stringify({ propertyId, shopNumber, floor, status: 'Vacant' })
      });
      router.push('/units');
    } catch (err: any) {
      setError(err.message || 'Failed to create unit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 className="title">Add Unit / Shop</h1>
        <div className="glass-panel">
          {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Property / Location</label>
              <select 
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(128,128,128,0.1)', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value="">Select a property...</option>
                {properties.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Shop Number / Unit Name</label>
              <input 
                type="text" 
                value={shopNumber}
                onChange={(e) => setShopNumber(e.target.value)}
                required
                placeholder="e.g. 101 or A-1"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(128,128,128,0.1)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Floor</label>
              <input 
                type="text" 
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                required
                placeholder="e.g. Ground Floor, 1st Floor"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(128,128,128,0.1)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Button type="button" variant="secondary" onClick={() => router.back()} style={{ flex: 1 }}>Cancel</Button>
              <Button type="submit" isLoading={loading} style={{ flex: 2 }}>Save Unit</Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
