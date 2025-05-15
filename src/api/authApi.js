import axiosInstance from "./axiosInstance";

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

export const signup = async (userData) => {
  const response = await axiosInstance.post("/api/auth/signup", userData);
  return response.data;
};
