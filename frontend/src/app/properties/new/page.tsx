'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/utils/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';

export default function NewProperty() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await fetchApi('/properties', {
        method: 'POST',
        body: JSON.stringify({ name, address })
      });
      router.push('/properties');
    } catch (err: any) {
      setError(err.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 className="title">Add Property</h1>
        <div className="glass-panel">
          {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Property Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. City Centre Complex"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(128,128,128,0.1)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Address</label>
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Complete physical address..."
                rows={4}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(128,128,128,0.1)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Button type="button" variant="secondary" onClick={() => router.back()} style={{ flex: 1 }}>Cancel</Button>
              <Button type="submit" isLoading={loading} style={{ flex: 2 }}>Save Property</Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
