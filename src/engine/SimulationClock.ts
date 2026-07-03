export class SimulationClock {
  private _tick = 0;
  private _running = false;
  private _tickIntervalMs: number;

  constructor(tickIntervalMs = 400) {
    this._tickIntervalMs = tickIntervalMs;
  }

  get tick() {
    return this._tick;
  }

  get running() {
    return this._running;
  }

  get tickIntervalMs() {
    return this._tickIntervalMs;
  }

  get timeMs() {
    return this._tick * this._tickIntervalMs;
  }

  increment(): void {
    this._tick++;
  }

  reset(): void {
    this._tick = 0;
  }

  start(): void {
    this._running = true;
  }

  stop(): void {
    this._running = false;
  }
}
