import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const PROMPT = ChatPromptTemplate.fromMessages([
	[
		"system",
		[
			"너는 애자일에 대한 전반적인 질문 및 나의 팀 구조 또는 프로젝트 진행상황에 관련된 질문에 대답해주는 도우미야.",
			"내가 주는 팀 구조 json을 참고해서 답변해줘.",
			"반드시 전문적인 답변만 해야해. 다른 말은 쓰지 마.",
		].join(" "),
	],
	[
		"human",
		"내가 속한 팀들의 구조:\n{content}\n\n내가 속한 팀들, 그 팀의 상세 설명과 진행중인 프로젝트들, 각 프로젝트의 설명과 이슈들의 정보가 담긴 json이야. 이를 참고해서 나의 질문에 답변해줘.",
	],
]);

const useAgent = async (content, apiKey) => {
	const model = new ChatGoogleGenerativeAI({
		apiKey,
		model: "gemini-2.5-flash-lite",
		apiVersion: "v1beta",
		temperature: 0.3,
	});
	const chain = PROMPT.pipe(model).pipe(new StringOutputParser());
	const response = await chain.invoke({ content });
	return response;
};

export default useAgent;
