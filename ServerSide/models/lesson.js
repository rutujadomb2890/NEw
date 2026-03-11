const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    duration: {
      type: String,
      trim: true,
    },

    videoUrl: {
      type: String,   // Cloudinary secure_url
      required: true,
    },

    videoPublicId: {
      type: String,   // Cloudinary public_id (important for deleting video later)
      required: true,
    },

    thumbnail: {
      type: String,   // Cloudinary secure_url for thumbnail
    },

    order: {
      type: Number,   // Lesson sequence inside course
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("lessons", lessonSchema);