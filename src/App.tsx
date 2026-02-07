import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, AreaChart, Area
} from "recharts";
import {
  TrendingDown, TrendingUp, Shield, Clock, DollarSign, AlertTriangle,
  Zap, Target, ChevronRight, ArrowDownRight, Layers, BarChart3,
  CheckCircle2, Circle, ClipboardList
} from "lucide-react";

// ─── DATA ──────────────────────────────────────────────────────────────
const COLORS = {
  btc: "#F7931A",
  eth: "#627EEA",
  sol: "#9945FF",
  xrp: "#23292F",
  ada: "#0033AD",
  avax: "#E84142",
  green: "#22c55e",
  red: "#ef4444",
  amber: "#f59e0b",
  muted: "#64748b",
};

interface Asset {
  symbol: string;
  name: string;
  color: string;
  price: number;
  ath: number;
  athDrop: number;
  allocation: number;
  dollarAmount: number;
  conviction: "High" | "Medium" | "Low";
  riskLevel: number;
  rewardPotential: number;
  category: string;
  catalyst: string;
  bearTarget: number;
  baseTarget: number;
  bullTarget: number;
  baseUpside: number;
  tvlOrMetric: string;
  rationale: string;
}

const assets: Asset[] = [
  {
    symbol: "BTC", name: "Bitcoin", color: COLORS.btc,
    price: 62000, ath: 126210, athDrop: 52,
    allocation: 50, dollarAmount: 1000, conviction: "High",
    riskLevel: 3, rewardPotential: 7, category: "Store of Value",
    catalyst: "Institutional adoption, ETF inflows, halving cycle",
    bearTarget: 45000, baseTarget: 95000, bullTarget: 150000, baseUpside: 53,
    tvlOrMetric: "58-60% dominance",
    rationale: "The anchor. Post-crash entry at 52% below ATH with strong institutional backing. ETF flows remain positive despite pullback. Halving cycle historically precedes major rallies 12-18 months out.",
  },
  {
    symbol: "ETH", name: "Ethereum", color: COLORS.eth,
    price: 2088, ath: 4954, athDrop: 57,
    allocation: 25, dollarAmount: 500, conviction: "High",
    riskLevel: 4, rewardPotential: 8, category: "Smart Contract Platform",
    catalyst: "L2 ecosystem growth, DeFi TVL recovery, Pectra upgrade",
    bearTarget: 1400, baseTarget: 3800, bullTarget: 5500, baseUpside: 82,
    tvlOrMetric: "$68.2B TVL",
    rationale: "DeFi backbone trading at deep discount. $68B+ TVL ecosystem is unrivaled. ETH/BTC ratio at multi-year lows creates strong relative value. Pectra upgrade and L2 maturation are near-term catalysts.",
  },
  {
    symbol: "SOL", name: "Solana", color: COLORS.sol,
    price: 87, ath: 293, athDrop: 70,
    allocation: 10, dollarAmount: 200, conviction: "Medium",
    riskLevel: 7, rewardPotential: 9, category: "High-Performance L1",
    catalyst: "Firedancer client, DePIN adoption, institutional interest",
    bearTarget: 45, baseTarget: 135, bullTarget: 250, baseUpside: 55,
    tvlOrMetric: "$4.1B TVL",
    rationale: "Fastest-growing ecosystem with real usage in payments, DePIN, and consumer apps. Firedancer upgrade could dramatically improve reliability. High beta play with strong community.",
  },
  {
    symbol: "XRP", name: "XRP", color: "#00AAE4",
    price: 1.60, ath: 3.84, athDrop: 58,
    allocation: 10, dollarAmount: 200, conviction: "Medium",
    riskLevel: 5, rewardPotential: 7, category: "Payments & Settlement",
    catalyst: "SEC clarity, RLUSD stablecoin at $1.5B, institutional partnerships",
    bearTarget: 0.80, baseTarget: 2.80, bullTarget: 4.50, baseUpside: 75,
    tvlOrMetric: "RLUSD $1.5B AUM",
    rationale: "Regulatory clarity is a massive tailwind. RLUSD stablecoin already at $1.5B shows institutional demand. Cross-border payment use case is real and growing. The legal overhang is finally gone.",
  },
  {
    symbol: "ADA", name: "Cardano", color: COLORS.ada,
    price: 0.30, ath: 3.08, athDrop: 90,
    allocation: 3, dollarAmount: 60, conviction: "Low",
    riskLevel: 7, rewardPotential: 9, category: "Research-Driven L1",
    catalyst: "Hydra scaling production-ready, Midnight privacy chain",
    bearTarget: 0.12, baseTarget: 0.85, bullTarget: 2.00, baseUpside: 183,
    tvlOrMetric: "$350M TVL",
    rationale: "Deepest discount from ATH (-90%) creates asymmetric upside if execution improves. Hydra now production-ready. High-risk moonshot allocation only.",
  },
  {
    symbol: "AVAX", name: "Avalanche", color: COLORS.avax,
    price: 8.80, ath: 146, athDrop: 94,
    allocation: 2, dollarAmount: 40, conviction: "Low",
    riskLevel: 8, rewardPotential: 9, category: "Subnet Architecture",
    catalyst: "RWA tokenization partnerships, subnet adoption",
    bearTarget: 4.00, baseTarget: 20.00, bullTarget: 45.00, baseUpside: 127,
    tvlOrMetric: "$1.1B TVL",
    rationale: "94% off ATH — the deepest discount. Subnet architecture is unique for institutional/RWA use. Small speculative position for potential 2-5x if RWA narrative plays out.",
  },
];

const totalInvestment = 2000;

const allocationData = assets.map(a => ({
  name: a.symbol,
  value: a.allocation,
  dollars: a.dollarAmount,
  color: a.color,
}));

const upsideData = assets.map(a => ({
  name: a.symbol,
  "Bear Case": Math.round(((a.bearTarget - a.price) / a.price) * 100),
  "Base Case": Math.round(((a.baseTarget - a.price) / a.price) * 100),
  "Bull Case": Math.round(((a.bullTarget - a.price) / a.price) * 100),
}));

const dcaSchedule = [
  { week: "Week 1 (Feb 13)", amount: 700, focus: "BTC $350, ETH $200, SOL $100, XRP $50", note: "Initial positions in highest-conviction assets" },
  { week: "Week 2 (Feb 20)", amount: 500, focus: "BTC $250, ETH $150, XRP $100", note: "Add to core, start XRP position" },
  { week: "Week 3 (Feb 27)", amount: 400, focus: "BTC $200, ETH $100, ADA $60, AVAX $40", note: "Fill remaining allocations" },
  { week: "Week 4 (Mar 6)", amount: 400, focus: "BTC $200, ETH $50, SOL $100, XRP $50", note: "Final entries, complete strategy" },
];

const scenarioData = [
  { scenario: "Bear (-30%)", portfolio: 1400, color: COLORS.red },
  { scenario: "Flat (0%)", portfolio: 2000, color: COLORS.muted },
  { scenario: "Base (+60%)", portfolio: 3200, color: COLORS.green },
  { scenario: "Bull (+150%)", portfolio: 5000, color: COLORS.amber },
];

const marketSentiment = [
  { metric: "Fear & Greed Index", value: "11 — Extreme Fear", signal: "buy" as const },
  { metric: "BTC Dominance", value: "58-60%", signal: "neutral" as const },
  { metric: "Total Market Cap", value: "~$2.1T (down from $3.9T)", signal: "buy" as const },
  { metric: "ETH/BTC Ratio", value: "Multi-year low", signal: "buy" as const },
  { metric: "Spot ETF Flows", value: "Positive despite crash", signal: "buy" as const },
  { metric: "Stablecoin Supply", value: "$210B+ (near ATH)", signal: "buy" as const },
];

interface ActionItem {
  id: string;
  date: string;
  task: string;
  detail: string;
  category: "buy" | "security" | "review" | "rebalance";
}

