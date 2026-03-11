const express = require("express");
const router = express.Router();

const {
  createLesson,
  getLessonsByCourse,
  getSingleLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");

const upload = require("../config/multerVideo");

// CREATE lesson
router.post("/lessons/", upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), createLesson);

// GET lessons by course
router.get("/lessons/course/:courseId", getLessonsByCourse);

// GET single lesson
router.get("/lessons/:id", getSingleLesson);

// UPDATE lesson
router.put("/lessons/:id", upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), updateLesson);

// DELETE lesson
router.delete("/lessons/:id", deleteLesson);

module.exports = router;