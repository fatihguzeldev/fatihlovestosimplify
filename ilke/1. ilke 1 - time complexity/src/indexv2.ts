import { mockDataset } from "./database/mockDataset";
import { performance } from "perf_hooks";

// O(log n)
// binary search
const findFatih = (dataset: string[]): number => {
  const start = performance.now();
  let left = 0;
  let right = dataset.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (dataset[mid] === "Fatih Güzel") {
      const end = performance.now();
      console.log(`O(log n) execution time: ${end - start} ms`);
      return mid;
    } else if (dataset[mid] < "Fatih Güzel") {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // eğer bulamazsak
  const end = performance.now();
  console.log(`O(log n) execution time: ${end - start} ms`);

  return -1;
};

const index = findFatih(mockDataset);

console.log(index);
