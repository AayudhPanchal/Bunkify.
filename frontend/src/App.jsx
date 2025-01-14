import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useSnackbar } from 'notistack';
import SubjectCard from './Components/SubjectCard.jsx';
import AddSubjectPopover from "./Components/AddSubjectPopover.jsx";
import Login from './Components/Login.jsx';
import Signup from './Components/Signup.jsx';

const BACKEND = import.meta.env.VITE_BACKEND;

function App() {
  const [subjects, setSubjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Fetch user data on app load
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${BACKEND}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSubjects();
    }
  }, [user]);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND}/api/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const deleteSubject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND}/api/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(subjects.filter(subject => subject._id !== id));
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const updateAttendance = async (id, updatedSubject) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${BACKEND}/api/subjects/${id}`, updatedSubject, {
        headers: { Authorization: `Bearer ${token}` }
      });
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    enqueueSnackbar('Logged out successfully', { variant: 'success' });
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <header className="py-6 text-center flex justify-between items-center px-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Bunkify<span className='text-green-500'>.</span></h1>
          <div className="flex gap-4">
            <label htmlFor="add-subject-modal" className="btn btn-success">
              <FontAwesomeIcon icon={faPlus} /> {/* Add Subject Icon */}
            </label>
            {user && (
              <button onClick={handleLogout} className="btn btn-danger">
                <FontAwesomeIcon icon={faSignOutAlt} /> {/* Logout Icon */}
              </button>
            )}
          </div>
        </header>
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/signup" element={<Signup onSignup={setUser} />} />
          <Route path="/" element={user ? (
            <Main
              subjects={subjects}
              incrementPresent={incrementPresent}
              incrementAbsent={incrementAbsent}
              deleteSubject={deleteSubject}
              fetchSubjects={fetchSubjects}
              setUser={setUser}
            />
          ) : (
            <Navigate to="/login" />
          )} />
        </Routes>
      </div>
    </Router>
  );
}

const Main = ({ subjects, incrementPresent, incrementAbsent, deleteSubject, fetchSubjects, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <main className="container mx-auto px-4 py-8 flex-grow">
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
      <AddSubjectPopover fetchSubjects={fetchSubjects} />
    </main>
  );
};

export default App;