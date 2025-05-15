export const getToken = () => localStorage.getItem("accessToken");
export const setToken = (token) => localStorage.setItem("accessToken", token);
export const removeToken = () => localStorage.removeItem("accessToken");

export const getRefreshToken = () => localStorage.getItem("refreshToken");
export const setRefreshToken = (token) =>
  localStorage.setItem("refreshToken", token);
export const removeRefreshToken = () => localStorage.removeItem("refreshToken");
