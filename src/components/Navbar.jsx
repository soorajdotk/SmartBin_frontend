import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <h1>SmartBin : Bottle Return and reward system</h1>
      <button onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;