// spec: 4.4 — News System
// spec: 4.4.1 — Event structure (headline, target, score, gain, tau, creation tick)
// spec: 4.4.2 — actual score ~ Normal(target, σ_score), clamped to [-1,1]
// spec: 4.4.3 — shock = score × gain × exp(-(t-t0)/tau) × (REF_TAU/tau)
// spec: 4.5 — S_factor(k) = Σ all active factor events shock(event)
// spec: 4.5.1 — S_stock(i) = Σ all active ticker events shock(event)

import { HEADLINE_TEMPLATES, type HeadlineTemplate } from './seed/headlines';
import { SIGMA_SCORE, HEADLINE_GAIN_MEAN, HEADLINE_GAIN_STD, HEADLINE_TAU_MEAN, HEADLINE_TAU_STD, HEADLINE_COOLDOWN_TICKS, HEADLINE_PROBABILITY, REF_TAU } from './constants';
import { getGlobalRng } from './math/Random';
import { computeShock } from './math/Decay';

export interface HeadlineEvent {
  id: string;
  headline: string;
  targetFactor: string | null;
  targetTicker: string | null;
  targetScore: number;
  actualScore: number;
  gain: number;
  tau: number;
  creationTick: number;
}

let headlineIdCounter = 0;

function nextHeadlineId(): string {
  headlineIdCounter++;
  return `hl-${headlineIdCounter}`;
}

// spec: 4.12 — randomize once per game: Headline gain, Headline tau, Headline realized score
function randomizeTemplate(template: HeadlineTemplate, rng: ReturnType<typeof getGlobalRng>): {
  gain: number;
  tau: number;
} {
  const gain = Math.max(0.01, rng.nextNormal() * HEADLINE_GAIN_STD + HEADLINE_GAIN_MEAN);
  const tau = Math.max(1, Math.round(rng.nextNormal() * HEADLINE_TAU_STD + HEADLINE_TAU_MEAN));
  return { gain, tau };
}

// spec: 4.4.2 — draw actual score from Normal(target, σ_score), clamp to [-1, 1]
function generateActualScore(targetScore: number, rng: ReturnType<typeof getGlobalRng>): number {
  const raw = targetScore + rng.nextNormal() * SIGMA_SCORE;
  return Math.max(-1, Math.min(1, raw));
}

function pickRandomTemplate(rng: ReturnType<typeof getGlobalRng>): {
  template: HeadlineTemplate;
} {
  const idx = Math.floor(rng.next() * HEADLINE_TEMPLATES.length);
  return { template: HEADLINE_TEMPLATES[idx] };
}

// spec: 4.8 step 1 — Fire scheduled events
export function maybeGenerateHeadline(
  tick: number,
  lastHeadlineTick: number,
): HeadlineEvent | null {
  if (tick - lastHeadlineTick < HEADLINE_COOLDOWN_TICKS) return null;
  const rng = getGlobalRng();
  if (rng.next() > HEADLINE_PROBABILITY) return null;

  const { template } = pickRandomTemplate(rng);
  const { gain, tau } = randomizeTemplate(template, rng);
  const actualScore = generateActualScore(template.targetScore, rng);

  const targetFactor = template.targetFactor || null;
  const targetTicker = null;

  return {
    id: nextHeadlineId(),
    headline: template.text,
    targetFactor,
    targetTicker,
    targetScore: template.targetScore,
    actualScore,
    gain,
    tau,
    creationTick: tick,
  };
}

// spec: 4.4.3 — compute shock for a single event
export function computeEventShock(
  event: HeadlineEvent,
  currentTick: number,
): number {
  return computeShock(event.actualScore, event.gain, event.tau, currentTick, event.creationTick);
}

// spec: 4.5 — S_factor(k) = Σ all active factor events shock(event)
export function aggregateFactorNews(
  events: HeadlineEvent[],
  currentTick: number,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const ev of events) {
    if (!ev.targetFactor) continue;
    const shock = computeEventShock(ev, currentTick);
    result[ev.targetFactor] = (result[ev.targetFactor] ?? 0) + shock;
  }
  return result;
}

// spec: 4.5.1 — S_stock(i) = Σ all active ticker events shock(event)
export function aggregateTickerNews(
  events: HeadlineEvent[],
  ticker: string,
  currentTick: number,
): number {
  let total = 0;
  for (const ev of events) {
    if (ev.targetTicker !== ticker) continue;
    total += computeEventShock(ev, currentTick);
  }
  return total;
}

// Clean expired events (tau decayed to negligible)
export function cleanupEvents(
  events: HeadlineEvent[],
  currentTick: number,
): HeadlineEvent[] {
  const threshold = 1e-10;
  return events.filter((ev) => {
    const shock = Math.abs(computeEventShock(ev, currentTick));
    return shock > threshold;
  });
}
