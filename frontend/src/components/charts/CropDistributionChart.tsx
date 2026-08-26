import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface ShareItem {
  name: string;
  value: number;
}

interface CropDistributionChartProps {
  data: ShareItem[];
}

const COLORS = ["#15803d", "#22c55e", "#86efac", "#bbf7d0", "#dcfce7", "#3b82f6", "#ef4444"];

const CropDistributionChart: React.FC<CropDistributionChartProps> = ({ data }) => {
  return (
    <div className="h-72 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CropDistributionChart;
