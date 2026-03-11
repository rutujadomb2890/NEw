import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import React, { useState, useEffect } from "react";
import { getEnrolledCourses } from "../api/courseApi";

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      if (user?._id) {
        const res = await getEnrolledCourses(user._id);
        setEnrolledCourses(res.data.enrollments || []);
        setError("");
      }
    } catch (err) {
      console.error("Failed to load enrolled courses", err);
      setError("Failed to load enrolled courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, [user?._id]);

  const completedCourses = enrolledCourses.filter(
    (enrollment) => enrollment.progress === 100
  ).length;

  const averageProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce((sum, e) => sum + (e.progress || 0), 0) /
            enrolledCourses.length
        )
      : 0;

  return (
    <DashboardLayout role="student">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Student Overview
        </h2>
        <button
          onClick={fetchEnrolledCourses}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 text-sm font-semibold"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/60 p-6 rounded-3xl shadow-xl">
          <h3>Enrolled Courses</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {enrolledCourses.length}
          </p>
        </div>

        <div className="bg-white/60 p-6 rounded-3xl shadow-xl">
          <h3>Completed</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">
            {completedCourses}
          </p>
        </div>

        <div className="bg-white/60 p-6 rounded-3xl shadow-xl">
          <h3>Progress</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {averageProgress}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Your Enrolled Courses
        </h3>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading your courses...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : enrolledCourses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">
              You haven't enrolled in any courses yet
            </p>
            <Link
              to="/allcourses"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {enrolledCourses.map((enrollment) => (
              <div
                key={enrollment._id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={
                    enrollment.course?.thumbnail
                      ? `http://localhost:5000${enrollment.course.thumbnail}`
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={enrollment.course?.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-2">
                    {enrollment.course?.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    by {enrollment.course?.instructor?.name || "Unknown"}
                  </p>

                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold">Progress</span>
                      <span className="text-sm font-semibold">
                        {enrollment.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
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
                        style={{
                          width: `${enrollment.progress || 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/course-player/${enrollment.course?._id}`}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-center hover:bg-indigo-700 text-sm"
                    >
                      Continue Learning
                    </Link>
                    {enrollment.progress === 100 && (
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
