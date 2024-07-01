const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  signedIn: { type: Boolean, default: false },
  signInTime: { type: Date }, // Add signInTime field
  signedOut: { type: Boolean, default: false },
  signOutTime: { type: Date } // Add signOutTime field
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
