import React from "react";
import Navbar from "../components/Navbar";

const About = () => {
  return (

    <>
    <Navbar/>
    <div className="p-10 max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold mb-6">
        About EduLMS
      </h1>

      <p className="mb-6 text-gray-700">
        EduLMS is a modern online learning platform designed to empower students 
        and instructors worldwide. Our mission is to make quality education accessible 
        to everyone.
      </p>

      <h2 className="text-2xl font-semibold mb-4">
        Our Mission
      </h2>

      <p className="mb-6 text-gray-700">
        We aim to bridge the gap between knowledge and opportunity by providing 
        practical, real-world focused courses.
      </p>

      <h2 className="text-2xl font-semibold mb-4">
        Latest Blog
      </h2>

      <div className="bg-gray-100 p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-2">
          The Future of Online Learning in 2025
        </h3>
        <p className="text-gray-600">
          Discover how AI and immersive technology are transforming the online education landscape...
        </p>
      </div>

    </div></>
  );
};

export default About;