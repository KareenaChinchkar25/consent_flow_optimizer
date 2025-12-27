import React, { useState } from "react";
import {
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Camera,
  Activity,
  LineChart,
  ChevronRight,
  CheckCircle,
  Zap,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

/* -------------------------------------------------------------------------- */
/*                                   Mock Data                                 */
/* -------------------------------------------------------------------------- */

const riskScoreOverTime = [
  { date: "Jan 1", score: 7.2 },
  { date: "Jan 8", score: 6.8 },
  { date: "Jan 15", score: 7.5 },
  { date: "Jan 22", score: 6.2 },
  { date: "Jan 29", score: 5.9 },
  { date: "Feb 5", score: 6.8 },
];

const insights = [
  {
    id: 1,
    title: "Camera permissions dominate risk",
    description: "Camera access contributes 42% of total risk score.",
    icon: Camera,
  },
  {
    id: 2,
    title: "Late-night consent behavior",
    description: "68% of high-risk permissions occur between 10 PM – 2 AM.",
    icon: Clock,
  },
];

const recommendations = [
  {
    id: 1,
    title: "Review camera permissions",
    description: "5 unused permissions detected",
    action: "Review",
    icon: Camera,
  },
  {
    id: 2,
    title: "Enable auto-block",
    description: "Automatically block high-risk requests",
    action: "Configure",
    icon: Shield,
  },
];

/* -------------------------------------------------------------------------- */
/*                               Line Chart SVG                               */
/* -------------------------------------------------------------------------- */

const RiskLineChart = () => {
  const width = 500;
  const height = 200;
  const padding = 40;

  const maxScore = 10;

  const points = riskScoreOverTime.map((d, i) => {
    const x =
      padding +
      (i * (width - padding * 2)) / (riskScoreOverTime.length - 1);
    const y =
      height - padding - (d.score / maxScore) * (height - padding * 2);
    return { ...d, x, y };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56">
      {/* Grid */}
      {[0, 2.5, 5, 7.5, 10].map((val) => {
        const y =
          height - padding - (val / maxScore) * (height - padding * 2);
        return (
          <g key={val}>
            <line
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />
            <text
              x={padding - 10}
              y={y + 4}
              fontSize="10"
              fill="#6b7280"
              textAnchor="end"
            >
              {val}
            </text>
          </g>
        );
      })}

      {/* Axis */}
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#d1d5db" />
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#d1d5db"
      />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="#6366f1"
        strokeWidth="2.5"
      />

      {/* Points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#6366f1" />
          <text
            x={p.x}
            y={height - padding + 14}
            fontSize="10"
            fill="#6b7280"
            textAnchor="middle"
          >
            {p.date}
          </text>
        </g>
      ))}
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/*                               Main Component                                */
/* -------------------------------------------------------------------------- */

export default function RiskInsightsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* ============================ HEADER ============================ */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Risk Insights
              </h1>
              <p className="text-sm text-gray-600">
                Privacy risk and consent analytics
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm rounded-md font-medium ${
                  timeRange === range
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </header>

        {/* ============================ KPI SUMMARY ============================ */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Overall Risk</p>
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">68%</p>
            <p className="text-sm text-emerald-600 flex items-center gap-1">
              <TrendingDown className="w-4 h-4" /> Improving
            </p>
          </Card>

          <Card className="p-6 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">High-Risk Consents</p>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">14</p>
            <p className="text-sm text-red-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +2 this month
            </p>
          </Card>

          <Card className="p-6 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Risk Trend</p>
              <TrendingDown className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-emerald-700">Improving</p>
            <p className="text-sm text-gray-600">12% reduction</p>
          </Card>
        </section>

        {/* ============================ LINE GRAPH ============================ */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Risk Score Trend
              </h2>
              <p className="text-sm text-gray-600">
                Risk score changes over time
              </p>
            </div>
            <LineChart className="w-5 h-5 text-indigo-600" />
          </div>

          <RiskLineChart />
        </Card>

        {/* ============================ INSIGHTS & ACTIONS ============================ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Smart Risk Insights
              </h2>
              <Zap className="w-5 h-5 text-amber-600" />
            </div>

            {insights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex gap-3 p-4 rounded-lg bg-gray-50 border"
                >
                  <Icon className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Recommended Actions
              </h2>
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>

            {recommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <div
                  key={rec.id}
                  className="flex justify-between items-center p-4 rounded-lg border hover:bg-indigo-50 transition"
                >
                  <div className="flex gap-3">
                    <Icon className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-medium text-gray-900">{rec.title}</p>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-indigo-600 flex items-center gap-1">
                    {rec.action}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </Card>
        </section>

      </div>
    </div>
  );
}
