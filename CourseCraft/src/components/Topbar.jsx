import { Link,useNavigate } from "react-router-dom";
import React from "react";

const Topbar = ({ role }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"))
  return (


    <div className="bg-white/50 backdrop-blur-md shadow-md p-4 flex justify-end gap-8 items-center">

        <p className="text-2xl font-bold text-gray-500">Welcome {user.name.toUpperCase()}</p>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Logout
      </button>

    </div>
  );
};

export default Topbar;
