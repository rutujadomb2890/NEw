import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import React, { useState, useEffect } from "react";
import { getAllCourses } from "../api/courseApi";

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const response = await getAllCourses();
        // Filter courses created by this instructor
        const instructorCourses = response.data.filter(course =>
          course.instructor._id === user._id || course.instructor === user._id
        );

        setCourses(instructorCourses);

        // Calculate stats
        const totalStudents = instructorCourses.reduce((sum, course) => sum + course.totalStudents, 0);
        const totalEarnings = instructorCourses.reduce((sum, course) =>
          sum + (course.totalStudents * (course.discountPrice || course.price)), 0
        );

        setStats({
          totalCourses: instructorCourses.length,
          totalStudents,
          totalEarnings
        });

      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchInstructorCourses();
  }, []);

  return (
    <DashboardLayout role="instructor">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Instructor Overview
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-xl">
          <h3 className="text-gray-700">Total Courses</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalCourses}</p>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-xl">
          <h3 className="text-gray-700">Total Students</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">{stats.totalStudents}</p>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-xl">
          <h3 className="text-gray-700">Total Earnings</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">${stats.totalEarnings}</p>
        </div>

      </div>

      {/* Course List */}
      <div className="mt-10 bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-xl">

        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          My Courses
        </h3>

        {courses.length === 0 ? (
          <p className="text-gray-500">No courses created yet. <Link to="/create-course" className="text-blue-600 hover:underline">Create your first course</Link></p>
        ) : (
          <div className="space-y-4">
            {courses.map((course, index) => (
              <div key={course._id || course.id} className={`flex justify-between items-center text-white p-4 rounded-2xl ${
                index % 2 === 0 ? 'bg-blue-600' : 'bg-indigo-600'
              }`}>
                <div>
                  <h4 className="font-semibold">{course.title}</h4>
                  <p className="text-sm opacity-80">{course.totalStudents} Students Enrolled</p>
                </div>
                <Link to={`/manage-course/${course._id || course.id}`}>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                    Manage Lessons
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>

    </DashboardLayout>
  );
};

export default InstructorDashboard;
