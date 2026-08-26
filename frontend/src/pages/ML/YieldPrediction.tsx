import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import client from "../../api/client";
import type { Farm, Field, YieldPredictionResponse } from "../../types";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { useToast } from "../../hooks/useToast";
import { TrendingUp, BarChart2 } from "lucide-react";

const yieldSchema = z.object({
  field_id: z.string().min(1, "Field selection is required"),
  crop_name: z.string().min(1, "Crop name is required"),
  area: z.coerce.number().positive("Must be positive"),
  nitrogen: z.coerce.number().min(0).optional(),
  phosphorus: z.coerce.number().min(0).optional(),
  potassium: z.coerce.number().min(0).optional(),
  rainfall: z.coerce.number().min(0).optional(),
  temperature: z.coerce.number().optional(),
  humidity: z.coerce.number().min(0).max(100).optional(),
  season: z.string().optional(),
});

const YieldPrediction: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<YieldPredictionResponse | null>(null);

  // Load farms & fields for context select list
  const { data: farms = [] } = useQuery<Farm[]>({
    queryKey: ["farms"],
    queryFn: async () => {
      const res = await client.get("/farms");
      return res.data.data;
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(yieldSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await client.post("/ml/yield-prediction", data);
      setResult(res.data.data);
      toast("success", "Analysis Complete", "Yield projections successfully calculated.");
    } catch (err: any) {
      toast("error", "Projection Failed", err.response?.data?.detail || "ML model inference failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Yield Predictor</h1>
        <p className="text-sm text-neutral-500 font-medium mt-1">Estimate total harvest yield based on crop type and area sizes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Param Card */}
        <Card title="Soil and Field Dimensions" className="lg:col-span-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input id="yield-field" label="Field ID / Name" placeholder="e.g. North Plot" error={errors.field_id?.message as string} {...register("field_id")} />
            <Input id="yield-crop" label="Crop Name" placeholder="e.g. Maize" error={errors.crop_name?.message as string} {...register("crop_name")} />
            <Input id="yield-area" label="Area (Hectares)" type="number" step="any" error={errors.area?.message as string} {...register("area")} />

            <div className="border-t border-neutral-100 pt-4 space-y-4">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Climate Modifiers (Optional)</span>
              <Input id="yield-rain" label="Expected Rainfall (mm)" type="number" step="any" error={errors.rainfall?.message as string} {...register("rainfall")} />
              <Input id="yield-temp" label="Avg Temperature (°C)" type="number" step="any" error={errors.temperature?.message as string} {...register("temperature")} />
              <Select
                id="yield-season"
                label="Season"
                options={[
                  { value: "", label: "Select Season" },
                  { value: "kharif", label: "Kharif" },
                  { value: "rabi", label: "Rabi" },
                  { value: "zaid", label: "Zaid" },
                  { value: "whole year", label: "Whole Year" },
                ]}
                error={errors.season?.message as string}
                {...register("season")}
              />
            </div>

            <Button type="submit" loading={loading} className="w-full flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Run Projection
            </Button>
          </form>
        </Card>

        {/* Output */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <Card title="Yield Projection Output" subtitle={`Model Version: ${result.model_version}`}>
              <div className="space-y-6">
                <div className="p-6 border border-neutral-200 bg-neutral-50/50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-650 rounded-xl text-white">
                      <BarChart2 className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Total Estimated Yield</span>
                      <h4 className="text-3xl font-black text-neutral-800 mt-1">
                        {result.predicted_yield.toFixed(2)} <span className="text-sm font-semibold text-neutral-500">{result.yield_unit}</span>
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-neutral-200 rounded-xl">
                    <span className="text-[9px] text-neutral-500 font-bold uppercase block tracking-wider">Lower Bound (95% CI)</span>
                    <p className="text-xl font-bold text-neutral-800 mt-1">
                      {result.confidence_lower ? `${result.confidence_lower.toFixed(2)} tonnes` : "--"}
                    </p>
                  </div>
                  <div className="p-4 border border-neutral-200 rounded-xl">
                    <span className="text-[9px] text-neutral-500 font-bold uppercase block tracking-wider">Upper Bound (95% CI)</span>
                    <p className="text-xl font-bold text-neutral-800 mt-1">
                      {result.confidence_upper ? `${result.confidence_upper.toFixed(2)} tonnes` : "--"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center p-12 border border-dashed border-neutral-200 bg-white rounded-xl text-sm text-neutral-500 font-medium">
              Run projection parameters to estimate yield output.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YieldPrediction;
