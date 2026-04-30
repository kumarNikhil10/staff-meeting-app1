const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const { protect } = require('../middleware/auth');

// GET MY MEETINGS
router.get('/', protect, async (req, res) => {
  try {
    let meetings;
    if (req.user.role === 'principal') {
      meetings = await Meeting.find()
        .populate('scheduledBy', 'name role department')
        .populate('attendees.user', 'name email role department')
        .sort({ date: -1 });
    } else {
      meetings = await Meeting.find({
        $or: [
          { scheduledBy: req.user.id },
          { 'attendees.user': req.user.id }
        ]
      })
        .populate('scheduledBy', 'name role department')
        .populate('attendees.user', 'name email role department')
        .sort({ date: -1 });
    }
    res.json(meetings);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// GET ONE MEETING
router.get('/:id', protect, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('scheduledBy', 'name role department')
      .populate('attendees.user', 'name email role department');
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json(meeting);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// CREATE MEETING (principal or hod)
router.post('/', protect, async (req, res) => {
  try {
    if (!['principal', 'hod'].includes(req.user.role))
      return res.status(403).json({ message: 'Only Principal or HOD can schedule meetings' });

    const { title, agenda, date, time, meetingLink, venue, attendees } = req.body;
    if (!title || !date || !time)
      return res.status(400).json({ message: 'Title, date and time are required' });

    const meeting = await Meeting.create({
      title,
      agenda,
      date,
      time,
      meetingLink,
      venue,
      scheduledBy: req.user.id,
      scheduledByRole: req.user.role,
      attendees: attendees ? attendees.map(id => ({ user: id })) : []
    });

    const populated = await Meeting.findById(meeting._id)
      .populate('scheduledBy', 'name role department')
      .populate('attendees.user', 'name email');

    res.status(201).json({ message: 'Meeting scheduled!', meeting: populated });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// UPDATE STATUS (principal or hod who created it)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    meeting.status = status;
    await meeting.save();
    res.json({ message: `Meeting marked as ${status}`, meeting });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// STAFF: ACCEPT / DECLINE INVITE
router.put('/:id/respond', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    const attendee = meeting.attendees.find(a => a.user.toString() === req.user.id);
    if (!attendee) return res.status(400).json({ message: 'You are not invited to this meeting' });

    attendee.status = status;
    await meeting.save();
    res.json({ message: `You have ${status} the meeting!` });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// STAFF: SUBMIT THROUGHPUT (meeting notes)
router.put('/:id/throughput', protect, async (req, res) => {
  try {
    const { throughput } = req.body;
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    const attendee = meeting.attendees.find(a => a.user.toString() === req.user.id);
    if (!attendee) return res.status(400).json({ message: 'You are not part of this meeting' });

    attendee.throughput = throughput;
    await meeting.save();
    res.json({ message: 'Meeting notes submitted!' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// DELETE MEETING
router.delete('/:id', protect, async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meeting deleted' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
