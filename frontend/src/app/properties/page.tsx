'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/utils/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/properties')
      .then(setProperties)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title" style={{ margin: 0 }}>Properties Directory</h1>
        <Button>+ Add Property</Button>
      </div>

      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {properties.map((prop: any) => (
            <div key={prop.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{prop.name}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{prop.address}</p>
              <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Units</span>
                <span style={{ fontWeight: 600 }}>{prop._count.units}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
