import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../api/client";
import type { FinancialSummary, Expense, Revenue } from "../../types";
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
import { DollarSign, Plus, TrendingUp, TrendingDown, Wallet, Trash2 } from "lucide-react";

const expenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum(["SEEDS", "FERTILIZERS", "PESTICIDES", "LABOR", "MACHINERY", "IRRIGATION", "FUEL", "OTHER"]),
  amount: z.coerce.number().positive("Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

const revenueSchema = z.object({
  source: z.string().min(1, "Source / Buyer is required"),
  quantity_sold: z.coerce.number().positive("Quantity must be positive"),
  unit_price: z.coerce.number().positive("Unit price must be positive"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

const FinancialManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);

  // Fetch Financial Summary
  const { data: summary, isLoading } = useQuery<FinancialSummary>({
    queryKey: ["financial_summary"],
    queryFn: async () => {
      const res = await client.get("/financial/summary");
      return res.data.data;
    },
  });

  const { register: regExpense, handleSubmit: submitExpense, reset: resetExp, formState: { errors: expErrors } } = useForm({
    resolver: zodResolver(expenseSchema),
  });

  const { register: regRevenue, handleSubmit: submitRevenue, reset: resetRev, formState: { errors: revErrors } } = useForm({
    resolver: zodResolver(revenueSchema),
  });

  // Expense Mutation
  const expenseMutation = useMutation({
    mutationFn: (data: any) => client.post("/financial/expenses", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial_summary"] });
      toast("success", "Expense added successfully");
      setIsExpenseModalOpen(false);
      resetExp();
    },
  });

  // Revenue Mutation
  const revenueMutation = useMutation({
    mutationFn: (data: any) => client.post("/financial/revenues", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial_summary"] });
      toast("success", "Revenue record added successfully");
      setIsRevenueModalOpen(false);
      resetRev();
    },
  });

  // Delete Mutations
  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => client.delete(`/financial/expenses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial_summary"] });
      toast("success", "Expense record deleted");
    },
  });

  const deleteRevenueMutation = useMutation({
    mutationFn: (id: string) => client.delete(`/financial/revenues/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial_summary"] });
      toast("success", "Revenue record deleted");
    },
  });

  if (isLoading) {
    return <div className="h-64 bg-neutral-200 animate-pulse rounded-xl" />;
  }

  const net = summary?.net_profit || 0;
  const isProfitable = net >= 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Financial Management</h1>
          <p className="text-sm text-neutral-500 font-medium mt-1">Track farm expenses, crop sales revenue, and net profit margins</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setIsExpenseModalOpen(true); resetExp(); }} variant="secondary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Expense
          </Button>
          <Button onClick={() => { setIsRevenueModalOpen(true); resetRev(); }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Record Revenue
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-50 text-green-700">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500">Total Revenue</p>
            <p className="text-2xl font-bold text-neutral-800 mt-0.5">₹{(summary?.total_revenue || 0).toLocaleString()}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-50 text-red-700">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500">Total Expenses</p>
            <p className="text-2xl font-bold text-neutral-800 mt-0.5">₹{(summary?.total_expense || 0).toLocaleString()}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${isProfitable ? "bg-primary-50 text-primary-700" : "bg-red-50 text-red-700"}`}>
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500">Net Profit</p>
            <p className={`text-2xl font-bold mt-0.5 ${isProfitable ? "text-primary-700" : "text-red-600"}`}>
              ₹{net.toLocaleString()}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500">Profit Margin</p>
            <p className="text-2xl font-bold text-neutral-800 mt-0.5">
              {(summary?.profit_margin_percent || 0).toFixed(1)}%
            </p>
          </div>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expenses List */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-neutral-800">Recent Expenses</h3>
          <Table<Expense>
            data={summary?.recent_expenses || []}
            emptyMessage="No expenses logged yet."
            columns={[
              { header: "Title", accessor: (e) => <span className="font-semibold text-neutral-800">{e.title}</span> },
              { header: "Category", accessor: (e) => <Badge variant="neutral">{e.category}</Badge> },
              { header: "Amount", accessor: (e) => <span className="font-bold text-red-600">₹{e.amount.toLocaleString()}</span> },
              { header: "Date", accessor: (e) => <span>{e.date}</span> },
              {
                header: "",
                accessor: (e) => (
                  <button onClick={() => deleteExpenseMutation.mutate(e.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                ),
              },
            ]}
          />
        </div>

        {/* Revenues List */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-neutral-800">Recent Revenue & Sales</h3>
          <Table<Revenue>
            data={summary?.recent_revenues || []}
            emptyMessage="No crop revenue recorded yet."
            columns={[
              { header: "Buyer / Source", accessor: (r) => <span className="font-semibold text-neutral-800">{r.source}</span> },
              { header: "Qty / Rate", accessor: (r) => <span>{r.quantity_sold} × ₹{r.unit_price}</span> },
              { header: "Total", accessor: (r) => <span className="font-bold text-primary-700">₹{r.total_amount.toLocaleString()}</span> },
              { header: "Date", accessor: (r) => <span>{r.date}</span> },
              {
                header: "",
                accessor: (r) => (
                  <button onClick={() => deleteRevenueMutation.mutate(r.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Add Expense Record">
        <form onSubmit={submitExpense((d: any) => expenseMutation.mutate(d))} className="space-y-4">
          <Input id="exp-title" label="Expense Title" placeholder="e.g. Tomato Seeds Purchase" error={expErrors.title?.message as string} {...regExpense("title")} />
          <Select
            id="exp-cat"
            label="Category"
            options={[
              { value: "SEEDS", label: "Seeds" },
              { value: "FERTILIZERS", label: "Fertilizers" },
              { value: "PESTICIDES", label: "Pesticides" },
              { value: "LABOR", label: "Labor" },
              { value: "MACHINERY", label: "Machinery" },
              { value: "IRRIGATION", label: "Irrigation" },
              { value: "FUEL", label: "Fuel" },
              { value: "OTHER", label: "Other" },
            ]}
            error={expErrors.category?.message as string}
            {...regExpense("category")}
          />
          <Input id="exp-amount" label="Amount (₹)" type="number" step="any" error={expErrors.amount?.message as string} {...regExpense("amount")} />
          <Input id="exp-date" label="Date" type="date" error={expErrors.date?.message as string} {...regExpense("date")} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsExpenseModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={expenseMutation.isPending}>Save Expense</Button>
          </div>
        </form>
      </Modal>

      {/* Add Revenue Modal */}
      <Modal isOpen={isRevenueModalOpen} onClose={() => setIsRevenueModalOpen(false)} title="Record Revenue Sales">
        <form onSubmit={submitRevenue((d: any) => revenueMutation.mutate(d))} className="space-y-4">
          <Input id="rev-src" label="Buyer / Mandi Source" placeholder="e.g. Local Grain Mandi" error={revErrors.source?.message as string} {...regRevenue("source")} />
          <Input id="rev-qty" label="Quantity Sold (Quintals / Tonnes)" type="number" step="any" error={revErrors.quantity_sold?.message as string} {...regRevenue("quantity_sold")} />
          <Input id="rev-price" label="Unit Price (₹ per unit)" type="number" step="any" error={revErrors.unit_price?.message as string} {...regRevenue("unit_price")} />
          <Input id="rev-date" label="Sale Date" type="date" error={revErrors.date?.message as string} {...regRevenue("date")} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsRevenueModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={revenueMutation.isPending}>Save Revenue</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FinancialManagement;
