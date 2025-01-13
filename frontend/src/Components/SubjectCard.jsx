import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

const SubjectCard = ({ course, courseID, total, present, incrementPresent, incrementAbsent, deleteSubject }) => {
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);
  const absent = total - present;
  const attendancePercentage = ((present / total) * 100).toFixed(1);
  const { enqueueSnackbar } = useSnackbar();

  const getProgressColor = (percentage) => {
    if (percentage < 60) return 'text-red-500';
    if (percentage < 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  const handleDeleteClick = () => {
    setIsDeletePopoverOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSubject();
      enqueueSnackbar('Subject deleted successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting subject:', error);
      enqueueSnackbar(error.response?.data?.message || 'Error deleting subject', { variant: 'error' });
    }
    setIsDeletePopoverOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeletePopoverOpen(false);
  };

  return (
    <div className="w-full sm:w-[90vw] lg:w-[70vw] mx-auto bg-gray-900 shadow-black shadow-md rounded-2xl relative z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="mr-4">
            <h2 className="text-lg font-semibold text-white">{course}</h2>
            <p className="text-gray-400">{courseID}</p>
            <div className="mt-2 text-gray-400">
              <p>Present: {present}</p>
              <p>Absent: {absent}</p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className={`radial-progress ${getProgressColor(attendancePercentage)}`} style={{ "--value": attendancePercentage, "--size": "75px", "--thickness": "8px", "transition": "all 0.5s ease-in-out" }} role="progressbar">
              {attendancePercentage}%
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-4">
          <button onClick={incrementPresent} className="border border-green-500 text-green-500 px-3 py-1 rounded transition duration-300">
            Present
          </button>
          <button onClick={incrementAbsent} className="border border-red-500 text-red-500 px-3 py-1 rounded transition duration-300">
            Absent
          </button>
          <button onClick={handleDeleteClick} className="border border-red-500 text-red-500 px-3 py-1 rounded transition duration-300">
            Delete
          </button>
        </div>
      </div>

      {isDeletePopoverOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-4 rounded w-[85vw]">
            <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
            <p className="text-gray-400">Are you sure you want to delete this subject?</p>
            <div className="mt-4 flex justify-end gap-4">
              <button onClick={handleConfirmDelete} className="btn btn-error">Delete</button>
              <button onClick={handleCancelDelete} className="btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectCard;