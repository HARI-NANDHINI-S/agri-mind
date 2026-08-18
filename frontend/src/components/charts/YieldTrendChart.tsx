import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface DataPoint {
  date: string;
  value: number;
}

interface YieldTrendChartProps {
  data: DataPoint[];
}

const YieldTrendChart: React.FC<YieldTrendChartProps> = ({ data }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="yieldColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#15803d" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#15803d" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} />
          <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
          />
          <Area type="monotone" dataKey="value" stroke="#15803d" strokeWidth={2} fillOpacity={1} fill="url(#yieldColor)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YieldTrendChart;
