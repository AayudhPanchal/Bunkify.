import React, { useState } from 'react';
import axios from 'axios';

const AddSubjectPopover = ({ fetchSubjects }) => {
  const [newSubject, setNewSubject] = useState({ course: '', courseID: '', total: 0, present: 0 });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newSubject.course) newErrors.course = "Course name is required";
    if (!newSubject.courseID) newErrors.courseID = "Course ID is required";
    if (newSubject.total <= 0) newErrors.total = "Total classes must be greater than 0";
    if (newSubject.present > newSubject.total) newErrors.present = "Present classes can't be greater than total classes";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addSubject = async () => {
    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:5000/api/subjects', {
        Course: newSubject.course,
        CourseID: newSubject.courseID,
        Total: newSubject.total,
        Present: newSubject.present,
      });
      fetchSubjects();
      setNewSubject({ course: '', courseID: '', total: 0, present: 0 });
      document.getElementById('add-subject-modal').checked = false; // Close the modal
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  return (
    <>
      <input type="checkbox" id="add-subject-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Subject</h3>
          <div className="py-4">
            <input
              type="text"
              name="course"
              placeholder="Course Name"
              className="input input-bordered w-full mb-2"
              value={newSubject.course}
              onChange={handleInputChange}
            />
            {errors.course && <p className="text-red-500 text-sm">{errors.course}</p>}
            <input
              type="text"
              name="courseID"
              placeholder="Course ID"
              className="input input-bordered w-full mb-2"
              value={newSubject.courseID}
              onChange={handleInputChange}
            />
            {errors.courseID && <p className="text-red-500 text-sm">{errors.courseID}</p>}
            <input
              type="number"
              name="total"
              placeholder="Total Classes"
              className="input input-bordered w-full mb-2"
              value={newSubject.total}
              onChange={handleInputChange}
            />
            {errors.total && <p className="text-red-500 text-sm">{errors.total}</p>}
            <input
              type="number"
              name="present"
              placeholder="Classes Attended"
              className="input input-bordered w-full mb-2"
              value={newSubject.present}
              onChange={handleInputChange}
            />
            {errors.present && <p className="text-red-500 text-sm">{errors.present}</p>}
          </div>
          <div className="modal-action">
            <button className="btn btn-success" onClick={addSubject}>Add</button>
            <label htmlFor="add-subject-modal" className="btn">Cancel</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSubjectPopover;