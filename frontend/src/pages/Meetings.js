import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMeetings, deleteMeeting } from '../api';

function Meetings({ user }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, scheduled, completed, cancelled

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const res = await getMeetings();
      setMeetings(res.data);
    } catch (err) {
      console.error('Error loading meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return;

    try {
      await deleteMeeting(id);
      setMeetings(meetings.filter(m => m._id !== id)); // remove from list
      alert('Meeting deleted!');
    } catch (err) {
      alert('Failed to delete meeting');
    }
  };

  // Apply filter
  const filtered = filter === 'all' ? meetings : meetings.filter(m => m.status === filter);

  if (loading) return <div className="loading">Loading meetings...</div>;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>📋 All Meetings</h1>
        {user.role === 'admin' && (
          <Link to="/create-meeting">
            <button className="btn btn-primary">+ New Meeting</button>
          </Link>
        )}
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'scheduled', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="btn"
            style={{
              background: filter === f ? '#2563eb' : '#e5e7eb',
              color: filter === f ? 'white' : '#333',
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              textTransform: 'capitalize'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          No meetings found.
        </div>
      ) : (
        filtered.map(meeting => (
          <div key={meeting._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{meeting.title}</h2>
                  <span className={`badge badge-${meeting.status}`}>{meeting.status}</span>
                </div>

                {meeting.description && (
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {meeting.description}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap' }}>
                  <span>📅 {new Date(meeting.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>🕐 {meeting.time}</span>
                  <span>📍 {meeting.venue}</span>
                  <span>👤 {meeting.organizer?.name}</span>
                  <span>👥 {meeting.attendees?.length} attendees</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                <Link to={`/meetings/${meeting._id}`}>
                  <button className="btn btn-gray" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                    View
                  </button>
                </Link>
                {user.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(meeting._id)}
                    className="btn btn-danger"
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Meetings;
