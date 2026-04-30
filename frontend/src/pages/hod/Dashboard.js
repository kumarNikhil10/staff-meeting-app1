import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getMeetings, updateMeetingStatus } from '../../api';


function HodDashboard({ user }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const location = useLocation();

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { 
      const r = await getMeetings(); 
      setMeetings(r.data); 
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleStatus = async (id, status) => {
    try { 
      await updateMeetingStatus(id, status); 
      flash(`✅ Meeting marked as ${status}`); 
      load(); 
    } catch (e) { 
      flash('❌ Failed'); 
    }
  };

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const today = new Date().toDateString();
  const todayMeetings = meetings.filter(m => new Date(m.date).toDateString() === today);
  const upcoming = meetings.filter(m => m.status === 'scheduled' && new Date(m.date) >= new Date());
  const completed = meetings.filter(m => m.status === 'completed');

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading SMVIT Systems...</p>
    </div>
  );

  return (
    <div className="dashboard-outer-wrapper">
      <main className="dashboard-content">
        {msg && <div className={`alert-floating ${msg.includes('❌') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

        <div className="dashboard-intro-row">
          <div className="welcome-box">
            <h1 className="page-title">HOD Dashboard</h1>
            <p className="welcome-text">Welcome back, <span className="user-highlight">{user?.name || 'HOD'}</span></p>
          </div>
        </div>

        <div className="stat-grid-modern">
          <div className="stat-card-modern border-green">
            <div className="stat-info">
              <span className="stat-label">Today's Meetings</span>
              <div className="stat-num">{todayMeetings.length}</div>
            </div>
            <div className="stat-icon-wrap">📅</div>
          </div>
          <div className="stat-card-modern border-blue">
            <div className="stat-info">
              <span className="stat-label">Upcoming</span>
              <div className="stat-num">{upcoming.length}</div>
            </div>
            <div className="stat-icon-wrap">⏳</div>
          </div>
          <div className="stat-card-modern border-gray">
            <div className="stat-info">
              <span className="stat-label">Completed</span>
              <div className="stat-num">{completed.length}</div>
            </div>
            <div className="stat-icon-wrap">✅</div>
          </div>
        </div>

        <div className="card-modern shadow-sm">
          <div className="card-header-modern">
            <h3>Meeting Schedule</h3>
          </div>
          
          <div className="table-container">
            {meetings.length === 0 ? (
              <div className="empty-placeholder">No meetings scheduled.</div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Staff / Participant</th>
                    <th>Date & Time</th>
                    <th>Agenda</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map(m => (
                    <tr key={m._id}>
                      <td className="font-semibold">
                        {m.scheduledBy?.name === user?.name 
                          ? m.attendees?.map(a => a.user?.name).join(', ') 
                          : m.scheduledBy?.name}
                      </td>
                      <td>
                        <div className="datetime-cell">
                          <span className="date-text">
                            {new Date(m.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </span>
                          <span className="time-text">{m.time}</span>
                        </div>
                      </td>
                      <td className="agenda-text">{m.agenda || m.title}</td>
                      <td><span className={`status-pill pill-${m.status}`}>{m.status}</span></td>
                      <td className="text-right">
                        <div className="action-cell">
                          {m.status === 'scheduled' && m.scheduledBy?._id === user?.id && (
                            <button className="btn-done" onClick={() => handleStatus(m._id, 'completed')}>Done</button>
                          )}
                          {m.meetingLink && m.status === 'scheduled' && (
                            <a href={m.meetingLink} target="_blank" rel="noreferrer" className="btn-join">Join</a>
                          )}
                          {m.status === 'completed' && <span className="text-success">✓ Finished</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default HodDashboard;