import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import PrincipalDashboard from './pages/principal/Dashboard';
import PrincipalSchedule from './pages/principal/ScheduleMeeting';
import Blacklist from './pages/principal/Blacklist';
import HodDashboard from './pages/hod/Dashboard';
import HodSchedule from './pages/hod/ScheduleMeeting';
import StaffDashboard from './pages/staff/Dashboard';
import ManageHods from './pages/principal/ManageHods';
import ManageStaff from './pages/principal/ManageStaff';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const RoleRoute = ({ element, roles }) => {
    if (!user) return <Navigate to="/" />;
    if (!roles.includes(user.role)) return <Navigate to={`/${user.role}/dashboard`} />;
    return element;
  };

  return (
    <BrowserRouter>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        {/* Public */}
        <Route path="/" element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <Home onLogin={handleLogin} />} />
        <Route path="/register/:role" element={<Register />} />

        {/* Principal */}
        <Route path="/principal/dashboard" element={<RoleRoute element={<PrincipalDashboard user={user} />} roles={['principal']} />} />
        <Route path="/principal/schedule" element={<RoleRoute element={<PrincipalSchedule user={user} />} roles={['principal']} />} />
        <Route path="/principal/blacklist" element={<RoleRoute element={<Blacklist user={user} />} roles={['principal']} />} />

        {/* HOD */}
        <Route path="/hod/dashboard" element={<RoleRoute element={<HodDashboard user={user} />} roles={['hod']} />} />
        <Route path="/hod/schedule" element={<RoleRoute element={<HodSchedule user={user} />} roles={['hod']} />} />

        {/* Staff */}
        <Route path="/staff/dashboard" element={<RoleRoute element={<StaffDashboard user={user} />} roles={['staff']} />} />

        <Route path="*" element={<Navigate to="/" />} />
        {/* Principal Management Routes */}
        <Route path="/principal/manage-hods" element={<RoleRoute element={<ManageHods user={user} />} roles={['principal']} />} />
        <Route path="/principal/manage-staff" element={<RoleRoute element={<ManageStaff user={user} />} roles={['principal']} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
