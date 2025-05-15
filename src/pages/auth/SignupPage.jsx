import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup as signupApi } from "../../api/authApi";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, username } = formData;

    if (!email || !password || !confirmPassword || !username) {
      setErrorMsg("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      await signupApi({ email, password, username });
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMsg("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Signup Page</h1>
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        {errorMsg && (
          <p className="text-red-500 text-sm mb-4 text-center">{errorMsg}</p>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your password"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
            비밀번호 확인
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Confirm your password"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">
            사용자 이름
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your username"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "회원가입 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
