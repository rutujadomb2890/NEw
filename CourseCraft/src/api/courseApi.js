import axios from "./axios";

export const createCourse = (formData) => {
  return axios.post("/courses/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllCourses = () => {
  return axios.get("/courses/");
};

export const getCourseById = (id) => {
  return axios.get(`/courses/${id}`);
};

export const updateCourse = (id, formData) => {
  return axios.put(`/courses/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteCourse = (id) => {
  return axios.delete(`/courses/${id}`);
};

// Lesson API functions
export const createLesson = (courseId, formData) => {
  return axios.post(`/lessons/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getLessonsByCourse = (courseId) => {
  return axios.get(`/lessons/course/${courseId}`);
};

export const getSingleLesson = (lessonId) => {
  return axios.get(`/lessons/${lessonId}`);
};

export const updateLesson = (lessonId, formData) => {
  return axios.put(`/lessons/${lessonId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteLesson = (lessonId) => {
  return axios.delete(`/lessons/${lessonId}`);
};

// Enrollment API function
export const enrollCourse = (studentId, courseId) => {
  return axios.post(`/enrollments`, {
    studentId,
    courseId,
  });
};

export const getEnrolledCourses = (studentId) => {
  return axios.get(`/enrollments/${studentId}`);
};

export const checkEnrollment = (studentId, courseId) => {
  return axios.get(`/enrollments/${studentId}/${courseId}`);
};

export const markLessonCompleted = (studentId, courseId, lessonId) => {
  return axios.post(`/enrollments/mark-lesson-completed`, {
    studentId,
    courseId,
    lessonId,
  });
};
