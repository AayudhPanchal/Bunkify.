const Subject = require('../models/Subject');

// @desc    Get all subjects for a user
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user.id });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private
const createSubject = async (req, res) => {
  const { Course, CourseID, Total, Present } = req.body;

  const newSubject = new Subject({
    Course,
    CourseID,
    Total,
    Present,
    user: req.user.id,
  });

  try {
    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update attendance of a subject
// @route   PUT /api/subjects/:id
// @access  Private
const updateAttendance = async (req, res) => {
  const { Total, Present } = req.body;

  try {
    const updatedSubject = await Subject.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { Total, Present },
      { new: true }
    );

    if (updatedSubject) {
      res.json(updatedSubject);
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (subject) {
      res.json({ message: 'Subject deleted' });
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubjects,
  createSubject,
  updateAttendance,
  deleteSubject,
};