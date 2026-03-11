import DashboardLayout from "../layouts/DashboardLayout";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getLessonsByCourse, createLesson, updateLesson, deleteLesson } from "../api/courseApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageCourse = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState(null);

  const [lessonData, setLessonData] = useState({
    title: "",
    duration: "",
    description: "",
    video: null,
    thumbnail: null,
  });

  const [preview, setPreview] = useState(null);

  // Fetch lessons when component mounts
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await getLessonsByCourse(courseId);
        setLessons(response.data);
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
        toast.error("Failed to load lessons");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchLessons();
    }
  }, [courseId]);

  // Handle input change
  const handleChange = (e) => {
    setLessonData({
      ...lessonData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle thumbnail image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLessonData({ ...lessonData, thumbnail: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle video upload
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLessonData({ ...lessonData, video: file });
    }
  };

  // Add or Update lesson
  const handleAddLesson = async () => {
    if (!lessonData.title || !lessonData.duration) {
      toast.error("Please fill in title and duration");
      return;
    }

    if (!lessonData.video && !editingLesson) {
      toast.error("Please upload a video for the lesson");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", lessonData.title);
      formData.append("duration", lessonData.duration);
      formData.append("description", lessonData.description);
      formData.append("course", courseId);

      let order;
      if (editingLesson) {
        order = editingLesson.order;
      } else {
        order = lessons.length + 1;
      }
      formData.append("order", order);

      if (lessonData.video) {
        formData.append("video", lessonData.video);
      }
      if (lessonData.thumbnail) {
        formData.append("thumbnail", lessonData.thumbnail);
      }

      if (editingLesson) {
        // Update existing lesson
        await updateLesson(editingLesson._id, formData);
        toast.success("Lesson updated successfully!");
      } else {
        // Create new lesson
        await createLesson(courseId, formData);
        toast.success("Lesson added successfully!");
      }

      // Refresh lessons
      const response = await getLessonsByCourse(courseId);
      setLessons(response.data);

      // Reset form
      setLessonData({
        title: "",
        duration: "",
        description: "",
        video: null,
        thumbnail: null,
      });
      setPreview(null);
      setEditingLesson(null);

    } catch (error) {
      console.error("Failed to save lesson:", error);
      toast.error(error.response?.data?.message || "Failed to save lesson");
    }
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setLessonData({
      title: lesson.title,
      duration: lesson.duration,
      description: lesson.description || "",
      video: null,
      thumbnail: null,
    });
    setPreview(lesson.thumbnail ? `http://localhost:5000${lesson.thumbnail}` : null);
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) {
      return;
    }

    try {
      await deleteLesson(lessonId);
      toast.success("Lesson deleted successfully!");

      // Refresh lessons
      const response = await getLessonsByCourse(courseId);
      setLessons(response.data);

    } catch (error) {
      console.error("Failed to delete lesson:", error);
      toast.error("Failed to delete lesson");
    }
  };

  const handleCancelEdit = () => {
    setEditingLesson(null);
    setLessonData({
      title: "",
      duration: "",
      description: "",
      video: null,
      thumbnail: null,
    });
    setPreview(null);
  };

  return (
    <DashboardLayout role="instructor">
      <ToastContainer />

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Manage Course Lessons
      </h2>

      {loading ? (
        <div className="text-center py-8">
          <p>Loading lessons...</p>
        </div>
      ) : (
        <>
          {/* Add/Edit Lesson Section */}
          <div className="bg-white p-6 rounded-2xl shadow mb-8">
            <h3 className="text-lg font-semibold mb-6">
              {editingLesson ? "Edit Lesson" : "Add New Lesson"}
            </h3>

            <div className="space-y-4">

              <input
                type="text"
                name="title"
                value={lessonData.title}
                onChange={handleChange}
                placeholder="Lesson Title"
                className="w-full p-3 border rounded-xl"
              />

              <input
                type="text"
                name="duration"
                value={lessonData.duration}
                onChange={handleChange}
                placeholder="Duration (e.g. 15 min)"
                className="w-full p-3 border rounded-xl"
              />

              <textarea
                name="description"
                value={lessonData.description}
                onChange={handleChange}
                placeholder="Lesson Description"
                rows="3"
                className="w-full p-3 border rounded-xl"
              ></textarea>

              {/* Video Upload */}
              <div>
                <label className="block mb-2 font-medium">
                  Upload Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="w-full p-2 border rounded-xl"
                />
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block mb-2 font-medium">
                  Upload Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded-xl"
                />

                {preview && (
                  <img
                    src={preview}
                    alt="Thumbnail Preview"
                    className="mt-4 w-40 h-24 object-cover rounded-xl shadow"
                  />
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddLesson}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl"
                >
                  {editingLesson ? "Update Lesson" : "Add Lesson"}
                </button>

                {editingLesson && (
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-6 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Lessons List */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">
              Course Lessons ({lessons.length})
            </h3>

            {lessons.length === 0 ? (
              <p>No lessons added yet.</p>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <div
                    key={lesson._id || lesson.id}
                    className="flex justify-between items-center border p-4 rounded-xl"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{lesson.title}</p>
                      <p className="text-gray-500 text-sm">
                        {lesson.duration}
                      </p>
                      {lesson.description && (
                        <p className="text-gray-600 text-sm mt-1">
                          {lesson.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(lesson)}
                        className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(lesson._id || lesson.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

    </DashboardLayout>
  );
};

export default ManageCourse;
