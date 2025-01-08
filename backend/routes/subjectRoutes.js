const express = require('express');
const {
  getSubjects,
  updateAttendance,
  deleteSubject,
  createSubject,
} = require('../controllers/subjectController');

const router = express.Router();

router.route('/').get(getSubjects).post(createSubject);
router.route('/:id').put(updateAttendance).delete(deleteSubject);

module.exports = router;