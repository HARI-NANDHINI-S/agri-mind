import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../api/client";
import { AdminOverview, User } from "../../types";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { useToast } from "../../hooks/useToast";
import { ShieldAlert, Users, Spade, Leaf, Cpu, Activity } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch Overview
  const { data: overview, isLoading: isLoadingOverview } = useQuery<AdminOverview>({
    queryKey: ["admin_overview"],
    queryFn: async () => {
      const res = await client.get("/admin/overview");
      return res.data.data;
    },
  });

  // Fetch Users
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["admin_users"],
    queryFn: async () => {
      const res = await client.get("/admin/users");
      return res.data.data;
    },
  });

  // Role Mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "FARMER" | "ADMIN" }) =>
      client.put(`/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      queryClient.invalidateQueries({ queryKey: ["admin_overview"] });
      toast("success", "User role updated");
    },
  });

  // Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, is_active }: { userId: string; is_active: boolean }) =>
      client.put(`/admin/users/${userId}/status`, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      toast("success", "User status updated");
    },
  });

  if (isLoadingOverview) {
    return <div className="h-64 bg-neutral-200 animate-pulse rounded-xl" />;
  }

  const statCards = [
    { label: "Total Platform Users", value: overview?.total_users || 0, icon: Users, color: "bg-blue-50 text-blue-700" },
    { label: "Total Farms", value: overview?.total_farms || 0, icon: Spade, color: "bg-green-50 text-green-700" },
    { label: "Active Crops Tracked", value: overview?.total_crops || 0, icon: Leaf, color: "bg-primary-50 text-primary-700" },
    { label: "Total ML Inferences", value: overview?.total_predictions || 0, icon: Cpu, color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-600" /> Admin Dashboard & ML Management
          </h1>
          <p className="text-sm text-neutral-500 font-medium mt-1">Platform management, user roles, and machine learning models status</p>
        </div>
        <Badge variant="success">
          <span className="flex items-center gap-1">
            <Activity className="h-3 w-3" /> System Health: {overview?.system_health}
          </span>
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((s, idx) => (
          <Card key={idx} className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500">{s.label}</p>
              <p className="text-2xl font-bold text-neutral-800 mt-0.5">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ML Models Table */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-neutral-800">Machine Learning Models Registry</h3>
        <Table
          data={overview?.ml_models || []}
          columns={[
            { header: "Model Name", accessor: (m) => <span className="font-bold text-neutral-800">{m.name}</span> },
            { header: "Version", accessor: (m) => <span className="font-mono text-xs">{m.version}</span> },
            {
              header: "Status",
              accessor: (m) => <Badge variant={m.status === "LOADED" ? "success" : "info"}>{m.status}</Badge>,
            },
            { header: "State", accessor: (m) => <span className="text-xs">{m.last_trained}</span> },
          ]}
        />
      </div>

      {/* Users Management Table */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-neutral-800">User Accounts Management</h3>
        <Table
          loading={isLoadingUsers}
          data={users}
          columns={[
            {
              header: "User Details",
              accessor: (u) => (
                <div>
                  <p className="font-bold text-neutral-800 text-sm">{u.full_name}</p>
                  <p className="text-[10px] text-neutral-500 font-semibold">{u.email}</p>
                </div>
              ),
            },
            {
              header: "Role",
              accessor: (u) => <Badge variant={u.role === "ADMIN" ? "danger" : "neutral"}>{u.role}</Badge>,
            },
            {
              header: "Account Status",
              accessor: (u) => <Badge variant={u.is_active ? "success" : "danger"}>{u.is_active ? "Active" : "Inactive"}</Badge>,
            },
            { header: "Registered", accessor: (u) => <span className="text-xs">{new Date(u.created_at).toLocaleDateString()}</span> },
            {
              header: "Admin Actions",
              accessor: (u) => (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      updateRoleMutation.mutate({
                        userId: u.id,
                        role: u.role === "ADMIN" ? "FARMER" : "ADMIN",
                      })
                    }
                  >
                    Toggle Role ({u.role === "ADMIN" ? "Set Farmer" : "Set Admin"})
                  </Button>
                  <Button
                    size="sm"
                    variant={u.is_active ? "danger" : "primary"}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        userId: u.id,
                        is_active: !u.is_active,
                      })
                    }
                  >
                    {u.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
