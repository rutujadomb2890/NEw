const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const Lesson = require("../models/lesson");

exports.enrollCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    console.log("Enrollment request - studentId:", studentId, "courseId:", courseId);

    // Validate IDs
    if (!studentId || !courseId) {
      return res.status(400).json({ message: "Student ID and Course ID are required" });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      console.log("Student already enrolled in this course");
      return res.status(400).json({ message: "Already enrolled" });
    }

    // Create enrollment - let MongoDB handle the ID conversion
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    console.log("Enrollment created with ID:", enrollment._id);

    // Fetch the created enrollment with populated data
    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate({
        path: "course",
        select: "title thumbnail price discountPrice instructor rating"
      })
      .populate({
        path: "student",
        select: "name email"
      });

    console.log("Populated enrollment:", populatedEnrollment);

    res.status(201).json({
      message: "Enrolled successfully",
      enrollment: populatedEnrollment,
    });

  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mark lesson as completed and update course progress
exports.markLessonCompleted = async (req, res) => {
  try {
    const { studentId, courseId, lessonId } = req.body;

    if (!studentId || !courseId || !lessonId) {
      return res.status(400).json({ message: "Student ID, Course ID, and Lesson ID are required" });
    }

    // Find the enrollment
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Add lesson to completedLessons if not already there
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // Get total lessons in the course
    const totalLessons = await Lesson.countDocuments({ course: courseId });

    // Calculate progress percentage
    const completedCount = enrollment.completedLessons.length;
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    enrollment.progress = progress;

    await enrollment.save();

    const updatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate({
        path: "course",
        select: "title thumbnail price discountPrice instructor rating"
      })
      .populate({
        path: "student",
        select: "name email"
      });

    res.status(200).json({
      message: "Lesson marked as completed",
      enrollment: updatedEnrollment,
      progress: progress,
    });

  } catch (error) {
    console.error("Mark lesson completed error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const { studentId } = req.params;

    console.log("Fetching enrollments for student:", studentId);

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Find enrollments and populate with course details
    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "course",
        select: "title thumbnail price discountPrice instructor rating description"
      })
      .populate({
        path: "student",
        select: "name email"
      })
      .sort({ createdAt: -1 });

    console.log(`Found ${enrollments.length} enrollments for student ${studentId}`);
    console.log("Enrollments data:", enrollments);

    res.status(200).json({
      message: "Enrolled courses fetched successfully",
      enrollments,
    });

  } catch (error) {
    console.error("Get enrollments error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.checkEnrollment = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    console.log("Checking enrollment - studentId:", studentId, "courseId:", courseId);

    if (!studentId || !courseId) {
      return res.status(400).json({ message: "Student ID and Course ID are required" });
    }

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    const isEnrolled = !!enrollment;
    console.log(`Student ${studentId} enrollment in course ${courseId}:`, isEnrolled);

    res.status(200).json({
      isEnrolled,
    });

  } catch (error) {
    console.error("Check enrollment error:", error);
    res.status(500).json({ message: error.message });
  }
};