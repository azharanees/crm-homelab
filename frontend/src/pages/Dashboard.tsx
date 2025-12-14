import { useAuth } from '../hooks/useAuth'
import { useFetch } from '../hooks/useFetch'
import { leadsApi } from '../api/client'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Lead } from '../types'

export function Dashboard() {
  const { user } = useAuth()

  const { data: leadsData, loading } = useFetch(() => leadsApi.list(), [])

  const leads = (leadsData as any)?.data || []

  const stats = {
    total: leads.length,
    new_lead: leads.filter((l: Lead) => l.status === 'new_lead').length,
    contacted: leads.filter((l: Lead) => l.status === 'contacted').length,
    qualified: leads.filter((l: Lead) => l.status === 'qualified').length,
    won: leads.filter((l: Lead) => l.status === 'won').length,
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Welcome back, <span style={{ background: 'linear-gradient(to right, #2563eb, #7c3aed)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name}</span>!
          </h1>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>Here's your sales pipeline overview</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#dbeafe', borderRadius: '12px', border: '1px solid #bfdbfe', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', opacity: 0.75, color: '#1e40af', margin: 0 }}>Total Leads</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '16px', color: '#1e40af', margin: '16px 0 0 0' }}>{stats.total}</p>
              </div>
              <span style={{ fontSize: '32px' }}>📊</span>
            </div>
          </div>
          <div style={{ backgroundColor: '#fef3c7', borderRadius: '12px', border: '1px solid #fcd34d', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', opacity: 0.75, color: '#92400e', margin: 0 }}>New Leads</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '16px', color: '#92400e', margin: '16px 0 0 0' }}>{stats.new_lead}</p>
              </div>
              <span style={{ fontSize: '32px' }}>✨</span>
            </div>
          </div>
          <div style={{ backgroundColor: '#fed7aa', borderRadius: '12px', border: '1px solid #fdba74', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', opacity: 0.75, color: '#92400e', margin: 0 }}>Contacted</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '16px', color: '#92400e', margin: '16px 0 0 0' }}>{stats.contacted}</p>
              </div>
              <span style={{ fontSize: '32px' }}>📞</span>
            </div>
          </div>
          <div style={{ backgroundColor: '#dcfce7', borderRadius: '12px', border: '1px solid #bbf7d0', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', opacity: 0.75, color: '#166534', margin: 0 }}>Won</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '16px', color: '#166534', margin: '16px 0 0 0' }}>{stats.won}</p>
              </div>
              <span style={{ fontSize: '32px' }}>🎉</span>
            </div>
          </div>
        </div>

        {/* Pipeline Overview & Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', gridAutoFlow: 'dense' }}>
          {/* Pipeline Overview */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Pipeline Overview</h2>
              <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px', margin: 0 }}>Your leads distribution across stages</p>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ textAlign: 'center', padding: '16px', borderRadius: '8px', backgroundColor: '#dbeafe' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>{stats.new_lead}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>New</div>
                </div>
                <div style={{ textAlign: 'center', padding: '16px', borderRadius: '8px', backgroundColor: '#fed7aa' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400e' }}>{stats.contacted}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Contacted</div>
                </div>
                <div style={{ textAlign: 'center', padding: '16px', borderRadius: '8px', backgroundColor: '#e9d5ff' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6b21a8' }}>{stats.qualified}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Qualified</div>
                </div>
                <div style={{ textAlign: 'center', padding: '16px', borderRadius: '8px', backgroundColor: '#dcfce7' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#166534' }}>{stats.won}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Won</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Quick Stats</h2>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Conversion Rate</span>
                  <span style={{ fontWeight: 'bold', color: '#111827' }}>{stats.total ? Math.round((stats.won / stats.total) * 100) : 0}%</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#10b981', height: '8px', borderRadius: '9999px', width: `${stats.total ? (stats.won / stats.total) * 100 : 0}%` }}></div>
                </div>
              </div>
              <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Active Leads</span>
                  <span style={{ fontWeight: 'bold', color: '#111827', fontSize: '18px' }}>{stats.total - stats.won}</span>
                </div>
              </div>
              <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Close Rate</span>
                  <span style={{ fontWeight: 'bold', color: '#111827' }}>{stats.total ? Math.round((stats.won / (stats.won + stats.contacted)) * 100) || 0 : 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State or Leads List */}
        {leads.length === 0 && (
          <div style={{ marginTop: '32px', backgroundColor: 'white', borderRadius: '12px', padding: '48px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>No leads yet</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>Create your first lead to get started with your sales pipeline</p>
          </div>
        )}
      </div>
    </div>
  )
}
