import DashboardLayout from "../layouts/DashboardLayout";
import React, { useState, useEffect } from "react";
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "../api/courseApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discountPrice: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

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
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast.error("Failed to load courses");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.description || !formData.price) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const instructorId = user?._id || user?.id;

      if (!instructorId) {
        toast.error("User not logged in");
        setLoading(false);
        return;
      }

      const courseData = new FormData();
      courseData.append("title", formData.title);
      courseData.append("description", formData.description);
      courseData.append("price", formData.price);
      courseData.append("discountPrice", formData.discountPrice || formData.price);
      courseData.append("instructor", instructorId);

      if (thumbnail) {
        courseData.append("thumbnail", thumbnail);
      }

      await createCourse(courseData);
      toast.success("Course created successfully!");

      // Reset form and refresh courses
      resetForm();
      await fetchInstructorCourses();

    } catch (error) {
      console.error("Failed to create course:", error);
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.description || !formData.price) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const courseData = new FormData();
      courseData.append("title", formData.title);
      courseData.append("description", formData.description);
      courseData.append("price", formData.price);
      courseData.append("discountPrice", formData.discountPrice || formData.price);

      if (thumbnail) {
        courseData.append("thumbnail", thumbnail);
      }

      await updateCourse(editingCourse._id, courseData);
      toast.success("Course updated successfully!");

      // Reset form and refresh courses
      resetForm();
      await fetchInstructorCourses();

    } catch (error) {
      console.error("Failed to update course:", error);
      toast.error(error.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteCourse(courseId);
      toast.success("Course deleted successfully!");
      await fetchInstructorCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
      toast.error("Failed to delete course");
    }
  };

  const startEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      discountPrice: course.discountPrice,
    });
    setThumbnail(null);
    setPreview(course.thumbnail);
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      discountPrice: "",
    });
    setThumbnail(null);
    setPreview(null);
    setEditingCourse(null);
    setShowCreateForm(false);
  };

  return (
    <DashboardLayout role="instructor">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Manage Courses
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {showCreateForm ? "Cancel" : "+ Create New Course"}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-xl mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {editingCourse ? "Edit Course" : "Create New Course"}
          </h3>

          <form className="space-y-6" onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Course Title */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2 font-medium">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter course title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:shadow-md"
                />
              </div>

              {/* Course Price */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:shadow-md"
                />
              </div>

              {/* Discount Price */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Discount Price ($) (Optional)
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  placeholder="0.00"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:shadow-md"
                />
              </div>
            </div>

            {/* Course Description */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Course Description *
              </label>
              <textarea
                name="description"
                rows="5"
                placeholder="Enter detailed course description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:shadow-md resize-vertical"
              ></textarea>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Course Thumbnail {editingCourse ? "(Optional - leave empty to keep current)" : "*"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />

              {(preview || (editingCourse && editingCourse.thumbnail)) && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={preview || (editingCourse.thumbnail ? `http://localhost:5000${editingCourse.thumbnail}` : "https://via.placeholder.com/400x200?text=No+Image")}
                    alt="Thumbnail Preview"
                    className="w-48 h-32 object-cover rounded-xl shadow-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editingCourse ? "Updating..." : "Creating..."}
                  </span>
                ) : (
                  editingCourse ? "Update Course" : "Create Course"
                )}
              </button>

              {editingCourse && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-4 rounded-xl hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Course List */}
      <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Your Courses ({courses.length})
        </h3>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-lg">No courses created yet.</p>
            <p className="text-gray-400 mt-2">Click "Create New Course" to get started!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course, index) => (
              <div key={course._id || course.id} className="bg-white/80 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-start space-x-4">
                      {course.thumbnail && (
                        <img
                          src={course.thumbnail ? `http://localhost:5000${course.thumbnail}` : "https://via.placeholder.com/400x200?text=No+Image"}
                          alt={course.title}
                          className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-200"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-lg mb-2">{course.title}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <span className="mr-1">👥</span>
                            {course.totalStudents || 0} students
                          </span>
                          <span className="flex items-center">
                            <span className="mr-1">💰</span>
                            ${course.discountPrice || course.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`/manage-course/${course._id || course.id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 text-center text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Manage Lessons
                    </a>

                    <button
                      onClick={() => startEditCourse(course)}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Edit Course
                    </button>

                    <button
                      onClick={() => handleDeleteCourse(course._id || course.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Delete
                    </button>
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

export default ManageCourses;
