/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IndianRupeeIcon,
  Globe,
  Plus,
  Pencil,
  Trash2,
  Search,
  Star,
  Check,
  User,
  Shield,
  Database,
  Upload,
  Key,
  Monitor,
  EyeOff,
  Eye,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { Textarea } from "@/components/ui/textarea";

// ─── Mock Data ────────────────────────────────────────────────────
interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
  status: "active" | "inactive";
}

interface Language {
  id: number;
  name: string;
  code: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  isDefault: boolean;
  status: "active" | "inactive";
}

// ─── API Keys Tab ─────────────────────────────────────────────────
interface ApiKey {
  id: number;
  provider: string;
  label: string;
  keyType: "public" | "secret";
  value: string;
  status: "active" | "inactive";
  lastUpdated: string;
}

const initialApiKeys: ApiKey[] = [
  {
    id: 1,
    provider: "Razorpay",
    label: "Razorpay Key ID",
    keyType: "public",
    value: "rzp_live_xxxxxxxxxxxxxxx",
    status: "active",
    lastUpdated: "2026-03-10",
  },
  {
    id: 2,
    provider: "Razorpay",
    label: "Razorpay Key Secret",
    keyType: "secret",
    value: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
    status: "active",
    lastUpdated: "2026-03-10",
  },
  {
    id: 3,
    provider: "Stripe",
    label: "Stripe Publishable Key",
    keyType: "public",
    value: "pk_live_xxxxxxxxxxxxxxx",
    status: "inactive",
    lastUpdated: "2026-02-20",
  },
  {
    id: 4,
    provider: "Stripe",
    label: "Stripe Secret Key",
    keyType: "secret",
    value: "sk_live_xxxxxxxxxxxxxxx",
    status: "inactive",
    lastUpdated: "2026-02-20",
  },
  {
    id: 5,
    provider: "PayU",
    label: "PayU Merchant Key",
    keyType: "public",
    value: "xxxxxxxx",
    status: "inactive",
    lastUpdated: "2026-01-15",
  },
];

const initialCurrencies: Currency[] = [
  {
    id: 1,
    name: "Indian Rupee",
    code: "INR",
    symbol: "₹",
    exchangeRate: 1,
    isDefault: true,
    status: "active",
  },
  {
    id: 2,
    name: "US Dollar",
    code: "USD",
    symbol: "$",
    exchangeRate: 0.012,
    isDefault: false,
    status: "active",
  },
  {
    id: 3,
    name: "Euro",
    code: "EUR",
    symbol: "€",
    exchangeRate: 0.011,
    isDefault: false,
    status: "active",
  },
  {
    id: 4,
    name: "British Pound",
    code: "GBP",
    symbol: "£",
    exchangeRate: 0.0095,
    isDefault: false,
    status: "active",
  },
  {
    id: 5,
    name: "Japanese Yen",
    code: "JPY",
    symbol: "¥",
    exchangeRate: 1.79,
    isDefault: false,
    status: "inactive",
  },
  {
    id: 6,
    name: "UAE Dirham",
    code: "AED",
    symbol: "د.إ",
    exchangeRate: 0.044,
    isDefault: false,
    status: "active",
  },
  {
    id: 7,
    name: "Saudi Riyal",
    code: "SAR",
    symbol: "﷼",
    exchangeRate: 0.045,
    isDefault: false,
    status: "inactive",
  },
  {
    id: 8,
    name: "Canadian Dollar",
    code: "CAD",
    symbol: "C$",
    exchangeRate: 0.016,
    isDefault: false,
    status: "active",
  },
];

