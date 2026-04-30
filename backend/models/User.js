const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['principal', 'hod', 'staff'],
    default: 'staff'
  },
  department: { type: String, default: '' },
  isApproved: { type: Boolean, default: true }, // HODs need approval
  isBlacklisted: { type: Boolean, default: false },
  blacklistReason: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
