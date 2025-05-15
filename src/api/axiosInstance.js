import axios from "axios";
import { getToken } from "../utils/tokenManager"; // added import

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Remove the extra `/api` prefix
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
