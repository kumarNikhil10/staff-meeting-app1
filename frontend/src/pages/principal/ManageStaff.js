import React, { useState, useEffect } from 'react';
// Only import what you need
import { getUsers, blacklistUser, unblacklistUser } from '../../api'; 
import '../Dashboard.css';

function ManageStaff() {
  const [staff, setStaff] = useState([]);

  const loadStaff = () => {
    getUsers().then(r => setStaff(r.data.filter(u => u.role === 'staff')));
  };

  useEffect(() => { loadStaff(); }, []);

  const handleBlacklist = async (id, isBlacklisted) => {
    try {
      if (isBlacklisted) await unblacklistUser(id);
      else await blacklistUser(id);
      loadStaff();
    } catch (e) { alert("Operation failed"); }
  };

  return (
    <div className="dashboard-outer-wrapper">
      <main className="dashboard-content">
        <h1 className="page-title">Staff Registry</h1>
        <div className="card-modern shadow-sm">
          <table className="modern-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.isBlacklisted ? '🔴 Restricted' : '🟢 Active'}</td>
                  <td>
                    <button 
                      className="logout-btn" 
                      style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                      onClick={() => handleBlacklist(s._id, s.isBlacklisted)}
                    >
                      {s.isBlacklisted ? 'Unblacklist' : 'Blacklist'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default ManageStaff;