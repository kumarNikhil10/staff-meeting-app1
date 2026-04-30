import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMeetings, getUsers, getPendingHods, approveHod, rejectHod, blacklistUser } from '../../api';
import '../Dashboard.css';

function PrincipalDashboard({ user }) {
  const [meetings, setMeetings] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingHods, setPendingHods] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [blacklistModal, setBlacklistModal] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [m, u, p] = await Promise.all([getMeetings(), getUsers(), getPendingHods()]);
      setMeetings(m.data);
      setUsers(u.data);
      setPendingHods(p.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleApprove = async (id) => {
    try { await approveHod(id); flash('✅ HOD Approved!'); loadAll(); }
    catch (err) { flash('❌ Failed'); }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this HOD registration?')) return;
    try { await rejectHod(id); flash('HOD registration rejected.'); loadAll(); }
    catch (err) { flash('❌ Failed'); }
  };

  const handleBlacklist = async () => {
    if (!reason.trim()) return alert('Please enter a reason');
    try {
      await blacklistUser(blacklistModal._id, reason);
      flash(`✅ ${blacklistModal.name} blacklisted.`);
      setBlacklistModal(null); setReason('');
      loadAll();
    } catch (err) { flash('❌ Failed'); }
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" style={{ borderTopColor: '#1e40af' }}></div>
      <p>Loading Principal Terminal...</p>
    </div>
  );

  const hods = users.filter(u => u.role === 'hod' && u.isApproved);
  const staff = users.filter(u => u.role === 'staff');
  const blacklisted = users.filter(u => u.isBlacklisted);

  return (
    <div className="dashboard-outer-wrapper">
      <main className="dashboard-content">
        <div className="dashboard-intro-row">
          <div className="welcome-box">
            <h1 className="page-title">Principal Dashboard</h1>
            <p className="welcome-text">Institutional overview and administrative controls</p>
          </div>
          <Link to="/principal/schedule">
            <button className="btn-teal-modern" style={{ background: '#1e293b' }}>
              📢 Global Announcement Meeting
            </button>
          </Link>
        </div>

        {msg && <div className={`alert-floating ${msg.includes('❌') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

        {/* Statistics Grid */}
        <div className="stat-grid-modern">
          <div className="stat-card-modern" style={{ borderLeft: '5px solid #1e40af' }}>
            <div className="stat-info">
              <span className="stat-label">Total HODs</span>
              <div className="stat-num">{hods.length}</div>
            </div>
            <div className="stat-icon-wrap">👔</div>
          </div>
          <div className="stat-card-modern" style={{ borderLeft: '5px solid #3b82f6' }}>
            <div className="stat-info">
              <span className="stat-label">Total Staff</span>
              <div className="stat-num">{staff.length}</div>
            </div>
            <div className="stat-icon-wrap">👥</div>
          </div>
          <div className="stat-card-modern border-green">
            <div className="stat-info">
              <span className="stat-label">All Meetings</span>
              <div className="stat-num">{meetings.length}</div>
            </div>
            <div className="stat-icon-wrap">📅</div>
          </div>
          <div className="stat-card-modern" style={{ borderLeft: '5px solid #dc2626' }}>
            <div className="stat-info">
              <span className="stat-label">Blacklisted</span>
              <div className="stat-num" style={{ color: '#dc2626' }}>{blacklisted.length}</div>
            </div>
            <div className="stat-icon-wrap">🚫</div>
          </div>
        </div>

        {/* Pending HOD Approvals - High Priority Card */}
        {pendingHods.length > 0 && (
          <div className="card-modern shadow-sm" style={{ marginBottom: '2.5rem', border: '1px solid #f97316' }}>
            <div className="card-header-modern" style={{ background: '#fff7ed' }}>
              <h3 style={{ color: '#ea580c' }}>⏳ Pending HOD Approvals ({pendingHods.length})</h3>
            </div>
            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Department</th><th className="text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {pendingHods.map(h => (
                    <tr key={h._id}>
                      <td className="font-semibold">{h.name}</td>
                      <td>{h.email}</td>
                      <td><span className="status-pill" style={{ background: '#ffedd5', color: '#9a3412' }}>{h.department}</span></td>
                      <td className="text-right">
                        <div className="action-cell">
                          <button className="btn-done" onClick={() => handleApprove(h._id)}>Approve</button>
                          <button className="logout-btn" style={{ padding: '6px 12px' }} onClick={() => handleReject(h._id)}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Activity Table */}
        <div className="card-modern shadow-sm">
          <div className="card-header-modern">
            <h3>Recent Meeting Activity</h3>
          </div>
          <div className="table-container">
            {meetings.length === 0 ? (
              <div className="empty-placeholder">No institutional meetings recorded.</div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Attendees</th>
                    <th>Organizer</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.slice(0, 8).map((m) => (
                    <tr key={m._id}>
                      <td className="font-semibold">
                        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {m.attendees?.map(a => a.user?.name).join(', ') || 'Global'}
                        </div>
                      </td>
                      <td>{m.scheduledBy?.name}</td>
                      <td>
                        <div className="datetime-cell">
                          <span className="date-text">{new Date(m.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                          <span className="time-text">{m.time}</span>
                        </div>
                      </td>
                      <td><span className={`status-pill pill-${m.status}`}>{m.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Blacklist Modal - Lore Themed */}
      {blacklistModal && (
        <div className="modal-overlay">
          <div className="card-modern" style={{ width: '400px', padding: '2rem' }}>
            <h2 style={{ color: '#dc2626', marginTop: 0 }}>Restrict Access</h2>
            <p className="welcome-text">User: <strong>{blacklistModal.name}</strong></p>
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label">Reason for Blacklist</label>
              <textarea 
                className="form-input" 
                value={reason} 
                onChange={e => setReason(e.target.value)} 
                rows="3" 
                placeholder="Misconduct, security breach, etc..."
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="auth-btn" style={{ background: '#dc2626' }} onClick={handleBlacklist}>Confirm Blacklist</button>
              <button className="logout-btn" style={{ background: '#f1f5f9', color: '#475569', borderColor: '#e2e8f0' }} onClick={() => { setBlacklistModal(null); setReason(''); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrincipalDashboard;