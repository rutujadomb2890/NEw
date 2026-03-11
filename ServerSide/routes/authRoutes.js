const express = require("express");
const { registerUser, loginUser, updateProfile, getProfile } = require("../controllers/AuthController");
const upload = require("../config/multer");

const router = express.Router();


router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/profile/:id", getProfile);
router.put("/users/profile/:id", upload.single("profileImage"), updateProfile);

module.exports = router;