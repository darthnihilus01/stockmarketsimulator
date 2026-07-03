// spec: 4.3.1, 4.3.2 — Cholesky decomposition + PSD repair

export function choleskyDecomposition(matrix: number[][]): number[][] {
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
        if (val <= 1e-14) {
          L[i][j] = 0;
        } else {
          L[i][j] = Math.sqrt(val);
        }
      } else {
        if (Math.abs(L[j][j]) < 1e-14) {
          L[i][j] = 0;
        } else {
          L[i][j] = (matrix[i][j] - sum) / L[j][j];
        }
      }
    }
  }
  return L;
}

export function isPSD(matrix: number[][]): boolean {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    const eigenvalues = matrix.map((row, j) => row[i]);
    const sum = eigenvalues.reduce((s, v) => s + v, 0);
    if (sum <= 0) return false;
  }
  const L = choleskyDecomposition(matrix);
  for (let i = 0; i < n; i++) {
    if (isNaN(L[i][i]) || L[i][i] === undefined) return false;
  }
  return true;
}

export function nearestPSD(matrix: number[][]): number[][] {
  const n = matrix.length;
  const X: number[][] = matrix.map((r) => [...r]);
  let diff = 1;
  const maxIter = 100;
  let iter = 0;

  while (diff > 1e-10 && iter < maxIter) {
    iter++;
    const prev = X.map((r) => [...r]);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        X[j][i] = X[i][j] = (X[i][j] + X[j][i]) / 2;
      }
    }
    const eig = eigenDecomposition(X);
    for (let i = 0; i < n; i++) {
      eig.values[i] = Math.max(eig.values[i], 1e-10);
    }
    const reconstructed = reconstructMatrix(eig);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        X[i][j] = reconstructed[i][j];
        X[j][i] = reconstructed[i][j];
      }
    }
    for (let i = 0; i < n; i++) {
      const norm = Math.sqrt(X[i].reduce((s, v, k) => s + v * X[k][i], 0));
      if (norm > 0) {
        for (let j = 0; j < n; j++) {
          X[i][j] /= norm;
          X[j][i] /= norm;
        }
      }
    }
    let maxDiff = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        maxDiff = Math.max(maxDiff, Math.abs(X[i][j] - prev[i][j]));
      }
    }
    diff = maxDiff;
  }

  return X;
}

function eigenDecomposition(matrix: number[][]): { values: number[]; vectors: number[][] } {
  const n = matrix.length;
  const A = matrix.map((r) => [...r]);
  const V = Array.from({ length: n }, (_, i) => {
    const v = new Array(n).fill(0);
    v[i] = 1;
    return v;
  });

  for (let iter = 0; iter < 50; iter++) {
    let maxOff = 0;
    let p = 0, q = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const val = Math.abs(A[i][j]);
        if (val > maxOff) {
          maxOff = val;
          p = i;
          q = j;
        }
      }
    }
    if (maxOff < 1e-14) break;

    const app = A[p][p];
    const aqq = A[q][q];
    const apq = A[p][q];
    const theta = (aqq - app) / (2 * apq);
    const t = Math.sign(theta) / (Math.abs(theta) + Math.sqrt(1 + theta * theta));
    const c = 1 / Math.sqrt(1 + t * t);
    const s = t * c;

    for (let i = 0; i < n; i++) {
      const aip = A[i][p];
      const aiq = A[i][q];
      A[i][p] = c * aip - s * aiq;
      A[i][q] = s * aip + c * aiq;
    }
    for (let j = 0; j < n; j++) {
      const apj = A[p][j];
      const aqj = A[q][j];
      A[p][j] = c * apj - s * aqj;
      A[q][j] = s * apj + c * aqj;
    }
    for (let i = 0; i < n; i++) {
      const vip = V[i][p];
      const viq = V[i][q];
      V[i][p] = c * vip - s * viq;
      V[i][q] = s * vip + c * viq;
    }
  }

  const values = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    values[i] = A[i][i];
  }

  return { values, vectors: V };
}

function reconstructMatrix(eig: { values: number[]; vectors: number[][] }): number[][] {
  const n = eig.values.length;
  const result: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += eig.vectors[i][k] * eig.values[k] * eig.vectors[j][k];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

export function applyCholesky(L: number[][], uncorrelated: number[]): number[] {
  const n = L.length;
  const result = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += (L[i][j] ?? 0) * (uncorrelated[j] ?? 0);
    }
    result[i] = sum;
  }
  return result;
}
