import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

const useAuth = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { isAuthenticated };
};

export default useAuth;