const actionPlanItems: ActionItem[] = [
  { id: "a1", date: "Feb 13", task: "Execute Week 1 purchases — $700", detail: "BTC $350, ETH $200, SOL $100, XRP $50. Use limit orders 1-2% below spot.", category: "buy" },
  { id: "a2", date: "Feb 13", task: "Enable 2FA on exchange accounts", detail: "Set up authenticator app (not SMS) on Coinbase/Kraken. Store backup codes securely.", category: "security" },
  { id: "a3", date: "Feb 14", task: "Set stop-loss alerts at -20% from entries", detail: "Configure price alerts on your exchange or a tracking app like CoinGecko.", category: "review" },
  { id: "a4", date: "Feb 20", task: "Execute Week 2 purchases — $500", detail: "BTC $250, ETH $150, XRP $100. Check if prices have moved significantly before ordering.", category: "buy" },
  { id: "a5", date: "Feb 27", task: "Execute Week 3 purchases — $400", detail: "BTC $200, ETH $100, ADA $60, AVAX $40. Complete satellite allocations.", category: "buy" },
  { id: "a6", date: "Mar 6", task: "Execute Week 4 (final) purchases — $400", detail: "BTC $200, ETH $50, SOL $100, XRP $50. Full strategy now deployed.", category: "buy" },
  { id: "a7", date: "Mar 7-14", task: "Transfer all holdings to hardware wallet", detail: "Move crypto off exchange to Ledger/Trezor. Store seed phrase offline in a secure location.", category: "security" },
  { id: "a8", date: "Mar 15", task: "Record all entry prices and amounts", detail: "Log average entry price per asset, total coins held, and cost basis for tax purposes.", category: "review" },
  { id: "a9", date: "Monthly", task: "15-minute portfolio check-in", detail: "Review total value, check for major news. No action unless stop-loss triggered.", category: "review" },
  { id: "a10", date: "Quarterly", task: "Deep thesis review for each position", detail: "Re-evaluate catalysts, on-chain metrics, and macro environment. Adjust conviction levels if needed.", category: "review" },
  { id: "a11", date: "When 3x", task: "Take original investment off the table", detail: "If any altcoin hits 3x, sell enough to recover cost basis. Let remaining profits ride.", category: "rebalance" },
  { id: "a12", date: "12-18mo", task: "Full portfolio review and exit strategy", detail: "Assess whether to hold, take profits, or reallocate based on market cycle position.", category: "rebalance" },
];

// ─── COMPONENTS ────────────────────────────────────────────────────────

function SignalDot({ signal }: { signal: "buy" | "sell" | "neutral" }) {
  const c = signal === "buy" ? "bg-green-500" : signal === "sell" ? "bg-red-500" : "bg-amber-500";
  return <span className={`inline-block w-2 h-2 rounded-full ${c} mr-2`} />;
}

