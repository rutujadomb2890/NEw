import React from "react";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-200 flex flex-col">

      {/* Navbar */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold text-blue-700">
          CourseCraft
        </h1>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-xl bg-white shadow hover:bg-gray-100 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 transition"
          >
            Register
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Learn & Teach Without Limits
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          CourseCraft is a modern learning platform for students and instructors.
          Build skills, create courses, and grow together.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </div>

    </div>
  );
};

export default LandingPage;
