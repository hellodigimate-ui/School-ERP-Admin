/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/rules-of-hooks */
"use client"


import { useEffect, useState } from "react";
import { Save, RotateCcw, UserPlus, Camera, ChevronDown, ChevronUp, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { Switch } from "@/components/ui/switch";

const categories = [
  "General", 
  "OBC", 
  "SC", 
  "ST", 
  "EWS", 
  "Other"
];

const bloodGroups = [
  "A+", 
  "A-", 
  "B+", 
  "B-", 
  "AB+", 
  "AB-", 
  "O+", 
  "O-"
];

const houses = [
  "Red House", 
  "Blue House", 
  "Green House", 
  "Yellow House"
];

const genders = [
  "Male", 
  "Female", 
  "Other"
];

interface StudentForm {
  admissionNumber: string;
  admissionDate: string;
  branch: string;
  className: string;
  sectionId: string;
  name: string;
  email: string;
  rollNumber: string;
  password: string;
  gender: string;
  dateOfBirth: string;
  category: string;
  phone: string;
  bloodGroup: string;
  house: string;
  height: string;
  weight: string;
  currentAddress: string;
  permanentAddress: string;
  sameAsCurrent: boolean;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  parentEmail: string;
  parentPassword: string;
  guardianName: string;
  guardianPhone: string;
  fatherOccupation: string;
  motherOccupation: string;
  guardianRelation: string;

  // ✅ New Fields (Documents Info)
  apaarId: string;
  rteNumber: string;
  penNumber: string;

  // Fees
  admissionFee: number;
  tutionFee: number;
  transportFee: number;
  hostelFee: number;
  otherFee: number;
  discountType: string;
  discountValue: string;
  installments: number;
  dueDate: string;
}

const installmentTypes = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

const Page = () => {
  const { toast } = useToast();
  const [showPrevSchool, setShowPrevSchool] = useState(false);
  const [parentEmail, setParentEmail] = useState("");
  const [siblingData, setSiblingData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [branchList, setBranchList] = useState<any[]>([]);
  const [classList, setClassList] = useState<any[]>([]);
  const [sectionList, setSectionList] = useState<any[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [feeLoading, setFeeLoading] = useState(false);
  const [discountTypes, setDiscountTypes] = useState<any[]>([]);
  const [documents, setDocuments] = useState({
    aadhaarFront: null as File | null,
    aadhaarBack: null as File | null,
  });
  const [extraDiscounts, setExtraDiscounts] = useState({
    sibling: 0,
    scholarship: 0,
    sports: 0,
    staff: 0,
    manual: 0,
  });

const [formData, setFormData] = useState<StudentForm>({
  admissionNumber: "",
  admissionDate: "",
  branch: "",
  className: "",
  sectionId: "",
  name: "",
  email: "",
  rollNumber: "",
  password: "",
  gender: "",
  dateOfBirth: "",
  category: "",
  phone: "",
  bloodGroup: "",
  house: "",
  height: "",
  weight: "",
  currentAddress: "",
  permanentAddress: "",
  sameAsCurrent : false,
  fatherName: "",
  fatherPhone: "",
  motherName: "",
  motherPhone: "",
  parentEmail: "",
  parentPassword: "",
  guardianName: "",
  guardianPhone: "",
  fatherOccupation: "",
  motherOccupation: "",
  guardianRelation: "",

  // ✅ New Fields (Documents Info)
  apaarId: "",
  rteNumber: "",
  penNumber: "",

  // Fees
  admissionFee: 0,
  tutionFee: 0,
  transportFee: 0,
  hostelFee: 0,
  otherFee: 0,
  discountType: "",
  discountValue: "",
  installments: 1,
  dueDate: "",
});

useEffect(() => {
  console.log("Form Data Updated:", formData);
}, [formData]);


const fetchBranches = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/branches", {
      params: { page: 1, perPage: 100 },
    });

    setBranchList(res.data.data);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to load branches",
      variant: "destructive",
    });
  }
};

const fetchClasses = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/classes");

    setClassList(res.data.data);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to load classes",
      variant: "destructive",
    });
  }
};

const fetchSections = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/sections");

    setSectionList(res.data.data);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to load sections",
      variant: "destructive",
    });
  }
};


useEffect(() => {
  fetchBranches();
  fetchClasses();
  fetchSections();
}, []);


const totalFees =
Number(formData.admissionFee || 0) +
Number(formData.tutionFee || 0) +
Number(formData.transportFee || 0) +
Number(formData.hostelFee || 0) +
Number(formData.otherFee || 0);

const totalDiscountPercent =
  extraDiscounts.sibling +
  extraDiscounts.scholarship +
  extraDiscounts.sports +
  extraDiscounts.staff +
  extraDiscounts.manual;

const discountAmount = (totalFees * totalDiscountPercent) / 100;

const finalFee = totalFees - discountAmount;

const handleFeeChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]:
      name.includes("Fee") || name === "discountValue"
        ? Number(value)
        : value,
  }));
};

// Fake API check (replace with backend call)
const checkParentEmail = async (email: string) => {
  setParentEmail(email);

  if (!email) return;

  try {
    const res = await axiosInstance.get(
      `/api/v1/students/check-parent?email=${email}`
    );

    if (res.data.exists) {

      const data = res.data.data;
      const childrenCount = data.children.length;

      setSiblingData(data);

      let siblingDiscount = 0;

      if (childrenCount === 1) siblingDiscount = 10;
      else if (childrenCount === 2) siblingDiscount = 15;
      else if (childrenCount >= 3) siblingDiscount = 20;

      setExtraDiscounts((prev) => ({
        ...prev,
        sibling: siblingDiscount
      }));

    

      toast({
        title: "Sibling Detected",
        description: `${childrenCount} children enrolled. ${siblingDiscount}% sibling discount applied.`,
      });

    } else {
      setSiblingData(null);

      setExtraDiscounts((prev) => ({
        ...prev,
        sibling: 0
      }));
    }

  } catch (error: any) {
    setSiblingData(null);
  }
};

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;



  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.admissionNumber || !formData.name || !formData.phone) {
    toast({
      title: "⚠ Missing Required Fields",
      description: "Please fill all mandatory fields marked with *",
      variant: "destructive",
    });
    return;
  }

  try {
    setIsSubmitting(true);

    // 🔥 Loading Toast
    toast({
      title: "Saving Admission...",
      description: "Please wait while we process the data",
    });

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, String(value));
    });

    formDataToSend.append(
      "fees",
      JSON.stringify({
        admissionFee: Number(formData.admissionFee),
        tutionFee: Number(formData.tutionFee),
        transportFee: Number(formData.transportFee),
        hostelFee: Number(formData.hostelFee),
        otherFee: Number(formData.otherFee),
        discountType: formData.discountType,
        discountValue: totalDiscountPercent,
        installments: formData.installments,
        dueDate: formData.dueDate,
        totalFees,
        finalFee,
      })
    );

    if (photo) formDataToSend.append("photo", photo);
    if (documents.aadhaarFront) formDataToSend.append("aadhaarFront", documents.aadhaarFront);
    if (documents.aadhaarBack) formDataToSend.append("aadhaarBack", documents.aadhaarBack);

    const response = await axiosInstance.post(
      "/api/v1/students",
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast({
      title: "🎉 Admission Successful",
      description: `${formData.name} student admission admitted successfully`,
    });

    handleReset();

  } catch (error: any) {
    console.error("Submit Error:", error);

    let errorMessage = "Something went wrong";

    if (error?.response?.data) {
      const data = error.response.data;

      if (data.message) errorMessage = data.message;

      if (data.errors && typeof data.errors === "object") {
        const firstKey = Object.keys(data.errors)[0];
        errorMessage = `${firstKey}: ${data.errors[firstKey][0]}`;
      }
    }

    toast({
      title: "❌ Submission Failed",
      description: errorMessage,
      variant: "destructive",
    });

  } finally {
    setIsSubmitting(false);
  }
};

const fetchFeeStructure = async (branchId: string, classId: string) => {
  if (!branchId || !classId) return;

  try {
    setFeeLoading(true);

    const res = await axiosInstance.get("/api/v1/fees/structure", {
      params: {
        branchId,
        classId,
      },
    });

    const fee = res.data.data;

    setFormData((prev) => ({
      ...prev,
      admissionFee: fee.admissionFee || 0,
      tutionFee: fee.tutionFee || 0,
      transportFee: fee.transportFee || 0,
      hostelFee: fee.hostelFee || 0,
      otherFee: fee.otherFee || 0,
      dueDate: fee.dueDate || "",
      // ❌ REMOVED lateFinePerDay (was causing error)
    }));
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to load fee structure",
      variant: "destructive",
    });
  } finally {
    setFeeLoading(false);
  }
};

const fetchDiscounts = async () => {

  try {

    const res = await axiosInstance.get("/api/v1/discounts");

    setDiscountTypes(res.data.data.discounts);

  } catch (error) {

    toast({
      title: "Error",
      description: "Failed to load discounts",
      variant: "destructive",
    });

  }

};


useEffect(() => {

  if (formData.branch && formData.className) {
    fetchFeeStructure(formData.branch, formData.className);
  }

}, [formData.branch, formData.className]);

useEffect(() => {
  fetchDiscounts();
}, []);

