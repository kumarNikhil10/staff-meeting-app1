import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import './Dashboard.css';

function Home({ onLogin }) {
  const navigate = useNavigate();
  const [loginRole, setLoginRole] = useState(null); 
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser({ ...form, role: loginRole });
      onLogin(res.data.user, res.data.token);
      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const bgStyle = {
    minHeight: '100vh',
    backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Sir_M._Visvesvaraya_Institute_of_Technology%2C_Bangalore.jpg/1280px-Sir_M._Visvesvaraya_Institute_of_Technology%2C_Bangalore.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  };

  const overlayStyle = {
    position: 'absolute', inset: 0,
    background: 'rgba(253, 251, 247, 0.9)' 
  };

  return (
    <div style={bgStyle}>
      <div style={overlayStyle} />
      
      <header className="inst-header" style={{ position: 'relative', zIndex: 10 }}>
        <div className="inst-container">
          <div className="inst-branding">
            <h2 className="inst-short">SMVIT</h2>
            <h1 className="inst-full">SIR M. VISVESVARAYA INSTITUTE OF TECHNOLOGY</h1>
            <p className="inst-creds">
              Affiliated to VTU, Belagavi | Approved by AICTE, New Delhi | Accredited by NAAC
            </p>
          </div>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>

        {!loginRole ? (
          <div className="card-modern shadow-lg" style={{ textAlign: 'center', width: '100%', maxWidth: '850px', padding: '3.5rem' }}>
            <h1 className="page-title" style={{ fontSize: '2.5rem', color: '#1e293b', marginBottom: '1rem' }}>
              Meeting Portal
            </h1>
            <p className="welcome-text" style={{ marginBottom: '3rem' }}>
              Select your role to access the scheduling and management system
            </p>

            {/* Parallel 3-Column Layout */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              <button className="role-card-btn" onClick={() => setLoginRole('principal')}>
                <span className="role-icon">🏛️</span>
                <span>Principal Login</span>
              </button>
              
              <button className="role-card-btn" onClick={() => setLoginRole('hod')}>
                <span className="role-icon">👔</span>
                <span>HOD Login</span>
              </button>
              
              <button className="role-card-btn" onClick={() => setLoginRole('staff')}>
                <span className="role-icon">👤</span>
                <span>Staff Login</span>
              </button>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
              <p className="welcome-text" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>New to the portal? Create an account:</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  className="btn-teal-modern" 
                  style={{ background: 'white', color: '#0d9488', border: '1px solid #0d9488', padding: '0.6rem 1.5rem' }}
                  onClick={() => navigate('/register/hod')}
                >
                  Register as HOD
                </button>
                <button 
                  className="btn-teal-modern" 
                  style={{ background: 'white', color: '#0d9488', border: '1px solid #0d9488', padding: '0.6rem 1.5rem' }}
                  onClick={() => navigate('/register/staff')}
                >
                  Register as Staff
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Role Specific Login Card */
          <div className="card-modern shadow-lg" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '3rem' }}>
                {loginRole === 'principal' ? '🏛️' : loginRole === 'hod' ? '👔' : '👤'}
              </span>
              <h2 className="auth-title" style={{ textTransform: 'capitalize', marginTop: '1rem' }}>
                {loginRole} Login
              </h2>
            </div>
            
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input"
                  placeholder="your@email.com" 
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-input"
                  placeholder="Enter password" 
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} 
                  required 
                />
              </div>
              {error && <div className="alert-floating alert-error">{error}</div>}
              <button type="submit" className="btn-teal-modern" disabled={loading} style={{ width: '100%', padding: '0.8rem' }}>
                {loading ? 'Signing in...' : 'Login to Dashboard'}
              </button>
            </form>
            
            <button 
              onClick={() => { setLoginRole(null); setError(''); }} 
              className="nav-item" 
              style={{ width: '100%', marginTop: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center' }}
            >
              ← Back to Role Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;