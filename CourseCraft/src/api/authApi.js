import axios from "./axios";

export const loginUser = (data) => {
  return axios.post("/users/login", data);
};

export const registerUser = (data) => {
  return axios.post("/users/register", data);
};

export const getProfileIns = (userId) => {
  return axios.get(`/users/profile/${userId}`);
};

export const updateProfileIns = (userId, formData) => {
  return axios.put(`/users/profile/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};