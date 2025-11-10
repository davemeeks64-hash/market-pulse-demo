import MarketPulse from "../../components/MarketPulse";
import StatCard from "../../components/StatCard";
import SimulatorTile from "../../components/SimulatorTile";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-white/50">
          Overview • Market Pulse • Simulator
        </p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Equity" value="$12,480.22" change="+2.4% today" tone="up" />
        <StatCard title="Open Positions" value="5" change="2 watching" />
        <StatCard title="Simulator Balance" value="$5,000.00" change="Paper mode" />
      </div>

      {/* Market Pulse */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Market Pulse</h2>
          <p className="text-xs text-white/40">
            We ain’t tellin’ you to buy — just what’s trending 👀
          </p>
        </div>
        <MarketPulse />
      </section>

      {/* Simulator Tile */}
<SimulatorTile />
    </div>
  );
}
