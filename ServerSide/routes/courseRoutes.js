const express = require("express");
const router = express.Router();

const upload = require("../config/multer");

const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

/* CREATE */
router.post("/courses/", upload.single("thumbnail"), createCourse);

/* READ */
router.get("/courses/", getAllCourses);
router.get("/courses/:id", getCourseById);

/* UPDATE */
router.put("/courses/:id", upload.single("thumbnail"), updateCourse);

/* DELETE */
router.delete("/courses/:id", deleteCourse);

module.exports = router;