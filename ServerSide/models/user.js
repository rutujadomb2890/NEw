const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "instructor", "student"],
      default: "student",
    },

    profileImage: { type: String, required: false },
    bio: { type: String, required: false },

    // Additional profile fields for instructors
    skills: [{ type: String }], // Array of skills
    socialLinks: {
      linkedin: { type: String },
      github: { type: String },
      website: { type: String },
    },
    experience: { type: Number, default: 0 }, // Years of experience
  },
  { timestamps: true }
);

/* --------------------------
   HASH PASSWORD BEFORE SAVE
---------------------------*/
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// /* --------------------------
//    COMPARE PASSWORD METHOD
// ---------------------------*/
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

module.exports = mongoose.model("User", userSchema);