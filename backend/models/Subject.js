const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  Course: { type: String, required: true },
  CourseID: { type: String, required: true },
  Total: { type: Number, required: true },
  Present: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Subject', subjectSchema);