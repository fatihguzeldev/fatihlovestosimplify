import { chunks } from "./chunks";
import { getEmbedding } from "./embed";
import { cosineSimilarity } from "./similarity";
import readlineSync from "readline-sync";
import { generateText } from "./generate";

function buildPrompt(context: string, question: string): string {
  return `Using the following information, answer the question as accurately as possible.
  Context: ${context}

  Question: ${question}

  just give the answer directly, with few sentences. don't mention the context in the answer.`;
}

const main = async () => {
  console.log("embedding hesaplanıyor...");

  const chunkEmbeddings = await Promise.all(
    chunks.map(async (chunk) => ({
      ...chunk,
      embedding: await getEmbedding(chunk.text),
    }))
  );

  while (true) {
    const question = readlineSync.question(
      "\nsorunuzu yazın (çıkmak için q): "
    );

    if (question.toLowerCase() === "q") {
      break;
    }

    const questionEmbedding = await getEmbedding(question);

    const topChunk = chunkEmbeddings
      .map((chunk) => ({
        ...chunk,
        score: cosineSimilarity(questionEmbedding, chunk.embedding),
      }))
      .sort((a, b) => b.score - a.score)[0];

    const prompt = buildPrompt(topChunk.text, question);

    const response = await generateText(prompt);

    console.log("en alakalı context: ", topChunk.text, topChunk.score);
    console.log("\n");
    console.log(response);
  }
};

main();
