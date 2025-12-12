import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Chatbot from "../components/layout/Chatbot";

const MainLayout = () => {
	return (
		<div className="flex flex-col min-h-screen relative">
			{/* Navbar - 최상단 고정 */}
			<Navbar className="bg-gray shadow-md" />

			{/* 메인 콘텐츠 영역 (Sidebar + Content) */}
			<div className="flex flex-1 pt-16 overflow-y-auto max-h-[calc(100vh)] py-4 max-md:flex-col">
				{/* Sidebar - 왼쪽 고정 */}
				<Sidebar className="w-50" />
				{/* 메인 콘텐츠 - 오른쪽, 스크롤 가능 */}
				<main className="flex-1 md:ml-60 bg-gray-50 ">
					<Outlet />
				</main>
			</div>

			{/* Chatbot - 오른쪽 하단 고정 */}
			<Chatbot />
		</div>
	);
};

export default MainLayout;
