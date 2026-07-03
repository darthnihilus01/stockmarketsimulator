import type { Factor } from '@/types';

export const FACTORS: Factor[] = [
  { id: 'crude', name: 'Crude Oil' },
  { id: 'rates', name: 'Interest Rates' },
  { id: 'tech', name: 'Technology' },
  { id: 'metals', name: 'Metals' },
  { id: 'consumer', name: 'Consumer Demand' },
  { id: 'supply', name: 'Supply Chain' },
  { id: 'energy', name: 'Energy' },
  { id: 'credit', name: 'Credit' },
  { id: 'risk', name: 'Global Risk' },
  { id: 'domestic', name: 'Domestic Policy' },
];

export const FACTOR_IDS = FACTORS.map((f) => f.id);

export const FACTOR_CORRELATION_MATRIX: number[][] = [
  [1.0,  0.2, -0.1,  0.6,  0.1,  0.4,  0.7,  0.1, -0.2,  0.0],
  [0.2,  1.0, -0.3,  0.3, -0.4, -0.1,  0.1,  0.5,  0.3,  0.4],
  [-0.1, -0.3, 1.0, -0.2,  0.3, -0.3, -0.2, -0.4, -0.1,  0.2],
  [0.6,  0.3, -0.2,  1.0,  0.0,  0.3,  0.4,  0.2, -0.3,  0.0],
  [0.1, -0.4,  0.3,  0.0,  1.0, -0.2,  0.1, -0.3,  0.0,  0.3],
  [0.4, -0.1, -0.3,  0.3, -0.2,  1.0,  0.3,  0.1,  0.2, -0.2],
  [0.7,  0.1, -0.2,  0.4,  0.1,  0.3,  1.0,  0.0, -0.1,  0.1],
  [0.1,  0.5, -0.4,  0.2, -0.3,  0.1,  0.0,  1.0,  0.4,  0.3],
  [-0.2,  0.3, -0.1, -0.3,  0.0,  0.2, -0.1,  0.4,  1.0, -0.3],
  [0.0,  0.4,  0.2,  0.0,  0.3, -0.2,  0.1,  0.3, -0.3,  1.0],
];

export const FACTOR_NOISE_SIGMA = 0.08;
