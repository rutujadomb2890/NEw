import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { getAllCourses, checkEnrollment } from "../api/courseApi";
import { CartContext } from "../context/CartContext";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const { addToCart } = useContext(CartContext);
  const [addedToCart, setAddedToCart] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getAllCourses();
        setCourses(res.data);

        // Check enrollment status for each course
        if (user?._id && res.data.length > 0) {
          const enrollmentChecks = res.data.map((course) =>
            checkEnrollment(user._id, course._id)
              .then((response) => ({
                courseId: course._id,
                isEnrolled: response.data.isEnrolled,
              }))
              .catch(() => ({
                courseId: course._id,
                isEnrolled: false,
              }))
          );

          const results = await Promise.all(enrollmentChecks);
          const enrollmentMap = {};
          results.forEach((result) => {
            enrollmentMap[result.courseId] = result.isEnrolled;
          });
          setEnrolledCourses(enrollmentMap);
        }
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user?._id]);

  const handleAddToCart = (course) => {
    addToCart(course);
    setAddedToCart({ ...addedToCart, [course._id]: true });

    // Reset the button state after 2 seconds
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [course._id]: false });
    }, 2000);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-10 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-10">All Courses</h1>
          <p className="text-center text-gray-500">Loading courses...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-10">All Courses</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id || course.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={
                  course.thumbnail
                    ? `http://localhost:5000${course.thumbnail}`
                    : "https://via.placeholder.com/400x200?text=No+Image"
                }
                alt={course.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>

                <p className="text-gray-600 text-sm mb-1">
                  Instructor: {course.instructor?.name || "Unknown"}
                </p>

                <p className="text-yellow-500 mb-2">⭐ {course.rating}</p>

                <div className="mb-4">
                  <span className="line-through text-gray-400 mr-2">
                    ${course.price}
                  </span>
                  <span className="text-indigo-600 font-bold">
                    ${course.discountPrice || course.price}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  {enrolledCourses[course._id] ? (
                    <button
                      disabled
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg cursor-not-allowed text-center"
                    >
                      ✓ Enrolled
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(course)}
                      className={`flex-1 ${
                        addedToCart[course._id]
                          ? "bg-green-600"
                          : "bg-indigo-600"
                      } text-white px-4 py-2 rounded-lg transition`}
                    >
                      {addedToCart[course._id] ? "✓ Added" : "Add to Cart"}
                    </button>
                  )}

                  <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
                    Reviews
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllCourses;