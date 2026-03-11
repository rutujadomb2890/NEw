import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { loginUser } from "../api/authApi";

const LoginPage = () => {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const toggleRole = () => {
    setRole(prev => prev === "student" ? "instructor" : "student");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await loginUser({
        email,
        password,
        role
      });

      console.log(res.data);

      // store user info (backend returns user object)
      const userData = res.data.user;
      // ensure we have _id for consistency
      if (userData && userData.id && !userData._id) {
        userData._id = userData.id;
      }
      localStorage.setItem("user", JSON.stringify(userData));

      // redirect based on role
      if (role === "student") {
        navigate("/home");
      } else {
        navigate("/instructor-dashboard");
      }

    } catch (error) {

      console.log(error);
      alert(error.response?.data?.message || "Login Failed");

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-200 px-4">

      <div className="backdrop-blur-lg bg-white/40 border border-white/30 rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center shadow-2xl">

        {/* LEFT TOGGLE */}
        <div className="relative flex flex-col items-center">
          <div
            onClick={toggleRole}
            className="w-24 h-80 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full relative cursor-pointer shadow-inner"
          >
            <div
              className={`absolute w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-sm font-bold text-blue-600 transition-all duration-1000 ease-in-out transform hover:scale-110 ${
                role === "student" ? "top-4 left-4"  : "bottom-4 left-4"
              }`}
            >
              {role === "student" ? "S" : "I"}
            </div>
          </div>

          <div className="mt-6 font-semibold text-gray-700">
            {role === "student" ? "Student Login" : "Instructor Login"}
          </div>
        </div>

        {/* FORM */}
        <div className="w-[350px] md:w-[450px] bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[35px] p-8 text-white shadow-xl">

          <h2 className="text-3xl font-bold mb-8">
            {role === "student" ? "Student Login" : "Instructor Login"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl text-black outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] focus:scale-[1.02] bg-white/90 backdrop-blur-sm"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl text-black outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] focus:scale-[1.02] bg-white/90 backdrop-blur-sm"
            />
            

            <button
              type="submit"
              className="w-full bg-white text-blue-700 font-semibold py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-1 focus:scale-[1.02] focus:-translate-y-1"
            >
              Login
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;