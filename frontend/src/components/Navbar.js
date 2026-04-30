import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../pages/Dashboard.css'; // Ensure the theme CSS is imported

function Navbar({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const getLinks = () => {
    if (!user) return null;
    
    if (user.role === 'principal') return (
      <>
        <Link to="/principal/dashboard" className={`nav-item ${isActive('/principal/dashboard')}`}>Dashboard</Link>
        <Link to="/principal/manage-hods" className={`nav-item ${isActive('/principal/manage-hods')}`}>HODs</Link>
        <Link to="/principal/manage-staff" className={`nav-item ${isActive('/principal/manage-staff')}`}>Staff</Link>
        <Link to="/principal/blacklist" className={`nav-item ${isActive('/principal/blacklist')}`}>Blacklist</Link>
      </>
    );
    
    if (user.role === 'hod') return (
      <>
        <Link to="/hod/dashboard" className={`nav-item ${isActive('/hod/dashboard')}`}>Dashboard</Link>
        <Link to="/hod/schedule" className={`nav-item ${isActive('/hod/schedule')}`}>Schedule Meeting</Link>
      </>
    );
    
    if (user.role === 'staff') return (
      <>
        <Link to="/staff/dashboard" className={`nav-item ${isActive('/staff/dashboard')}`}>Dashboard</Link>
      </>
    );
  };

  return (
    <header className="inst-header">
      <div className="inst-container">
        {/* Branding Section */}
        <div className="inst-branding">
          <h2 className="inst-short">SMVIT</h2>
          <h1 className="inst-full">SIR M. VISVESVARAYA INSTITUTE OF TECHNOLOGY</h1>
          <p className="inst-creds">
            Affiliated to VTU, Belagavi | Approved by AICTE, New Delhi | Accredited by NAAC
          </p>
        </div>
        
        {/* Navigation Section */}
        <nav className="header-nav">
          <div className="nav-links">
            {getLinks()}
          </div>
          {user && (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;