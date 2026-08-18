import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import client from "../../api/client";
import type { PricePredictionResponse } from "../../types";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { useToast } from "../../hooks/useToast";
import { LineChart, TrendingUp, TrendingDown, Minus } from "lucide-react";

const priceSchema = z.object({
  crop_name: z.string().min(1, "Crop name is required"),
  market_name: z.string().optional(),
  location: z.string().optional(),
  target_month: z.string().min(1, "Target timeframe is required"),
});

type PriceFormInputs = z.infer<typeof priceSchema>;

const PricePrediction: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PricePredictionResponse | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<PriceFormInputs>({
    resolver: zodResolver(priceSchema),
  });

  const onSubmit = async (data: PriceFormInputs) => {
    setLoading(true);
    try {
      const res = await client.post("/ml/price-prediction", data);
      setResult(res.data.data);
      toast("success", "Forecast Generated", "Price prediction model executed successfully.");
    } catch (err: any) {
      toast("error", "Forecast Failed", err.response?.data?.detail || "ML model error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Price Forecast</h1>
        <p className="text-sm text-neutral-500 font-medium mt-1">Forecast future crop market prices based on seasonal demand trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Card */}
        <Card title="Forecast Parameters" className="lg:col-span-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input id="pp-crop" label="Crop Name" placeholder="e.g. Wheat" error={errors.crop_name?.message} {...register("crop_name")} />
            <Input id="pp-mkt" label="Target Mandi / Market (Optional)" placeholder="e.g. Karnal Mandi" error={errors.market_name?.message} {...register("market_name")} />
            <Input id="pp-loc" label="Location (Optional)" placeholder="e.g. Haryana" error={errors.location?.message} {...register("location")} />
            <Select
              id="pp-month"
              label="Target Timeframe"
              options={[
                { value: "Next Month", label: "Next Month" },
                { value: "October 2026", label: "October 2026" },
                { value: "November 2026", label: "November 2026" },
                { value: "December 2026", label: "December 2026" },
              ]}
              error={errors.target_month?.message}
              {...register("target_month")}
            />

            <Button type="submit" loading={loading} className="w-full flex items-center gap-2">
              <LineChart className="h-4 w-4" /> Run Price Forecast
            </Button>
          </form>
        </Card>

        {/* Results Card */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <Card title="Predicted Market Price" subtitle={`Model Version: ${result.model_version}`}>
              <div className="space-y-6">
                <div className="p-6 border border-neutral-200 bg-neutral-50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Target Crop Price ({result.target_month})</span>
                    <h4 className="text-3xl font-black text-neutral-800 mt-1">
                      ₹{result.predicted_price.toFixed(2)} <span className="text-sm font-semibold text-neutral-500">{result.unit}</span>
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.trend_direction === "UP" ? "success" : result.trend_direction === "DOWN" ? "danger" : "neutral"}>
                      <span className="flex items-center gap-1">
                        {result.trend_direction === "UP" ? <TrendingUp className="h-3 w-3" /> : result.trend_direction === "DOWN" ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                        {result.trend_direction} TREND
                      </span>
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-neutral-200 rounded-xl">
                    <span className="text-[9px] text-neutral-500 font-bold uppercase block tracking-wider">Estimated Minimum</span>
                    <p className="text-xl font-bold text-neutral-800 mt-1">
                      ₹{result.confidence_lower?.toFixed(2)} {result.unit}
                    </p>
                  </div>
                  <div className="p-4 border border-neutral-200 rounded-xl">
                    <span className="text-[9px] text-neutral-500 font-bold uppercase block tracking-wider">Estimated Maximum</span>
                    <p className="text-xl font-bold text-neutral-800 mt-1">
                      ₹{result.confidence_upper?.toFixed(2)} {result.unit}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center p-12 border border-dashed border-neutral-200 bg-white rounded-xl text-sm text-neutral-500 font-medium">
              Run price forecast parameters to project crop market values.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricePrediction;
