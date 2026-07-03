export interface HeadlineTemplate {
  text: string;
  targetFactor: string;
  targetScore: number;
  tau: number;
  severity: 'high' | 'medium' | 'low';
}

export const HEADLINE_TEMPLATES: HeadlineTemplate[] = [
  { text: '[MACRO] OPEC+ ANNOUNCES SURPRISE PRODUCTION CUT OF 1M BARRELS PER DAY', targetFactor: 'crude', targetScore: 0.7, tau: 300, severity: 'high' },
  { text: '[MACRO] OIL INVENTORIES DROP MORE THAN EXPECTED', targetFactor: 'crude', targetScore: 0.4, tau: 200, severity: 'medium' },
  { text: '[MACRO] SAUDI ARABIA SIGNALS POTENTIAL SUPPLY INCREASE', targetFactor: 'crude', targetScore: -0.5, tau: 180, severity: 'medium' },
  { text: '[MACRO] CRUDE OIL FUTURES SURGE ON SUPPLY CONCERNS', targetFactor: 'crude', targetScore: 0.5, tau: 150, severity: 'high' },
  { text: '[MACRO] US OIL PRODUCTION HITS RECORD HIGH', targetFactor: 'crude', targetScore: -0.3, tau: 250, severity: 'low' },
  { text: '[MACRO] FED RAISES INTEREST RATES BY 25 BASIS POINTS', targetFactor: 'rates', targetScore: -0.5, tau: 200, severity: 'high' },
  { text: '[MACRO] FED HOLDS INTEREST RATES STEADY', targetFactor: 'rates', targetScore: 0.2, tau: 150, severity: 'medium' },
  { text: '[MACRO] FED SIGNALS POSSIBLE RATE CUT IN COMING MONTHS', targetFactor: 'rates', targetScore: 0.6, tau: 250, severity: 'high' },
  { text: '[MACRO] INFLATION DATA COMES IN HOTTER THAN EXPECTED', targetFactor: 'rates', targetScore: -0.4, tau: 200, severity: 'high' },
  { text: '[MACRO] CPI REPORT SHOWS INFLATION COOLING', targetFactor: 'rates', targetScore: 0.5, tau: 180, severity: 'medium' },
  { text: '[TECH] NVIDIA UNVEILS NEXT-GENERATION AI CHIP ARCHITECTURE', targetFactor: 'tech', targetScore: 0.6, tau: 150, severity: 'high' },
  { text: '[TECH] MICROSOFT LAUNCHES NEW AI ASSISTANT PLATFORM', targetFactor: 'tech', targetScore: 0.5, tau: 120, severity: 'medium' },
  { text: '[TECH] APPLE RELEASES MAJOR SOFTWARE UPDATE WITH AI FEATURES', targetFactor: 'tech', targetScore: 0.4, tau: 130, severity: 'medium' },
  { text: '[TECH] ANTITRUST REGULATORS OPEN INVESTIGATION INTO BIG TECH', targetFactor: 'tech', targetScore: -0.4, tau: 200, severity: 'high' },
  { text: '[TECH] GOOGLE DEMONSTRATES BREAKTHROUGH IN QUANTUM COMPUTING', targetFactor: 'tech', targetScore: 0.5, tau: 100, severity: 'low' },
  { text: '[TECH] GLOBAL SEMICONDUCTOR SALES SURGE 15% YEAR OVER YEAR', targetFactor: 'tech', targetScore: 0.5, tau: 180, severity: 'medium' },
  { text: '[COMMODITIES] GOLD PRICES HIT ALL-TIME HIGH ABOVE $2,400', targetFactor: 'metals', targetScore: 0.6, tau: 150, severity: 'high' },
  { text: '[COMMODITIES] COPPER PRICES JUMP ON SUPPLY SHORTAGE', targetFactor: 'metals', targetScore: 0.5, tau: 200, severity: 'medium' },
  { text: '[COMMODITIES] CHINA METALS DEMAND SHOWS SIGNS OF WEAKENING', targetFactor: 'metals', targetScore: -0.4, tau: 250, severity: 'medium' },
  { text: '[COMMODITIES] STEEL PRICES DECLINE AMID SLOWING CONSTRUCTION', targetFactor: 'metals', targetScore: -0.3, tau: 180, severity: 'low' },
  { text: '[CONSUMER] US CONSUMER CONFIDENCE INDEX DROPS SHARPLY', targetFactor: 'consumer', targetScore: -0.5, tau: 200, severity: 'high' },
  { text: '[CONSUMER] RETAIL SALES EXCEED ESTIMATES IN LATEST REPORT', targetFactor: 'consumer', targetScore: 0.5, tau: 180, severity: 'medium' },
  { text: '[CONSUMER] HOLIDAY SHOPPING SEASON PROJECTED TO SET RECORDS', targetFactor: 'consumer', targetScore: 0.4, tau: 150, severity: 'low' },
  { text: '[CONSUMER] CONSUMER DEBT REACHES NEW HIGH RAISING CONCERNS', targetFactor: 'consumer', targetScore: -0.3, tau: 250, severity: 'medium' },
  { text: '[SUPPLY] MAJOR PORT DISRUPTIONS ON WEST COAST DELAY SHIPMENTS', targetFactor: 'supply', targetScore: -0.5, tau: 200, severity: 'high' },
  { text: '[SUPPLY] SUPPLY CHAIN BOTTLENECKS EASING ACROSS MANUFACTURING', targetFactor: 'supply', targetScore: 0.5, tau: 250, severity: 'medium' },
  { text: '[SUPPLY] GLOBAL SHIPPING COSTS SURGE ON REROUTING AROUND RED SEA', targetFactor: 'supply', targetScore: -0.4, tau: 150, severity: 'high' },
  { text: '[SUPPLY] NEW LOGISTICS TECHNOLOGY CUTS DELIVERY TIMES BY 20%', targetFactor: 'supply', targetScore: 0.3, tau: 180, severity: 'low' },
  { text: '[ENERGY] DOE ANNOUNCES STRATEGIC PETROLEUM RESERVE RELEASE', targetFactor: 'energy', targetScore: -0.4, tau: 120, severity: 'high' },
  { text: '[ENERGY] RENEWABLE ENERGY INVESTMENT REACHES RECORD LEVELS', targetFactor: 'energy', targetScore: 0.5, tau: 200, severity: 'medium' },
  { text: '[ENERGY] GLOBAL ENERGY DEMAND PROJECTED TO RISE 3% THIS YEAR', targetFactor: 'energy', targetScore: 0.4, tau: 180, severity: 'low' },
  { text: '[ENERGY] NUCLEAR ENERGY RENAISSANCE GAINS REGULATORY APPROVAL', targetFactor: 'energy', targetScore: 0.3, tau: 250, severity: 'low' },
  { text: '[CREDIT] CREDIT MARKETS TIGHTEN AS BANKS REDUCE LENDING', targetFactor: 'credit', targetScore: -0.5, tau: 200, severity: 'high' },
  { text: '[CREDIT] CORPORATE BOND ISSUANCE SURGES IN RISK-ON ENVIRONMENT', targetFactor: 'credit', targetScore: 0.5, tau: 150, severity: 'medium' },
  { text: '[CREDIT] CREDIT DEFAULT SWAPS WIDEN ACROSS HIGH-YIELD SECTOR', targetFactor: 'credit', targetScore: -0.4, tau: 180, severity: 'high' },
  { text: '[CREDIT] FED STRESS TEST SHOWS BANKS WELL CAPITALIZED', targetFactor: 'credit', targetScore: 0.3, tau: 200, severity: 'low' },
  { text: '[RISK] GEOPOLITICAL TENSIONS ESCALATE IN MIDDLE EAST', targetFactor: 'risk', targetScore: -0.7, tau: 100, severity: 'high' },
  { text: '[RISK] TRADE WAR TARIFFS EXPAND BETWEEN MAJOR ECONOMIES', targetFactor: 'risk', targetScore: -0.5, tau: 200, severity: 'high' },
  { text: '[RISK] GLOBAL MARKET VOLATILITY SUBSIDES ON DIPLOMATIC PROGRESS', targetFactor: 'risk', targetScore: 0.5, tau: 150, severity: 'medium' },
  { text: '[RISK] CYBER ATTACK DISRUPTS FINANCIAL INSTITUTIONS', targetFactor: 'risk', targetScore: -0.6, tau: 80, severity: 'high' },
  { text: '[POLICY] NEW TAX REFORM PROPOSAL UNVEILED BY TREASURY', targetFactor: 'domestic', targetScore: 0.4, tau: 200, severity: 'medium' },
  { text: '[POLICY] CONGRESS PASSES MAJOR INFRASTRUCTURE SPENDING BILL', targetFactor: 'domestic', targetScore: 0.5, tau: 250, severity: 'high' },
  { text: '[POLICY] REGULATORY OVERSIGHT INTENSIFIES ACROSS FINANCIAL SECTOR', targetFactor: 'domestic', targetScore: -0.3, tau: 180, severity: 'medium' },
  { text: '[POLICY] CENTRAL BANK DIGITAL CURRENCY PILOT ANNOUNCED', targetFactor: 'domestic', targetScore: 0.2, tau: 150, severity: 'low' },
];
