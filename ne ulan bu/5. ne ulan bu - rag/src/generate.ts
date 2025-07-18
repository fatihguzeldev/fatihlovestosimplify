import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const API_URL = "https://router.huggingface.co/v1/chat/completions";
const API_TOKEN = process.env.HF_API_TOKEN || "";

export const generateText = async (prompt: string) => {
  if (!API_TOKEN) {
    throw new Error("HF_API_TOKEN is missing");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`HF API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  return (data as any).choices[0].message.content;
};
