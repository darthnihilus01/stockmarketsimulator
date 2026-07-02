import type { NewsAlert, NewsItem, NewsType } from '@/types';

const NEWS_TEMPLATES: { text: string; type: NewsType }[] = [
  { text: '[MACRO] HOUSING PERMITS RISE 1.2% IN MAY', type: 'NORMAL' },
  { text: 'SEC INVESTIGATES UNUSUAL CALL VOLUME IN TSLA', type: 'ALERT' },
  { text: 'NVDA ANNOUNCES NEW GEFORCE RTX ARCHITECTURE', type: 'NORMAL' },
  { text: '[URGENT] GEOPOLITICAL TENSIONS ESCALATE IN MIDDLE EAST', type: 'URGENT' },
  { text: 'MSFT SURFACE OUTLOOK UPGRADED BY MORGAN STANLEY', type: 'NORMAL' },
  { text: 'COINBASE REPORTED OUTAGE AMID BTC VOLATILITY', type: 'ALERT' },
  { text: 'APPLE UNVEILS M4 ULTRA CHIP AT DEVELOPER FORUM', type: 'NORMAL' },
  { text: 'FED HOLDS INTEREST RATES STEADY AT JUNE MEETING', type: 'NORMAL' },
  { text: 'CRUDE OIL FUTURES SURGE ON SUPPLY CONCERNS', type: 'ALERT' },
  { text: 'TESLA DELIVERIES Q2 BEAT ANALYST EXPECTATIONS', type: 'NORMAL' },
  { text: 'AMAZON ANNOUNCES $10B SHARE BUYBACK PROGRAM', type: 'NORMAL' },
  { text: '[URGENT] MAJOR CYBER ATTACK HITS GLOBAL BANKS', type: 'URGENT' },
  { text: 'GOLD PRICES HIT ALL-TIME HIGH ABOVE $2,400', type: 'ALERT' },
  { text: 'JPMORGAN RAISES S&P 500 YEAR-END TARGET', type: 'NORMAL' },
  { text: 'GOOGLE LAUNCHES NEW AI MODEL SURPASSING GPT-4', type: 'NORMAL' },
];

let newsCounter = 0;

export function generateNewsItem(): NewsItem {
  newsCounter++;
  const template = NEWS_TEMPLATES[Math.floor(Math.random() * NEWS_TEMPLATES.length)];
  const d = new Date();
  return {
    id: `NEWS_${newsCounter}_${Date.now()}`,
    time: d.toLocaleTimeString([], { hour12: false }),
    text: template.text,
    type: template.type,
  };
}

export function bundleNewsAlerts(items: NewsItem[]): NewsAlert[] {
  const alerts: NewsAlert[] = [];
  for (let i = 0; i < items.length; i += 3) {
    const batch = items.slice(i, i + 5);
    if (batch.length === 0) continue;
    alerts.push({
      id: `ALERT_${Date.now()}_${i}`,
      time: batch[0].time,
      title: batch.length > 1 ? `${batch[0].text.substring(0, 40)}...` : batch[0].text,
      headlines: batch.map(n => n.text),
      severity: batch.some(n => n.type === 'URGENT') ? 'high' : batch.some(n => n.type === 'ALERT') ? 'medium' : 'low',
    });
  }
  return alerts;
}
