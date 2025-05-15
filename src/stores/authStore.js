import { create } from "zustand";
import { getToken, setToken, removeToken } from "../utils/tokenManager";

export const useAuthStore = create((set) => ({
  isAuthenticated: !!getToken(),
  user: null,
  accessToken: null,
  refreshToken: null,
  login: ({ accessToken, refreshToken, email, username }) => {
    setToken(accessToken); // Save access token to local storage
    set({
      isAuthenticated: true,
      user: { email, username },
      accessToken,
      refreshToken,
    });
  },
  logout: () => {
    removeToken(); // Remove token from local storage
    set({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  },
  checkAuth: () => {
    const token = getToken();
    if (token) {
      set({ isAuthenticated: true });
    } else {
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
      });
    }
  },
}));
