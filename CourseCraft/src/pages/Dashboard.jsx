import React from "react";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user.role === "instructor") {
    return <Navigate to="/instructor-dashboard" replace />;
  } else {
    return <Navigate to="/student-dashboard" replace />;
  }
};

export default Dashboard;