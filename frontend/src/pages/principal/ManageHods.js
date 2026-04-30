import React, { useState, useEffect } from 'react';
// Change updateApproval to approveHod and rejectHod
import { getUsers, approveHod, rejectHod } from '../../api'; 
import '../Dashboard.css';

function ManageHods() {
  const [hods, setHods] = useState([]);

  useEffect(() => {
    getUsers().then(r => {
      setHods(r.data.filter(u => u.role === 'hod'));
    });
  }, []);

  const handleAction = async (id, currentStatus) => {
    try {
      if (currentStatus) {
        await rejectHod(id); // If already approved, reject/revoke
      } else {
        await approveHod(id); // If pending, approve
      }
      // Refresh list
      const r = await getUsers();
      setHods(r.data.filter(u => u.role === 'hod'));
    } catch (e) {
      alert("Action failed");
    }
  };

  return (
    <div className="dashboard-outer-wrapper">
      <main className="dashboard-content">
        <h1 className="page-title">Manage HODs</h1>
        <div className="card-modern shadow-sm">
          <table className="modern-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Dept</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {hods.map(h => (
                <tr key={h._id}>
                  <td>{h.name}</td>
                  <td>{h.email}</td>
                  <td>{h.department}</td>
                  <td>
                    <span className={`status-pill ${h.isApproved ? 'pill-completed' : 'pill-scheduled'}`}>
                      {h.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-done" onClick={() => handleAction(h._id, h.isApproved)}>
                      {h.isApproved ? 'Revoke' : 'Approve'}
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

export default ManageHods;