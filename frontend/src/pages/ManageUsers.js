import React, { useState, useEffect } from 'react';
import { getStaff, changeUserRole, deleteUser } from '../api';

function ManageUsers({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await getStaff();
      setUsers(res.data);
    } catch (err) {
      console.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole, name) => {
    const action = newRole === 'admin' ? 'make admin' : 'make staff';
    if (!window.confirm(`Are you sure you want to ${action} for ${name}?`)) return;

    try {
      const res = await changeUserRole(id, newRole);
      setMessage(res.data.message);
      // Update the user in the list without reloading
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to change role');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete ${name}? This cannot be undone.`)) return;

    try {
      await deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
      setMessage(`${name} has been removed.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  const admins = users.filter(u => u.role === 'admin');
  const staff = users.filter(u => u.role === 'staff');

  return (
    <div className="page">
      <h1>👥 Manage Users</h1>

      {message && (
        <div style={{
          background: message.includes('cannot') || message.includes('Failed') ? '#fee2e2' : '#dcfce7',
          color: message.includes('cannot') || message.includes('Failed') ? '#991b1b' : '#166534',
          padding: '0.8rem 1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontWeight: '500'
        }}>
          {message}
        </div>
      )}

      {/* Admins Section */}
      <div className="card">
        <h2>🔑 Admins ({admins.length})</h2>
        {admins.map(u => (
          <div key={u._id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '0.5rem'
          }}>
            <div>
              <div style={{ fontWeight: '600' }}>
                {u.name}
                {u._id === user.id && (
                  <span style={{
                    background: '#ede9fe', color: '#7c3aed',
                    fontSize: '0.7rem', padding: '2px 8px',
                    borderRadius: '10px', marginLeft: '8px'
                  }}>You</span>
                )}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{u.email}</div>
            </div>

            {u._id !== user.id && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleRoleChange(u._id, 'staff', u.name)}
                  className="btn btn-gray"
                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}
                >
                  Make Staff
                </button>
                <button
                  onClick={() => handleDelete(u._id, u.name)}
                  className="btn btn-danger"
                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Staff Section */}
      <div className="card">
        <h2>👤 Staff Members ({staff.length})</h2>
        {staff.length === 0 ? (
          <p style={{ color: '#64748b' }}>No staff members yet.</p>
        ) : (
          staff.map(u => (
            <div key={u._id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.8rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '0.5rem'
            }}>
              <div>
                <div style={{ fontWeight: '600' }}>{u.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{u.email}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleRoleChange(u._id, 'admin', u.name)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}
                >
                  Make Admin
                </button>
                <button
                  onClick={() => handleDelete(u._id, u.name)}
                  className="btn btn-danger"
                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManageUsers;