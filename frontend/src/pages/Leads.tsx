import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { leadsApi } from '../api/client'
import { useFetch } from '../hooks/useFetch'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Lead } from '../types'

export function Leads() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    contact_name: '',
    email: '',
    phone: '',
    status: 'new_lead',
    source: 'referral',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const { data: leadsData, loading, refetch } = useFetch(
    () => leadsApi.list({ status, source, q: search }),
    [status, source, search]
  )

  const leads = (leadsData as any)?.data || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setIsSubmitting(true)

    try {
      await leadsApi.create(formData)
      setFormData({
        title: '',
        company: '',
        contact_name: '',
        email: '',
        phone: '',
        status: 'new_lead',
        source: 'referral',
      })
      setIsFormOpen(false)
      refetch()
    } catch (error: any) {
      setFormError(error.message || 'Failed to create lead')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Leads</h1>
            <p style={{ color: '#6b7280', marginTop: '8px', margin: '8px 0 0 0' }}>{leads.length} total leads</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            style={{ background: 'linear-gradient(to right, #2563eb, #1e40af)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)')}
          >
            <span style={{ fontSize: '18px' }}>+</span> Add Lead
          </button>
        </div>

        {/* Filters */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Search</label>
              <input
                type="text"
                placeholder="Search by name, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              >
                <option value="">All Status</option>
                <option value="new_lead">New</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              >
                <option value="">All Sources</option>
                <option value="referral">Referral</option>
                <option value="cold_call">Cold Call</option>
                <option value="inbound">Inbound</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leads List */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {leads.length === 0 ? (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '48px', textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '16px', margin: '0 0 16px 0' }}>No leads found</p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  style={{ color: '#2563eb', fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontSize: '14px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  Create your first lead
                </button>
              </div>
            ) : (
              leads.map((lead: Lead) => (
                <div key={lead.id} onClick={() => navigate(`/leads/${lead.id}`)} style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '24px', cursor: 'pointer', transition: 'all 0.2s', display: 'block', textDecoration: 'none', color: 'inherit' }} onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#d1d5db'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{lead.title}</h3>
                      <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0 0' }}>{lead.company}</p>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: getStatusBgColor(lead.status), color: getStatusTextColor(lead.status), textTransform: 'capitalize', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                      {lead.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: '0 0 4px 0' }}>Contact</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{lead.contact_name}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: '0 0 4px 0' }}>Email</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{lead.email || '—'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: '0 0 4px 0' }}>Phone</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>{lead.phone || '—'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: '0 0 4px 0' }}>Source</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0, textTransform: 'capitalize' }}>{lead.source?.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {isFormOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', maxWidth: '672px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Add New Lead</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                style={{ fontSize: '24px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'light', padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#4b5563')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {formError && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '6px', fontSize: '14px' }}>
                  {formError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Lead Title *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Enterprise Software Deal"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Company *</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="e.g., Acme Corp"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Contact Name *</label>
                  <input
                    type="text"
                    name="contact_name"
                    placeholder="e.g., John Smith"
                    value={formData.contact_name}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Source *</label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  >
                    <option value="referral">Referral</option>
                    <option value="cold_call">Cold Call</option>
                    <option value="inbound">Inbound</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  >
                    <option value="new_lead">New</option>
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ flex: 1, background: 'linear-gradient(to right, #2563eb, #1e40af)', color: 'white', padding: '12px', borderRadius: '6px', fontWeight: '600', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.5 : 1, fontSize: '14px' }}
                  onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                >
                  {isSubmitting ? 'Creating...' : 'Create Lead'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  style={{ flex: 1, backgroundColor: '#e5e7eb', color: '#111827', padding: '12px', borderRadius: '6px', fontWeight: '600', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d1d5db')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new_lead: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getStatusBgColor(status: string): string {
  const colors: Record<string, string> = {
    new_lead: '#dbeafe',
    pending: '#fef3c7',
    contacted: '#fed7aa',
    qualified: '#e9d5ff',
    won: '#dcfce7',
    lost: '#fecaca',
  }
  return colors[status] || '#f3f4f6'
}

function getStatusTextColor(status: string): string {
  const colors: Record<string, string> = {
    new_lead: '#1e40af',
    pending: '#92400e',
    contacted: '#92400e',
    qualified: '#6b21a8',
    won: '#166534',
    lost: '#991b1b',
  }
  return colors[status] || '#374151'
}
