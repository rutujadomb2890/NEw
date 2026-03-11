const express = require("express");
const router = express.Router();
const { enrollCourse, getEnrolledCourses, checkEnrollment, markLessonCompleted } = require("../controllers/enrollementController");


router.post("/enrollments", enrollCourse);
router.post("/enrollments/mark-lesson-completed", markLessonCompleted);
router.get("/enrollments/:studentId/:courseId", checkEnrollment);
router.get("/enrollments/:studentId", getEnrolledCourses);

module.exports = router;