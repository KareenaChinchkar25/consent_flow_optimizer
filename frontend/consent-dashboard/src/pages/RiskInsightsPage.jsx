import React, { useState } from 'react';
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Globe, 
  Camera, 
  Mic, 
  MapPin, 
  Eye,
  Activity,
  PieChart,
  BarChart3,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  Zap,
  Calendar
} from 'lucide-react';

// Mock data for charts and metrics
const mockData = {
  riskScoreOverTime: [
    { date: 'Jan 1', score: 7.2 },
    { date: 'Jan 8', score: 6.8 },
    { date: 'Jan 15', score: 7.5 },
    { date: 'Jan 22', score: 6.2 },
    { date: 'Jan 29', score: 5.9 },
    { date: 'Feb 5', score: 6.8 },
  ],
  riskByPermission: [
    { permission: 'Camera', value: 42, risk: 'high' },
    { permission: 'Location', value: 28, risk: 'medium' },
    { permission: 'Microphone', value: 18, risk: 'medium' },
    { permission: 'Contacts', value: 8, risk: 'low' },
    { permission: 'Notifications', value: 4, risk: 'low' },
  ],
  riskDistribution: [
    { level: 'High Risk', value: 25, color: '#EF4444' },
    { level: 'Medium Risk', value: 35, color: '#F59E0B' },
    { level: 'Low Risk', value: 40, color: '#10B981' },
  ],
  topRiskySites: [
    { name: 'socialstream.com', permission: 'Camera', riskLevel: 'high', visits: 124 },
    { name: 'shoppify.store', permission: 'Location', riskLevel: 'high', visits: 89 },
    { name: 'videomeet.live', permission: 'Microphone', riskLevel: 'medium', visits: 156 },
    { name: 'weatherwise.app', permission: 'Location', riskLevel: 'medium', visits: 203 },
    { name: 'fitness-track.co', permission: 'Health Data', riskLevel: 'medium', visits: 67 },
  ],
  insights: [
    {
      id: 1,
      title: 'Camera permissions dominate risk',
      description: 'Camera access contributes 42% of total risk score, significantly higher than other permissions.',
      icon: Camera,
      trend: 'high'
    },
    {
      id: 2,
      title: 'Late-night permission patterns',
      description: '68% of high-risk consents are granted between 10 PM - 2 AM, when users may be less attentive.',
      icon: Clock,
      trend: 'rising'
    },
    {
      id: 3,
      title: 'Location access patterns',
      description: 'Repeated medium-risk location sharing to shopping and fitness apps shows consistent behavior.',
      icon: MapPin,
      trend: 'stable'
    },
  ],
  recommendations: [
    {
      id: 1,
      title: 'Review camera permissions',
      description: '5 unused camera permissions detected',
      action: 'Review now',
      icon: Camera
    },
    {
      id: 2,
      title: 'Enable auto-block',
      description: 'Automatically block high-risk permission requests',
      action: 'Configure',
      icon: Shield
    },
    {
      id: 3,
      title: 'Schedule monthly review',
      description: 'Set up recurring permission audits',
      action: 'Schedule',
      icon: Calendar
    },
  ]
};

