import { useEffect, useState } from "react";
import getAllInfo from "../../utils/getAllInfo";

const Chatbot = () => {
	const [chatBotOn, setChatbotOn] = useState(false);
	const [allInfo, setAllInfo] = useState({});

	useEffect(() => {
		if (chatBotOn) {
			const setInfo = async () => {
				const info = await getAllInfo();
				setAllInfo(info);
			};
			setInfo();
		}
		console.log(allInfo);
	}, [chatBotOn]);

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
				<div className="absolute flex flex-col justify-between w-96 h-[600px] right-0 bottom-16">
					<div className="w-full h-full bg-white border-gray-300 border-2 rounded"></div>
					<input
						className="w-full bg-white border-gray-300 border-2 rounded h-10 text-black pl-2 pr-2"
						type="text"
						placeholder="애자일에 관해 질문해주세요."
					></input>
				</div>
			)}
		</div>
	);
};

export default Chatbot;
