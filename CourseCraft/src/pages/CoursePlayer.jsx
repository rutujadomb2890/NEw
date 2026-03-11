import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getLessonsByCourse, markLessonCompleted, getEnrolledCourses } from "../api/courseApi";

const CoursePlayer = () => {
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [courseProgress, setCourseProgress] = useState(0);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get student ID from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setStudentId(user._id);
    }
  }, []);

  // Fetch lessons and enrollment progress from backend
  useEffect(() => {
    const fetchLessonsAndProgress = async () => {
      try {
        setLoading(true);
        const res = await getLessonsByCourse(courseId);
        setLessons(res.data);

        if (res.data.length > 0) {
          setCurrentLesson(res.data[0]);
        }

        // Fetch enrollment to get completed lessons and progress
        if (studentId) {
          try {
            const enrollmentRes = await getEnrolledCourses(studentId);
            const enrollments = enrollmentRes.data.enrollments || [];
            const courseEnrollment = enrollments.find(
              (e) => e.course?._id === courseId
            );

            if (courseEnrollment) {
              setCompletedLessons(courseEnrollment.completedLessons || []);
              setCourseProgress(courseEnrollment.progress || 0);
              console.log(
                `Loaded progress: ${courseEnrollment.progress}%, Completed lessons: ${courseEnrollment.completedLessons?.length || 0}`
              );
            }
          } catch (err) {
            console.error("Error fetching enrollment:", err);
          }
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchLessonsAndProgress();
    }
  }, [courseId, studentId]);

  const handleTimeUpdate = async (e) => {
    const video = e.target;
    const progress = (video.currentTime / video.duration) * 100;

    if (
      progress >= 80 &&
      currentLesson &&
      !completedLessons.includes(currentLesson._id) &&
      studentId
    ) {
      try {
        const response = await markLessonCompleted(studentId, courseId, currentLesson._id);
        
        // Update local state with response from backend
        setCompletedLessons(response.data.enrollment.completedLessons || []);
        setCourseProgress(response.data.progress);

        console.log(`Lesson marked as completed. Course progress: ${response.data.progress}%`);
      } catch (error) {
        console.error("Error marking lesson as completed:", error);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">
          <p>Loading course content...</p>
        </div>
      </>
    );
  }

  if (!currentLesson) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">
          No lessons available for this course.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 flex">

        {/* Sidebar */}
        <div className="w-1/4 bg-white shadow p-4">

          <h2 className="text-lg font-semibold mb-4">
            Course Lessons
          </h2>

          {/* Progress Bar */}
          <div className="mb-6 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-300"
              style={{ width: `${courseProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mb-4 font-semibold">
            Progress: {courseProgress}%
          </p>

          <div className="space-y-3">

            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                onClick={() => setCurrentLesson(lesson)}
                className={`p-3 rounded-lg cursor-pointer ${
                  currentLesson._id === lesson._id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {lesson.title}

                {completedLessons.includes(lesson._id) && (
                  <span className="ml-2 text-green-400 font-bold">
                    ✔
                  </span>
                )}
              </div>
            ))}

          </div>

        </div>

        {/* Video Player */}
        <div className="w-3/4 p-8">

          <h1 className="text-2xl font-bold mb-4">
            {currentLesson.title}
          </h1>

          <video
            key={currentLesson.videoUrl}
            controls
            onTimeUpdate={handleTimeUpdate}
            className="w-full rounded-xl shadow mb-6"
          >
            <source
              src={currentLesson.videoUrl}
              type="video/mp4"
            />
          </video>

          {/* Lesson Details */}
          <div className="bg-white p-6 rounded-xl shadow">

            <p className="text-gray-700 mb-4">
              {currentLesson.description}
            </p>

            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">

              <div>
                <strong>Duration:</strong>
                <br />
                {currentLesson.duration}
              </div>

              <div>
                <strong>Order:</strong>
                <br />
                {currentLesson.order}
              </div>

              <div>
                <strong>Status:</strong>
                <br />
                {completedLessons.includes(currentLesson._id)
                  ? "Completed"
                  : "In Progress"}
              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default CoursePlayer;