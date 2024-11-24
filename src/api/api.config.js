import axios from "axios";

export const baseURL =
  "https://odl-contractattendance-e3v0.onrender.com/api/v1";

// console.log("API Base URL:", baseURL); // Add this line for debugging

export const Api = axios.create({
  baseURL,
  withCredentials: false,
});

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//axios.get("url")
//Api.get("url")
//Api.post("/signup", {email: "email", password: "password"});
