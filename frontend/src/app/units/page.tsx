'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/utils/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';

export default function Units() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/properties').then((data) => {
      setProperties(data);
      if (data.length > 0) {
        setSelectedProperty(data[0].id);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      setLoading(true);
      fetchApi(`/units/property/${selectedProperty}`)
        .then(setUnits)
        .finally(() => setLoading(false));
    }
  }, [selectedProperty]);

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title" style={{ margin: 0 }}>Unit Directory</h1>
        <Button>+ Add Unit</Button>
      </div>

      {!loading && properties.length > 0 && (
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {properties.map((p: any) => (
            <button
              key={p.id}
              onClick={() => setSelectedProperty(p.id)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                background: selectedProperty === p.id ? 'var(--primary-color)' : 'var(--surface-color)',
                color: 'white',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {units.map((u: any) => (
            <div key={u.id} className="glass-panel" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Floor {u.floor}</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0.5rem 0' }}>Shop {u.shopNumber}</h2>
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 500,
                marginTop: '1rem',
                background: u.status === 'Vacant' ? 'rgba(16, 185, 129, 0.2)' : u.status === 'Occupied' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: u.status === 'Vacant' ? 'var(--success-color)' : u.status === 'Occupied' ? '#818cf8' : 'var(--warning-color)'
              }}>
                {u.status}
              </span>
            </div>
          ))}
          {units.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>No units found for this property.</div>}
        </div>
      )}
    </DashboardLayout>
  );
}
