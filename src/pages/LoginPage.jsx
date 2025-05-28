// pages/LoginPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();

  // If a token already exists in localStorage, redirect to /assets
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/assets');
    }
  }, [navigate]);

  // Called after successful login from LoginForm
  const handleLogin = () => {
    navigate('/assets');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
