import { FeatureExtractionPipeline, pipeline } from "@xenova/transformers";

let embedder: FeatureExtractionPipeline;

export const getEmbedding = async (text: string) => {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }

  const output = await embedder(text, { normalize: true, pooling: "mean" });

  return Array.from(output.data);
};
