import React from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface RadarMetric {
  subject: string;
  A: number;
  fullMark: number;
}

interface HealthRadarChartProps {
  data: RadarMetric[];
}

const HealthRadarChart: React.FC<HealthRadarChartProps> = ({ data }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="subject" stroke="#6b7280" fontSize={11} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9ca3af" fontSize={10} />
          <Radar
            name="Soil Level"
            dataKey="A"
            stroke="#15803d"
            fill="#22c55e"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthRadarChart;
