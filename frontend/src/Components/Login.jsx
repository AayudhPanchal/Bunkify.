import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      enqueueSnackbar('Email and password are required', { variant: 'error' });
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token); // Store the token in local storage
      onLogin(response.data.user);
      enqueueSnackbar('Login successful!', { variant: 'success' });
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      enqueueSnackbar(error.response?.data?.message || 'Invalid email or password', { variant: 'error' });
    }
  };

  return (
    <div className="pt-12 md:pt-60 bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-[80vw] max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn btn-success w-full mb-4">Login</button>
        </form>
        <p className="text-gray-400">Don't have an account? <Link to="/signup" className="text-green-500">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;