function StatCard({ label, value, sub, icon: Icon, accent = "green" }: {
  label: string; value: string; sub?: string; icon: React.ElementType; accent?: string
}) {
  const borderColor = accent === "green" ? "border-green-500/30" : accent === "blue" ? "border-blue-500/30" : "border-amber-500/30";
  const iconColor = accent === "green" ? "text-green-400" : accent === "blue" ? "text-blue-400" : "text-amber-400";
  return (
    <div className={`bg-[hsl(222,47%,8%)] border ${borderColor} rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function AssetRow({ asset, isExpanded, onToggle }: { asset: Asset; isExpanded: boolean; onToggle: () => void }) {
  const convictionColor = asset.conviction === "High" ? "bg-green-500/15 text-green-400 border-green-500/30"
    : asset.conviction === "Medium" ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
    : "bg-red-500/15 text-red-400 border-red-500/30";

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-3">
      <button onClick={onToggle} className="w-full text-left px-4 py-3 flex items-center gap-4 hover:bg-secondary/50 transition-colors">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: asset.color + "20", color: asset.color }}>
          {asset.symbol}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{asset.name}</span>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${convictionColor}`}>{asset.conviction}</Badge>
            <span className="text-xs text-muted-foreground">{asset.category}</span>
          </div>
          <div className="flex items-center gap-4 mt-0.5 text-sm">
            <span className="font-mono text-muted-foreground">${asset.price.toLocaleString()}</span>
            <span className="text-red-400 flex items-center gap-0.5 text-xs">
              <ArrowDownRight className="w-3 h-3" />{asset.athDrop}% from ATH
            </span>
          </div>
        </div>
        <div className="text-right mr-2">
          <div className="text-lg font-semibold" style={{ color: asset.color }}>{asset.allocation}%</div>
          <div className="text-xs text-muted-foreground font-mono">${asset.dollarAmount}</div>
        </div>
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-border bg-[hsl(222,47%,7%)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Price Targets</span>
              <div className="mt-1 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-red-400">Bear</span><span className="font-mono">${asset.bearTarget.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-green-400">Base</span><span className="font-mono">${asset.baseTarget.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-amber-400">Bull</span><span className="font-mono">${asset.bullTarget.toLocaleString()}</span></div>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Risk / Reward</span>
              <div className="mt-2 space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-0.5"><span>Risk</span><span>{asset.riskLevel}/10</span></div>
                  <Progress value={asset.riskLevel * 10} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-0.5"><span>Reward Potential</span><span>{asset.rewardPotential}/10</span></div>
                  <Progress value={asset.rewardPotential * 10} className="h-1.5" />
                </div>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Key Catalyst</span>
              <p className="text-sm text-muted-foreground mt-1">{asset.catalyst}</p>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2 block">Key Metric</span>
              <p className="text-sm mt-0.5">{asset.tvlOrMetric}</p>
            </div>
          </div>
          <div className="bg-[hsl(222,47%,10%)] rounded p-3 border border-border">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Investment Thesis</span>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{asset.rationale}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-[hsl(222,47%,10%)] border border-border rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs" style={{ color: p.color || p.fill }}>
          {p.name}: {typeof p.value === 'number' && p.name !== "portfolio" ? `${p.value > 0 ? "+" : ""}${p.value}%` : `$${p.value?.toLocaleString()}`}
        </p>
      ))}
    </div>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────

export default function App() {
  const [expandedAsset, setExpandedAsset] = useState<string | null>("BTC");
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const toggleAction = (id: string) => {
    setCompletedActions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-green-400 font-medium">Live Strategy</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Crypto Investment Strategy</h1>
            <p className="text-muted-foreground mt-1 text-sm">$2,000 portfolio &middot; February 2026 &middot; Post-crash entry</p>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-xs px-3 py-1">
            <TrendingDown className="w-3 h-3 mr-1" /> Buy the Fear
          </Badge>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Investment" value="$2,000" sub="4-week DCA plan" icon={DollarSign} />
        <StatCard label="Market Sentiment" value="Extreme Fear" sub="Fear & Greed: 11/100" icon={AlertTriangle} accent="amber" />
        <StatCard label="Avg. ATH Discount" value="-70%" sub="Across 6 assets" icon={TrendingDown} accent="blue" />
        <StatCard label="Base Case Return" value="+$1,200" sub="~60% weighted upside" icon={TrendingUp} />
      </div>

      {/* Market Context Banner */}
      <Card className="mb-6 bg-gradient-to-r from-[hsl(222,47%,8%)] to-[hsl(222,47%,12%)] border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-xs uppercase tracking-wider font-medium text-blue-400">Market Context — February 2026</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Crypto markets have experienced a sharp correction from all-time highs, with total market cap falling from ~$3.9T to ~$2.1T. Bitcoin dropped ~52% from its $126K ATH, and altcoins are down 57-94%. The Fear & Greed Index sits at 11 (Extreme Fear) — historically one of the strongest buy signals. Meanwhile, stablecoin supply remains near ATH ($210B+) and spot ETF flows are still positive, suggesting capital is on the sidelines waiting to re-enter.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {marketSentiment.map(s => (
              <div key={s.metric} className="flex items-center text-xs py-1">
                <SignalDot signal={s.signal} />
                <span className="text-muted-foreground">{s.metric}:</span>
                <span className="ml-1 font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="allocation" className="space-y-4">
        <TabsList className="bg-secondary/50 border border-border p-1 h-auto flex-wrap">
          <TabsTrigger value="allocation" className="text-xs data-[state=active]:bg-background">Portfolio Allocation</TabsTrigger>
          <TabsTrigger value="assets" className="text-xs data-[state=active]:bg-background">Asset Deep Dive</TabsTrigger>
          <TabsTrigger value="scenarios" className="text-xs data-[state=active]:bg-background">Scenarios & Upside</TabsTrigger>
          <TabsTrigger value="dca" className="text-xs data-[state=active]:bg-background">DCA Schedule</TabsTrigger>
          <TabsTrigger value="risk" className="text-xs data-[state=active]:bg-background">Risk Framework</TabsTrigger>
          <TabsTrigger value="actions" className="text-xs data-[state=active]:bg-background">Action Plan</TabsTrigger>
        </TabsList>

        {/* ── ALLOCATION TAB ── */}
        <TabsContent value="allocation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" /> Allocation Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={allocationData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" stroke="none">
                      {allocationData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[hsl(222,47%,10%)] border border-border rounded-lg px-3 py-2">
                          <p className="text-xs font-semibold">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.value}% — ${d.dollars}</p>
                        </div>
                      );
                    }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {allocationData.map(a => (
                    <div key={a.name} className="flex items-center gap-1.5 text-xs">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: a.color }} />
                      <span>{a.name}</span>
                      <span className="text-muted-foreground">{a.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Position Sizing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assets.map(a => (
                    <div key={a.symbol} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style={{ backgroundColor: a.color + "20", color: a.color }}>
                        {a.symbol}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{a.name}</span>
                          <span className="text-sm font-mono">${a.dollarAmount}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${a.allocation}%`, backgroundColor: a.color }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-bold font-mono">${totalInvestment.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-xs uppercase tracking-wider font-medium text-green-400">Strategy Philosophy</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="text-foreground font-medium block mb-1">Core-Satellite Approach</span>
                  75% in BTC + ETH (proven, institutional-grade assets) with 25% in higher-beta altcoins for growth potential. This mirrors what Dalio calls an "all-weather" mindset adapted for crypto.
                </div>
                <div>
                  <span className="text-foreground font-medium block mb-1">Dollar-Cost Averaging</span>
                  Spread $2,000 across 4 weekly purchases rather than lump sum. In volatile markets, DCA reduces timing risk and takes advantage of further dips. Howard Marks: build in margin for error.
                </div>
                <div>
                  <span className="text-foreground font-medium block mb-1">Buy When Others Fear</span>
                  Fear & Greed at 11 is historically in the bottom 5% of readings. Every prior reading below 15 has preceded a recovery. Warren Buffett's maxim applies: be greedy when others are fearful.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── ASSETS TAB ── */}
        <TabsContent value="assets">
          <div className="space-y-0">
            {assets.map(a => (
              <AssetRow key={a.symbol} asset={a} isExpanded={expandedAsset === a.symbol} onToggle={() => setExpandedAsset(expandedAsset === a.symbol ? null : a.symbol)} />
            ))}
          </div>
        </TabsContent>

        {/* ── SCENARIOS TAB ── */}
        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Price Target Upside by Asset</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={upsideData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 15%)" />
                    <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} width={40} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Bear Case" fill={COLORS.red} radius={[0, 2, 2, 0]} barSize={8} />
                    <Bar dataKey="Base Case" fill={COLORS.green} radius={[0, 2, 2, 0]} barSize={8} />
                    <Bar dataKey="Bull Case" fill={COLORS.amber} radius={[0, 2, 2, 0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {[{ label: "Bear", color: COLORS.red }, { label: "Base", color: COLORS.green }, { label: "Bull", color: COLORS.amber }].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5 text-xs">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: l.color }} />
                      <span>{l.label} Case</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scenarioData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 15%)" />
                    <XAxis dataKey="scenario" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v: number) => `$${v.toLocaleString()}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="portfolio" radius={[4, 4, 0, 0]} barSize={40}>
                      {scenarioData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {scenarioData.map(s => (
                    <div key={s.scenario} className="text-center p-2 rounded-lg border border-border bg-[hsl(222,47%,8%)]">
                      <div className="text-lg font-bold font-mono" style={{ color: s.color }}>${s.portfolio.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{s.scenario}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-amber-400" />
                <span className="text-xs uppercase tracking-wider font-medium text-amber-400">Weighted Return Expectation</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Weighting scenarios by probability: Bear (20%), Base (50%), Bull (30%). The expected portfolio value is approximately <span className="text-foreground font-semibold">$3,180</span>, representing a <span className="text-green-400 font-semibold">~59% return</span> over 12-18 months.
              </p>
              <div className="bg-[hsl(222,47%,8%)] rounded-lg p-3 border border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Expected Value:</span>
                  <span className="text-xl font-bold font-mono text-green-400">$3,180</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-green-600 to-green-400" style={{ width: "59%" }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>$2,000 invested</span>
                  <span>$3,180 expected (12-18mo)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── DCA SCHEDULE TAB ── */}
        <TabsContent value="dca" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" /> 4-Week Dollar-Cost Average Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {dcaSchedule.map((w, i) => (
                  <div key={i} className="flex gap-4 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i === 0 ? "border-green-500 bg-green-500/20 text-green-400" : "border-border bg-secondary text-muted-foreground"}`}>
                        {i + 1}
                      </div>
                      {i < dcaSchedule.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{w.week}</span>
                        <span className="font-mono text-sm font-semibold">${w.amount}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{w.focus}</p>
                      <p className="text-xs text-muted-foreground/70 italic">{w.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="bg-[hsl(222,47%,8%)] rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">Execution Tips</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2"><span className="text-muted-foreground/50">&#8226;</span>Use limit orders 1-2% below spot to improve entries</li>
                  <li className="flex items-start gap-2"><span className="text-muted-foreground/50">&#8226;</span>Execute during low-volume hours (early morning EST) for tighter spreads</li>
                  <li className="flex items-start gap-2"><span className="text-muted-foreground/50">&#8226;</span>If BTC drops below $55K during DCA period, accelerate purchases</li>
                  <li className="flex items-start gap-2"><span className="text-muted-foreground/50">&#8226;</span>Transfer to hardware wallet after completing all entries</li>
                  <li className="flex items-start gap-2"><span className="text-muted-foreground/50">&#8226;</span>Set stop-loss alerts at -20% from average entry for risk management</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cumulative Investment Over 4 Weeks</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={[
                  { week: "Start", invested: 0 },
                  { week: "Week 1", invested: 700 },
                  { week: "Week 2", invested: 1200 },
                  { week: "Week 3", invested: 1600 },
                  { week: "Week 4", invested: 2000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 15%)" />
                  <XAxis dataKey="week" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v: number) => `$${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="invested" stroke={COLORS.green} fill={COLORS.green} fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── RISK FRAMEWORK TAB ── */}
        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Asset Comparison Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={[
                    { metric: "Security", BTC: 95, ETH: 90, SOL: 65, XRP: 75 },
                    { metric: "Adoption", BTC: 90, ETH: 85, SOL: 75, XRP: 70 },
                    { metric: "Growth", BTC: 70, ETH: 80, SOL: 90, XRP: 65 },
                    { metric: "Liquidity", BTC: 95, ETH: 90, SOL: 75, XRP: 80 },
                    { metric: "Low Risk", BTC: 65, ETH: 60, SOL: 30, XRP: 50 },
                  ]}>
                    <PolarGrid stroke="hsl(217 33% 20%)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} tick={false} axisLine={false} />
                    <Radar name="BTC" dataKey="BTC" stroke={COLORS.btc} fill={COLORS.btc} fillOpacity={0.15} strokeWidth={2} />
                    <Radar name="ETH" dataKey="ETH" stroke={COLORS.eth} fill={COLORS.eth} fillOpacity={0.1} strokeWidth={2} />
                    <Radar name="SOL" dataKey="SOL" stroke={COLORS.sol} fill={COLORS.sol} fillOpacity={0.1} strokeWidth={2} />
                    <Radar name="XRP" dataKey="XRP" stroke="#00AAE4" fill="#00AAE4" fillOpacity={0.05} strokeWidth={2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-3 mt-2">
                  {[{ label: "BTC", color: COLORS.btc }, { label: "ETH", color: COLORS.eth }, { label: "SOL", color: COLORS.sol }, { label: "XRP", color: "#00AAE4" }].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5 text-xs">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: l.color }} />
                      <span>{l.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-400" /> Risk Management Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rule: "Position Sizing", detail: "Never more than 50% in a single asset. BTC at 50% is the ceiling due to its risk profile.", color: "border-l-green-500" },
                    { rule: "Stop-Loss Discipline", detail: "Set alerts at -20% from average entry. If triggered, evaluate fundamentals before panic selling.", color: "border-l-amber-500" },
                    { rule: "Loss Tolerance", detail: "This $2,000 is risk capital. Worst-case (bear scenario) loses ~$600. You've confirmed this is acceptable.", color: "border-l-blue-500" },
                    { rule: "Time Horizon", detail: "Minimum 12-18 month hold. Crypto cycles reward patience. Don't check prices daily.", color: "border-l-purple-500" },
                    { rule: "Rebalance Trigger", detail: "If any altcoin position grows to 3x+, take original investment off the table and let profits ride.", color: "border-l-red-500" },
                    { rule: "Security First", detail: "Move to hardware wallet after DCA completes. Enable 2FA on all exchange accounts. Never share keys.", color: "border-l-cyan-500" },
                  ].map((r, i) => (
                    <div key={i} className={`border-l-2 ${r.color} pl-3 py-1`}>
                      <span className="text-sm font-medium block">{r.rule}</span>
                      <span className="text-xs text-muted-foreground">{r.detail}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-xs uppercase tracking-wider font-medium text-red-400">What Could Go Wrong — Second-Level Thinking (Howard Marks)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { risk: "Macro Escalation", detail: "If tariff war intensifies or recession hits, crypto could see another 20-30% leg down before recovery." },
                  { risk: "Regulatory Crackdown", detail: "New restrictive legislation (especially on staking, DeFi) could suppress altcoin prices further." },
                  { risk: "Black Swan Event", detail: "Major exchange failure, stablecoin depeg, or smart contract exploit could trigger cascading liquidations." },
                  { risk: "Extended Bear Market", detail: "Recovery could take 2-3 years instead of 12-18 months. You need patience and conviction to hold." },
                ].map((r, i) => (
                  <div key={i} className="bg-[hsl(222,47%,8%)] rounded-lg p-3 border border-red-500/10">
                    <span className="text-sm font-medium text-red-400">{r.risk}</span>
                    <p className="text-xs text-muted-foreground mt-1">{r.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── ACTION PLAN TAB ── */}
        <TabsContent value="actions" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-green-400" /> Investment Action Plan
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {completedActions.size} of {actionPlanItems.length} tasks completed
              </p>
              <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
                  style={{ width: `${(completedActions.size / actionPlanItems.length) * 100}%` }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {actionPlanItems.map((item) => {
                  const done = completedActions.has(item.id);
                  const catColor =
                    item.category === "buy" ? "text-green-400 bg-green-500/10 border-green-500/20" :
                    item.category === "security" ? "text-blue-400 bg-blue-500/10 border-blue-500/20" :
                    item.category === "review" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                    "text-purple-400 bg-purple-500/10 border-purple-500/20";
                  const catLabel =
                    item.category === "buy" ? "Purchase" :
                    item.category === "security" ? "Security" :
                    item.category === "review" ? "Review" : "Rebalance";

                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleAction(item.id)}
                      className={`w-full text-left flex items-start gap-3 px-3 py-3 rounded-lg border transition-all duration-300 ${
                        done
                          ? "bg-[hsl(222,47%,7%)] border-border/50 opacity-60"
                          : "bg-[hsl(222,47%,8%)] border-border hover:border-green-500/30 hover:bg-[hsl(222,47%,9%)]"
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {done ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 transition-all duration-300" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground/40 transition-all duration-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-sm font-medium transition-all duration-300 ${
                              done ? "line-through text-muted-foreground/50" : "text-foreground"
                            }`}
                          >
                            {item.task}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 border ${catColor} ${done ? "opacity-40" : ""}`}
                          >
                            {catLabel}
                          </Badge>
                        </div>
                        <p
                          className={`text-xs mt-1 transition-all duration-300 ${
                            done ? "text-muted-foreground/30 line-through" : "text-muted-foreground"
                          }`}
                        >
                          {item.detail}
                        </p>
                      </div>
                      <div className={`text-[10px] font-mono flex-shrink-0 mt-0.5 transition-all duration-300 ${
                        done ? "text-muted-foreground/30" : "text-muted-foreground"
                      }`}>
                        {item.date}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs uppercase tracking-wider font-medium text-amber-400">Pro Tips for Execution</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="bg-[hsl(222,47%,8%)] rounded-lg p-3 border border-border">
                  <span className="text-foreground font-medium block mb-1">Use Limit Orders</span>
                  Place limit orders 1-2% below the current spot price rather than market orders. In volatile markets this can save you 2-4% on entries over the full DCA period.
                </div>
                <div className="bg-[hsl(222,47%,8%)] rounded-lg p-3 border border-border">
                  <span className="text-foreground font-medium block mb-1">Trade During Low Volume</span>
                  Execute during early morning EST hours when spreads are tighter. Avoid trading during high-volatility news events.
                </div>
                <div className="bg-[hsl(222,47%,8%)] rounded-lg p-3 border border-border">
                  <span className="text-foreground font-medium block mb-1">Accelerate on Dips</span>
                  If BTC drops below $55K during your DCA window, consider moving up later purchases to capitalize on the deeper discount.
                </div>
                <div className="bg-[hsl(222,47%,8%)] rounded-lg p-3 border border-border">
                  <span className="text-foreground font-medium block mb-1">Don't Check Daily</span>
                  After deploying capital, set weekly or biweekly review cadence. Daily price checking leads to emotional decisions.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t border-border text-center">
        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
          For informational purposes only. Not financial advice. Research generated Feb 7, 2026. Always do your own research.
        </p>
      </footer>
    </div>
  );
}
