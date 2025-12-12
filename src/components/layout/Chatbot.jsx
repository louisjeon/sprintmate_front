import { useEffect, useRef, useState } from "react";
import getAllInfo from "../../utils/getAllInfo";
import useAgent from "../../hooks/useAgent";
import { useAuthStore } from "../../stores/authStore";

const Chatbot = () => {
	const [chatBotOn, setChatbotOn] = useState(false);
	const [allInfo, setAllInfo] = useState({});
	const [chatHistory, setChatHistory] = useState([]);
	const [answerLoading, setAnswerLoading] = useState(false);
	const [showLoadingWarning, setShowLoadingWarning] = useState(false);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const scrollRef = useRef();
	const [dotCnt, setDotCnt] = useState(0);

	useEffect(() => {
		if (chatBotOn & isAuthenticated) {
			const setInfo = async () => {
				const info = await getAllInfo();
				setAllInfo(info);
			};
			setInfo();
		}
		console.log(allInfo);
	}, [chatBotOn]);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [chatHistory]);

	useEffect(() => {
		if (answerLoading) {
			const timer = setInterval(() => {
				console.log(dotCnt);
				setDotCnt((prev) => (prev + 1) % 3);
			}, 200);
			return () => {
				clearInterval(timer);
			};
		} else {
			setDotCnt(0);
		}
	}, [answerLoading]);

	const envokeModel = async (message, sent) => {
		await useAgent(allInfo, message)
			.then((ans) =>
				setChatHistory([
					...chatHistory,
					sent,
					{ type: "received", message: ans },
				])
			)
			.then(() => setAnswerLoading(false));
	};

	return (
		<div
			id="circle"
			className="absolute border-4 border-blue-900 flex bg-blue-500 text-center text-white w-16 h-16 right-4 bottom-4 rounded-full cursor-pointer"
			onClick={(e) =>
				["circle", "h1"].includes(e.target.id) &&
				setChatbotOn(!chatBotOn)
			}
		>
			<h1 id="h1" className="m-auto select-none">
				애자일
				<br />
				챗봇
			</h1>
			{chatBotOn && (
				<div className="absolute flex flex-col z-10 justify-between w-[calc(100vw-40px)] max-w-96 h-[calc(100vh-100px)] max-h-[600px] right-0 bottom-16 text-black">
					<div
						ref={scrollRef}
						className="flex flex-col w-full h-full bg-white border-gray-300 border-2 rounded cursor-default overflow-scroll"
					>
						{showLoadingWarning && (
							<div className="absolute flex -mt-10 rounded h-10 w-full bg-red-500 text-white animate-[fadeOut_3s_linear_forwards]">
								<h1 className="m-auto">
									에이전트가 답변중입니다...
								</h1>
							</div>
						)}
						{chatHistory.map((chat, i) => {
							let styleStr = "";
							switch (chat.type) {
								case "sent":
									styleStr = "bg-gray-200 self-end";
									break;
								case "received":
									styleStr = "bg-blue-500 text-white";
									break;
							}
							return (
								<div
									className={
										"rounded p-1 m-1 w-4/6 " + styleStr
									}
									key={i}
								>
									{chat.message}
								</div>
							);
						})}
						{answerLoading && (
							<div className="rounded p-1 m-1 w-4/6 bg-blue-500 text-white">
								에이전트가 답변중입니다{".".repeat(dotCnt)}
							</div>
						)}
					</div>
					<input
						className="w-full bg-white border-gray-300 border-2 rounded h-10 pl-2 pr-2"
						type="text"
						placeholder="팀, 프로젝트 또는 다양한 주제에 관해 질문해주세요."
						onKeyDown={(e) => {
							if (
								e.key === "Enter" &&
								e.nativeEvent.isComposing == false
							) {
								if (!answerLoading) {
									setChatHistory([
										...chatHistory,
										{
											type: "sent",
											message: e.target.value,
										},
									]);
									envokeModel(e.target.value, {
										type: "sent",
										message: e.target.value,
									});
									setAnswerLoading(true);
									e.target.value = "";
								} else {
									setShowLoadingWarning(true);
									setTimeout(() => {
										setShowLoadingWarning(false);
									}, 3000);
								}
							}
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default Chatbot;