const initialLanguages: Language[] = [
  {
    id: 1,
    name: "English",
    code: "en",
    nativeName: "English",
    direction: "ltr",
    isDefault: true,
    status: "active",
  },
  {
    id: 2,
    name: "Hindi",
    code: "hi",
    nativeName: "हिन्दी",
    direction: "ltr",
    isDefault: false,
    status: "active",
  },
  {
    id: 3,
    name: "Tamil",
    code: "ta",
    nativeName: "தமிழ்",
    direction: "ltr",
    isDefault: false,
    status: "active",
  },
  {
    id: 4,
    name: "Telugu",
    code: "te",
    nativeName: "తెలుగు",
    direction: "ltr",
    isDefault: false,
    status: "active",
  },
  {
    id: 5,
    name: "Arabic",
    code: "ar",
    nativeName: "العربية",
    direction: "rtl",
    isDefault: false,
    status: "active",
  },
  {
    id: 6,
    name: "Urdu",
    code: "ur",
    nativeName: "اردو",
    direction: "rtl",
    isDefault: false,
    status: "inactive",
  },
  {
    id: 7,
    name: "Marathi",
    code: "mr",
    nativeName: "मराठी",
    direction: "ltr",
    isDefault: false,
    status: "active",
  },
  {
    id: 8,
    name: "Bengali",
    code: "bn",
    nativeName: "বাংলা",
    direction: "ltr",
    isDefault: false,
    status: "inactive",
  },
  {
    id: 9,
    name: "Gujarati",
    code: "gu",
    nativeName: "ગુજરાતી",
    direction: "ltr",
    isDefault: false,
    status: "active",
  },
  {
    id: 10,
    name: "Kannada",
    code: "kn",
    nativeName: "ಕನ್ನಡ",
    direction: "ltr",
    isDefault: false,
    status: "inactive",
  },
];

