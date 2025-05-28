// components/LoginForm.jsx

import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid credentials');
        } else {
          throw new Error('Server error');
        }
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // ✅ Salva o token
      onLogin(); // ✅ Redireciona para /assets
    } catch (err) {
      console.error('Login failed:', err.message);
      setError(
        err.message === 'Invalid credentials'
          ? 'Email or password is incorrect.'
          : 'Login failed. Please try again later.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md w-80 space-y-4">
      <h2 className="text-white text-xl font-bold text-center">Login</h2>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <button
        type="submit"
        className="w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-500"
      >
        Log In
      </button>
    </form>
  );
};

export default LoginForm;
