const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET ALL STAFF - GET /api/staff
router.get('/', protect, async (req, res) => {
  try {
    const staff = await User.find().select('-password');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET MY PROFILE - GET /api/staff/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CHANGE USER ROLE - PUT /api/staff/:id/role (admin only)
router.put('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;

    // Prevent admin from changing their own role accidentally
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot change your own role!' });
    }

    if (!['admin', 'staff'].includes(role)) {
      return res.status(400).json({ message: 'Role must be admin or staff' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `${user.name} is now ${role}!`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE USER - DELETE /api/staff/:id (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account!' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `${user.name} has been removed.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;