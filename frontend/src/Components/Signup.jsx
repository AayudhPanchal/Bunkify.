import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Signup = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      enqueueSnackbar('Email and password are required', { variant: 'error' });
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/auth/signup`, {
        email,
        password,
      });

      onSignup(response.data);
      enqueueSnackbar('Signup successful! Please log in.', { variant: 'success' });
      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error);
      enqueueSnackbar(error.response?.data?.message || 'Error signing up', { variant: 'error' });
    }
  };

  return (
    <div className="pt-12 md:pt-60 bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-[80vw] max-w-md">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Email</label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-gray-400 mb-2">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input input-bordered w-full pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="absolute right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-success w-full mb-4">Sign Up</button>
        </form>
        <p className="text-gray-400">Already have an account? <a href="/login" className="text-green-500">Login</a></p>
      </div>
    </div>
  );
};

export default Signup;