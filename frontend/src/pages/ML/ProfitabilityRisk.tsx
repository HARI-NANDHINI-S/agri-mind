import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import client from "../../api/client";
import type { ProfitabilityRiskResponse } from "../../types";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { useToast } from "../../hooks/useToast";
import { ShieldCheck, AlertTriangle } from "lucide-react";

const profSchema = z.object({
  crop_name: z.string().min(1, "Crop name is required"),
  area: z.coerce.number().positive("Area must be positive"),
  estimated_cost: z.coerce.number().positive("Estimated cost must be positive"),
  expected_yield_per_ha: z.coerce.number().positive().optional(),
  expected_market_price: z.coerce.number().positive().optional(),
});

const ProfitabilityRisk: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProfitabilityRiskResponse | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await client.post("/ml/profitability-risk", data);
      setResult(res.data.data);
      toast("success", "Analysis Finished", "Profitability and risk profile generated.");
    } catch (err: any) {
      toast("error", "Analysis Failed", err.response?.data?.detail || "ML model error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Profitability & Risk Analysis</h1>
        <p className="text-sm text-neutral-500 font-medium mt-1">Simulate expected revenue, return on investment (ROI), and risk scoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Card */}
        <Card title="Investment Inputs" className="lg:col-span-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input id="pr-crop" label="Crop Name" placeholder="e.g. Cotton" error={errors.crop_name?.message as string} {...register("crop_name")} />
            <Input id="pr-area" label="Field Area (Hectares)" type="number" step="any" error={errors.area?.message as string} {...register("area")} />
            <Input id="pr-cost" label="Estimated Total Input Cost (₹)" type="number" step="any" error={errors.estimated_cost?.message as string} {...register("estimated_cost")} />
            <Input id="pr-yield" label="Expected Yield (Tonnes/ha, optional)" type="number" step="any" error={errors.expected_yield_per_ha?.message as string} {...register("expected_yield_per_ha")} />
            <Input id="pr-price" label="Expected Market Price (₹/quintal, optional)" type="number" step="any" error={errors.expected_market_price?.message as string} {...register("expected_market_price")} />

            <Button type="submit" loading={loading} className="w-full flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Run Profit & Risk Simulation
            </Button>
          </form>
        </Card>

        {/* Results Showcase */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <Card title="Financial & Risk Report" subtitle={`Model Version: ${result.model_version}`}>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border border-neutral-200 rounded-xl bg-neutral-50">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block tracking-wider">Projected Revenue</span>
                    <p className="text-xl font-bold text-neutral-800 mt-1">₹{result.projected_revenue.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border border-neutral-200 rounded-xl bg-primary-50">
                    <span className="text-[10px] text-primary-700 font-bold uppercase block tracking-wider">Projected Net Profit</span>
                    <p className="text-xl font-bold text-primary-800 mt-1">₹{result.projected_profit.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border border-neutral-200 rounded-xl bg-neutral-50">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block tracking-wider">Expected ROI</span>
                    <p className="text-xl font-bold text-neutral-800 mt-1">{result.expected_roi_percent}%</p>
                  </div>
                </div>

                <div className="p-5 border border-neutral-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Overall Risk Categorization</span>
                    <p className="text-sm font-semibold text-neutral-600 mt-0.5">Calculated based on disease probability, market volatility & weather</p>
                  </div>
                  <Badge variant={result.overall_risk_score === "LOW" ? "success" : result.overall_risk_score === "MEDIUM" ? "warning" : "danger"}>
                    {result.overall_risk_score} RISK
                  </Badge>
                </div>

                {/* Recommendations */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                  <h5 className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle className="h-4 w-4 text-blue-700" /> AgriMind Risk Strategy Advisory
                  </h5>
                  <p className="text-xs text-neutral-700 leading-relaxed font-medium">{result.recommendations}</p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center p-12 border border-dashed border-neutral-200 bg-white rounded-xl text-sm text-neutral-500 font-medium">
              Enter investment metrics to run profitability and risk simulation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityRisk;
