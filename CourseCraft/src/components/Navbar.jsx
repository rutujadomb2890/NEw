import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  // Get user from localStorage to determine role
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;
  const userRole = user?.role;
  const { cartItemCount } = useContext(CartContext);

  console.log("Navbar - User:", userRole, "IsLoggedIn:", isLoggedIn);

  // Determine dashboard link based on role
  const dashboardLink = userRole === "instructor" ? "/instructor-dashboard" : "/student-dashboard";

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">

      <Link to="/" className="text-2xl font-bold text-indigo-600">
        CourseCraft
      </Link>

      <div className="space-x-6 flex items-center">
        <Link to="/home" className="hover:text-indigo-600">
          Home
        </Link>


        {isLoggedIn && userRole === "student" && (
        <Link to="/allcourses" className="hover:text-indigo-600">
          Courses
        </Link>
        )}

       

        <Link to="/about" className="hover:text-indigo-600">
          About us
        </Link>

        <Link to="/contact" className="hover:text-indigo-600">
          Contact us
        </Link>

        {isLoggedIn && (
          <Link to="/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
            Dashboard
          </Link>
        )}

        {isLoggedIn && userRole === "student" && (
          <Link to="/cart" className="relative hover:text-indigo-600">
            <span className="text-2xl">🛒</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        )}
      </div>

    </nav>
  );
};

export default Navbar;