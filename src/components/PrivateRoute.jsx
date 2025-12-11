import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While checking authentication & refreshing tokens
  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "40px", fontSize: "18px" }}>
        Checking Authentication...
      </div>
    );
  }

  // If no user and no session, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated
  return <>{children}</>;
};

export default PrivateRoute;
