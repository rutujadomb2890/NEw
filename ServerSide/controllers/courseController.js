const Course = require("../models/course");

exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, discountPrice, instructor } = req.body;

    const thumbnail = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const course = await Course.create({
      title,
      description,
      price,
      discountPrice,
      instructor,
      thumbnail,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { title, description, price, discountPrice } = req.body;

    const updateData = {
      title,
      description,
      price,
      discountPrice,
    };

    // If new image uploaded
    if (req.file) {
      updateData.thumbnail = `/uploads/${req.file.filename}`;
    }

    const course = await Course.findByIdAndUpdate(
        req.params.id,
        updateData,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({
      message: "Course updated successfully",
      course,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};