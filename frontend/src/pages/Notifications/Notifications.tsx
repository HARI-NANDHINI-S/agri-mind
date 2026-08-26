import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../api/client";
import type { Notification } from "../../types";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { useToast } from "../../hooks/useToast";
import { Bell, CheckCircle2, AlertTriangle, Info, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notifications: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await client.get("/notifications");
      return res.data.data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => client.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => client.put("/notifications/read-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast("success", "All notifications marked as read");
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "DISEASE_ALERT": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "HARVEST_REMINDER": return <CheckCircle2 className="h-5 w-5 text-primary-700" />;
      case "PRICE_ALERT": return <Tag className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-neutral-500" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary-700" /> Notifications & Alerts
          </h1>
          <p className="text-sm text-neutral-500 font-medium mt-1">Disease warnings, harvest reminders, and system advisories</p>
        </div>
        <Button variant="secondary" onClick={() => markAllReadMutation.mutate()} size="sm">
          Mark All as Read
        </Button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="h-40 bg-neutral-200 animate-pulse rounded-xl" />
        ) : notifications.length === 0 ? (
          <Card className="py-12 text-center text-sm text-neutral-500 font-medium">
            No notifications available at this time.
          </Card>
        ) : (
          notifications.map((n) => (
            <Card
              key={n.id}
              className={`flex items-start justify-between gap-4 transition-all ${
                !n.is_read ? "bg-primary-50/30 border-primary-200" : "bg-white"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-neutral-100 mt-0.5">{getIcon(n.type)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-neutral-800 text-sm">{n.title}</h4>
                    {!n.is_read && <Badge variant="info">NEW</Badge>}
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-neutral-400 font-semibold mt-2 block">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {n.link && (
                  <Button size="sm" variant="ghost" onClick={() => { if (!n.is_read) markReadMutation.mutate(n.id); navigate(n.link!); }}>
                    View
                  </Button>
                )}
                {!n.is_read && (
                  <Button size="sm" variant="secondary" onClick={() => markReadMutation.mutate(n.id)}>
                    Mark Read
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
