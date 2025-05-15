import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore"; // Import the store

const HomePage = () => {
  const navigate = useNavigate();
  // Get authentication state from the store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-16 flex flex-col items-center justify-start text-center">
      {/* 헤더 */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
        Sprint Mate에 오신 것을 환영합니다 🚀
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 max-w-xl mb-8">
        이슈의 내용을 분석해 스토리 포인트를 예측하고, 팀의 협업과 일정 관리를
        더 쉽게 만들어드립니다.
      </p>

      {/* 로그인 여부에 따른 CTA */}
      {isAuthenticated ? ( // Use state from store
        <button
          onClick={() => navigate("/teams")}
          className="px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition mb-12"
        >
          내 팀으로 이동하기
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            로그인
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
          >
            회원가입
          </button>
        </div>
      )}

      {/* 주요 기능 소개 */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">📊 SP 예측 자동화</h3>
          <p className="text-sm text-gray-600">
            AI가 이슈 내용을 분석해 스토리 포인트를 자동으로 예측합니다.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">📋 칸반 기반 이슈 관리</h3>
          <p className="text-sm text-gray-600">
            프로젝트의 이슈를 칸반 보드로 시각적으로 관리할 수 있습니다.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">🧑‍💻 역할 기반 팀 운영</h3>
          <p className="text-sm text-gray-600">
            PO, SM, 개발자 역할을 구분해 팀을 체계적으로 운영할 수 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
