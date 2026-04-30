import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createMeeting, getUsers } from '../../api';
import '../Dashboard.css';

function PrincipalSchedule() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ 
    title: '', 
    agenda: '', 
    date: '', 
    time: '', 
    meetingLink: '', 
    venue: '', 
    selectedStaff: [], 
    selectedHods: [] 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers().then(r => setUsers(r.data)).catch(console.error);
  }, []);

  const hods = users.filter(u => u.role === 'hod' && u.isApproved && !u.isBlacklisted);
  const staff = users.filter(u => u.role === 'staff' && !u.isBlacklisted);

  const toggleSelect = (id, field) => {
    const list = form[field];
    setForm({ ...form, [field]: list.includes(id) ? list.filter(x => x !== id) : [...list, id] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.date || !form.time) return setError('Title, date and time are required');
    setLoading(true);
    try {
      const attendees = [...form.selectedStaff, ...form.selectedHods];
      await createMeeting({ 
        title: form.title, 
        agenda: form.agenda, 
        date: form.date, 
        time: form.time, 
        meetingLink: form.meetingLink, 
        venue: form.venue, 
        attendees 
      });
      alert('Meeting scheduled successfully!');
      navigate('/principal/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule');
    } finally { setLoading(false); }
  };

  return (
    <div className="dashboard-outer-wrapper">
      {/* Institutional Header with Royal Blue Principal Accent */}
      <header className="inst-header">
        <div className="inst-container">
          <div className="inst-branding">
            <h2 className="inst-short" style={{ color: '#1e40af' }}>SMVIT</h2>
            <h1 className="inst-full">SIR M. VISVESVARAYA INSTITUTE OF TECHNOLOGY</h1>
            <p className="inst-creds">Principal Administrative Console</p>
          </div>
          
          <nav className="header-nav">
            <div className="nav-links">
              <Link to="/principal/dashboard" className="nav-item">Dashboard</Link>
              <Link to="/principal/schedule" className="nav-item active" style={{ color: '#1e40af', borderBottomColor: '#1e40af' }}>Schedule Meeting</Link>
            </div>
            <button className="logout-btn">Logout</button>
          </nav>
        </div>
      </header>

      <main className="dashboard-content" style={{ maxWidth: '900px' }}>
        <div className="dashboard-intro-row">
          <div className="welcome-box">
            <h1 className="page-title">Organize Meeting</h1>
            <p className="welcome-text">Create institutional sessions for Staff and HODs</p>
          </div>
        </div>

        {error && <div className="alert-floating alert-error">❌ {error}</div>}

        <div className="card-modern shadow-sm" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit} className="auth-form">
            
            <div className="form-group">
              <label className="form-label">Meeting Title *</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. Semester Beginning Review" 
                value={form.title} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Meeting Date *</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={form.date} 
                  onChange={e => setForm({ ...form, date: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Meeting Time *</label>
                <input 
                  type="time" 
                  className="form-input"
                  value={form.time} 
                  onChange={e => setForm({ ...form, time: e.target.value })} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Agenda / Subject</label>
              <textarea 
                className="form-input"
                rows="3" 
                placeholder="Enter key discussion points..." 
                value={form.agenda} 
                onChange={e => setForm({ ...form, agenda: e.target.value })} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Venue (Internal)</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. Conference Hall" 
                  value={form.venue} 
                  onChange={e => setForm({ ...form, venue: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Meeting Link (External)</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="https://meet.google.com/xxx" 
                  value={form.meetingLink} 
                  onChange={e => setForm({ ...form, meetingLink: e.target.value })} 
                />
              </div>
            </div>

            <hr className="auth-divider" style={{ margin: '2rem 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Staff Selection Column */}
              <div className="form-group">
                <label className="form-label">Select Staff ({form.selectedStaff.length})</label>
                <div className="attendee-selector shadow-sm" style={{ maxHeight: '200px' }}>
                  {staff.length === 0 ? (
                    <p className="empty-placeholder">No staff registered</p>
                  ) : (
                    staff.map(s => (
                      <label key={s._id} className={`attendee-item ${form.selectedStaff.includes(s._id) ? 'selected' : ''}`}>
                        <input 
                          type="checkbox" 
                          checked={form.selectedStaff.includes(s._id)} 
                          onChange={() => toggleSelect(s._id, 'selectedStaff')}
                        />
                        <div className="attendee-info">
                          <span className="attendee-name">{s.name}</span>
                          <span className="attendee-email">{s.email}</span>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* HOD Selection Column */}
              <div className="form-group">
                <label className="form-label">Select HODs ({form.selectedHods.length})</label>
                <div className="attendee-selector shadow-sm" style={{ maxHeight: '200px' }}>
                  {hods.length === 0 ? (
                    <p className="empty-placeholder">No approved HODs</p>
                  ) : (
                    hods.map(h => (
                      <label key={h._id} className={`attendee-item ${form.selectedHods.includes(h._id) ? 'selected' : ''}`}>
                        <input 
                          type="checkbox" 
                          checked={form.selectedHods.includes(h._id)} 
                          onChange={() => toggleSelect(h._id, 'selectedHods')}
                        />
                        <div className="attendee-info">
                          <span className="attendee-name">{h.name}</span>
                          <span className="attendee-email">{h.department}</span>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem' }}>
              <button 
                type="submit" 
                className="btn-teal-modern" 
                disabled={loading} 
                style={{ width: '100%', padding: '1rem', background: '#1e40af' }}
              >
                {loading ? 'Processing...' : '🚀 Finalize & Schedule'}
              </button>
              <button 
                type="button" 
                className="logout-btn" 
                style={{ width: '30%', padding: '1rem', background: '#f1f5f9', color: '#475569', borderColor: '#e2e8f0' }}
                onClick={() => navigate('/principal/dashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default PrincipalSchedule;