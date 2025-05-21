import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../../api/authApi"; // Import the API function
import { useAuthStore } from "../../stores/authStore"; // Import the store

const LoginPage = () => {
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login); // Get the login action
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    setErrorMsg(""); // Clear previous errors
    setIsLoading(true); // Set loading state

    try {
      const response = await loginApi({ email, password });
      loginAction(response); // Pass the entire response to loginAction
      navigate("/"); // Redirect to homepage on successful login
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.status === 401) {
        setErrorMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setErrorMsg("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          로그인
        </h2>

        {errorMsg && (
          <p className="text-red-500 text-sm mb-4 text-center">{errorMsg}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleLogin();
              }
            }}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading} // Disable button while loading
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "로그인 중..." : "로그인"} {/* Show loading text */}
        </button>

        <div className="text-center mt-6">
          <span className="text-sm text-gray-600 mr-1">
            아직 회원이 아니신가요?
          </span>
          <button
            onClick={() => navigate("/signup")}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
