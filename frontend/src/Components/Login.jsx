import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token); // Store the token in local storage
      onLogin(response.data.user);
      navigate('/');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="pt-12 md:pt-60 bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-[80vw] max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
          <div className="mb-6">
            <label className="block text-gray-400 mb-2">Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-full mb-4">Login</button>
        </form>
        <p className="text-gray-400">Don't have an account? <Link to="/signup" className="text-green-500">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;