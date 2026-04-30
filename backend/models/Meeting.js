const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  agenda: { type: String, default: '' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  meetingLink: { type: String, default: '' },
  venue: { type: String, default: '' },
  scheduledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledByRole: { type: String }, // 'principal' or 'hod'
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    throughput: { type: String, default: '' } // meeting notes from staff
  }],
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
