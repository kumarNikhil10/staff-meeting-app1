import React, { useState, useEffect } from 'react';
import { getMeetings, respondToMeeting, submitThroughput } from '../../api';
import '../Dashboard.css';

function StaffDashboard({ user }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [throughputModal, setThroughputModal] = useState(null);
  const [notes, setNotes] = useState('');

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

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleRespond = async (id, status) => {
    try { 
      await respondToMeeting(id, status); 
      flash(`✅ You have ${status} the meeting!`); 
      load(); 
    } catch (e) { 
      flash(e.response?.data?.message || '❌ Failed'); 
    }
  };

  const handleThroughput = async () => {
    if (!notes.trim()) return alert('Please enter your meeting notes');
    try {
      await submitThroughput(throughputModal._id, notes);
      flash('✅ Meeting notes submitted!');
      setThroughputModal(null); 
      setNotes(''); 
      load();
    } catch (e) { 
      flash('❌ Failed'); 
    }
  };

  const myAttendance = (meeting) => meeting.attendees?.find(a => a.user?._id === user.id || a.user === user.id);

  // Stats Logic
  const total = meetings.length;
  const upcoming = meetings.filter(m => m.status === 'scheduled').length;
  const completed = meetings.filter(m => {
      const att = myAttendance(m);
      return att?.throughput; // Count as completed only if notes are submitted
  }).length;

  // Split Data for Two Sections
  const activeMeetings = meetings.filter(m => {
    const att = myAttendance(m);
    return !att?.throughput; // Still needs action or notes
  });

  const earlierMeetings = meetings.filter(m => {
    const att = myAttendance(m);
    return att?.throughput; // Archive section
  });

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" style={{ borderTopColor: '#3b82f6' }}></div>
      <p>Loading Staff Portal...</p>
    </div>
  );

  return (
    <div className="dashboard-outer-wrapper">
      <main className="dashboard-content">
        <div className="dashboard-intro-row">
          <div className="welcome-box">
            <h1 className="page-title">Staff Dashboard</h1>
            <p className="welcome-text">Welcome back, <span className="user-highlight" style={{ borderBottomColor: '#3b82f6' }}>{user?.name || 'Staff'}</span></p>
          </div>
        </div>

        {msg && <div className={`alert-floating ${msg.includes('❌') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

        {/* Statistics Grid */}
        <div className="stat-grid-modern">
          <div className="stat-card-modern border-blue">
            <div className="stat-info">
              <span className="stat-label">Total Assigned</span>
              <div className="stat-num">{total}</div>
            </div>
            <div className="stat-icon-wrap">📋</div>
          </div>
          <div className="stat-card-modern" style={{ borderLeft: '5px solid #60a5fa' }}>
            <div className="stat-info">
              <span className="stat-label">Upcoming</span>
              <div className="stat-num" style={{ color: '#3b82f6' }}>{upcoming}</div>
            </div>
            <div className="stat-icon-wrap">⏳</div>
          </div>
          <div className="stat-card-modern border-green">
            <div className="stat-info">
              <span className="stat-label">Notes Provided</span>
              <div className="stat-num">{completed}</div>
            </div>
            <div className="stat-icon-wrap">✅</div>
          </div>
        </div>

        {/* --- SECTION 1: ACTIVE MEETINGS --- */}
        <div className="card-modern shadow-sm">
          <div className="card-header-modern">
            <h3>Your Assigned Meetings</h3>
          </div>
          <div className="table-container">
            {activeMeetings.length === 0 ? (
              <div className="empty-placeholder">No active meetings requiring your attention.</div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Scheduled By</th>
                    <th>Date & Time</th>
                    <th>Agenda</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMeetings.map(m => {
                    const att = myAttendance(m);
                    return (
                      <tr key={m._id}>
                        <td className="font-semibold">{m.scheduledBy?.name}</td>
                        <td>
                          <div className="datetime-cell">
                            <span className="date-text">
                              {new Date(m.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </span>
                            <span className="time-text">{m.time}</span>
                          </div>
                        </td>
                        <td className="agenda-text">{m.agenda || m.title}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span className={`status-pill pill-${m.status}`}>{m.status}</span>
                            {att && <span className={`status-pill pill-${att.status === 'pending' ? 'scheduled' : att.status === 'accepted' ? 'completed' : 'cancelled'}`} style={{ fontSize: '0.65rem' }}>Response: {att.status}</span>}
                          </div>
                        </td>
                        <td className="text-right">
                          <div className="action-cell">
                            {att && att.status === 'pending' && m.status === 'scheduled' && (
                              <>
                                <button className="btn-done" onClick={() => handleRespond(m._id, 'accepted')}>Accept</button>
                                <button className="logout-btn" style={{ padding: '6px 12px' }} onClick={() => handleRespond(m._id, 'declined')}>Decline</button>
                              </>
                            )}
                            {m.meetingLink && m.status === 'scheduled' && att?.status === 'accepted' && (
                              <a href={m.meetingLink} target="_blank" rel="noreferrer" className="btn-join">Join Link</a>
                            )}
                            {m.status === 'completed' && att && !att.throughput && (
                              <button className="btn-teal-modern" style={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={() => { setThroughputModal(m); setNotes(''); }}>
                                + Add Notes
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* --- SECTION 2: EARLIER MEETINGS & NOTES --- */}
        <div className="card-modern shadow-sm" style={{ marginTop: '2.5rem', borderTop: '4px solid #0d9488' }}>
          <div className="card-header-modern">
            <h3>Earlier Meetings & Notes</h3>
          </div>
          <div className="table-container">
            {earlierMeetings.length === 0 ? (
              <div className="empty-placeholder">No meeting history found.</div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Agenda</th>
                    <th>Notes (Throughput)</th>
                    <th className="text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {earlierMeetings.map(m => {
                    const att = myAttendance(m);
                    return (
                      <tr key={m._id}>
                        <td style={{ width: '120px' }}>{new Date(m.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td className="font-semibold" style={{ maxWidth: '200px' }}>{m.agenda || m.title}</td>
                        <td style={{ color: '#475569', fontStyle: 'italic', fontSize: '0.9rem', lineHeight: '1.4' }}>
                          "{att.throughput}"
                        </td>
                        <td className="text-right">
                          <span className="text-success" style={{ fontWeight: 700, fontSize: '0.8rem' }}>✓ ARCHIVED</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Throughput Modal */}
      {throughputModal && (
        <div className="modal-overlay">
          <div className="card-modern" style={{ width: '500px', padding: '2rem' }}>
            <h2 style={{ marginTop: 0, color: '#1e293b' }}>📝 Meeting Outcomes</h2>
            <p className="welcome-text" style={{ marginBottom: '1.5rem' }}>Submit notes for: <strong>{throughputModal.agenda || throughputModal.title}</strong></p>
            
            <div className="form-group">
              <label className="form-label">Discussion & Action Items</label>
              <textarea 
                className="form-input"
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                rows="5" 
                placeholder="What was decided? List any specific action items assigned to you..." 
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-teal-modern" style={{ flex: 2 }} onClick={handleThroughput}>Submit Throughput</button>
              <button className="logout-btn" style={{ flex: 1, background: '#f1f5f9', color: '#475569', borderColor: '#e2e8f0' }} onClick={() => setThroughputModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;