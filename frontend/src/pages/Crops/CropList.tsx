import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../api/client";
import type { Crop, Farm, Field } from "../../types";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { useToast } from "../../hooks/useToast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Leaf, Plus, Edit, Trash2, History } from "lucide-react";

const cropSchema = z.object({
  field_id: z.string().min(1, "Field selection is required"),
  name: z.string().min(1, "Name is required"),
  variety: z.string().optional(),
  planting_date: z.string().optional(),
  expected_harvest_date: z.string().optional(),
  stage: z.enum(["PLANNING", "PLANTED", "GROWING", "FLOWERING", "HARVEST_READY", "HARVESTED", "SOLD"]),
  seed_info: z.string().optional(),
  expected_yield: z.coerce.number().positive("Must be positive").optional(),
});

const CropList: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [historyCrop, setHistoryCrop] = useState<Crop | null>(null);

  // Fetch Crops
  const { data: crops = [], isLoading: isLoadingCrops } = useQuery<Crop[]>({
    queryKey: ["crops"],
    queryFn: async () => {
      const res = await client.get("/crops");
      return res.data.data;
    },
  });

  // Fetch Farms
  const { data: farms = [] } = useQuery<Farm[]>({
    queryKey: ["farms"],
    queryFn: async () => {
      const res = await client.get("/farms");
      return res.data.data;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(cropSchema),
  });

  // Save Crop Mutation
  const cropMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingCrop) {
        return client.put(`/crops/${editingCrop.id}`, data);
      }
      return client.post("/crops", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crops"] });
      toast("success", editingCrop ? "Crop updated successfully" : "Crop registered successfully");
      setIsCropModalOpen(false);
      setEditingCrop(null);
      reset();
    },
    onError: (err: any) => {
      toast("error", "Action Failed", err.response?.data?.detail || "Could not save crop");
    },
  });

  // Delete Crop Mutation
  const deleteCropMutation = useMutation({
    mutationFn: async (id: string) => {
      return client.delete(`/crops/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crops"] });
      toast("success", "Crop deleted successfully");
    },
  });

  const openEditCrop = (crop: Crop) => {
    setEditingCrop(crop);
    setIsCropModalOpen(true);
    reset({
      field_id: crop.field_id,
      name: crop.name,
      variety: crop.variety || "",
      planting_date: crop.planting_date || "",
      expected_harvest_date: crop.expected_harvest_date || "",
      stage: crop.stage,
      seed_info: crop.seed_info || "",
      expected_yield: crop.expected_yield || undefined,
    });
  };

  const getStageBadgeVariant = (stage: string) => {
    switch (stage) {
      case "PLANNING": return "neutral";
      case "PLANTED":
      case "GROWING": return "info";
      case "FLOWERING":
      case "HARVEST_READY": return "warning";
      case "HARVESTED":
      case "SOLD": return "success";
      default: return "neutral";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Crops Lifecycle</h1>
          <p className="text-sm text-neutral-500 font-medium mt-1">Track growth states, expected yields, and histories</p>
        </div>
        <Button onClick={() => { setEditingCrop(null); setIsCropModalOpen(true); reset(); }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Crop
        </Button>
      </div>

      {/* Crops Table */}
      <Table<Crop>
        loading={isLoadingCrops}
        data={crops}
        emptyMessage="No crops registered yet. Click 'Add Crop' to register your first crop."
        columns={[
          {
            header: "Crop Details",
            accessor: (crop) => (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-primary-50 text-primary-700">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-neutral-850 text-sm">{crop.name}</p>
                  <p className="text-[10px] text-neutral-500 font-semibold">{crop.variety || "Standard variety"}</p>
                </div>
              </div>
            ),
          },
          {
            header: "Stage",
            accessor: (crop) => <Badge variant={getStageBadgeVariant(crop.stage)}>{crop.stage}</Badge>,
          },
          {
            header: "Planting Date",
            accessor: (crop) => <span>{crop.planting_date || "--"}</span>,
          },
          {
            header: "Expected Harvest",
            accessor: (crop) => <span>{crop.expected_harvest_date || "--"}</span>,
          },
          {
            header: "Yield Estimation",
            accessor: (crop) => <span>{crop.expected_yield ? `${crop.expected_yield} tonnes` : "--"}</span>,
          },
          {
            header: "Actions",
            accessor: (crop) => (
              <div className="flex items-center gap-2">
                <button onClick={() => { setHistoryCrop(crop); setIsHistoryModalOpen(true); }} className="text-neutral-500 hover:text-neutral-700" title="Lifecycle History">
                  <History className="h-4 w-4" />
                </button>
                <button onClick={() => openEditCrop(crop)} className="text-neutral-500 hover:text-neutral-700" title="Edit">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => deleteCropMutation.mutate(crop.id)} className="text-red-500 hover:text-red-700" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
      />

      {/* Crop Add/Edit Modal */}
      <Modal isOpen={isCropModalOpen} onClose={() => setIsCropModalOpen(false)} title={editingCrop ? "Edit Crop" : "Add Crop"}>
        <form onSubmit={handleSubmit((data: any) => cropMutation.mutate(data))} className="space-y-4">
          <Input id="crop-field-id" label="Field Location ID" placeholder="e.g. Field ID" error={errors.field_id?.message as string} {...register("field_id")} />
          <Input id="crop-name" label="Crop Name" placeholder="e.g. Tomato" error={errors.name?.message as string} {...register("name")} />
          <Input id="crop-variety" label="Variety" placeholder="e.g. Roma" error={errors.variety?.message as string} {...register("variety")} />
          <Input id="crop-p-date" label="Planting Date" type="date" error={errors.planting_date?.message as string} {...register("planting_date")} />
          <Input id="crop-eh-date" label="Expected Harvest Date" type="date" error={errors.expected_harvest_date?.message as string} {...register("expected_harvest_date")} />
          <Select
            id="crop-stage"
            label="Growth Stage"
            options={[
              { value: "PLANNING", label: "Planning" },
              { value: "PLANTED", label: "Planted" },
              { value: "GROWING", label: "Growing" },
              { value: "FLOWERING", label: "Flowering" },
              { value: "HARVEST_READY", label: "Harvest Ready" },
              { value: "HARVESTED", label: "Harvested" },
              { value: "SOLD", label: "Sold" },
            ]}
            error={errors.stage?.message as string}
            {...register("stage")}
          />
          <Input id="crop-seed" label="Seed Information" placeholder="Vendor / lot number" error={errors.seed_info?.message as string} {...register("seed_info")} />
          <Input id="crop-yield" label="Expected Yield (Tonnes)" type="number" step="any" error={errors.expected_yield?.message as string} {...register("expected_yield")} />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsCropModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={cropMutation.isPending}>Save Crop</Button>
          </div>
        </form>
      </Modal>

      {/* History Log Modal */}
      <Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} title={`${historyCrop?.name || "Crop"} Transition Logs`}>
        <div className="space-y-4">
          <div className="relative pl-6 border-l-2 border-primary-100 space-y-4">
            {historyCrop?.history?.map((entry) => (
              <div key={entry.id} className="relative">
                <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary-650 ring-4 ring-white" />
                <p className="text-xs font-bold text-neutral-800 uppercase tracking-wider">{entry.stage}</p>
                <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">{new Date(entry.created_at).toLocaleString()}</p>
              </div>
            )) || <p className="text-xs text-neutral-500 font-semibold">No lifecycle states recorded.</p>}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => setIsHistoryModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CropList;
