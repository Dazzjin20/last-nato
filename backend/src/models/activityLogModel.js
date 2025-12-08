const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, required: true },
  estimatedHours: { type: Number, required: true },
  points: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  location: { type: String, required: true },
  status: { type: String, default: 'Unassigned' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', default: null },
  createdAt: { type: Date, default: Date.now }
}, {
  collection: 'activitylogs' // Explicitly set collection name
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;