const User = require("../models/user");
const Course = require("../models/course");
const Enrollment = require("../models/enrollment");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==========================
   LOGIN USER
==========================*/
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });
    console.log(user)

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // const isMatch = await user.matchPassword(password);

    if(password !== user.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==========================
   UPDATE PROFILE
==========================*/
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { bio, skills, socialLinks, experience } = req.body;

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (experience !== undefined) updateData.experience = experience;

    // Parse JSON strings
    if (skills !== undefined) {
      updateData.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    }
    if (socialLinks !== undefined) {
      updateData.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
    }

    // Handle profile image upload
    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ==========================
   GET PROFILE WITH STATS
==========================*/
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let stats = {};
    if (user.role === "instructor") {
      // Get courses by instructor
      const courses = await Course.find({ instructor: userId });

      // Calculate total students
      const enrollments = await Enrollment.find({ course: { $in: courses.map(c => c._id) } });
      const totalStudents = enrollments.length;

      // Calculate average rating
      const avgRating = courses.length > 0 ? courses.reduce((sum, c) => sum + c.rating, 0) / courses.length : 0;

      stats = {
        totalCourses: courses.length,
        totalStudents,
        avgRating: parseFloat(avgRating.toFixed(1)),
        experience: user.experience || 0,
      };
    }

    res.json({
      user,
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};