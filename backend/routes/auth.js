const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please fill in all fields' });
    if (name.trim().length < 2)
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    if (!emailRegex.test(email))
      return res.status(400).json({ message: 'Please enter a valid email (e.g. name@gmail.com)' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (role === 'principal')
      return res.status(403).json({ message: 'Principal account cannot be registered.' });
    if (role === 'hod' && !department)
      return res.status(400).json({ message: 'HOD must select a department' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(400).json({ message: 'An account with this email already exists.' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // HODs need principal approval, staff are auto-approved
    const isApproved = role === 'hod' ? false : true;

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashed,
      role: role || 'staff',
      department: department || '',
      isApproved
    });

    if (role === 'hod') {
      return res.status(201).json({
        message: 'HOD registration submitted! Waiting for Principal approval.',
        pendingApproval: true
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Make sure MongoDB is running.' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Please enter email and password' });
    if (!emailRegex.test(email))
      return res.status(400).json({ message: 'Please enter a valid email address' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(400).json({ message: 'No account found with this email.' });

    // Check role matches login page
    if (role && user.role !== role)
      return res.status(400).json({ message: `This account is not a ${role}. Please use the correct login.` });

    if (user.isBlacklisted)
      return res.status(403).json({ message: 'Your account has been blacklisted. Contact the Principal.' });

    if (!user.isApproved)
      return res.status(403).json({ message: 'Your HOD registration is pending Principal approval.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Incorrect password. Please try again.' });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Make sure MongoDB is running.' });
  }
});

module.exports = router;
