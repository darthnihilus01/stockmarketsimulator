import { HEADLINE_TEMPLATES } from './seed/headlines';
import { clamp } from './MathUtils';
import type { HeadlineMeta, FactorContribution, NewsItem, MarketState } from '@/types';

let headlineIdCounter = 0;

function nextHeadlineId(): string {
  headlineIdCounter++;
  return `hl-${headlineIdCounter}`;
}

function pickRandomTemplate(): { template: typeof HEADLINE_TEMPLATES[0]; variance: number } {
  const idx = Math.floor(Math.random() * HEADLINE_TEMPLATES.length);
  const t = HEADLINE_TEMPLATES[idx];
  const variance = (Math.random() - 0.5) * 0.3;
  return { template: t, variance };
}

export function maybeGenerateHeadline(
  tick: number,
  lastHeadlineTick: number,
  headlineCooldown: number,
  probability: number,
): HeadlineMeta | null {
  if (tick - lastHeadlineTick < headlineCooldown) return null;
  if (Math.random() > probability) return null;

  const { template, variance } = pickRandomTemplate();
  const actualScore = clamp(template.targetScore + variance, -1, 1);

  return {
    id: nextHeadlineId(),
    time: tick,
    text: template.text,
    targetFactor: template.targetFactor,
    targetScore: template.targetScore,
    actualScore,
    tau: template.tau,
    severity: template.severity,
  };
}

export function getHeadlineNewsItem(hl: HeadlineMeta, tick: number): NewsItem {
  const typeMap = {
    high: 'URGENT' as const,
    medium: 'ALERT' as const,
    low: 'NORMAL' as const,
  };
  return {
    id: hl.id,
    time: formatTickTime(tick),
    text: hl.text,
    type: typeMap[hl.severity],
  };
}

export function createContributionsFromHeadline(hl: HeadlineMeta): FactorContribution[] {
  const magnitude = Math.abs(hl.actualScore) * 0.3;
  return [
    {
      factorId: hl.targetFactor,
      strength: hl.actualScore > 0 ? magnitude : -magnitude,
      expiryTick: hl.time + hl.tau,
    },
  ];
}

export function decayHeadlines(
  contributions: FactorContribution[],
  tick: number,
): FactorContribution[] {
  return contributions.filter((c) => tick < c.expiryTick);
}

export function getActiveContributionsDelta(
  contributions: FactorContribution[],
  tick: number,
): number {
  return contributions
    .filter((c) => tick < c.expiryTick)
    .reduce((sum, c) => sum + c.strength, 0);
}

export function cleanupExpiredHeadlines(
  contributions: FactorContribution[],
  tick: number,
): FactorContribution[] {
  return contributions.filter((c) => c.expiryTick > tick);
}

function formatTickTime(tick: number): string {
  const totalSeconds = Math.floor(tick * 0.4);
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
