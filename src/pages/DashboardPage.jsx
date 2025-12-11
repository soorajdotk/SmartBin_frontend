import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaQrcode, FaListAlt, FaSignOutAlt } from 'react-icons/fa';

const DashboardPage = () => {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchPoints = async () => {
      try {
        const res = await fetch(`https://smartbin-backend-gptt.onrender.com/api/users/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (data && data.rewardPoints !== undefined) {
          setPoints(data.rewardPoints);
        }
      } catch (err) {
        console.error("Error fetching points:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [user, token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const gotoScanner = () => navigate('/scan');
  const gotoHistory = () => navigate('/history');

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="dashboard-stats">
          <h2>Welcome, {user?.name || "User"}!</h2>
          <p style={{ color: '#6c757d', marginBottom: '16px' }}>
            Your current reward balance:
          </p>
          <div className="points-balance">{points} Points</div>
        </div>
        
        <div className="dashboard-actions">
          <button className="btn btn-success" onClick={gotoScanner}>
            <FaQrcode /> Scan QR Code
          </button>
          
          <button className="btn btn-secondary" onClick={gotoHistory}>
            <FaListAlt /> View Reward History
          </button>
          
          <button className="btn btn-danger" onClick={handleLogout} style={{ marginTop: '24px' }}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>How it works:</h3>
        <ol style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Place your bottles into the detection area of SmartBin.</li>
           <li>After successful deposit of bottles scan the QR code on the SmartBin.</li>
          <li>Earn reward points for each bottle returned.</li>
          <li>Redeem points for rewards and discounts : integrated in future.</li>
        </ol>
      </div>
    </div>
  );
};

export default DashboardPage;
