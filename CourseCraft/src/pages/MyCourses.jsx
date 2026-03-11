import DashboardLayout from "../layouts/DashboardLayout";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEnrolledCourses } from "../api/courseApi";

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, ongoing, completed

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!user?._id) {
        console.error("No user ID found");
        setError("User not logged in");
        setLoading(false);
        return;
      }

      console.log("Fetching enrolled courses for user:", user._id);
      const res = await getEnrolledCourses(user._id);
      
      console.log("API Response:", res.data);
      console.log("Enrollments count:", res.data.enrollments?.length);
      
      const enrollmentsData = res.data.enrollments || [];
      console.log("Setting enrolled courses to:", enrollmentsData);
      
      setEnrolledCourses(enrollmentsData);
      setError("");
    } catch (err) {
      console.error("Failed to load enrolled courses:", err);
      console.error("Error details:", err.response?.data || err.message);
      setError("Failed to load enrolled courses: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("MyCourses component mounted, user ID:", user?._id);
    fetchEnrolledCourses();
    
    // Set up a listener to refetch when the page becomes visible (user returns from cart)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Page became visible, refetching courses...");
        fetchEnrolledCourses();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user?._id]);

  // Filter courses based on active tab
  const getFilteredCourses = () => {
    switch (activeTab) {
      case "ongoing":
        return enrolledCourses.filter(
          (enrollment) => enrollment.progress < 100 && (enrollment.progress > 0)
        );
      case "completed":
        return enrolledCourses.filter(
          (enrollment) => enrollment.progress === 100
        );
      default:
        return enrolledCourses;
    }
  };

  const filteredCourses = getFilteredCourses();
  const completedCount = enrolledCourses.filter(
    (e) => e.progress === 100
  ).length;
  const ongoingCount = enrolledCourses.filter(
    (e) => e.progress > 0 && e.progress < 100
  ).length;

  return (
    <DashboardLayout role="student">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-lg p-2 w-fit">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "all"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          All ({enrolledCourses.length})
        </button>
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "ongoing"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          Ongoing ({ongoingCount})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "completed"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Refresh Button */}
      <div className="mb-6">
        <button
          onClick={fetchEnrolledCourses}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? "Refreshing..." : "Refresh Courses"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading your courses...</p>
        </div>
      )}

      {/* No Courses */}
      {!loading && enrolledCourses.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-10 text-center">
          <h3 className="text-2xl font-semibold text-gray-600 mb-4">
            No Courses Yet
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't enrolled in any courses. Browse available courses to get started!
          </p>
          <Link
            to="/allcourses"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Browse Courses
          </Link>
        </div>
      )}

      {/* Courses Grid */}
      {!loading && filteredCourses.length === 0 && enrolledCourses.length > 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            No courses in this category
          </p>
        </div>
      )}

      {!loading && filteredCourses.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((enrollment) => (
            <div
              key={enrollment._id}
              className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden hover:scale-105 transition duration-300 hover:shadow-2xl"
            >
              {/* Course Thumbnail */}
              <img
                src={
                  enrollment.course?.thumbnail
                    ? `http://localhost:5000${enrollment.course.thumbnail}`
                    : "https://via.placeholder.com/400x200?text=No+Image"
                }
                alt={enrollment.course?.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {enrollment.course?.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3">
                  by {enrollment.course?.instructor?.name || "Unknown"}
                </p>

                {/* Progress Bar */}
                <p className="text-gray-600 text-sm mb-2 font-semibold">
                  Progress: {enrollment.progress || 0}%
                </p>

                <div className="w-full bg-gray-300 h-2 rounded-full mb-4">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      enrollment.progress === 100
                        ? "bg-green-600"
                        : enrollment.progress >= 75
                        ? "bg-blue-600"
                        : enrollment.progress >= 50
                        ? "bg-indigo-600"
                        : "bg-yellow-500"
                    }`}
                    style={{ width: `${enrollment.progress || 0}%` }}
                  ></div>
                </div>

                {/* Button */}
                <div className="flex gap-2">
                  <Link
                    to={`/course-player/${enrollment.course?._id}`}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition text-center text-sm font-semibold"
                  >
                    Continue Learning
                  </Link>
                  
                  {enrollment.progress === 100 && (
                    <span className="px-3 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-semibold flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyCourses;
