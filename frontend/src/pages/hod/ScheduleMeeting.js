import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createMeeting, getUsers } from '../../api';


function HodSchedule({ user }) {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({ 
    title: '', 
    agenda: '', 
    date: '', 
    time: '', 
    meetingLink: '', 
    venue: '', 
    selectedStaff: [] 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers()
      .then(r => setStaffList(r.data.filter(u => u.role === 'staff' && !u.isBlacklisted)))
      .catch(console.error);
  }, []);

  const toggle = (id) => {
    setForm(f => ({ 
      ...f, 
      selectedStaff: f.selectedStaff.includes(id) 
        ? f.selectedStaff.filter(x => x !== id) 
        : [...f.selectedStaff, id] 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    if (!form.title || !form.date || !form.time) return setError('Title, date and time are required');
    setLoading(true);
    try {
      await createMeeting({ 
        title: form.title, 
        agenda: form.agenda, 
        date: form.date, 
        time: form.time, 
        meetingLink: form.meetingLink, 
        venue: form.venue, 
        attendees: form.selectedStaff 
      });
      alert('Meeting scheduled!');
      navigate('/hod/dashboard');
    } catch (err) { 
      setError(err.response?.data?.message || 'Failed to schedule meeting'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="dashboard-outer-wrapper">
      {/* Institutional Header with Emerald HOD Accent */}
      <header className="inst-header">
        <div className="inst-container">
          <div className="inst-branding">
            <h2 className="inst-short">SMVIT</h2>
            <h1 className="inst-full">SIR M. VISVESVARAYA INSTITUTE OF TECHNOLOGY</h1>
            <p className="inst-creds">Department of {user.department || 'Academics'}</p>
          </div>
          
          <nav className="header-nav">
            <div className="nav-links">
              <Link to="/hod/dashboard" className="nav-item">Dashboard</Link>
              <Link to="/hod/schedule" className="nav-item active">Schedule Meeting</Link>
            </div>
            <button className="logout-btn">Logout</button>
          </nav>
        </div>
      </header>

      <main className="dashboard-content" style={{ maxWidth: '800px' }}>
        <div className="dashboard-intro-row">
          <div className="welcome-box">
            <h1 className="page-title">Department Meeting</h1>
            <p className="welcome-text">Schedule a new session for staff members</p>
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
                placeholder="e.g. Monthly Lab Review" 
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
              <label className="form-label">Agenda / Topic</label>
              <textarea 
                className="form-input"
                rows="3" 
                placeholder="Enter discussion points..." 
                value={form.agenda} 
                onChange={e => setForm({ ...form, agenda: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Online Meeting Link</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="https://meet.google.com/xxx-xxxx-xxx" 
                value={form.meetingLink} 
                onChange={e => setForm({ ...form, meetingLink: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Venue (In-Person)</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. Seminar Hall, Room 201" 
                value={form.venue} 
                onChange={e => setForm({ ...form, venue: e.target.value })} 
              />
            </div>

            <hr className="auth-divider" style={{ margin: '2rem 0' }} />

            <div className="form-group">
              <label className="form-label">Select Staff Attendees ({form.selectedStaff.length})</label>
              <div className="attendee-selector shadow-sm">
                {staffList.length === 0 ? (
                  <p className="empty-placeholder">No staff members found.</p>
                ) : (
                  staffList.map(s => (
                    <label 
                      key={s._id} 
                      className={`attendee-item ${form.selectedStaff.includes(s._id) ? 'selected' : ''}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={form.selectedStaff.includes(s._id)} 
                        onChange={() => toggle(s._id)} 
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

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
              <button 
                type="submit" 
                className="btn-teal-modern" 
                style={{ width: '100%', padding: '1rem' }} 
                disabled={loading}
              >
                {loading ? 'Scheduling...' : '📅 Finalize & Schedule Meeting'}
              </button>
              <button 
                type="button" 
                className="logout-btn" 
                style={{ width: '30%', background: '#f1f5f9', color: '#475569', borderColor: '#e2e8f0' }}
                onClick={() => navigate('/hod/dashboard')}
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

export default HodSchedule;