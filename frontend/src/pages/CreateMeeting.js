import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createMeeting, getStaff } from '../api';
import '../Dashboard.css'; // Reusing your main theme file

function CreateMeeting() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    agenda: '',
    attendees: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const res = await getStaff();
        setStaff(res.data);
      } catch (err) {
        console.error('Error loading staff');
      }
    };
    loadStaff();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleAttendee = (id) => {
    if (form.attendees.includes(id)) {
      setForm({ ...form, attendees: form.attendees.filter(a => a !== id) });
    } else {
      setForm({ ...form, attendees: [...form.attendees, id] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createMeeting(form);
      alert('Meeting created successfully!');
      navigate('/hod/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-outer-wrapper">
      {/* Institutional Header */}
      <header className="inst-header">
        <div className="inst-container">
          <div className="inst-branding">
            <h2 className="inst-short">SMVIT</h2>
            <h1 className="inst-full">SIR M. VISVESVARAYA INSTITUTE OF TECHNOLOGY</h1>
            <p className="inst-creds">Established by Sri Krishnadevaraya Educational Trust</p>
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
            <h1 className="page-title">Schedule New Meeting</h1>
            <p className="welcome-text">Organize and invite staff for department reviews</p>
          </div>
        </div>

        {error && <div className="alert-floating alert-error">{error}</div>}

        <div className="card-modern shadow-sm" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Meeting Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Department Monthly Review"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-input"
                placeholder="Brief description..."
                value={form.description}
                onChange={handleChange}
                rows="2"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time *</label>
                <input
                  type="time"
                  name="time"
                  className="form-input"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Venue *</label>
              <input
                type="text"
                name="venue"
                className="form-input"
                placeholder="e.g. Conference Room A"
                value={form.venue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Agenda / Topics</label>
              <textarea
                name="agenda"
                className="form-input"
                placeholder="1. Exam schedule...&#10;2. Lab updates..."
                value={form.agenda}
                onChange={handleChange}
                rows="4"
              />
            </div>

            {/* Staff Selection List */}
            <div className="form-group">
              <label className="form-label">Select Attendees ({form.attendees.length})</label>
              <div className="attendee-selector shadow-sm">
                {staff.length === 0 ? (
                  <p className="empty-placeholder">No staff members found.</p>
                ) : (
                  staff.map(member => (
                    <label
                      key={member._id}
                      className={`attendee-item ${form.attendees.includes(member._id) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={form.attendees.includes(member._id)}
                        onChange={() => toggleAttendee(member._id)}
                      />
                      <div className="attendee-info">
                        <span className="attendee-name">{member.name}</span>
                        <span className="attendee-email">{member.email}</span>
                      </div>
                      <span className={`status-pill pill-${member.role === 'admin' ? 'completed' : 'scheduled'}`} style={{ marginLeft: 'auto' }}>
                        {member.role}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="btn-teal-modern" style={{ flex: 2 }} disabled={loading}>
                {loading ? 'Creating...' : '✅ Confirm & Create Meeting'}
              </button>
              <button type="button" className="logout-btn" style={{ flex: 1, padding: '10px' }} onClick={() => navigate('/hod/dashboard')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateMeeting;