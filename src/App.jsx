// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AssetsPage from './pages/AssetsPage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Redireciona da raiz com base na presença do token */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/assets" replace /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/assets"
          element={
            <PrivateRoute>
              <AssetsPage />
            </PrivateRoute>
          }
        />
        {/* Catch-all para redirecionar sempre para a raiz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
