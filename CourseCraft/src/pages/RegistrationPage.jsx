import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { registerUser } from "../api/authApi";

const RegistrationPage = () => {

  const [role, setRole] = useState("student");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });

  const navigate = useNavigate();

  const toggleRole = () => {
    setRole((prev) => (prev === "student" ? "instructor" : "student"));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const payload = {
        ...formData,
        role,
      };

      const res = await registerUser(payload);

      alert(res.data.message || "Registration Successful");

      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-200 px-4">

      <div className="backdrop-blur-lg bg-white/40 border border-white/30 rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center shadow-2xl">

        {/* Toggle Section */}
        <div className="relative flex flex-col items-center">

          <div
            onClick={toggleRole}
            className="w-24 h-80 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full flex items-center justify-center relative cursor-pointer shadow-inner transition-all duration-500 hover:scale-105"
          >

            <div
              className={`absolute w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-sm font-bold text-blue-600 transition-all duration-1000 ease-in-out transform hover:scale-110 ${
                role === "student" ? "top-4" : "bottom-4"
              }`}
            >
              {role === "student" ? "S" : "I"}
            </div>

          </div>

          <div className="mt-6 text-center font-semibold text-gray-700 text-lg tracking-wide">
            {role === "student" ? "Student Mode" : "Instructor Mode"}
          </div>

        </div>

        {/* Form Section */}
        <div className="w-[350px] md:w-[450px] bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[35px] p-8 text-white shadow-xl">

          <h2 className="text-3xl font-bold mb-8 tracking-wide">
            {role === "student"
              ? "Student Registration"
              : "Instructor Registration"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="w-full p-4 rounded-xl text-black outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] focus:scale-[1.02] bg-white/90 backdrop-blur-sm"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              onChange={handleChange}
              className="w-full p-4 rounded-xl text-black outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] focus:scale-[1.02] bg-white/90 backdrop-blur-sm"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full p-4 rounded-xl text-black outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] focus:scale-[1.02] bg-white/90 backdrop-blur-sm"
            />

            {role === "instructor" && (
              <input
                type="text"
                name="bio"
                placeholder="Your Expertise (e.g. MERN Stack)"
                required
                onChange={handleChange}
                className="w-full p-4 rounded-xl text-black outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] focus:scale-[1.02] bg-white/90 backdrop-blur-sm"
              />
            )}

            <button
              type="submit"
              className="w-full bg-white text-blue-700 font-semibold py-4 rounded-xl hover:bg-gray-100 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:scale-[1.02] focus:-translate-y-1"
            >
              Register as {role === "student" ? "Student" : "Instructor"}
            </button>

            <div className="text-center text-sm mt-4 text-white/80">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="underline cursor-pointer hover:text-white transition"
              >
                Login
              </span>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default RegistrationPage;