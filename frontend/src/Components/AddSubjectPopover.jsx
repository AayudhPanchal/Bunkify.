import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const AddSubjectPopover = ({ fetchSubjects }) => {
  const [newSubject, setNewSubject] = useState({ course: '', courseID: '', total: 0, present: 0 });
  const { enqueueSnackbar } = useSnackbar();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: name === 'total' || name === 'present' ? parseInt(value) : value });
  };

  const validateForm = () => {
    if (!newSubject.course) {
      enqueueSnackbar("Course name is required", { variant: 'error' });
      return false;
    }
    if (!newSubject.courseID) {
      enqueueSnackbar("Course ID is required", { variant: 'error' });
      return false;
    }
    if (newSubject.total <= 0) {
      enqueueSnackbar("Total classes must be greater than 0", { variant: 'error' });
      return false;
    }
    if (newSubject.present > newSubject.total) {
      enqueueSnackbar("Present classes can't be greater than total classes", { variant: 'error' });
      return false;
    }
    return true;
  };

  const addSubject = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BACKEND}/api/subjects`, {
        Course: newSubject.course,
        CourseID: newSubject.courseID,
        Total: newSubject.total,
        Present: newSubject.present,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSubjects();
      setNewSubject({ course: '', courseID: '', total: 0, present: 0 });
      document.getElementById('add-subject-modal').checked = false; // Close the modal
      enqueueSnackbar('Subject added successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error adding subject:', error);
      enqueueSnackbar(error.response?.data?.message || 'Error adding subject', { variant: 'error' });
    }
  };

  return (
    <>
      <input type="checkbox" id="add-subject-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative z-50">
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
            <input
              type="text"
              name="courseID"
              placeholder="Course ID"
              className="input input-bordered w-full mb-2"
              value={newSubject.courseID}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="total"
              placeholder="Total Classes"
              className="input input-bordered w-full mb-2"
              value={newSubject.total}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="present"
              placeholder="Classes Attended"
              className="input input-bordered w-full mb-2"
              value={newSubject.present}
              onChange={handleInputChange}
            />
          </div>
          <div className="modal-action">
            <button className="btn btn-success" onClick={addSubject}>Add</button>
            <label htmlFor="add-subject-modal" className="btn">Cancel</label>
          </div>
        </div>
        <label htmlFor="add-subject-modal" className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></label>
      </div>
    </>
  );
};

export default AddSubjectPopover;