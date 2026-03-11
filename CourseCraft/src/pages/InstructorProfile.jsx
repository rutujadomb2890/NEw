import DashboardLayout from "../layouts/DashboardLayout";
import React, { useState, useEffect } from "react";
import { getProfileIns, updateProfileIns } from "../api/authAPi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InstructorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // Form states
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState(0);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    website: "",
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const response = await getProfileIns(user._id || user.id);
      setProfile(response.data.user);
      setStats(response.data.stats);

      // Set form values
      setBio(response.data.user.bio || "");
      setExperience(response.data.user.experience || 0);
      setSkills(response.data.user.skills || []);
      setSocialLinks(response.data.user.socialLinks || {
        linkedin: "",
        github: "",
        website: "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks({
      ...socialLinks,
      [platform]: value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();

      formData.append("bio", bio);
      formData.append("experience", experience);
      formData.append("skills", JSON.stringify(skills));
      formData.append("socialLinks", JSON.stringify(socialLinks));

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await updateProfileIns(user._id || user.id, formData);
      toast.success("Profile updated successfully!");
      setEditing(false);
      fetchProfile(); // Refresh data
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="instructor">
        <div className="text-center py-12">
          <p>Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="instructor">
      <ToastContainer />

      <div className="max-w-6xl mx-auto space-y-8">

        {/* Profile Header */}
        <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-8">

          <div className="relative">
            <img
              src={profile?.profileImage ? `http://localhost:5000${profile.profileImage}` : "https://via.placeholder.com/150"}
              alt="Instructor"
              className="w-36 h-36 rounded-full object-cover shadow-lg"
            />
            {editing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                📷
              </label>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800">
              {profile?.name || "Instructor"}
            </h2>
            <p className="text-indigo-600 font-medium mt-2">
              {profile?.bio || "No bio available"}
            </p>
            <p className="text-gray-600 mt-4 max-w-xl">
              Email: {profile?.email}
            </p>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>

        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalCourses || 0}</p>
            <p className="text-gray-600">Courses</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-3xl font-bold text-green-600">{stats.totalStudents || 0}</p>
            <p className="text-gray-600">Students</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-3xl font-bold text-yellow-500">{stats.avgRating || 0} ⭐</p>
            <p className="text-gray-600">Average Rating</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.experience || 0}</p>
            <p className="text-gray-600">Years Experience</p>
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-xl space-y-6">

            <h3 className="text-xl font-semibold text-gray-800">Edit Profile</h3>

            {/* Bio */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="3"
                className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Years of Experience</label>
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                min="0"
                className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Skills & Expertise</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  className="flex-1 p-4 rounded-xl border border-gray-300 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                />
                <button
                  onClick={handleAddSkill}
                  className="bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Social Links</label>
              <div className="space-y-3">
                <input
                  type="url"
                  value={socialLinks.linkedin}
                  onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                  placeholder="LinkedIn URL"
                  className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                />
                <input
                  type="url"
                  value={socialLinks.github}
                  onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                  placeholder="GitHub URL"
                  className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                />
                <input
                  type="url"
                  value={socialLinks.website}
                  onChange={(e) => handleSocialLinkChange("website", e.target.value)}
                  placeholder="Personal Website URL"
                  className="w-full p-4 rounded-xl border border-gray-300 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Save Changes
              </button>
            </div>

          </div>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {(socialLinks.linkedin || socialLinks.github || socialLinks.website) && (
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Social Links</h3>
            <div className="space-y-2">
              {socialLinks.linkedin && (
                <p className="text-blue-600 cursor-pointer hover:underline">
                  🔗 {socialLinks.linkedin}
                </p>
              )}
              {socialLinks.github && (
                <p className="text-gray-800 cursor-pointer hover:underline">
                  💻 {socialLinks.github}
                </p>
              )}
              {socialLinks.website && (
                <p className="text-indigo-600 cursor-pointer hover:underline">
                  🌐 {socialLinks.website}
                </p>
              )}
            </div>
          </div>
        )}

      </div>

    </DashboardLayout>
  );
};

export default InstructorProfile;
