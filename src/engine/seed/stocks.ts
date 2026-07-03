import type { StockDefinition } from '@/types';

export const STOCK_DEFINITIONS: StockDefinition[] = [
  {
    symbol: 'AAPL', name: 'APPLE INC.', sector: 'Technology', basePrice: 150.25,
    marketBeta: 1.1, drift: 0.00004,
    factorBetas: { crude: 0.0, rates: -0.1, tech: 0.85, metals: 0.0, consumer: 0.40, supply: -0.30, energy: 0.0, credit: -0.15, risk: -0.10, domestic: 0.15 },
    research: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories. The company has a strong ecosystem with high customer loyalty and recurring services revenue. Technology innovation and consumer demand are primary drivers of performance.'
  },
  {
    symbol: 'MSFT', name: 'MICROSOFT CORP.', sector: 'Technology', basePrice: 320.50,
    marketBeta: 1.05, drift: 0.00004,
    factorBetas: { crude: 0.0, rates: -0.05, tech: 0.90, metals: 0.0, consumer: 0.25, supply: -0.15, energy: 0.0, credit: 0.20, risk: -0.05, domestic: 0.15 },
    research: 'Microsoft is a leading technology company focused on cloud computing, enterprise software, and AI. Azure continues to gain market share against competitors. The company benefits from long-term enterprise contracts and recurring subscription revenue.'
  },
  {
    symbol: 'GOOGL', name: 'ALPHABET INC.', sector: 'Technology', basePrice: 140.80,
    marketBeta: 1.05, drift: 0.00004,
    factorBetas: { crude: 0.0, rates: -0.05, tech: 0.85, metals: 0.0, consumer: 0.35, supply: -0.10, energy: 0.0, credit: 0.10, risk: -0.10, domestic: 0.20 },
    research: 'Alphabet operates the Google search engine, YouTube, and cloud computing services. Advertising revenue and AI-driven product innovation are key growth drivers. The company generates substantial free cash flow from its core search business.'
  },
  {
    symbol: 'NVDA', name: 'NVIDIA CORP.', sector: 'Technology', basePrice: 450.15,
    marketBeta: 1.3, drift: 0.00005,
    factorBetas: { crude: 0.0, rates: -0.1, tech: 0.95, metals: 0.0, consumer: 0.20, supply: -0.40, energy: 0.0, credit: -0.10, risk: -0.05, domestic: 0.05 },
    research: 'NVIDIA is the dominant player in AI chips and data center GPUs. The company has experienced explosive growth driven by AI infrastructure spending across hyperscalers. Supply chain constraints can impact near-term performance.'
  },
  {
    symbol: 'AMD', name: 'ADVANCED MICRO DEVICES', sector: 'Technology', basePrice: 120.30,
    marketBeta: 1.25, drift: 0.00005,
    factorBetas: { crude: 0.0, rates: -0.1, tech: 0.90, metals: 0.0, consumer: 0.15, supply: -0.45, energy: 0.0, credit: -0.10, risk: -0.05, domestic: 0.05 },
    research: 'AMD designs high-performance computing and graphics processors. The company competes directly with NVIDIA and Intel across data center, PC, and gaming markets. Manufacturing relies on third-party foundries.'
  },
  {
    symbol: 'CRM', name: 'SALESFORCE INC.', sector: 'Technology', basePrice: 215.40,
    marketBeta: 1.0, drift: 0.00003,
    factorBetas: { crude: 0.0, rates: -0.1, tech: 0.75, metals: 0.0, consumer: 0.30, supply: -0.05, energy: 0.0, credit: 0.15, risk: -0.10, domestic: 0.10 },
    research: 'Salesforce is the leading customer relationship management platform. The company provides cloud-based enterprise software solutions. Growth is driven by digital transformation and enterprise adoption of AI-powered sales tools.'
  },
  {
    symbol: 'ADBE', name: 'ADOBE INC.', sector: 'Technology', basePrice: 380.60,
    marketBeta: 0.95, drift: 0.00003,
    factorBetas: { crude: 0.0, rates: -0.05, tech: 0.80, metals: 0.0, consumer: 0.20, supply: -0.05, energy: 0.0, credit: 0.10, risk: -0.05, domestic: 0.15 },
    research: 'Adobe provides creative, document, and experience cloud software. The company has successfully transitioned to a subscription model with recurring revenue. AI-powered features are driving engagement across the Creative Cloud suite.'
  },
  {
    symbol: 'ORCL', name: 'ORACLE CORP.', sector: 'Technology', basePrice: 110.20,
    marketBeta: 0.9, drift: 0.00003,
    factorBetas: { crude: 0.0, rates: -0.05, tech: 0.70, metals: 0.0, consumer: 0.10, supply: -0.05, energy: 0.0, credit: 0.25, risk: -0.05, domestic: 0.10 },
    research: 'Oracle provides database software, cloud infrastructure, and enterprise applications. The company is expanding its cloud business while maintaining its dominant position in database management.'
  },
  {
    symbol: 'INTC', name: 'INTEL CORP.', sector: 'Technology', basePrice: 45.80,
    marketBeta: 1.1, drift: 0.00002,
    factorBetas: { crude: 0.0, rates: -0.1, tech: 0.60, metals: 0.0, consumer: 0.15, supply: -0.50, energy: 0.0, credit: -0.15, risk: -0.10, domestic: 0.25 },
    research: 'Intel is a semiconductor manufacturer designing processors for PCs, data centers, and edge computing. The company is investing heavily in manufacturing capacity. Supply chain and domestic policy factors significantly impact operations.'
  },
  {
    symbol: 'TSLA', name: 'TESLA INC.', sector: 'Consumer', basePrice: 240.80,
    marketBeta: 1.4, drift: 0.00006,
    factorBetas: { crude: 0.0, rates: -0.2, tech: 0.50, metals: 0.20, consumer: 0.45, supply: -0.50, energy: 0.60, credit: -0.20, risk: -0.15, domestic: 0.10 },
    research: 'Tesla is an electric vehicle manufacturer and clean energy company. The company faces increasing competition but maintains technological leadership in battery technology and autonomous driving. Energy storage and solar products provide diversification.'
  },
  {
    symbol: 'AMZN', name: 'AMAZON.COM INC.', sector: 'Consumer', basePrice: 185.40,
    marketBeta: 1.15, drift: 0.00004,
    factorBetas: { crude: 0.05, rates: -0.15, tech: 0.55, metals: 0.0, consumer: 0.80, supply: -0.35, energy: 0.05, credit: -0.10, risk: -0.10, domestic: 0.15 },
    research: 'Amazon operates the largest e-commerce marketplace and a leading cloud computing platform through AWS. Consumer spending trends directly impact retail revenue. Supply chain efficiency is critical for margins.'
  },
  {
    symbol: 'HD', name: 'HOME DEPOT INC.', sector: 'Consumer', basePrice: 335.20,
    marketBeta: 0.95, drift: 0.00003,
    factorBetas: { crude: 0.0, rates: -0.40, tech: 0.0, metals: 0.0, consumer: 0.70, supply: -0.20, energy: 0.0, credit: -0.25, risk: -0.05, domestic: 0.20 },
    research: 'Home Depot is the largest home improvement retailer. Housing market trends and interest rates significantly influence consumer spending on home renovation and construction materials.'
  },
  {
    symbol: 'MCD', name: 'MCDONALDS CORP.', sector: 'Consumer', basePrice: 295.60,
    marketBeta: 0.75, drift: 0.00003,
    factorBetas: { crude: 0.10, rates: -0.20, tech: 0.0, metals: 0.0, consumer: 0.60, supply: -0.15, energy: 0.10, credit: -0.10, risk: -0.10, domestic: 0.30 },
    research: 'McDonald\'s is the world\'s largest fast-food restaurant chain. Consumer spending and domestic economic policy drive franchise performance. The company benefits from its global brand and real estate portfolio.'
  },
  {
    symbol: 'NKE', name: 'NIKE INC.', sector: 'Consumer', basePrice: 108.90,
    marketBeta: 1.0, drift: 0.00003,
    factorBetas: { crude: 0.05, rates: -0.10, tech: 0.05, metals: 0.0, consumer: 0.65, supply: -0.30, energy: 0.05, credit: -0.10, risk: -0.15, domestic: 0.10 },
    research: 'Nike is the leading athletic footwear and apparel company. Consumer spending trends and supply chain efficiency are key performance drivers. The brand benefits from global sports culture and direct-to-consumer sales.'
  },
  {
    symbol: 'XOM', name: 'EXXON MOBIL CORP.', sector: 'Energy', basePrice: 112.40,
    marketBeta: 1.2, drift: 0.00004,
    factorBetas: { crude: 0.85, rates: 0.10, tech: -0.10, metals: 0.30, consumer: 0.05, supply: 0.10, energy: 0.80, credit: 0.05, risk: -0.20, domestic: 0.10 },
    research: 'Exxon Mobil is one of the largest integrated oil and gas companies. Performance is strongly correlated with crude oil prices and energy demand. The company has significant upstream, downstream, and chemical operations globally.'
  },
  {
    symbol: 'CVX', name: 'CHEVRON CORP.', sector: 'Energy', basePrice: 155.30,
    marketBeta: 1.15, drift: 0.00004,
    factorBetas: { crude: 0.80, rates: 0.10, tech: -0.05, metals: 0.20, consumer: 0.05, supply: 0.05, energy: 0.75, credit: 0.05, risk: -0.20, domestic: 0.10 },
    research: 'Chevron is a major integrated energy company with operations spanning oil and gas exploration, production, refining, and chemicals. The company has a strong balance sheet and consistent dividend growth.'
  },
  {
    symbol: 'COP', name: 'CONOCOPHILLIPS', sector: 'Energy', basePrice: 128.60,
    marketBeta: 1.25, drift: 0.00004,
    factorBetas: { crude: 0.75, rates: 0.05, tech: -0.10, metals: 0.15, consumer: 0.0, supply: 0.10, energy: 0.85, credit: 0.0, risk: -0.25, domestic: 0.05 },
    research: 'ConocoPhillips is a pure-play upstream oil and gas exploration and production company. Performance is highly sensitive to crude oil prices with limited downstream diversification.'
  },
  {
    symbol: 'OXY', name: 'OCCIDENTAL PETROLEUM', sector: 'Energy', basePrice: 62.80,
    marketBeta: 1.3, drift: 0.00004,
    factorBetas: { crude: 0.70, rates: 0.05, tech: -0.15, metals: 0.10, consumer: 0.0, supply: 0.10, energy: 0.65, credit: -0.10, risk: -0.30, domestic: 0.05 },
    research: 'Occidental Petroleum is an oil and gas exploration company with additional carbon capture and chemicals operations. Higher leverage makes the stock more sensitive to commodity price volatility.'
  },
  {
    symbol: 'SLB', name: 'SCHLUMBERGER NV', sector: 'Energy', basePrice: 52.40,
    marketBeta: 1.2, drift: 0.00004,
    factorBetas: { crude: 0.80, rates: 0.05, tech: 0.10, metals: 0.15, consumer: 0.0, supply: 0.20, energy: 0.70, credit: -0.05, risk: -0.20, domestic: 0.0 },
    research: 'Schlumberger is the world\'s largest oilfield services company. The company provides technology and services to the global energy industry. Drilling activity and energy investment levels drive revenue.'
  },
  {
    symbol: 'JPM', name: 'JPMORGAN CHASE', sector: 'Financial', basePrice: 185.40,
    marketBeta: 1.1, drift: 0.00003,
    factorBetas: { crude: 0.0, rates: 0.70, tech: -0.10, metals: 0.0, consumer: 0.20, supply: 0.0, energy: 0.0, credit: 0.75, risk: -0.20, domestic: 0.40 },
    research: 'JPMorgan Chase is the largest US bank by assets. Net interest margins benefit from rising rates. Credit conditions and domestic regulatory policy significantly impact earnings.'
  },
  {
    symbol: 'GS', name: 'GOLDMAN SACHS', sector: 'Financial', basePrice: 395.20,
    marketBeta: 1.2, drift: 0.00004,
    factorBetas: { crude: 0.0, rates: 0.65, tech: 0.10, metals: 0.0, consumer: 0.05, supply: 0.0, energy: 0.0, credit: 0.80, risk: -0.35, domestic: 0.25 },
    research: 'Goldman Sachs is a leading global investment bank. Investment banking fees, trading revenue, and asset management drive earnings. Market volatility and risk appetite affect performance.'
  },
  {
    symbol: 'BAC', name: 'BANK OF AMERICA', sector: 'Financial', basePrice: 38.20,
    marketBeta: 1.15, drift: 0.00003,
    factorBetas: { crude: 0.0, rates: 0.75, tech: -0.05, metals: 0.0, consumer: 0.30, supply: 0.0, energy: 0.0, credit: 0.70, risk: -0.25, domestic: 0.35 },
    research: 'Bank of America is a major US bank with extensive consumer and commercial banking operations. Consumer health and interest rate trends are key performance drivers.'
  },
  {
    symbol: 'MS', name: 'MORGAN STANLEY', sector: 'Financial', basePrice: 102.30,
    marketBeta: 1.15, drift: 0.00004,
    factorBetas: { crude: 0.0, rates: 0.60, tech: 0.25, metals: 0.0, consumer: 0.10, supply: 0.0, energy: 0.0, credit: 0.70, risk: -0.30, domestic: 0.20 },
    research: 'Morgan Stanley is a global financial services firm with strength in wealth management and investment banking. The wealth management division provides stable fee-based revenue.'
  },
  {
    symbol: 'C', name: 'CITIGROUP INC.', sector: 'Financial', basePrice: 54.60,
    marketBeta: 1.2, drift: 0.00003,
    factorBetas: { crude: 0.0, rates: 0.70, tech: -0.05, metals: 0.0, consumer: 0.20, supply: 0.0, energy: 0.0, credit: 0.65, risk: -0.30, domestic: 0.30 },
    research: 'Citigroup is a global diversified bank with a significant international presence. Global economic conditions and cross-border trade impact performance more than domestic-focused peers.'
  },
  {
    symbol: 'JNJ', name: 'JOHNSON & JOHNSON', sector: 'Healthcare', basePrice: 160.40,
    marketBeta: 0.75, drift: 0.00003,
    factorBetas: { crude: 0.0, rates: -0.20, tech: 0.05, metals: 0.0, consumer: 0.30, supply: -0.10, energy: 0.0, credit: -0.05, risk: -0.10, domestic: 0.25 },
    research: 'Johnson & Johnson is a diversified healthcare company with pharmaceutical, medical device, and consumer health segments. Defensive characteristics with stable demand across economic cycles.'
  },
  {
    symbol: 'PFE', name: 'PFIZER INC.', sector: 'Healthcare', basePrice: 34.20,
    marketBeta: 0.8, drift: 0.00003,
    factorBetas: { crude: 0.0, rates: -0.20, tech: 0.10, metals: 0.0, consumer: 0.25, supply: -0.15, energy: 0.0, credit: -0.05, risk: -0.10, domestic: 0.20 },
    research: 'Pfizer is a leading pharmaceutical company with a strong pipeline of innovative medicines. Drug development and regulatory approvals are key value drivers.'
  },
  {
    symbol: 'UNH', name: 'UNITEDHEALTH GROUP', sector: 'Healthcare', basePrice: 530.20,
    marketBeta: 0.8, drift: 0.00003,
    factorBetas: { crude: 0.0, rates: -0.15, tech: 0.15, metals: 0.0, consumer: 0.35, supply: -0.05, energy: 0.0, credit: -0.05, risk: -0.10, domestic: 0.30 },
    research: 'UnitedHealth Group is the largest health insurance company in the US. Government policy on healthcare and Medicare reimbursement rates significantly influence earnings.'
  },
  {
    symbol: 'CAT', name: 'CATERPILLAR INC.', sector: 'Industrial', basePrice: 298.40,
    marketBeta: 1.15, drift: 0.00004,
    factorBetas: { crude: 0.10, rates: -0.15, tech: 0.05, metals: 0.70, consumer: 0.05, supply: 0.40, energy: 0.35, credit: -0.10, risk: -0.20, domestic: 0.10 },
    research: 'Caterpillar is the world\'s leading manufacturer of construction and mining equipment. Commodity prices, infrastructure spending, and global trade activity drive demand.'
  },
  {
    symbol: 'BA', name: 'BOEING CO.', sector: 'Industrial', basePrice: 210.30,
    marketBeta: 1.2, drift: 0.00003,
    factorBetas: { crude: 0.0, rates: -0.10, tech: 0.15, metals: 0.40, consumer: 0.05, supply: 0.60, energy: 0.0, credit: -0.15, risk: -0.45, domestic: 0.15 },
    research: 'Boeing is a leading aerospace company manufacturing commercial aircraft and defense products. Supply chain reliability and global trade tensions significantly impact production and deliveries.'
  },
  {
    symbol: 'GE', name: 'GENERAL ELECTRIC', sector: 'Industrial', basePrice: 165.20,
    marketBeta: 1.1, drift: 0.00004,
    factorBetas: { crude: 0.0, rates: -0.05, tech: 0.20, metals: 0.20, consumer: 0.0, supply: 0.35, energy: 0.50, credit: 0.30, risk: -0.15, domestic: 0.10 },
    research: 'General Electric is a diversified industrial company with aerospace, energy, and renewable energy businesses. The aviation recovery and energy transition are key growth themes.'
  },
  {
    symbol: 'HON', name: 'HONEYWELL INTERNATIONAL', sector: 'Industrial', basePrice: 210.50,
    marketBeta: 1.0, drift: 0.00003,
    factorBetas: { crude: 0.0, rates: -0.05, tech: 0.30, metals: 0.10, consumer: 0.05, supply: 0.45, energy: 0.15, credit: -0.05, risk: -0.15, domestic: 0.25 },
    research: 'Honeywell is a diversified technology and manufacturing company serving aerospace, building technologies, and industrial automation markets. Technology integration and operational efficiency drive results.'
  },
  {
    symbol: 'MMM', name: '3M CO.', sector: 'Industrial', basePrice: 105.80,
    marketBeta: 0.9, drift: 0.00003,
    factorBetas: { crude: 0.05, rates: -0.10, tech: 0.15, metals: 0.30, consumer: 0.20, supply: 0.30, energy: 0.05, credit: -0.10, risk: -0.10, domestic: 0.15 },
    research: '3M is a diversified industrial conglomerate with products across safety, industrial, healthcare, and consumer markets. Raw material costs and global industrial production trends affect earnings.'
  },
  {
    symbol: 'BTC', name: 'BITCOIN', sector: 'Crypto', basePrice: 58250.0,
    marketBeta: 1.5, drift: 0.00005,
    factorBetas: { crude: 0.0, rates: -0.40, tech: 0.30, metals: 0.0, consumer: 0.0, supply: 0.0, energy: 0.0, credit: 0.50, risk: -0.60, domestic: -0.10 },
    research: 'Bitcoin is the largest cryptocurrency by market capitalization. It serves as a digital store of value and hedge against monetary debasement. Highly sensitive to risk appetite, credit conditions, and regulatory developments.'
  },
];
