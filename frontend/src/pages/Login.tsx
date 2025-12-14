import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setEmail('rep@wingmate.test')
    setPassword('password123')
  }

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #2563eb, #7c3aed)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '448px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(to right, #2563eb, #1e40af)', padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>W</div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: 'white', margin: 0 }}>Wingmate</h1>
          <p style={{ color: '#dbeafe', margin: '8px 0 0', fontSize: '14px' }}>Sales Pipeline CRM</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', marginBottom: '24px' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#f9fafb' }}
              placeholder="rep@wingmate.test"
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#f9fafb' }}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(to right, #2563eb, #1e40af)', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, fontSize: '14px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo section */}
        <div style={{ borderTop: '1px solid #e5e7eb', padding: '24px 32px', backgroundColor: '#f9fafb' }}>
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#4b5563', margin: '0 0 16px' }}>Demo Account</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: '0 0 4px' }}>Email</p>
              <p style={{ fontSize: '14px', color: '#111827', fontFamily: 'monospace', margin: 0 }}>rep@wingmate.test</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500', margin: '0 0 4px' }}>Password</p>
              <p style={{ fontSize: '14px', color: '#111827', fontFamily: 'monospace', margin: 0 }}>password123</p>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              style={{ width: '100%', marginTop: '12px', backgroundColor: '#d1d5db', color: '#111827', padding: '8px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}