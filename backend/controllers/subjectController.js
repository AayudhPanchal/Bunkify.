const Subject = require('../models/Subject');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Public
const createSubject = async (req, res) => {
  const { Course, CourseID, Total, Present } = req.body;

  const newSubject = new Subject({
    Course,
    CourseID,
    Total,
    Present,
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
// @access  Public
const updateAttendance = async (req, res) => {
  const { Total, Present } = req.body;

  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
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
// @access  Public
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

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