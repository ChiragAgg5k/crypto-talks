import {
  CopilotRuntime,
  GroqAdapter,
  copilotRuntimeNextJSPagesRouterEndpoint,
} from "@copilotkit/runtime";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: import.meta.env.GROQ_API_KEY });
const copilotKit = new CopilotRuntime();

const serviceAdapter = new GroqAdapter({
  // @ts-ignore
  groq,
  model: "llama-3.3-70b-versatile",
});

const handler = async (req: any, res: any) => {
  console.log(req.body);
  const handleRequest = copilotRuntimeNextJSPagesRouterEndpoint({
    runtime: copilotKit,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return await handleRequest(req, res);
};

export default handler;