// ─── Currency Tab ─────────────────────────────────────────────────
function CurrencyTab() {
  const { toast } = useToast();
  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Currency | null>(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    symbol: "",
    exchangeRate: "1",
    status: "active" as "active" | "inactive",
  });

  const filtered = currencies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setEditItem(null);
    setForm({
      name: "",
      code: "",
      symbol: "",
      exchangeRate: "1",
      status: "active",
    });
    setDialogOpen(true);
  };

  const openEdit = (c: Currency) => {
    setEditItem(c);
    setForm({
      name: c.name,
      code: c.code,
      symbol: c.symbol,
      exchangeRate: String(c.exchangeRate),
      status: c.status,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.code || !form.symbol) return;
    if (editItem) {
      setCurrencies((prev) =>
        prev.map((c) =>
          c.id === editItem.id
            ? {
                ...c,
                ...form,
                exchangeRate: parseFloat(form.exchangeRate) || 1,
              }
            : c,
        ),
      );
      toast({
        title: "Currency updated",
        description: `${form.name} has been updated.`,
      });
    } else {
      const newId = Math.max(...currencies.map((c) => c.id)) + 1;
      setCurrencies((prev) => [
        ...prev,
        {
          id: newId,
          ...form,
          exchangeRate: parseFloat(form.exchangeRate) || 1,
          isDefault: false,
        },
      ]);
      toast({
        title: "Currency added",
        description: `${form.name} has been added.`,
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    const c = currencies.find((x) => x.id === id);
    if (c?.isDefault)
      return toast({
        title: "Cannot delete",
        description: "Default currency cannot be deleted.",
        variant: "destructive",
      });
    setCurrencies((prev) => prev.filter((x) => x.id !== id));
    toast({ title: "Deleted", description: "Currency removed." });
  };

  const setDefault = (id: number) => {
    setCurrencies((prev) =>
      prev.map((c) => ({ ...c, isDefault: c.id === id })),
    );
    toast({ title: "Default updated" });
  };

  return (
    <div className="space-y-6">

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* TOTAL */}
        <Card className="border-0 shadow-md rounded-2xl hover:shadow-xl transition">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow">
              <IndianRupeeIcon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{currencies.length}</p>
              <p className="text-sm text-muted-foreground">Total Currencies</p>
            </div>
          </CardContent>
        </Card>

        {/* ACTIVE */}
        <Card className="border-0 shadow-md rounded-2xl hover:shadow-xl transition">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow">
              <Check size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {currencies.filter((c) => c.status === "active").length}
              </p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>

        {/* DEFAULT */}
        <Card className="border-0 shadow-md rounded-2xl hover:shadow-xl transition">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow">
              <Star size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {currencies.find((c) => c.isDefault)?.code ?? "—"}
              </p>
              <p className="text-sm text-muted-foreground">Default Currency</p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* TOOLBAR */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-3">

            {/* SEARCH */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search currencies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl bg-gray-50 focus:bg-white transition"
              />
            </div>

            {/* ADD BUTTON */}
            <Button
              onClick={openAdd}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow hover:opacity-90"
            >
              <Plus size={16} /> Add Currency
            </Button>

          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardContent className="pt-6 overflow-x-auto">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Default</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="hover:bg-gray-50 transition">

                  <TableCell className="font-medium">{c.name}</TableCell>

                  <TableCell>
                    <Badge className="bg-indigo-100 text-indigo-700 border-0">
                      {c.code}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-lg">{c.symbol}</TableCell>

                  <TableCell>{c.exchangeRate}</TableCell>

                  <TableCell>
                    <Badge
                      className={
                        c.status === "active"
                          ? "bg-green-100 text-green-700 border-0"
                          : "bg-red-100 text-red-600 border-0"
                      }
                    >
                      {c.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {c.isDefault ? (
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    ) : (
                      <button
                        onClick={() => setDefault(c.id)}
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        Set Default
                      </button>
                    )}
                  </TableCell>

                  <TableCell className="text-right space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-indigo-50"
                      onClick={() => openEdit(c)}
                    >
                      <Pencil size={14} />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-red-50 text-red-500"
                      onClick={() => handleDelete(c.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>

                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No currencies found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

        </CardContent>
      </Card>

      {/* DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl border-0 shadow-2xl">

          <DialogHeader>
            <DialogTitle>
              {editItem ? "Edit Currency" : "Add Currency"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Currency Name"
                className="rounded-xl bg-gray-50"
              />
              <Input
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
                placeholder="Code"
                className="rounded-xl bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                value={form.symbol}
                onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                placeholder="Symbol"
                className="rounded-xl bg-gray-50"
              />
              <Input
                type="number"
                value={form.exchangeRate}
                onChange={(e) =>
                  setForm({ ...form, exchangeRate: e.target.value })
                }
                className="rounded-xl bg-gray-50"
              />
            </div>

            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm({ ...form, status: v as "active" | "inactive" })
              }
            >
              <SelectTrigger className="rounded-xl bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

          </div>

          <DialogFooter>
            <Button variant="outline" className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl">
              {editItem ? "Update" : "Add"}
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

    </div>
  );
}

// ─── Language Tab ─────────────────────────────────────────────────
function LanguageTab() {
  const { toast } = useToast();
  const [languages, setLanguages] = useState<Language[]>(initialLanguages);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Language | null>(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    nativeName: "",
    direction: "ltr" as "ltr" | "rtl",
    status: "active" as "active" | "inactive",
  });

  const filtered = languages.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.includes(search),
  );

  const openAdd = () => {
    setEditItem(null);
    setForm({
      name: "",
      code: "",
      nativeName: "",
      direction: "ltr",
      status: "active",
    });
    setDialogOpen(true);
  };

  const openEdit = (l: Language) => {
    setEditItem(l);
    setForm({
      name: l.name,
      code: l.code,
      nativeName: l.nativeName,
      direction: l.direction,
      status: l.status,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.code) return;
    if (editItem) {
      setLanguages((prev) =>
        prev.map((l) => (l.id === editItem.id ? { ...l, ...form } : l)),
      );
      toast({
        title: "Language updated",
        description: `${form.name} has been updated.`,
      });
    } else {
      const newId = Math.max(...languages.map((l) => l.id)) + 1;
      setLanguages((prev) => [
        ...prev,
        { id: newId, ...form, isDefault: false },
      ]);
      toast({
        title: "Language added",
        description: `${form.name} has been added.`,
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    const l = languages.find((x) => x.id === id);
    if (l?.isDefault)
      return toast({
        title: "Cannot delete",
        description: "Default language cannot be deleted.",
        variant: "destructive",
      });
    setLanguages((prev) => prev.filter((x) => x.id !== id));
    toast({ title: "Deleted", description: "Language removed." });
  };

  const { setLang } = useLanguage();

  const setDefault = (id: number) => {
    setLanguages((prev) => prev.map((l) => ({ ...l, isDefault: l.id === id })));
    const selected = languages.find((l) => l.id === id);
    if (selected) {
      // update global language so UI switches immediately
      setLang(selected.code as any);
    }
    toast({ title: "Default updated" });
  };

  const toggleStatus = (id: number) => {
    setLanguages((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: l.status === "active" ? "inactive" : "active" }
          : l,
      ),
    );
  };

  return (
    <div className="space-y-6">

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Card className="border-0 shadow-md rounded-2xl hover:shadow-xl transition">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow">
              <Globe size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{languages.length}</p>
              <p className="text-sm text-muted-foreground">Total Languages</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl hover:shadow-xl transition">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center shadow">
              <Check size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {languages.filter((l) => l.status === "active").length}
              </p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl hover:shadow-xl transition">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center shadow">
              <Star size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {languages.find((l) => l.isDefault)?.name ?? "—"}
              </p>
              <p className="text-sm text-muted-foreground">Default</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl hover:shadow-xl transition">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center shadow">
              <Globe size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {languages.filter((l) => l.direction === "rtl").length}
              </p>
              <p className="text-sm text-muted-foreground">RTL</p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* TOOLBAR */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-3">

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search languages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl bg-gray-50 focus:bg-white transition"
              />
            </div>

            <Button
              onClick={openAdd}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow hover:opacity-90"
            >
              <Plus size={16} /> Add Language
            </Button>

          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardContent className="pt-6 overflow-x-auto">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Language</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Native</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Default</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id} className="hover:bg-gray-50 transition">

                  <TableCell className="font-medium">{l.name}</TableCell>

                  <TableCell>
                    <Badge className="bg-indigo-100 text-indigo-700 border-0">
                      {l.code}
                    </Badge>
                  </TableCell>

                  <TableCell className="font-medium">{l.nativeName}</TableCell>

                  <TableCell>
                    <Badge
                      className={
                        l.direction === "rtl"
                          ? "bg-purple-100 text-purple-700 border-0"
                          : "bg-gray-100 text-gray-700 border-0"
                      }
                    >
                      {l.direction.toUpperCase()}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Switch
                      checked={l.status === "active"}
                      onCheckedChange={() => toggleStatus(l.id)}
                    />
                  </TableCell>

                  <TableCell>
                    {l.isDefault ? (
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    ) : (
                      <button
                        onClick={() => setDefault(l.id)}
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        Set Default
                      </button>
                    )}
                  </TableCell>

                  <TableCell className="text-right space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-indigo-50"
                      onClick={() => openEdit(l)}
                    >
                      <Pencil size={14} />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-red-50 text-red-500"
                      onClick={() => handleDelete(l.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>

                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No languages found
                  </TableCell>
                </TableRow>
              )}

            </TableBody>
          </Table>

        </CardContent>
      </Card>

      {/* DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl border-0 shadow-2xl">

          <DialogHeader>
            <DialogTitle>
              {editItem ? "Edit Language" : "Add Language"}
            </DialogTitle>
            <DialogDescription>
              Fill in the language details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Language Name"
                className="rounded-xl bg-gray-50"
              />
              <Input
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toLowerCase() })
                }
                placeholder="Code"
                className="rounded-xl bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                value={form.nativeName}
                onChange={(e) =>
                  setForm({ ...form, nativeName: e.target.value })
                }
                placeholder="Native Name"
                className="rounded-xl bg-gray-50"
              />
              <Select
                value={form.direction}
                onValueChange={(v) =>
                  setForm({ ...form, direction: v as "ltr" | "rtl" })
                }
              >
                <SelectTrigger className="rounded-xl bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ltr">LTR</SelectItem>
                  <SelectItem value="rtl">RTL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm({ ...form, status: v as "active" | "inactive" })
              }
            >
              <SelectTrigger className="rounded-xl bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

          </div>

          <DialogFooter>
            <Button variant="outline" className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl">
              {editItem ? "Update" : "Add"}
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

    </div>
  );
}

function ApiKeysTab() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<ApiKey | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set());
  const [form, setForm] = useState({
    provider: "",
    label: "",
    keyType: "public" as "public" | "secret",
    value: "",
    status: "active" as "active" | "inactive",
  });

  const filtered = apiKeys.filter(
    (k) =>
      k.provider.toLowerCase().includes(search.toLowerCase()) ||
      k.label.toLowerCase().includes(search.toLowerCase()),
  );

  const providers = [...new Set(apiKeys.map((k) => k.provider))];

  const toggleVisibility = (id: number) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const maskValue = (val: string) => {
    if (val.length <= 8) return "••••••••";
    return val.slice(0, 4) + "••••••••" + val.slice(-4);
  };

  const copyToClipboard = (val: string) => {
    navigator.clipboard.writeText(val);
    toast({ title: "Copied", description: "API key copied to clipboard." });
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({
      provider: "",
      label: "",
      keyType: "public",
      value: "",
      status: "active",
    });
    setDialogOpen(true);
  };

  const openEdit = (k: ApiKey) => {
    setEditItem(k);
    setForm({
      provider: k.provider,
      label: k.label,
      keyType: k.keyType,
      value: k.value,
      status: k.status,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.provider || !form.label || !form.value) return;
    const today = new Date().toISOString().split("T")[0];
    if (editItem) {
      setApiKeys((prev) =>
        prev.map((k) =>
          k.id === editItem.id ? { ...k, ...form, lastUpdated: today } : k,
        ),
      );
      toast({
        title: "API Key updated",
        description: `${form.label} has been updated.`,
      });
    } else {
      const newId = Math.max(...apiKeys.map((k) => k.id), 0) + 1;
      setApiKeys((prev) => [
        ...prev,
        { id: newId, ...form, lastUpdated: today },
      ]);
      toast({
        title: "API Key added",
        description: `${form.label} has been added.`,
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    toast({ title: "Deleted", description: "API key removed." });
  };

  const toggleStatus = (id: number) => {
    setApiKeys((prev) =>
      prev.map((k) =>
        k.id === id
          ? { ...k, status: k.status === "active" ? "inactive" : "active" }
          : k,
      ),
    );
  };

return (
  <div className="space-y-6">

    {/* SUMMARY CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      <Card className="border-0 shadow-md rounded-2xl hover:shadow-xl transition">
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow">
            <Key size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold">{apiKeys.length}</p>
            <p className="text-sm text-muted-foreground">Total Keys</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md rounded-2xl hover:shadow-xl transition">
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center shadow">
            <Check size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {apiKeys.filter((k) => k.status === "active").length}
            </p>
            <p className="text-sm text-muted-foreground">Active Keys</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md rounded-2xl hover:shadow-xl transition">
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {apiKeys.filter((k) => k.keyType === "secret").length}
            </p>
            <p className="text-sm text-muted-foreground">Secret Keys</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md rounded-2xl hover:shadow-xl transition">
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center shadow">
            <Globe size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold">{providers.length}</p>
            <p className="text-sm text-muted-foreground">Providers</p>
          </div>
        </CardContent>
      </Card>

    </div>

    {/* TOOLBAR */}
    <Card className="border-0 shadow-md rounded-2xl">
      <CardContent className="pt-6 flex flex-col sm:flex-row justify-between gap-3">

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search API keys..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-gray-50 focus:bg-white transition"
          />
        </div>

        <Button
          onClick={openAdd}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow hover:opacity-90"
        >
          <Plus size={16} /> Add API Key
        </Button>

      </CardContent>
    </Card>

    {/* PROVIDERS */}
    {providers
      .filter((p) => filtered.some((k) => k.provider === p))
      .map((provider) => (
        <Card key={provider} className="border-0 shadow-md rounded-2xl">

          {/* Provider Header */}
          <CardHeader className="pb-3 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-2 h-6 rounded bg-gradient-to-b from-indigo-500 to-purple-500" />
                {provider}
              </CardTitle>
              <Badge className="bg-green-100 text-green-700 border-0">
                {
                  apiKeys.filter(
                    (k) => k.provider === provider && k.status === "active",
                  ).length
                } Active
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="overflow-x-auto">

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered
                  .filter((k) => k.provider === provider)
                  .map((k) => (
                    <TableRow key={k.id} className="hover:bg-gray-50 transition">

                      <TableCell className="font-medium">{k.label}</TableCell>

                      <TableCell>
                        <Badge
                          className={
                            k.keyType === "secret"
                              ? "bg-red-100 text-red-600 border-0"
                              : "bg-indigo-100 text-indigo-700 border-0"
                          }
                        >
                          {k.keyType}
                        </Badge>
                      </TableCell>

                      {/* KEY DISPLAY */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-black text-green-400 px-2 py-1 rounded font-mono">
                            {visibleKeys.has(k.id)
                              ? k.value
                              : maskValue(k.value)}
                          </code>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-gray-100"
                            onClick={() => toggleVisibility(k.id)}
                          >
                            {visibleKeys.has(k.id) ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-gray-100"
                            onClick={() => copyToClipboard(k.value)}
                          >
                            <Copy size={14} />
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Switch
                          checked={k.status === "active"}
                          onCheckedChange={() => toggleStatus(k.id)}
                        />
                      </TableCell>

                      <TableCell className="text-muted-foreground text-sm">
                        {k.lastUpdated}
                      </TableCell>

                      <TableCell className="text-right space-x-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-indigo-50"
                          onClick={() => openEdit(k)}
                        >
                          <Pencil size={14} />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-red-50 text-red-500"
                          onClick={() => handleDelete(k.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TableCell>

                    </TableRow>
                  ))}
              </TableBody>
            </Table>

          </CardContent>
        </Card>
      ))}

    {filtered.length === 0 && (
      <Card className="border-0 shadow-md rounded-2xl">
        <CardContent className="py-10 text-center text-muted-foreground">
          No API keys found
        </CardContent>
      </Card>
    )}

    {/* DIALOG */}
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="rounded-2xl border-0 shadow-2xl">

        <DialogHeader>
          <DialogTitle>
            {editItem ? "Edit API Key" : "Add API Key"}
          </DialogTitle>
          <DialogDescription>
            Securely manage your API credentials.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <Input
              value={form.provider}
              onChange={(e) =>
                setForm({ ...form, provider: e.target.value })
              }
              placeholder="Provider"
              className="rounded-xl bg-gray-50"
            />
            <Input
              value={form.label}
              onChange={(e) =>
                setForm({ ...form, label: e.target.value })
              }
              placeholder="Label"
              className="rounded-xl bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              value={form.keyType}
              onValueChange={(v) =>
                setForm({ ...form, keyType: v as "public" | "secret" })
              }
            >
              <SelectTrigger className="rounded-xl bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="secret">Secret</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm({ ...form, status: v as "active" | "inactive" })
              }
            >
              <SelectTrigger className="rounded-xl bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            placeholder="Paste API key..."
            className="rounded-xl bg-gray-50 font-mono"
          />

        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl">
            {editItem ? "Update" : "Add"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>

  </div>
);
}

// ─── Main Page ────────────────────────────────────────────────────
export default function SystemSettingsPage() {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const defaultTab = path.includes("/settings/language")
    ? "language"
    : "currency";

  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleSaveProfile = () => {
    toast.success("Profile settings saved successfully");
  };

  const handleSaveSecurity = () => {
    toast.success("Security settings updated");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold">Settings Dashboard</h1>
            <p className="text-sm opacity-90 mt-1">
              Manage your account, system preferences, and configurations
            </p>
          </div>

          {/* glow effect */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="bg-gradient-to-r from-gray-100 to-gray-200 p-1 rounded-xl shadow-inner">
            <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="currency" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all">
              <IndianRupeeIcon size={14} /> Currency
            </TabsTrigger>
            <TabsTrigger value="language" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all">
              <Globe size={14} /> Language
            </TabsTrigger>

            <TabsTrigger value="system" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all">
              <Database className="w-4 h-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all">
              <Key size={14} /> API Keys
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">

            <Card className="border-0 rounded-2xl shadow-lg overflow-hidden">

              {/* Gradient Header */}
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <p className="text-sm opacity-90">
                  Update your personal information and profile picture
                </p>
              </div>

              <CardContent className="space-y-8 p-6">

                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6">

                  {/* Avatar with ring */}
                  <div className="relative">
                    <Avatar className="w-24 h-24 ring-4 ring-indigo-100 shadow-md">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                      <AvatarFallback className="text-xl bg-indigo-100 text-indigo-600">
                        JD
                      </AvatarFallback>
                    </Avatar>

                    {/* small edit indicator */}
                    <div className="absolute bottom-0 right-0 bg-indigo-500 text-white p-1 rounded-full shadow">
                      <Upload className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="space-y-2 text-center sm:text-left">
                    <Button
                      variant="outline"
                      className="gap-2 rounded-xl border-indigo-200 hover:bg-indigo-50"
                    >
                      <Upload className="w-4 h-4" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Personal Info */}
                <div className="grid gap-5 md:grid-cols-2">

                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      defaultValue="John"
                      className="rounded-xl bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      defaultValue="Doe"
                      className="rounded-xl bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      defaultValue="john.doe@eduadmin.com"
                      className="rounded-xl bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="rounded-xl bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Role</Label>
                    <Input
                      defaultValue="Super Admin"
                      disabled
                      className="rounded-xl bg-gray-100 text-gray-500"
                    />
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center pt-4 border-t">

                  <p className="text-sm text-muted-foreground">
                    Last updated just now
                  </p>

                  <Button
                    onClick={handleSaveProfile}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl px-6 shadow-md hover:opacity-90"
                  >
                    Save Changes
                  </Button>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">

            {/* PASSWORD CARD */}
            <Card className="border-0 rounded-2xl shadow-lg overflow-hidden">

              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
                <h2 className="text-xl font-semibold">Password & Authentication</h2>
                <p className="text-sm opacity-90">
                  Manage your password and security settings
                </p>
              </div>

              <CardContent className="space-y-8 p-6">

                {/* Password Inputs */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="rounded-xl bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="rounded-xl bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="rounded-xl bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 2FA SECTION */}
                <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-sm transition">

                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow">
                      <Key className="w-5 h-5" />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                  />
                </div>

                {/* ACTION */}
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleSaveSecurity}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl px-6 shadow-md hover:opacity-90"
                  >
                    Update Password
                  </Button>
                </div>

              </CardContent>
            </Card>

            {/* SESSIONS CARD */}
            <Card className="border-0 rounded-2xl shadow-lg overflow-hidden">

              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
                <h2 className="text-xl font-semibold">Active Sessions</h2>
                <p className="text-sm opacity-90">
                  Manage your active login sessions
                </p>
              </div>

              <CardContent className="space-y-4 p-6">

                {[
                  {
                    device: "MacBook Pro",
                    location: "New York, US",
                    current: true,
                    time: "Active now",
                  },
                  {
                    device: "iPhone 14",
                    location: "New York, US",
                    current: false,
                    time: "2 hours ago",
                  },
                  {
                    device: "Windows PC",
                    location: "Boston, US",
                    current: false,
                    time: "3 days ago",
                  },
                ].map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-white border hover:shadow-md transition-all"
                  >

                    <div className="flex items-center gap-4">

                      {/* Device Icon */}
                      <div className="p-2 rounded-lg bg-gray-100">
                        <Monitor className="w-5 h-5 text-gray-600" />
                      </div>

                      <div>
                        <p className="font-medium text-gray-800 flex items-center gap-2">
                          {session.device}

                          {session.current && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {session.location} • {session.time}
                        </p>
                      </div>
                    </div>

                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}

              </CardContent>
            </Card>

          </TabsContent>

          {/* Currency Settings */}
          <TabsContent value="currency" className="space-y-6">
            <CurrencyTab />
          </TabsContent>

          {/* Language Settings */}
          <TabsContent value="language" className="space-y-6">
            <LanguageTab />
          </TabsContent>
          <TabsContent value="api-keys" className="space-y-6">
            <ApiKeysTab />
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">

            <Card className="border-0 rounded-2xl shadow-lg overflow-hidden">

              {/* HEADER */}
              <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 p-6 text-white">
                <h2 className="text-xl font-semibold">System Configuration</h2>
                <p className="text-sm opacity-90">
                  Configure system-wide settings for your institution
                </p>
              </div>

              <CardContent className="space-y-8 p-6">

                {/* FORM SECTION */}
                <div className="grid gap-5 md:grid-cols-2">

                  <div className="space-y-2">
                    <Label>Institution Name</Label>
                    <Input
                      defaultValue="EduAdmin Academy"
                      className="rounded-xl bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Institution Code</Label>
                    <Input
                      defaultValue="EDU-001"
                      className="rounded-xl bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Current Academic Year</Label>
                    <Select defaultValue="2024-25">
                      <SelectTrigger className="rounded-xl bg-gray-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-24">2023-2024</SelectItem>
                        <SelectItem value="2024-25">2024-2025</SelectItem>
                        <SelectItem value="2025-26">2025-2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger className="rounded-xl bg-gray-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </div>

                <Separator />

                {/* STORAGE SECTION */}
                <div className="space-y-4">

                  <h4 className="font-semibold text-gray-800">Data & Storage</h4>

                  <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border border-blue-100 shadow-sm space-y-4">

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Storage Used</span>
                      <span className="font-semibold text-gray-800">
                        2.4 GB / 10 GB
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: "24%" }}
                      />
                    </div>

                    {/* Extra Info */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Available: 7.6 GB</span>
                      <span>24% used</span>
                    </div>

                  </div>

                </div>

                {/* ACTION BAR */}
                <div className="flex justify-between items-center pt-4 border-t">

                  <p className="text-sm text-muted-foreground">
                    Last updated just now
                  </p>

                  <div className="flex gap-3">

                    <Button
                      variant="outline"
                      className="rounded-xl border-blue-200 hover:bg-blue-50"
                    >
                      Export Data
                    </Button>

                    <Button
                      className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl px-6 shadow-md hover:opacity-90"
                    >
                      Save Settings
                    </Button>

                  </div>
                </div>

              </CardContent>
            </Card>

          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
