import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getMeetings } from '../api';
import './Dashboard.css';

function Dashboard({ user }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await getMeetings();
        setMeetings(res.data);
      } catch (err) {
        console.error('Error loading meetings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  // Calculate statistics using the dashboard logic
  const scheduled = meetings.filter(m => m.status === 'scheduled').length;
  const completed = meetings.filter(m => m.status === 'completed').length;
  const cancelled = meetings.filter(m => m.status === 'cancelled').length;

  // Get top 5 upcoming meetings
  const upcoming = meetings
    .filter(m => m.status === 'scheduled' && new Date(m.date) >= new Date())
    .slice(0, 5);

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading SMVIT Dashboard...</p>
    </div>
  );

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
              <Link to="/dashboard" className={`nav-item ${location.pathname.includes('dashboard') ? 'active' : ''}`}>Dashboard</Link>
              <Link to="/meetings" className="nav-item">Meetings</Link>
              {user.role === 'admin' && <Link to="/hod/schedule" className="nav-item">Schedule</Link>}
            </div>
            <button className="logout-btn">Logout</button>
          </nav>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-intro-row">
          <div className="welcome-box">
            <h1 className="page-title">Welcome, {user.name}!</h1>
            <p className="welcome-text">Here is a summary of your meeting activities</p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="stat-grid-modern">
          <div className="stat-card-modern border-blue">
            <div className="stat-info">
              <span className="stat-label">Scheduled</span>
              <div className="stat-num">{scheduled}</div>
            </div>
            <div className="stat-icon-wrap">📅</div>
          </div>
          <div className="stat-card-modern border-green">
            <div className="stat-info">
              <span className="stat-label">Completed</span>
              <div className="stat-num">{completed}</div>
            </div>
            <div className="stat-icon-wrap">✅</div>
          </div>
          <div className="stat-card-modern border-gray" style={{ borderLeftColor: '#ef4444' }}>
            <div className="stat-info">
              <span className="stat-label">Cancelled</span>
              <div className="stat-num" style={{ color: '#ef4444' }}>{cancelled}</div>
            </div>
            <div className="stat-icon-wrap">❌</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: user.role === 'admin' ? '2fr 1fr' : '1fr', gap: '2rem' }}>
          
          {/* Upcoming Meetings List */}
          <section className="card-modern shadow-sm">
            <div className="card-header-modern" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>📅 Upcoming Meetings</h3>
              <Link to="/meetings" className="auth-link" style={{ fontSize: '0.85rem' }}>View All →</Link>
            </div>
            
            <div className="meeting-list-compact">
              {upcoming.length === 0 ? (
                <p className="empty-placeholder">No upcoming meetings scheduled.</p>
              ) : (
                upcoming.map(meeting => (
                  <Link key={meeting._id} to={`/meetings/${meeting._id}`} className="meeting-item-link">
                    <div className="meeting-item-content">
                      <div className="meeting-main-info">
                        <span className="meeting-title-text">{meeting.title}</span>
                        <div className="meeting-sub-info">
                          <span>📍 {meeting.venue}</span>
                          <span>•</span>
                          <span>🕐 {meeting.time}</span>
                        </div>
                      </div>
                      <div className="meeting-date-badge">
                        {new Date(meeting.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Quick Actions (Sidebar style for Admin) */}
          {user.role === 'admin' && (
            <aside>
              <div className="card-modern shadow-sm" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1rem' }}>⚡ Quick Actions</h3>
                <Link to="/hod/schedule">
                  <button className="btn-teal-modern" style={{ width: '100%', fontSize: '0.9rem' }}>
                    + Schedule Meeting
                  </button>
                </Link>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;