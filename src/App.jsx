import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OtpVerifyPage from "./pages/OtpVerifyPage";
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ScannerPage from './pages/ScannerPage';
import RewardHistoryPage from './pages/RewardHistoryPage';
import ClaimRewardPage from './pages/ClaimRewardPage';
import { FaRecycle, FaLeaf, FaGlobeAmericas } from 'react-icons/fa';

// Component to handle root redirect logic
const RootRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

// Visual section component for auth pages
const VisualSection = () => {
  return (
    <div className="visual-section">
      <div className="visual-content">
        <h1>SmartBin : Bottle return & Reward </h1>
        <p>
          Join the eco-revolution! Return your bottles, earn rewards, and help create a sustainable future for our planet.
        </p>
        <div className="eco-icons">
          <div className="eco-icon">
            <FaRecycle />
          </div>
          <div className="eco-icon">
            <FaLeaf />
          </div>
          <div className="eco-icon">
            <FaGlobeAmericas />
          </div>
        </div>
      </div>
    </div>
  );
};

// Layout wrapper component
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAuthPage =
  location.pathname === '/login' ||
  location.pathname === '/register' ||
  location.pathname === '/forgot-password' ||
  location.pathname === '/verify-otp'
  ;


  if (isAuthPage) {
    return (
      <div className="app-layout auth-layout">
        <VisualSection />
        <div className="content-section">
          {children}
        </div>
      </div>
    );
  }
  
  return (
    <div className="app-layout main-layout">
      <div className="main-content">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

// Main app routes component
const AppRoutes = () => {
  return (
    <LayoutWrapper>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OtpVerifyPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/scan" 
          element={
            <PrivateRoute>
              <ScannerPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <PrivateRoute>
              <RewardHistoryPage />
            </PrivateRoute>
          } 
        />
        
        <Route path="/claim" element={<ClaimRewardPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LayoutWrapper>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;