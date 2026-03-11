import React from "react";

import {  Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";

import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import ManageCourses from "./pages/ManageCourses";
import ManageCourse from "./layouts/ManageCourse";
import InstructorProfile from "./pages/InstructorProfile";
import CoursePlayer from "./pages/CoursePlayer";
import Home from "./pages/Home";
import AllCourses from "./pages/AllCourses";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";


function App() {


  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;
  const userRole = user?.role;

  console.log("App - User:", userRole, "IsLoggedIn:", isLoggedIn);

  return (

    <CartProvider>
     <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        {/* Student Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/my-courses" element={<MyCourses />} />

        {/* Instructor Routes */}
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        <Route path="/manage-courses" element={<ManageCourses />} />

        {/* General Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/manage-course/:courseId" element={<ManageCourse />} />
        <Route path="/instructor-profile" element={<InstructorProfile />} />

        <Route path="/course-player/:courseId" element={<CoursePlayer />} />

        <Route path="/home" element={<Home />} />



      
        {isLoggedIn && userRole === "student" && (
          <>
            <Route path="/allcourses" element={<AllCourses />} />
            <Route path="/cart" element={<Cart />} />
          </>
        )}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />



      </Routes>
    </CartProvider>
  );
}

export default App;
