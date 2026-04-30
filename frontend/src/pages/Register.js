import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { registerUser } from '../api';

const DEPARTMENTS = ['Computer Science', 'Information Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Mathematics', 'Physics', 'Chemistry', 'MBA'];

function Register() {
  const { role } = useParams(); // 'hod' or 'staff'
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '' });
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (name, value) => {
    if (name === 'name') {
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'At least 2 characters';
      if (!/^[a-zA-Z\s.]+$/.test(value)) return 'Letters only';
    }
    if (name === 'email') {
      if (!value) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '❌ Use format: name@gmail.com';
    }
    if (name === 'password') {
      if (!value) return 'Password is required';
      if (value.length < 6) return `${6 - value.length} more characters needed`;
    }
    if (name === 'department' && role === 'hod') {
      if (!value) return 'Please select a department';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: validate(name, value) });
  };

  const isValid = (name) => form[name]?.length > 0 && !errors[name];

  const inputStyle = (name) => ({
    width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.95rem', outline: 'none',
    border: `1.5px solid ${errors[name] ? '#ef4444' : isValid(name) ? '#16a34a' : '#d1d5db'}`,
    borderRadius: '8px', transition: 'border 0.2s'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validate('name', form.name),
      email: validate('email', form.email),
      password: validate('password', form.password),
      ...(role === 'hod' ? { department: validate('department', form.department) } : {})
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    setServerError('');
    setServerMsg('');
    try {
      const res = await registerUser({ ...form, role });
      if (res.data.pendingApproval) {
        setServerMsg('✅ HOD registration submitted! Waiting for Principal approval. You will be able to login once approved.');
      } else {
        setServerMsg('✅ Account created! Redirecting to login...');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a5f, #16a34a)', display: 'flex', flexDirection: 'column' }}>
      <header className="smvit-header">
        <div className="smvit-logo-area">
          <div className="smvit-logo">SMVIT</div>
          <div>
            <div className="smvit-title">SIR M. VISVESVARAYA INSTITUTE OF TECHNOLOGY</div>
            <div className="smvit-subtitle">Affiliated to VTU, Belagavi | Approved by AICTE | Accredited by NAAC</div>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
          <h2 style={{ textAlign: 'center', color: '#1e3a5f', marginBottom: '0.3rem' }}>
            {role === 'hod' ? '👔 Register as HOD' : '👤 Register as Staff'}
          </h2>
          {role === 'hod' && (
            <p style={{ textAlign: 'center', color: '#f97316', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              ⚠️ HOD registration requires Principal approval
            </p>
          )}

          {serverMsg && <div className="alert alert-success">{serverMsg}</div>}
          {serverError && <div className="alert alert-error">❌ {serverError}</div>}

          {!serverMsg && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" placeholder="Dr. John Smith" value={form.name} onChange={handleChange} style={inputStyle('name')} />
                {errors.name && <p className="error-msg">❌ {errors.name}</p>}
                {isValid('name') && <p className="success-msg">✅ Looks good!</p>}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input name="email" type="text" placeholder="name@gmail.com" value={form.email} onChange={handleChange} style={inputStyle('email')} />
                {errors.email && <p className="error-msg">{errors.email}</p>}
                {isValid('email') && <p className="success-msg">✅ Valid email!</p>}
              </div>

              <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} style={inputStyle('password')} />
                {errors.password && <p className="error-msg">❌ {errors.password}</p>}
                {isValid('password') && <p className="success-msg">✅ Strong!</p>}
              </div>

              {role === 'hod' && (
                <div className="form-group">
                  <label>Department</label>
                  <select name="department" value={form.department} onChange={handleChange} style={inputStyle('department')}>
                    <option value="">-- Select Department --</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.department && <p className="error-msg">❌ {errors.department}</p>}
                </div>
              )}

              <button type="submit" className="btn btn-green" disabled={loading} style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}>
                {loading ? 'Submitting...' : role === 'hod' ? 'Submit for Approval' : 'Create Account'}
              </button>
            </form>
          )}

          <button onClick={() => navigate('/')} style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