const handleReset = () => {
  setFormData({
    admissionNumber: "",
    admissionDate: "",
    branch: "",
    className: "",
    sectionId: "",
    name: "",
    email: "",
    rollNumber: "",
    password: "",
    gender: "",
    dateOfBirth: "",
    category: "",
    phone: "",
    bloodGroup: "",
    house: "",
    height: "",
    weight: "",
    currentAddress: "",
    permanentAddress: "",
    sameAsCurrent: false,
    fatherName: "",
    fatherPhone: "",
    motherName: "",
    motherPhone: "",
    parentEmail: "",
    parentPassword: "",
    guardianName: "",
    guardianPhone: "",
    fatherOccupation: "",
    motherOccupation: "",
    guardianRelation: "",

    apaarId: "",
    rteNumber: "",
    penNumber: "",

    admissionFee: 0,
    tutionFee: 0,
    transportFee: 0,
    hostelFee: 0,
    otherFee: 0,
    discountType: "",
    discountValue: "",
    installments: 1,
    dueDate: "",
  });

  // ✅ reset files
  setPhoto(null);
  setDocuments({
    aadhaarFront: null,
    aadhaarBack: null,
  });
  setSiblingData(null);
};

  return (
    <AdminLayout>
      <div className="w-full overflow-x-hidden" >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      
          {/* Left Section */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Student Admission
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Register a new student into the system
            </p>
          </div>

          {/* Right Badge */}
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 px-4 py-2 text-xs flex items-center">
            <UserPlus className="w-4 h-4 mr-2" />
            New Admission
          </Badge>

        </div>

        <form id="admission-form" onSubmit={handleSubmit} className="space-y-5">
          
          {/* ================= Basic Info ================= */}
          <Card className="border border-border/40 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 py-4 px-6">
              <CardTitle className="text-sm font-semibold text-white tracking-wide uppercase">
                Basic Information
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Admission Number *</Label>
                <Input placeholder="ADM-2025-XXX" value={formData.admissionNumber}
                 name="admissionNumber" onChange={(e)=>{handleChange(e)}} className="h-10 text-sm rounded-lg" required />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Admission Date *</Label>
                <Input type="date" value={formData.admissionDate}
                 name="admissionDate" onChange={(e)=>{handleChange(e)}}  className="h-10 text-sm rounded-lg" required />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Roll Number</Label>
                <Input placeholder="Enter roll number" name="rollNumber" value={formData.rollNumber} onChange={(e)=>{handleChange(e)}}  className="h-10 text-sm rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Branch *</Label>
                <Select
                  value={formData.branch}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, branch: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchList.map((branch: any) => (
                      <SelectItem key={branch.id} value={String(branch.id)}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Class *</Label>
                <Select
                value={formData.className}
                onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, className: value }))
                }
                >
                  <SelectTrigger className="h-10 text-sm rounded-lg">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classList.map((cls: any) => (
                      <SelectItem key={cls.id} value={String(cls.id)}>
                        {cls.name}
                      </SelectItem> 
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Section *</Label>
                <Select
                value={formData.sectionId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, sectionId: value }))
                }
                >
                  <SelectTrigger className="h-10 text-sm rounded-lg">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionList.map((section: any) => (
                      <SelectItem key={section.id} value={String(section.id)}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Student Name *</Label>
                <Input placeholder="Full name" value={formData.name}
                 name="name" onChange={(e)=>{handleChange(e)}} className="h-10 text-sm rounded-lg" required />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Email *</Label>
                <Input type="email" placeholder="Email" value={formData.email}
                 name="email" onChange={(e)=>{handleChange(e)}} className="h-10 text-sm rounded-lg" required />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Password *</Label>
                <Input type="password" value={formData.password}
                 name="password" onChange={(e)=>{handleChange(e)}} placeholder=". . . . . . . " className="h-10 text-sm rounded-lg" required />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Gender *</Label>
                <Select
                 onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm rounded-lg">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Date of Birth *</Label>
                <Input type="date" value={formData.dateOfBirth}
                 name="dateOfBirth" onChange={(e)=>{handleChange(e)}} className="h-10 text-sm rounded-lg" required />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Category</Label>
                <Select
                 onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm rounded-lg">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Mobile Number *</Label>
                <Input placeholder="10-digit mobile" value={formData.phone}
                 name="phone" onChange={(e)=>{handleChange(e)}} className="h-10 text-sm rounded-lg" required />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Blood Group</Label>
                <Select
                onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, bloodGroup: value }))
                }
                >
                  <SelectTrigger className="h-10 text-sm rounded-lg">
                    <SelectValue placeholder="Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">House</Label>
                <Select
                 onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, house: value }))
                  }
                >
                  <SelectTrigger className="h-10 text-sm rounded-lg">
                    <SelectValue placeholder="Select House" />
                  </SelectTrigger>
                  <SelectContent>
                    {houses.map(h => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>


          {/* ================= Physical & Photo ================= */}
          <Card className="border border-border/40 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 py-4 px-6">
              <CardTitle className="text-sm font-semibold text-white tracking-wide uppercase">
                Physical Details & Photo
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Height (cm)</Label>
                <Input type="number" name="height" value={formData.height} onChange={(e)=>{handleChange(e)}} placeholder="e.g. 150" className="h-10 text-sm rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Weight (kg)</Label>
                <Input type="number" name="weight" value={formData.weight} onChange={(e)=>{handleChange(e)}} placeholder="e.g. 45" className="h-10 text-sm rounded-lg" />
              </div>

              <div className="md:col-span-2 flex items-end gap-4">
                <div className="space-y-2 flex-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Student Photo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setPhoto(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                {/* <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed border-border/60 hover:border-primary transition-colors">
                  <Camera className="w-6 h-6 text-muted-foreground" />
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* ================= Documents Upload ================= */}
          <Card className="border border-border/40 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-600 to-gray-800 py-4 px-6">
              <CardTitle className="text-sm font-semibold text-white tracking-wide uppercase">
                Documents Details & Upload
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* APAAR ID */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  APAAR ID
                </Label>
                <Input
                  placeholder="Enter APAAR ID"
                  name="apaarId"
                  value={formData.apaarId}
                  onChange={handleChange}
                  className="h-10 text-sm rounded-lg"
                />
              </div>

              {/* RTE Number */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  RTE Number
                </Label>
                <Input
                  placeholder="Enter RTE Number"
                  name="rteNumber"
                  value={formData.rteNumber}
                  onChange={handleChange}
                  className="h-10 text-sm rounded-lg"
                />
              </div>

              {/* PEN Number */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  PEN Number
                </Label>
                <Input
                  placeholder="Enter PEN Number"
                  name="penNumber"
                  value={formData.penNumber}
                  onChange={handleChange}
                  className="h-10 text-sm rounded-lg"
                />
              </div>

              {/* Masked Aadhaar Upload */}
              <div className="md:col-span-2 lg:col-span-3 flex items-end gap-4">
                <div className="space-y-2 flex-1">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Upload Masked Aadhaar Card *
                  </Label>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];

                      if (file) {
                        setDocuments((prev) => ({
                          ...prev,
                          aadhaarFront: file,
                        }));
                      }
                    }}
                    className="h-10 text-sm rounded-lg"
                  />
                </div>

                {/* <button  className="w-20 h-20 cursor pointer rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed border-border/60">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </button> */}
              </div>

              {/* UnMasked Aadhaar Upload */}
              <div className="md:col-span-2 lg:col-span-3 flex items-end gap-4">
                <div className="space-y-2 flex-1">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Upload Back Side of Aadhaar Card *
                  </Label>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];

                      if (file) {
                        setDocuments((prev) => ({
                          ...prev,
                          aadhaarBack: file,
                        }));
                      }
                    }}
                    className="h-10 text-sm rounded-lg"
                  />
                </div>

                {/* <button className="w-20 h-20 cursor-pointer rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed border-border/60">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </button> */}
              </div>

            </CardContent>
          </Card>


          {/* ================= Address Details ================= */}
          <Card className="border border-border/40 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 py-4 px-6">
              <CardTitle className="text-sm font-semibold text-white tracking-wide uppercase">
                Address Details
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Current Address
                </Label>
                <Textarea
                  placeholder="Enter current address"
                  value={formData.currentAddress}
                  name="currentAddress" onChange={(e)=>{handleChange(e)}}
                  className="text-sm min-h-[90px] rounded-lg resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch 
                checked={formData.sameAsCurrent} 
                onCheckedChange={v => 
                setFormData({...formData, sameAsCurrent: v, ...(v ? { permanentAddress: formData.currentAddress} : {})})} />
                <Label className="text-sm">Permanent address same as current</Label>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Permanent Address
                </Label>
                <Textarea
                  placeholder="Enter permanent address"
                  value={formData.permanentAddress}
                  name="permanentAddress" onChange={(e)=>{handleChange(e)}}
                  className="text-sm min-h-[90px] rounded-lg resize-none"
                />
              </div>
            </CardContent>
          </Card>


          {/* ================= Parent / Guardian Details ================= */}
          <Card className="border border-border/40 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 py-4 px-6">
              <CardTitle className="text-sm font-semibold text-white tracking-wide uppercase">
                Parent / Guardian Details
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Father`s Name
                </Label>
                <Input placeholder="Father`s full name" value={formData.fatherName}
                  name="fatherName" onChange={(e)=>{handleChange(e)}} className="h-10 text-sm rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Father`s Occupation
                </Label>
                <Input placeholder="Occupation" value={formData.fatherOccupation}
                  name="fatherOccupation" onChange={(e)=>{handleChange(e)}} className="h-10 text-sm rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Father`s Mobile
                </Label>
                <Input placeholder="Mobile number" value={formData.fatherPhone}
                  name="fatherPhone" onChange={(e)=>{handleChange(e)}} className="h-10 text-sm rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Mother`s Name
                </Label>
                <Input placeholder="Mother`s full name" value={formData.motherName}
                  name="motherName" onChange={(e)=>{handleChange(e)}} className="h-10 text-sm rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Mother`s Occupation
                </Label>
                <Input placeholder="Occupation" value={formData.motherOccupation}
                  name="motherOccupation" onChange={(e)=>{handleChange(e)}} className="h-10 text-sm rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Mother`s Mobile
                </Label>
                <Input placeholder="Mobile number" value={formData.motherPhone}
                  name="motherPhone" onChange={(e)=>{handleChange(e)}} className="h-10 text-sm rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Guardian`s Name
                </Label>
                <Input placeholder="If different from parents" value={formData.guardianName}
                  name="guardianName" onChange={(e)=>{handleChange(e)}} className="h-10 text-sm rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Guardian`s Relation
                </Label>
                <Input placeholder="Relation" value={formData.guardianRelation}
                  name="guardianRelation" onChange={(e)=>{handleChange(e)}} className="h-10 text-sm rounded-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Guardian`s Mobile
                </Label>
                <Input placeholder="Mobile number" value={formData.guardianPhone}
                  name="guardianPhone" onChange={(e)=>{handleChange(e)}} className="h-10 text-sm rounded-lg" />
              </div>
            </CardContent>
          </Card>

          {/* ================= Parent / Guardian ================= */}
          <Card className="border border-border/40 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 py-4 px-6">
              <CardTitle className="text-sm font-semibold text-white tracking-wide uppercase">
                Parent`s Email & Password
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-muted-foreground">
                  Parent`s Email
                </Label>
                <Input
                  type="email"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={(e) => {
                    handleChange(e);
                    checkParentEmail(e.target.value);
                  }}
                  placeholder="Parent's email"
                  className="h-10 text-sm rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-muted-foreground">
                  Password
                </Label>
                <Input type="password" value={formData.parentPassword}
                  name="parentPassword" onChange={(e)=>{handleChange(e)}} placeholder=". . . . . . . ." className="h-10 text-sm rounded-lg" />
              </div>
            </CardContent>

          </Card>

          {/* ================= SIBLING DETECTION UI ================= */}
          {siblingData && (
            <Card className="border border-indigo-500/30 bg-indigo-500/5 rounded-2xl shadow-md">
              <CardContent className="p-6 space-y-4">

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-indigo-400">
                      Sibling Detected
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      This parent already has {siblingData.children.length} children enrolled.
                    </p>
                  </div>

                  <Badge className="bg-indigo-600 text-white">
                    {formData.discountValue}% Sibling Discount
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {siblingData.children.map((child: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-background border border-border/40"
                    >
                      <p className="text-sm font-medium">{child.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Class {child.class} - Section {child.section}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-sm text-emerald-400 font-medium">
                    ✔ This student will receive {formData.discountValue}% sibling discount.
                  </p>
                </div>

              </CardContent>
            </Card>
          )}

          {/* ================= Student Fees ================= */}
          <Card className="border border-border/40 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 py-4 px-6">
              <CardTitle className="text-sm font-semibold text-white tracking-wide uppercase">
                Fees & Payment Plan
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">

              <div className="space-y-2">
                <Label className="text-xs">Admission Fee</Label>
                <Input
                  type="number"
                  name="admissionFee"
                  value={formData.admissionFee}
                  onChange={handleFeeChange}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Tuition Fee</Label>
                <Input
                  type="number"
                  name="tutionFee"
                  value={formData.tutionFee}
                  onChange={handleFeeChange}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Transport Fee</Label>
                <Input
                  type="number"
                  name="transportFee"
                  value={formData.transportFee}
                  onChange={handleFeeChange}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Hostel Fee</Label>
                <Input
                  type="number"
                  name="hostelFee"
                  value={formData.hostelFee}
                  onChange={handleFeeChange}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Other Fee</Label>
                <Input
                  type="number"
                  name="otherFee"
                  value={formData.otherFee}
                  onChange={handleFeeChange}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Due Date</Label>
                <Input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleFeeChange}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Total Fees</Label>
                <Input
                  type="number"
                  name="totalFees"
                  value={totalFees}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-red-500">
                  Total Discount (%)
                </Label>
                <Input
                  value={totalDiscountPercent}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-green-600">
                  Final Payable Fees
                </Label>
                <Input
                  type="number"
                  value={finalFee}
                  readOnly
                  className="font-semibold text-green-600"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Installment Plan</Label>

                <Select
                  value={String(formData.installments)}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      installments: Number(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Plan" />
                  </SelectTrigger>

                  <SelectContent>
                    {installmentTypes.map((plan) => (
                      <SelectItem key={plan} value={plan}>
                        {plan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Discount Type</Label>

                <Select
                  value={formData.discountType}
                  onValueChange={async (value) => {

                    try {

                      const res = await axiosInstance.get(`/api/v1/discounts/${value}`);
                      const discount = res.data.data;

                      setExtraDiscounts((prev) => ({
                        ...prev,
                        scholarship: discount.value
                      }));

                      setFormData((prev) => ({
                        ...prev,
                        discountType: value
                      }));

                    } catch (error) {

                      toast({
                        title: "Error",
                        description: "Failed to load discount",
                        variant: "destructive",
                      });

                    }

                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Discount" />
                  </SelectTrigger>

                  <SelectContent>
                    {discountTypes.map((d: any) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <Label className="text-xs">Discount Amount (%)</Label>
                <Input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={(e) => {
                  const value = Number(e.target.value);

                  setExtraDiscounts((prev) => ({
                    ...prev,
                    manual: value
                  }));
                }}
                />
              </div> */}

              {/* <div className="space-y-2">
                <Label className="text-xs">Scholarship Discount (%)</Label>
                <Input
                  type="number"
                  value={extraDiscounts.scholarship}
                  onChange={(e) =>
                    setExtraDiscounts((prev) => ({
                      ...prev,
                      scholarship: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Sports Discount (%)</Label>
                <Input
                  type="number"
                  value={extraDiscounts.sports}
                  onChange={(e) =>
                    setExtraDiscounts((prev) => ({
                      ...prev,
                      sports: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Staff Discount (%)</Label>
                <Input
                  type="number"
                  value={extraDiscounts.staff}
                  onChange={(e) =>
                    setExtraDiscounts((prev) => ({
                      ...prev,
                      staff: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Manual Discount (%)</Label>
                <Input
                  type="number"
                  value={extraDiscounts.manual}
                  onChange={(e) =>
                    setExtraDiscounts((prev) => ({
                      ...prev,
                      manual: Number(e.target.value),
                    }))
                  }
                />
              </div> */}
              
            </CardContent>
          </Card>
          
          {/* ================= Previous School ================= */}
          <Card className="border border-border/40 shadow-md rounded-2xl overflow-hidden">
            <CardHeader
              className="bg-gradient-to-r from-pink-500 to-rose-600 py-4 px-6 cursor-pointer flex flex-row items-center justify-between"
              onClick={() => setShowPrevSchool(!showPrevSchool)}
            >
              <CardTitle className="text-sm font-semibold text-white tracking-wide uppercase">
                Previous School Details
              </CardTitle>

              {showPrevSchool ? (
                <ChevronUp className="w-4 h-4 text-white transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white transition-transform" />
              )}
            </CardHeader>

            {showPrevSchool && (
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    School Name
                  </Label>
                  <Input placeholder="Previous school name"  className="h-10 text-sm rounded-lg" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Last Class Attended
                  </Label>
                  <Input placeholder="e.g. Class 8" className="h-10 text-sm rounded-lg" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Year of Passing
                  </Label>
                  <Input type="number" placeholder="e.g. 2024" className="h-10 text-sm rounded-lg" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Board/University
                  </Label>
                  <Input placeholder="e.g. CBSE" className="h-10 text-sm rounded-lg" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Percentage / CGPA
                  </Label>
                  <Input placeholder="e.g. 85%" className="h-10 text-sm rounded-lg" />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    TC Number
                  </Label>
                  <Input placeholder="Transfer Certificate No." className="h-10 text-sm rounded-lg" />
                </div>
              </CardContent>
            )}
          </Card>


          {/* ================= Actions ================= */}
          <div className="flex items-center gap-4 justify-end pt-4 border-t border-border/40">

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-10 px-5 rounded-xl border-border/60 hover:bg-muted transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-10 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Admission"}
            </Button>

          </div>

        </form>
      </div>
    </AdminLayout>
  );
};

export default Page;