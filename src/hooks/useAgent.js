import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatMistralAI } from "@langchain/mistralai";

const PROMPT = ChatPromptTemplate.fromMessages([
	[
		"system",
		[
			"너는 스프린트 메이트라는 플랫폼에서 유저의 다양한 질문에 답변해주는 챗봇이야.\n",
			"유저의 팀 구조나 프로젝트 진행 상황, 또는 이슈에 관한 질문 상황에서는 다음 JSON을 참고하여 자연어로 대답해줘.\n\n{content}\n",
			"다른 상황에서는 너가 가진 지식 내에서 최대한 친절하게 답변해줘.\n",
		].join(" "),
	],
	["human", "{question}"],
]);

const useAgent = async (content, question) => {
	const model = new ChatMistralAI({
		apiKey: import.meta.env.VITE_MISTRAL_API,
		model: "mistral-large-latest",
		temperature: 0.3,
		maxRetries: 2,
	});
	const chain = PROMPT.pipe(model).pipe(new StringOutputParser());
	const response = await chain.invoke({ content, question });
	console.log(response);
	return response.replace(/``````/g, "").trim();
};

export default useAgent;
