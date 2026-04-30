import React, { useState, useEffect } from 'react';
import { getUsers, blacklistUser, unblacklistUser } from '../../api';

function Blacklist() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [modal, setModal] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { const r = await getUsers(); setUsers(r.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleBlacklist = async () => {
    if (!reason.trim()) return alert('Enter a reason');
    try {
      await blacklistUser(modal._id, reason);
      flash(`✅ ${modal.name} blacklisted.`);
      setModal(null); setReason(''); load();
    } catch (e) { flash('❌ Failed'); }
  };

  const handleUnblacklist = async (u) => {
    if (!window.confirm(`Remove ${u.name} from blacklist?`)) return;
    try { await unblacklistUser(u._id); flash(`✅ ${u.name} removed from blacklist.`); load(); }
    catch (e) { flash('❌ Failed'); }
  };

  const blacklisted = users.filter(u => u.isBlacklisted);
  const active = users.filter(u => !u.isBlacklisted);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="bg-wrapper">
      <div className="bg-content">
        <h1 className="page-title text-red">Blacklisted Users</h1>
        {msg && <div className={`alert ${msg.includes('❌') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

        <div className="card">
          {blacklisted.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No blacklisted users.</p>
          ) : (
            <table>
              <thead style={{ background: '#fee2e2' }}>
                <tr><th>ID</th><th>Name</th><th>Role</th><th>Reason</th><th>Action</th></tr>
              </thead>
              <tbody>
                {blacklisted.map((u, i) => (
                  <tr key={u._id}>
                    <td>{i + 1}</td>
                    <td>{u.name}</td>
                    <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                    <td>{u.blacklistReason}</td>
                    <td><button className="btn btn-green btn-sm" onClick={() => handleUnblacklist(u)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h2>Add to Blacklist</h2>
          <table>
            <thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Action</th></tr></thead>
            <tbody>
              {active.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td>{u.department || '—'}</td>
                  <td><button className="btn btn-red btn-sm" onClick={() => setModal(u)}>Blacklist</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '400px' }}>
              <h2 style={{ color: '#dc2626' }}>Blacklist {modal.name}</h2>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Reason *</label>
                <textarea value={reason} onChange={e => setReason(e.target.value)} rows="3" placeholder="e.g. Misconduct" />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-red" onClick={handleBlacklist}>Confirm</button>
                <button className="btn btn-gray" onClick={() => { setModal(null); setReason(''); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blacklist;
