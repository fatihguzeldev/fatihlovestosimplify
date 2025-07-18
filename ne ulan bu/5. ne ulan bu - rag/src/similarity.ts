// embeddingler zaten normalize, bu yüzden sadece dot product yapıyoruz.
export function cosineSimilarity(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}
