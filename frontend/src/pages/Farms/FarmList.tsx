import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../api/client";
import type { Farm, Field } from "../../types";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Table from "../../components/ui/Table";
import { useToast } from "../../hooks/useToast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Spade, Plus, Edit, Trash2 } from "lucide-react";

const optionalPositiveNumber = z.preprocess(
  (value) => value === "" ? undefined : value,
  z.coerce.number().positive("Must be positive").optional(),
);

const optionalNonNegativeNumber = z.preprocess(
  (value) => value === "" ? undefined : value,
  z.coerce.number().nonnegative().optional(),
);

// Form validation schemas
const farmSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().optional(),
  total_area: optionalPositiveNumber,
  soil_type: z.string().optional(),
  irrigation_type: z.string().optional(),
  description: z.string().optional(),
});

const fieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  area: optionalPositiveNumber,
  soil_ph: z.preprocess((value) => value === "" ? undefined : value, z.coerce.number().min(0).max(14).optional()),
  nitrogen: optionalNonNegativeNumber,
  phosphorus: optionalNonNegativeNumber,
  potassium: optionalNonNegativeNumber,
  soil_type: z.string().optional(),
  irrigation_method: z.string().optional(),
  description: z.string().optional(),
});

const FarmList: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [editingField, setEditingField] = useState<Field | null>(null);

  // Fetch Farms
  const { data: farms = [], isLoading: isLoadingFarms } = useQuery<Farm[]>({
    queryKey: ["farms"],
    queryFn: async () => {
      const res = await client.get("/farms");
      return res.data.data;
    },
  });

  // Fetch Fields for Selected Farm
  const { data: fields = [], isLoading: isLoadingFields } = useQuery<Field[]>({
    queryKey: ["fields", selectedFarm?.id],
    queryFn: async () => {
      if (!selectedFarm) return [];
      const res = await client.get(`/farms/${selectedFarm.id}/fields`);
      return res.data.data;
    },
    enabled: !!selectedFarm,
  });

  // Farm Form setup
  const { register: registerFarm, handleSubmit: handleFarmSubmit, reset: resetFarm, formState: { errors: farmErrors } } = useForm({
    resolver: zodResolver(farmSchema),
  });

  // Field Form setup
  const { register: registerField, handleSubmit: handleFieldSubmit, reset: resetField, formState: { errors: fieldErrors } } = useForm({
    resolver: zodResolver(fieldSchema),
  });

  // Create/Update Farm Mutation
  const farmMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingFarm) {
        return client.put(`/farms/${editingFarm.id}`, data);
      }
      return client.post("/farms", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      toast("success", editingFarm ? "Farm updated successfully" : "Farm created successfully");
      setIsFarmModalOpen(false);
      setEditingFarm(null);
      resetFarm();
    },
    onError: (err: any) => {
      toast("error", "Failed to save farm", err.response?.data?.detail || "Action failed");
    },
  });

  // Create/Update Field Mutation
  const fieldMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!selectedFarm) throw new Error("No farm selected");
      if (editingField) {
        return client.put(`/farms/${selectedFarm.id}/fields/${editingField.id}`, data);
      }
      return client.post(`/farms/${selectedFarm.id}/fields`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields", selectedFarm?.id] });
      toast("success", editingField ? "Field updated successfully" : "Field created successfully");
      setIsFieldModalOpen(false);
      setEditingField(null);
      resetField();
    },
    onError: (err: any) => {
      toast("error", "Failed to save field", err.response?.data?.detail || "Action failed");
    },
  });

  // Delete Farm Mutation
  const deleteFarmMutation = useMutation({
    mutationFn: async (id: string) => {
      return client.delete(`/farms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      toast("success", "Farm deleted successfully");
      if (selectedFarm?.id === editingFarm?.id) {
        setSelectedFarm(null);
      }
    },
  });

  // Delete Field Mutation
  const deleteFieldMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!selectedFarm) return;
      return client.delete(`/farms/${selectedFarm.id}/fields/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields", selectedFarm?.id] });
      toast("success", "Field deleted successfully");
    },
  });

  const openEditFarm = (farm: Farm) => {
    setEditingFarm(farm);
    setIsFarmModalOpen(true);
    resetFarm(farm as any);
  };

  const openEditField = (field: Field) => {
    setEditingField(field);
    setIsFieldModalOpen(true);
    resetField(field as any);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Farms & Fields</h1>
          <p className="text-sm text-neutral-500 font-medium mt-1">Manage physical layouts and field characteristics</p>
        </div>
        <Button onClick={() => { setEditingFarm(null); setIsFarmModalOpen(true); resetFarm(); }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Farm
        </Button>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoadingFarms ? (
          <div className="h-48 bg-neutral-200 animate-pulse rounded-xl col-span-3" />
        ) : farms.length === 0 ? (
          <div className="col-span-3 py-16 border border-dashed rounded-xl text-center text-neutral-500 font-medium bg-neutral-50/50">
            No farms registered yet. Click 'Add Farm' above to get started.
          </div>
        ) : (
          farms.map((farm) => (
            <Card
              key={farm.id}
              className={`cursor-pointer hover:border-primary-500 hover:shadow transition-all relative ${
                selectedFarm?.id === farm.id ? "border-primary-600 ring-1 ring-primary-600" : ""
              }`}
            >
              <div onClick={() => setSelectedFarm(farm)}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-primary-50 text-primary-700">
                    <Spade className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800 text-sm">{farm.name}</h4>
                    <p className="text-[10px] text-neutral-500 font-semibold">{farm.location || "No Location Specified"}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-neutral-600">
                  <div>Area: <span className="text-neutral-800">{farm.total_area || "--"} ha</span></div>
                  <div>Soil: <span className="text-neutral-800">{farm.soil_type || "--"}</span></div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <button onClick={() => openEditFarm(farm)} className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700">
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => deleteFarmMutation.mutate(farm.id)} className="p-1.5 rounded hover:bg-red-50 text-neutral-500 hover:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Fields Subsection */}
      {selectedFarm && (
        <div className="pt-6 border-t border-neutral-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-800">Fields of {selectedFarm.name}</h2>
              <p className="text-xs text-neutral-500 font-semibold mt-0.5">Physical plots, boundary sizing, and soil measurements</p>
            </div>
            <Button onClick={() => { setEditingField(null); setIsFieldModalOpen(true); resetField(); }} size="sm" className="flex items-center gap-2">
              <Plus className="h-3.5 w-3.5" /> Add Field
            </Button>
          </div>

          <Table<Field>
            loading={isLoadingFields}
            data={fields}
            emptyMessage="No fields registered in this farm yet."
            columns={[
              { header: "Name", accessor: (field) => <span className="font-semibold text-neutral-800">{field.name}</span> },
              { header: "Area", accessor: (field) => <span>{field.area ? `${field.area} ha` : "--"}</span> },
              { header: "pH Level", accessor: (field) => <span>{field.soil_ph ?? "--"}</span> },
              { header: "N-P-K Levels", accessor: (field) => <span className="font-mono text-xs">{field.nitrogen ?? "--"}-{field.phosphorus ?? "--"}-{field.potassium ?? "--"}</span> },
              { header: "Soil Type", accessor: (field) => <span>{field.soil_type || "--"}</span> },
              {
                header: "Actions",
                accessor: (field) => (
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditField(field)} className="text-neutral-500 hover:text-neutral-700">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteFieldMutation.mutate(field.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* Farm Create/Edit Modal */}
      <Modal isOpen={isFarmModalOpen} onClose={() => setIsFarmModalOpen(false)} title={editingFarm ? "Edit Farm" : "Add Farm"}>
        <form onSubmit={handleFarmSubmit((data: any) => farmMutation.mutate(data))} className="space-y-4">
          <Input id="farm-name" label="Farm Name" error={farmErrors.name?.message as string} {...registerFarm("name")} />
          <Input id="farm-loc" label="Location" error={farmErrors.location?.message as string} {...registerFarm("location")} />
          <Input id="farm-area" label="Total Area (Hectares)" type="number" step="any" error={farmErrors.total_area?.message as string} {...registerFarm("total_area")} />
          <Input id="farm-soil" label="Soil Type" error={farmErrors.soil_type?.message as string} {...registerFarm("soil_type")} />
          <Input id="farm-irr" label="Irrigation Type" error={farmErrors.irrigation_type?.message as string} {...registerFarm("irrigation_type")} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsFarmModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={farmMutation.isPending}>Save Farm</Button>
          </div>
        </form>
      </Modal>

      {/* Field Create/Edit Modal */}
      <Modal isOpen={isFieldModalOpen} onClose={() => setIsFieldModalOpen(false)} title={editingField ? "Edit Field" : "Add Field"}>
        <form onSubmit={handleFieldSubmit((data: any) => fieldMutation.mutate(data))} className="space-y-4">
          <Input id="field-name" label="Field Name" error={fieldErrors.name?.message as string} {...registerField("name")} />
          <Input id="field-area" label="Area (Hectares)" type="number" step="any" error={fieldErrors.area?.message as string} {...registerField("area")} />
          <Input id="field-ph" label="Soil pH" type="number" step="any" error={fieldErrors.soil_ph?.message as string} {...registerField("soil_ph")} />
          <div className="grid grid-cols-3 gap-3">
            <Input id="field-n" label="Nitrogen (N)" type="number" error={fieldErrors.nitrogen?.message as string} {...registerField("nitrogen")} />
            <Input id="field-p" label="Phosphorus (P)" type="number" error={fieldErrors.phosphorus?.message as string} {...registerField("phosphorus")} />
            <Input id="field-k" label="Potassium (K)" type="number" error={fieldErrors.potassium?.message as string} {...registerField("potassium")} />
          </div>
          <Input id="field-soil" label="Soil Type" error={fieldErrors.soil_type?.message as string} {...registerField("soil_type")} />
          <Input id="field-irr" label="Irrigation Method" error={fieldErrors.irrigation_method?.message as string} {...registerField("irrigation_method")} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsFieldModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={fieldMutation.isPending}>Save Field</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FarmList;
