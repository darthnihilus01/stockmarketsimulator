let seedCounter = 0;

export function resetSeedCounter() {
  seedCounter = 0;
}

function hashSeed(): number {
  seedCounter++;
  return (seedCounter * 9301 + 49297) % 233280;
}

export function seededRandom(): number {
  return hashSeed() / 233280;
}

export function normalRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function choleskyDecomposition(matrix: number[][]): number[][] | null {
  const n = matrix.length;
  const L: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) {
        sum += L[i][k] * L[j][k];
      }
      if (i === j) {
        const val = matrix[i][i] - sum;
        if (val <= 0) return null;
        L[i][j] = Math.sqrt(val);
      } else {
        L[i][j] = (matrix[i][j] - sum) / L[j][j];
      }
    }
  }
  return L;
}

export function applyCholesky(L: number[][], uncorrelated: number[]): number[] {
  const n = L.length;
  const result = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += L[i][j] * (uncorrelated[j] ?? 0);
    }
    result[i] = sum;
  }
  return result;
}
