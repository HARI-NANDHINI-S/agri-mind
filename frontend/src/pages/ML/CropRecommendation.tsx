import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import client from "../../api/client";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useToast } from "../../hooks/useToast";
import { Compass, CheckCircle } from "lucide-react";
import type { CropRecommendationResponse } from "../../types";

const recSchema = z.object({
  nitrogen: z.coerce.number().min(0, "Must be nonnegative"),
  phosphorus: z.coerce.number().min(0, "Must be nonnegative"),
  potassium: z.coerce.number().min(0, "Must be nonnegative"),
  temperature: z.coerce.number(),
  humidity: z.coerce.number().min(0).max(100, "Relative humidity must be 0-100%"),
  ph: z.coerce.number().min(0).max(14, "pH must be 0-14"),
  rainfall: z.coerce.number().min(0, "Must be nonnegative"),
});

const CropRecommendation: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropRecommendationResponse | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(recSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await client.post("/ml/crop-recommendation", data);
      setResult(res.data.data);
      toast("success", "Analysis Complete", "Optimal crop match suggestions generated.");
    } catch (err: any) {
      toast("error", "Prediction Failed", err.response?.data?.detail || "ML model inference failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Crop Recommendations</h1>
        <p className="text-sm text-neutral-500 font-medium mt-1">Get optimal crop selection choices based on soil chemistry metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Parameters Form */}
        <Card title="Soil and Climate Inputs" className="lg:col-span-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input id="rec-n" label="Nitrogen (N) (kg/ha)" type="number" step="any" error={errors.nitrogen?.message as string} {...register("nitrogen")} />
            <Input id="rec-p" label="Phosphorus (P) (kg/ha)" type="number" step="any" error={errors.phosphorus?.message as string} {...register("phosphorus")} />
            <Input id="rec-k" label="Potassium (K) (kg/ha)" type="number" step="any" error={errors.potassium?.message as string} {...register("potassium")} />
            <Input id="rec-t" label="Temperature (°C)" type="number" step="any" error={errors.temperature?.message as string} {...register("temperature")} />
            <Input id="rec-h" label="Humidity (%)" type="number" step="any" error={errors.humidity?.message as string} {...register("humidity")} />
            <Input id="rec-ph" label="Soil pH" type="number" step="any" error={errors.ph?.message as string} {...register("ph")} />
            <Input id="rec-r" label="Rainfall (mm)" type="number" step="any" error={errors.rainfall?.message as string} {...register("rainfall")} />

            <Button type="submit" loading={loading} className="w-full flex items-center gap-2">
              <Compass className="h-4 w-4" /> Analyze Soil
            </Button>
          </form>
        </Card>

        {/* Results Showcase */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <Card title="AgriMind AI Recommendations" subtitle={`Model Version: ${result.model_version}`}>
              <div className="space-y-4">
                {result.recommendations.map((item) => (
                  <div
                    key={item.rank}
                    className={`p-5 border rounded-xl flex items-center justify-between ${
                      item.rank === 1 ? "bg-primary-50/50 border-primary-200" : "bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${item.rank === 1 ? "bg-primary-650 text-white" : "bg-neutral-200 text-neutral-600"}`}>
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-800 text-base capitalize">{item.crop}</h4>
                        <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">Recommendation Rank #{item.rank}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-neutral-800">{(item.probability * 100).toFixed(1)}%</p>
                      <p className="text-[9px] text-neutral-500 font-semibold mt-0.5 uppercase tracking-wide">Confidence Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center p-12 border border-dashed border-neutral-200 bg-white rounded-xl text-sm text-neutral-500 font-medium">
              Enter parameter dimensions and run analysis to display optimal suggestions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropRecommendation;
