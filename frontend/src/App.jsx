import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubjectCard from './Components/SubjectCard.jsx';
import AddSubjectPopover from "./Components/AddSubjectPopover.jsx";
import 'daisyui/dist/full.css';

function App() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const deleteSubject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/subjects/${id}`);
      setSubjects(subjects.filter(subject => subject._id !== id));
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const updateAttendance = async (id, updatedSubject) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/subjects/${id}`, updatedSubject);
      setSubjects(subjects.map(subject => (subject._id === id ? response.data : subject)));
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const incrementPresent = (index) => {
    const subject = subjects[index];
    const updatedSubject = { ...subject, Present: subject.Present + 1, Total: subject.Total + 1 };
    updateAttendance(subject._id, updatedSubject);
  };

  const incrementAbsent = (index) => {
    const subject = subjects[index];
    const updatedSubject = { ...subject, Total: subject.Total + 1 };
    updateAttendance(subject._id, updatedSubject);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="py-6 text-center flex justify-between items-center px-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Bunkify<span className='text-green-500'>.</span></h1>
        <label htmlFor="add-subject-modal" className="btn btn-success">Add Subject</label>
      </header>
      <main className="container mx-auto px-4 py-8">
        {subjects.length === 0 ? (
          <div className="text-center mt-10">
            <h2 className="text-2xl font-semibold text-white">No subjects available</h2>
            <p className="text-gray-400 mt-2">Add a new subject to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject, index) => (
              <SubjectCard
                key={subject._id}
                course={subject.Course}
                courseID={subject.CourseID}
                total={subject.Total}
                present={subject.Present}
                incrementPresent={() => incrementPresent(index)}
                incrementAbsent={() => incrementAbsent(index)}
                deleteSubject={() => deleteSubject(subject._id)}
              />
            ))}
          </div>
        )}
      </main>
      <AddSubjectPopover fetchSubjects={fetchSubjects} />
    </div>
  );
}

export default App;