import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header style={{ background: 'linear-gradient(to right, #1e40af, #1e3a8a)', color: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', color: '#1e40af' }}>
            C
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>CRM App</h1>
            <p style={{ fontSize: '12px', opacity: 0.9, margin: '2px 0 0 0' }}>CRM Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a 
            href="/" 
            style={{ color: 'white', textDecoration: 'none', fontWeight: '500', fontSize: '14px', opacity: 0.9, transition: 'opacity 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}
          >
            Dashboard
          </a>
          <a 
            href="/leads" 
            style={{ color: 'white', textDecoration: 'none', fontWeight: '500', fontSize: '14px', opacity: 0.9, transition: 'opacity 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}
          >
            Leads
          </a>
          
          {/* Divider */}
          <div style={{ height: '24px', borderRight: '1px solid rgba(255, 255, 255, 0.3)', opacity: 0.5 }}></div>

          {/* User Info & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: '600', fontSize: '13px', margin: 0 }}>{user?.name}</p>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: '2px 0 0 0', textTransform: 'capitalize' }}>{user?.role} Account</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
