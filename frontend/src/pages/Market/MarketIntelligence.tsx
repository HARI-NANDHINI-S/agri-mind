import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import client from "../../api/client";
import type { MarketPrice, PriceTrendPoint } from "../../types";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";
import YieldTrendChart from "../../components/charts/YieldTrendChart";
import { Store } from "lucide-react";

const MarketIntelligence: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("Wheat");

  // Fetch prices
  const { data: prices = [], isLoading: isLoadingPrices } = useQuery<MarketPrice[]>({
    queryKey: ["market_prices", searchTerm],
    queryFn: async () => {
      const res = await client.get("/market/prices", {
        params: searchTerm ? { crop_name: searchTerm } : {},
      });
      return res.data.data;
    },
  });

  // Fetch price trends
  const { data: trends = [] } = useQuery<PriceTrendPoint[]>({
    queryKey: ["market_trends", selectedCrop],
    queryFn: async () => {
      const res = await client.get("/market/trends", {
        params: { crop_name: selectedCrop },
      });
      return res.data.data;
    },
  });

  const chartData = trends.map((t) => ({
    date: String(t.date),
    value: t.modal_price,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Market Intelligence</h1>
        <p className="text-sm text-neutral-500 font-medium mt-1">Live market prices, mandi rates, and crop historical price trends</p>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4 max-w-md">
        <div className="relative flex-1">
          <Input
            placeholder="Search crop or market location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Trend Chart Card */}
      <Card title={`Price Trend for ${selectedCrop}`} subtitle="Historical modal prices (₹/quintal)">
        <div className="flex gap-2 mb-4">
          {["Wheat", "Rice", "Cotton", "Maize", "Tomato"].map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCrop === crop
                  ? "bg-primary-700 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
        <YieldTrendChart data={chartData} />
      </Card>

      {/* Prices Table */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-neutral-800">Live Mandi Prices</h3>
        <Table<MarketPrice>
          loading={isLoadingPrices}
          data={prices}
          emptyMessage="No market price data matching your criteria."
          columns={[
            {
              header: "Crop Name",
              accessor: (p) => (
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary-700" />
                  <span className="font-bold text-neutral-800">{p.crop_name}</span>
                </div>
              ),
            },
            { header: "Market / Mandi", accessor: (p) => <span>{p.market_name}</span> },
            { header: "Location", accessor: (p) => <span>{p.location}, {p.state || ""}</span> },
            { header: "Min Price", accessor: (p) => <span className="text-neutral-500">₹{p.min_price}</span> },
            { header: "Modal Price", accessor: (p) => <span className="font-bold text-primary-700">₹{p.modal_price} {p.unit}</span> },
            { header: "Max Price", accessor: (p) => <span className="text-neutral-500">₹{p.max_price}</span> },
            { header: "Date", accessor: (p) => <span className="text-xs">{p.date}</span> },
          ]}
        />
      </div>
    </div>
  );
};

export default MarketIntelligence;
