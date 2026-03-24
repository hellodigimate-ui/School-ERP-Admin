"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Check, Star, Zap, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  active: boolean;
  icon: string;
  color: string;
}

const defaultPlans: Plan[] = [
  {
    id: "1",
    name: "Starter",
    price: "₹4,999",
    period: "/month",
    description: "Perfect for small schools just getting started",
    features: [
      "Up to 200 students",
      "5 staff accounts",
      "Basic attendance",
      "Fee collection",
      "SMS notifications",
      "Email support",
    ],
    popular: false,
    active: true,
    icon: "zap",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "2",
    name: "Professional",
    price: "₹9,999",
    period: "/month",
    description: "Ideal for growing schools with advanced needs",
    features: [
      "Up to 1,000 students",
      "25 staff accounts",
      "QR & biometric attendance",
      "Online courses",
      "Exam management",
      "Library & inventory",
      "WhatsApp integration",
      "Priority support",
    ],
    popular: true,
    active: true,
    icon: "star",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "3",
    name: "Enterprise",
    price: "₹19,999",
    period: "/month",
    description: "Complete solution for large institutions",
    features: [
      "Unlimited students",
      "Unlimited staff",
      "All modules included",
      "Multi-branch support",
      "Custom branding",
      "API access",
      "Dedicated account manager",
      "24/7 phone support",
      "Data backup & recovery",
    ],
    popular: false,
    active: true,
    icon: "crown",
    color: "from-amber-500 to-orange-600",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  zap: <Zap className="w-6 h-6" />,
  star: <Star className="w-6 h-6" />,
  crown: <Crown className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
};

export default function PricingPlans() {
  const [plans, setPlans] = useState<Plan[]>(defaultPlans);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    period: "/month",
    description: "",
    features: "",
    popular: false,
    active: true,
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      name: "",
      price: "",
      period: "/month",
      description: "",
      features: "",
      popular: false,
      active: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditing(plan);
    setForm({
      name: plan.name,
      price: plan.price,
      period: plan.period,
      description: plan.description,
      features: plan.features.join("\n"),
      popular: plan.popular,
      active: plan.active,
    });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.name || !form.price) {
      toast.error("Name and price required");
      return;
    }
    const features = form.features.split("\n").filter((f) => f.trim());
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-violet-500 to-purple-600",
      "from-amber-500 to-orange-600",
      "from-emerald-500 to-teal-600",
    ];
    const icons = ["zap", "star", "crown", "sparkles"];

    if (editing) {
      setPlans((p) =>
        p.map((pl) =>
          pl.id === editing.id ? { ...pl, ...form, features } : pl
        )
      );
      toast.success("Plan updated");
    } else {
      setPlans((p) => [
        ...p,
        {
          id: Date.now().toString(),
          ...form,
          features,
          icon: icons[p.length % icons.length],
          color: colors[p.length % colors.length],
        },
      ]);
      toast.success("Plan created");
    }
    setDialogOpen(false);
  };

  const deletePlan = (id: string) => {
    setPlans((p) => p.filter((pl) => pl.id !== id));
    toast.success("Plan deleted");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Pricing Plans
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage subscription plans for your school ERP
          </p>
        </div>

        <Button
          onClick={openNew}
          className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Plan
        </Button>
      </div>

      {/* Cards */}
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl 
            bg-white/70 dark:bg-white/5 backdrop-blur-xl
            ${plan.popular ? "ring-2 ring-indigo-500 scale-[1.04] shadow-xl" : ""}
          `}
          >
            {/* Glow Background */}
            <div
              className={`absolute inset-0 opacity-10 bg-gradient-to-br ${plan.color}`}
            />

            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
                ⭐ Most Popular
              </div>
            )}

            {/* Top Gradient Line */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${plan.color}`} />

            <CardHeader className="text-center pb-3 relative z-10">
              {/* Icon */}
              <div
                className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mb-4 shadow-lg`}
              >
                {iconMap[plan.icon]}
              </div>

              <CardTitle className="text-xl font-semibold">
                {plan.name}
              </CardTitle>

              <p className="text-muted-foreground text-xs">
                {plan.description}
              </p>

              {/* Price */}
              <div className="pt-3">
                <span className="text-4xl font-extrabold tracking-tight">
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-sm ml-1">
                  {plan.period}
                </span>
              </div>

              {/* Status */}
              <div className="flex justify-center pt-2">
                <Badge
                  className={`${
                    plan.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {plan.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="relative z-10">
              {/* Features */}
              <ul className="space-y-3 mb-5">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <div className="p-1 rounded-full bg-green-100">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1 hover:bg-indigo-50"
                  onClick={() => openEdit(plan)}
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:bg-red-50 gap-1"
                  onClick={() => deletePlan(plan.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog (kept clean + modern) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editing ? "Edit Plan" : "Create New Plan"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Plan Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Professional"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <Input
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label>Period</Label>
                <Input
                  value={form.period}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, period: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            <div>
              <Label>Features</Label>
              <Textarea
                value={form.features}
                onChange={(e) =>
                  setForm((f) => ({ ...f, features: e.target.value }))
                }
                rows={5}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.popular}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, popular: v }))
                  }
                />
                <Label>Popular</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={form.active}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, active: v }))
                  }
                />
                <Label>Active</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={()=>save()} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                {editing ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}