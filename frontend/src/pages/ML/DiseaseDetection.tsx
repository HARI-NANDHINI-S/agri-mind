import React, { useState } from "react";
import client from "../../api/client";
import type { DiseaseDetectionResponse } from "../../types";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { useToast } from "../../hooks/useToast";
import { UploadCloud, Bug, ShieldAlert, Sparkles } from "lucide-react";

const DiseaseDetection: React.FC = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseDetectionResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await client.post("/ml/disease-detection", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.data);
      toast("success", "Scan Complete", "AI Diagnostic assessment finished.");
    } catch (err: any) {
      toast("error", "Scan Failed", err.response?.data?.detail || "CV model inference failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Disease Scan</h1>
        <p className="text-sm text-neutral-500 font-medium mt-1">Upload leaf images for automatic disease identification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload card */}
        <Card title="Image Uploader">
          <div className="space-y-4">
            <div className="border border-dashed border-neutral-300 hover:border-primary-500 transition-all rounded-xl p-8 flex flex-col items-center justify-center bg-neutral-50/50 text-center relative overflow-hidden min-h-64">
              {previewUrl ? (
                <img src={previewUrl} alt="Leaf Preview" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="h-10 w-10 text-neutral-400 mb-3" />
                  <p className="text-xs font-semibold text-neutral-600">Drag leaf images here, or browse files</p>
                  <p className="text-[10px] text-neutral-500 font-medium mt-1">Supports PNG, JPG up to 10MB</p>
                </div>
              )}
              <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <Button onClick={handleUpload} disabled={!selectedFile} loading={loading} className="w-full flex items-center gap-2">
              <Bug className="h-4 w-4" /> Run Diagnosis
            </Button>
          </div>
        </Card>

        {/* Results card */}
        <div className="space-y-6">
          {result ? (
            <Card title="AI Diagnostics Output" subtitle={`Model Version: ${result.model_version}`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">Diagnostic Verdict</span>
                  <Badge variant={result.is_healthy ? "success" : "danger"}>
                    {result.is_healthy ? "Healthy Plant" : "Pathogen Detected"}
                  </Badge>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <h4 className="font-bold text-neutral-800 capitalize text-lg">{result.predicted_disease}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-neutral-500 font-semibold">Severity level:</span>
                    <span className="text-[10px] font-bold text-red-600 capitalize">{result.severity || "None"}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center px-4 py-3 border border-neutral-200 rounded-xl bg-white">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-neutral-400" />
                    <span className="text-[10px] text-neutral-600 font-semibold">Confidence Indicator</span>
                  </div>
                  <span className="text-lg font-black text-neutral-800">{(result.confidence * 100).toFixed(1)}%</span>
                </div>

                {result.recommendations && (
                  <div className="p-4 rounded-xl bg-primary-50/50 border border-primary-200">
                    <h5 className="text-xs font-bold text-primary-900 flex items-center gap-1.5 mb-1.5">
                      <ShieldAlert className="h-4 w-4" /> AgriMind Treatment Guidance
                    </h5>
                    <p className="text-xs text-neutral-700 leading-relaxed font-semibold">{result.recommendations}</p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center p-12 border border-dashed border-neutral-200 bg-white rounded-xl text-sm text-neutral-500 font-medium">
              Choose an image file and diagnose to show pathogenetic outputs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
