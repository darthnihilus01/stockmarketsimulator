// spec: 4.12 — seeded PRNG + Box-Muller normal

export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed | 0;
    if (this.state === 0) this.state = 1;
  }

  next(): number {
    this.state = (this.state * 1664525 + 1013904223) | 0;
    return (this.state >>> 0) / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextNormal(): number {
    let u = 0, v = 0;
    while (u === 0) u = this.next();
    while (v === 0) v = this.next();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }
}

let globalRng = new SeededRandom(Date.now());

export function getGlobalRng(): SeededRandom {
  return globalRng;
}

export function setGlobalSeed(seed: number): void {
  globalRng = new SeededRandom(seed);
}
