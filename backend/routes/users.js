const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const principalOnly = (req, res, next) => {
  if (req.user.role !== 'principal') return res.status(403).json({ message: 'Principal access only' });
  next();
};

// GET ALL USERS
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'principal' } }).select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// GET PENDING HOD APPROVALS
router.get('/pending-hods', protect, principalOnly, async (req, res) => {
  try {
    const hods = await User.find({ role: 'hod', isApproved: false }).select('-password');
    res.json(hods);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// APPROVE HOD
router.put('/:id/approve', protect, principalOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.name} approved as HOD!`, user });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// REJECT HOD
router.delete('/:id/reject', protect, principalOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'HOD registration rejected and removed.' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// BLACKLIST USER
router.put('/:id/blacklist', protect, principalOnly, async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlacklisted: true, blacklistReason: reason || 'No reason given' },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.name} has been blacklisted.`, user });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// REMOVE FROM BLACKLIST
router.put('/:id/unblacklist', protect, principalOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlacklisted: false, blacklistReason: '' },
      { new: true }
    ).select('-password');
    res.json({ message: `${user.name} removed from blacklist.`, user });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// DELETE USER
router.delete('/:id', protect, principalOnly, async (req, res) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ message: 'Cannot delete yourself' });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.name} removed.` });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
