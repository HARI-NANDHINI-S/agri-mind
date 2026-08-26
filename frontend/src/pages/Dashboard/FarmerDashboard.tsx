import React from "react";
import { useQuery } from "@tanstack/react-query";
import client from "../../api/client";
import Card from "../../components/ui/Card";
import YieldTrendChart from "../../components/charts/YieldTrendChart";
import CropDistributionChart from "../../components/charts/CropDistributionChart";
import {
  Spade,
  Leaf,
  Bug,
  Compass,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FarmerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard_overview"],
    queryFn: async () => {
      const res = await client.get("/dashboard/overview");
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-neutral-200 rounded-xl" />
          ))}
        </div>
        <div className="h-80 bg-neutral-200 rounded-xl" />
      </div>
    );
  }

  const summary = dashboardData?.summary || {
    total_farms: 0,
    total_fields: 0,
    active_crops: 0,
    disease_alerts: 0,
  };

  const statCards = [
    { label: "Total Farms", value: summary.total_farms, icon: Spade, color: "text-green-600 bg-green-50" },
    { label: "Total Fields", value: summary.total_fields, icon: Spade, color: "text-blue-600 bg-blue-50" },
    { label: "Active Crops", value: summary.active_crops, icon: Leaf, color: "text-primary-600 bg-primary-50" },
    { label: "Active Disease Alerts", value: summary.disease_alerts, icon: Bug, color: "text-red-600 bg-red-50" },
  ];

  // Map yield trend predictions into charting format
  const yieldChartData = (dashboardData?.yield_trend || []).map((pt: any) => ({
    date: new Date(pt.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    value: pt.predicted_yield,
  })).reverse();

  // Map crop stage counts
  const stageDistribution = Object.entries(dashboardData?.crop_stage_distribution || {}).map(([key, val]) => ({
    name: key.replace("_", " "),
    value: Number(val),
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Farm Overview</h1>
        <p className="text-sm text-neutral-500 font-medium mt-1">Real-time agricultural insights and metrics</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500">{stat.label}</p>
              <p className="text-2xl font-bold text-neutral-800 mt-0.5">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Yield Estimates & Prediction Trend" className="lg:col-span-2">
          {yieldChartData.length > 0 ? (
            <YieldTrendChart data={yieldChartData} />
          ) : (
            <div className="h-72 flex items-center justify-center text-sm text-neutral-500 font-medium bg-neutral-50/50 border border-dashed rounded-lg">
              No historical yield predictions recorded.
            </div>
          )}
        </Card>

        <Card title="Crops Stage Distribution">
          {stageDistribution.length > 0 ? (
            <CropDistributionChart data={stageDistribution} />
          ) : (
            <div className="h-72 flex items-center justify-center text-sm text-neutral-500 font-medium bg-neutral-50/50 border border-dashed rounded-lg">
              No active crops currently planted.
            </div>
          )}
        </Card>
      </div>

      {/* AI Insights & Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights Column */}
        <Card title="AgriMind AI Insights" className="lg:col-span-2">
          <div className="space-y-3">
            {(dashboardData?.insights || []).map((insight: string, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-neutral-50 border border-neutral-100 flex items-start gap-3"
              >
                <div className="h-5 w-5 text-primary-700 flex-shrink-0 mt-0.5">
                  {insight.includes("⚠️") ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Compass className="h-5 w-5 text-primary-700" />
                  )}
                </div>
                <p className="text-xs font-medium text-neutral-700 leading-relaxed">{insight.replace("⚠️ ", "").replace("🌾 ", "").replace("📅 ", "").replace("📊 ", "").replace("✅ ", "")}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions Column */}
        <Card title="Quick Tasks">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/ml/disease-detection")}
              className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left transition-colors"
            >
              <div>
                <p className="text-xs font-semibold text-neutral-800">Identify Leaf Diseases</p>
                <p className="text-[10px] text-neutral-500 font-medium mt-0.5">Upload leaves for scan diagnosis</p>
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-400" />
            </button>

            <button
              onClick={() => navigate("/ml/crop-recommendation")}
              className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left transition-colors"
            >
              <div>
                <p className="text-xs font-semibold text-neutral-800">Crop Recommendations</p>
                <p className="text-[10px] text-neutral-500 font-medium mt-0.5">Select matches for soil levels</p>
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-400" />
            </button>

            <button
              onClick={() => navigate("/ml/yield-prediction")}
              className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left transition-colors"
            >
              <div>
                <p className="text-xs font-semibold text-neutral-800">Forecast Total Yield</p>
                <p className="text-[10px] text-neutral-500 font-medium mt-0.5">Predict harvesting metrics</p>
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-400" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FarmerDashboard;