const RiskInsightsPage = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Helper function for risk level styling
  const getRiskLevelStyle = (level) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Risk Insights</h1>
            <p className="text-gray-600 mt-1">Analyze privacy risks and consent behavior patterns over time</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Last updated: Today, 9:42 AM
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${timeRange === range
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1️⃣ Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Overall Risk Score */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Overall Risk Score</h3>
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">6.8</span>
            <span className="text-gray-500">/10</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                style={{ width: '68%' }}
              />
            </div>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-600 font-medium">-12%</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Moderate risk • Improving trend</p>
        </div>

        {/* High-Risk Consents */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">High-Risk Consents</h3>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">14</span>
            <span className="text-gray-500">/ 89 total</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                style={{ width: '16%' }}
              />
            </div>
            <TrendingUp className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600 font-medium">+2</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
        </div>

        {/* Most Risky Permission */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Most Risky Permission</h3>
            <Camera className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mb-2">
            <span className="text-3xl font-bold text-gray-900">Camera</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                style={{ width: '42%' }}
              />
            </div>
            <span className="text-sm font-medium text-amber-700">42%</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Of total risk score</p>
        </div>

        {/* Risk Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Risk Trend</h3>
            <TrendingDown className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mb-2">
            <span className="text-3xl font-bold text-emerald-700">Improving</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                  style={{ width: '75%' }}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">12% improvement this month</p>
        </div>
      </div>

      {/* 2️⃣ Risk Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Risk Score Over Time */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Risk Score Over Time</h3>
              <p className="text-sm text-gray-600">30-day trend analysis</p>
            </div>
            <LineChart className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="h-64 flex items-end gap-2">
            {mockData.riskScoreOverTime.map((point, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${point.score * 8}%` }}
                  title={`Score: ${point.score}`}
                />
                <span className="text-xs text-gray-500 mt-2">{point.date}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span>Risk Score</span>
              <div className="ml-auto flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600 font-medium">Overall improving trend</span>
              </div>
            </div>
          </div>
        </div>
        

        {/* Risk by Permission Type */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Risk by Permission Type</h3>
              <p className="text-sm text-gray-600">Contributions to total risk score</p>
            </div>
            <PieChart className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="h-64 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              {mockData.riskByPermission.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.permission === 'Camera' && <Camera className="w-4 h-4 text-amber-600" />}
                      {item.permission === 'Location' && <MapPin className="w-4 h-4 text-blue-600" />}
                      {item.permission === 'Microphone' && <Mic className="w-4 h-4 text-violet-600" />}
                      <span className="text-sm font-medium text-gray-700">{item.permission}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelStyle(item.risk)}`}>
                      {item.risk}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-full rounded-full ${item.risk === 'high' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                          item.risk === 'medium' ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                            'bg-gradient-to-r from-emerald-400 to-emerald-600'
                        }`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                    <span className="text-xs text-gray-500 ml-1">of risk</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Risk Distribution</h3>
              <p className="text-sm text-gray-600">Breakdown by risk level across all permissions</p>
            </div>
            <BarChart3 className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="h-48 flex items-end gap-4">
            {mockData.riskDistribution.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-t-lg transition-all hover:opacity-80"
                  style={{
                    height: `${item.value * 1.5}%`,
                    background: `linear-gradient(to top, ${item.color}CC, ${item.color})`
                  }}
                  title={`${item.level}: ${item.value}%`}
                />
                <div className="mt-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-900">{item.level}</span>
                  </div>
                  <div className="text-2xl font-bold mt-1" style={{ color: item.color }}>
                    {item.value}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3️⃣ Top Risky Websites */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Risky Websites</h3>
              <p className="text-sm text-gray-600">Sites with highest risk permissions</p>
            </div>
            <Globe className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="space-y-4">
            {mockData.topRiskySites.map((site, index) => (
              <div
                key={index}
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-gray-900 truncate">{site.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelStyle(site.riskLevel)}`}>
                      {site.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      {site.permission === 'Camera' && <Camera className="w-3 h-3" />}
                      {site.permission === 'Location' && <MapPin className="w-3 h-3" />}
                      {site.permission === 'Microphone' && <Mic className="w-3 h-3" />}
                      {site.permission}
                    </span>
                    <span>•</span>
                    <span>{site.visits} visits</span>
                  </div>
                </div>
                {site.riskLevel === 'high' && (
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center gap-2">
            View full risk report
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* 4️⃣ Smart Risk Insights & 5️⃣ Recommendations */}
        <div className="space-y-6">
          {/* Insights */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Smart Risk Insights</h3>
                <p className="text-sm text-gray-600">AI-powered pattern detection</p>
              </div>
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <div className="space-y-4">
              {mockData.insights.map((insight) => {
                const Icon = insight.icon;
                return (
                  <div key={insight.id} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg">
                        <Icon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{insight.title}</h4>
                          {insight.trend === 'high' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                              High Impact
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recommended Actions</h3>
                <p className="text-sm text-gray-600">Proactive risk reduction</p>
              </div>
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="space-y-4">
              {mockData.recommendations.map((rec) => {
                const Icon = rec.icon;
                return (
                  <div key={rec.id} className="p-4 rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-white transition-colors">
                          <Icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{rec.title}</h4>
                          <p className="text-sm text-gray-600">{rec.description}</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2">
                        {rec.action}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center text-sm text-gray-500">
          <p>Risk scores are calculated using machine learning models analyzing permission patterns, timing, and context.</p>
          <p className="mt-1">Last model update: February 15, 2024 • Version 2.1.4</p>
        </div>
      </div>
    </div>
  );
};

// Mock chart icons
const LineChart = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

export default RiskInsightsPage;