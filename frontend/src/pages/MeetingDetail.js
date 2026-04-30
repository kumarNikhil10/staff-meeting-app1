import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMeeting, respondToMeeting, updateMeeting, deleteMeeting } from '../api';

function MeetingDetail({ user }) {
  const { id } = useParams(); // get meeting ID from URL
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadMeeting = async () => {
      try {
        const res = await getMeeting(id);
        setMeeting(res.data);
      } catch (err) {
        alert('Meeting not found');
        navigate('/meetings');
      } finally {
        setLoading(false);
      }
    };
    loadMeeting();
  }, [id, navigate]);

  // Staff responds to invite
  const handleRespond = async (status) => {
    setActionLoading(true);
    try {
      const res = await respondToMeeting(id, status);
      setMeeting(res.data.meeting);
      alert(`You have ${status} the meeting!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to respond');
    } finally {
      setActionLoading(false);
    }
  };

  // Admin changes meeting status
  const handleStatusChange = async (newStatus) => {
    setActionLoading(true);
    try {
      const res = await updateMeeting(id, { status: newStatus });
      setMeeting(res.data.meeting);
      alert(`Meeting marked as ${newStatus}!`);
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this meeting permanently?')) return;
    try {
      await deleteMeeting(id);
      alert('Meeting deleted!');
      navigate('/meetings');
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="loading">Loading meeting details...</div>;
  if (!meeting) return null;

  // Find this user's attendance status
  const myAttendance = meeting.attendees?.find(a => a.user?._id === user.id);

  return (
    <div className="page">
      <button onClick={() => navigate('/meetings')} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#2563eb', fontSize: '0.9rem', marginBottom: '1rem'
      }}>
        ← Back to Meetings
      </button>

      {/* Meeting Header */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>{meeting.title}</h1>
            <span className={`badge badge-${meeting.status}`} style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}>
              {meeting.status}
            </span>
          </div>

          {/* Admin Controls */}
          {user.role === 'admin' && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {meeting.status === 'scheduled' && (
                <button onClick={() => handleStatusChange('completed')} className="btn btn-success" disabled={actionLoading}>
                  Mark Completed
                </button>
              )}
              {meeting.status === 'scheduled' && (
                <button onClick={() => handleStatusChange('cancelled')} className="btn btn-danger" disabled={actionLoading}>
                  Cancel Meeting
                </button>
              )}
              <button onClick={handleDelete} className="btn btn-danger" disabled={actionLoading}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Meeting Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card">
          <h2>📋 Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['📅 Date', new Date(meeting.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
                ['🕐 Time', meeting.time],
                ['📍 Venue', meeting.venue],
                ['👤 Organizer', meeting.organizer?.name],
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.6rem 0', color: '#64748b', fontSize: '0.9rem', width: '40%' }}>{label}</td>
                  <td style={{ padding: '0.6rem 0', fontWeight: '500' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* My Invite Status */}
        {myAttendance && (
          <div className="card">
            <h2>📨 Your Invitation</h2>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              Status: <span className={`badge badge-${myAttendance.status}`}>{myAttendance.status}</span>
            </p>
            {meeting.status === 'scheduled' && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleRespond('accepted')}
                  className="btn btn-success"
                  disabled={actionLoading || myAttendance.status === 'accepted'}
                >
                  ✅ Accept
                </button>
                <button
                  onClick={() => handleRespond('declined')}
                  className="btn btn-danger"
                  disabled={actionLoading || myAttendance.status === 'declined'}
                >
                  ❌ Decline
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {meeting.description && (
        <div className="card">
          <h2>📄 Description</h2>
          <p style={{ color: '#475569', lineHeight: '1.7' }}>{meeting.description}</p>
        </div>
      )}

      {/* Agenda */}
      {meeting.agenda && (
        <div className="card">
          <h2>📌 Agenda</h2>
          <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap', color: '#475569', lineHeight: '1.7' }}>
            {meeting.agenda}
          </pre>
        </div>
      )}

      {/* Attendees List */}
      <div className="card">
        <h2>👥 Attendees ({meeting.attendees?.length})</h2>
        {meeting.attendees?.length === 0 ? (
          <p style={{ color: '#64748b' }}>No attendees added.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.7rem' }}>
            {meeting.attendees.map(a => (
              <div key={a._id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.7rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{a.user?.name}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{a.user?.email}</div>
                </div>
                <span className={`badge badge-${a.status}`}>{a.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MeetingDetail;
