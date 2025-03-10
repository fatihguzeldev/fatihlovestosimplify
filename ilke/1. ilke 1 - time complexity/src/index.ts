import { performance } from "perf_hooks";
import { mockDataset } from "./database/mockDataset";

// O(n)
const findFatih = (dataset: string[]): number => {
  const start = performance.now();

  for (let i = 0; i < dataset.length; i++) {
    if (dataset[i] === "Fatih Güzel") {
      const end = performance.now();

      console.log(`O(n) execution time: ${end - start} ms`);

      return i;
    }
  }

  // eğer bulamazsak
  const end = performance.now();
  console.log(`O(n) execution time: ${end - start} ms`);

  return -1;
};

const index = findFatih(mockDataset);

console.log(index);
