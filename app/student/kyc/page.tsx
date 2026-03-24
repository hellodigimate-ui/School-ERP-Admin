"use client"


import { useState } from "react";
import { StudentLayout } from "@/components/student/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
Shield, 
CheckCircle2, 
Clock, 
AlertCircle, 
Phone, 
CreditCard,
Upload,
FileCheck,
Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

type VerificationStatus = "pending" | "in-progress" | "verified" | "failed";

interface VerificationStep {
id: string;
title: string;
description: string;
status: VerificationStatus;
}

const KYC = () => {
const [aadharNumber, setAadharNumber] = useState("");
const [mobileNumber, setMobileNumber] = useState("");
const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);
const [isVerifyingAadhar, setIsVerifyingAadhar] = useState(false);
const [isVerifyingMobile, setIsVerifyingMobile] = useState(false);
const [isSendingOtp, setIsSendingOtp] = useState(false);

const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    {
    id: "aadhar",
    title: "Aadhar Verification",
    description: "Verify your identity using Aadhar card",
    status: "pending",
    },
    {
    id: "mobile",
    title: "Mobile Verification",
    description: "Verify your mobile number via OTP",
    status: "pending",
    },
    {
    id: "documents",
    title: "Document Upload",
    description: "Upload supporting documents",
    status: "pending",
    },
]);

const getCompletionPercentage = () => {
    const verified = verificationSteps.filter((s) => s.status === "verified").length;
    return Math.round((verified / verificationSteps.length) * 100);
};

const updateStepStatus = (stepId: string, status: VerificationStatus) => {
    setVerificationSteps((prev) =>
    prev.map((step) => (step.id === stepId ? { ...step, status } : step))
    );
};

const formatAadhar = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    const parts: string[] = [];
    for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
    }
    return parts.join(" ");
};

const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhar(e.target.value);
    setAadharNumber(formatted);
};

const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(digits);
};

const handleVerifyAadhar = async () => {
    if (aadharNumber.replace(/\s/g, "").length !== 12) {
    return;
    }
    
    setIsVerifyingAadhar(true);
    updateStepStatus("aadhar", "in-progress");
    
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsVerifyingAadhar(false);
    updateStepStatus("aadhar", "verified");
};

const handleSendOtp = async () => {
    if (mobileNumber.length !== 10) {
    return;
    }
    
    setIsSendingOtp(true);
    
    // Simulate OTP sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSendingOtp(false);
    setOtpSent(true);
    updateStepStatus("mobile", "in-progress");
};

const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
    return;
    }
    
    setIsVerifyingMobile(true);
    
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsVerifyingMobile(false);
    updateStepStatus("mobile", "verified");
};

const handleDocumentUpload = () => {
    // Simulate document upload
    updateStepStatus("documents", "verified");
};

const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
    case "verified":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />;
    case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
};

const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
    case "verified":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Verified</Badge>;
    case "in-progress":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">In Progress</Badge>;
    case "failed":
        return <Badge variant="destructive">Failed</Badge>;
    default:
        return <Badge variant="secondary">Pending</Badge>;
    }
};

const aadharStep = verificationSteps.find((s) => s.id === "aadhar");
const mobileStep = verificationSteps.find((s) => s.id === "mobile");
const documentsStep = verificationSteps.find((s) => s.id === "documents");

return (
    <StudentLayout>
        <div className="space-y-6">
            {/* Header */}
            <div>
            <h1 className="text-2xl font-bold text-foreground">KYC Verification</h1>
            <p className="text-muted-foreground">Complete your identity verification to access all features</p>
            </div>

            {/* Progress Overview */}
            <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                    <CardTitle className="text-lg">Verification Progress</CardTitle>
                    <CardDescription>Complete all steps to verify your identity</CardDescription>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-primary">{getCompletionPercentage()}%</span>
                    <p className="text-xs text-muted-foreground">Complete</p>
                </div>
                </div>
            </CardHeader>
            <CardContent>
                <Progress value={getCompletionPercentage()} className="h-2" />
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {verificationSteps.map((step) => (
                    <div
                    key={step.id}
                    className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border",
                        step.status === "verified" && "bg-green-500/5 border-green-500/20",
                        step.status === "in-progress" && "bg-yellow-500/5 border-yellow-500/20",
                        step.status === "pending" && "bg-muted/50"
                    )}
                    >
                    {getStatusIcon(step.status)}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{step.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
            {/* Aadhar Verification */}
            <Card>
                <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Aadhar Verification</CardTitle>
                        <CardDescription>Enter your 12-digit Aadhar number</CardDescription>
                    </div>
                    </div>
                    {getStatusBadge(aadharStep?.status || "pending")}
                </div>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="aadhar">Aadhar Number</Label>
                    <Input
                    id="aadhar"
                    placeholder="XXXX XXXX XXXX"
                    value={aadharNumber}
                    onChange={handleAadharChange}
                    disabled={aadharStep?.status === "verified"}
                    className="font-mono text-lg tracking-wider"
                    />
                    <p className="text-xs text-muted-foreground">
                    Enter your 12-digit Aadhar number without spaces
                    </p>
                </div>
                
                {aadharStep?.status === "verified" ? (
                    <Alert className="border-green-500/20 bg-green-500/5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-500">Verified</AlertTitle>
                    <AlertDescription>
                        Your Aadhar has been successfully verified.
                    </AlertDescription>
                    </Alert>
                ) : (
                    <Button
                    onClick={handleVerifyAadhar}
                    disabled={aadharNumber.replace(/\s/g, "").length !== 12 || isVerifyingAadhar}
                    className="w-full"
                    >
                    {isVerifyingAadhar ? (
                        <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                        </>
                    ) : (
                        "Verify Aadhar"
                    )}
                    </Button>
                )}
                </CardContent>
            </Card>

            {/* Mobile Verification */}
            <Card>
                <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                        <Phone className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Mobile Verification</CardTitle>
                        <CardDescription>Verify via OTP sent to your mobile</CardDescription>
                    </div>
                    </div>
                    {getStatusBadge(mobileStep?.status || "pending")}
                </div>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="flex gap-2">
                    <div className="flex h-10 items-center px-3 rounded-md border bg-muted text-sm">
                        +91
                    </div>
                    <Input
                        id="mobile"
                        placeholder="Enter 10-digit mobile number"
                        value={mobileNumber}
                        onChange={handleMobileChange}
                        disabled={mobileStep?.status === "verified" || otpSent}
                        className="flex-1"
                    />
                    </div>
                </div>

                {otpSent && mobileStep?.status !== "verified" && (
                    <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                        id="otp"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="font-mono text-lg tracking-widest text-center"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                        OTP sent to +91 {mobileNumber}
                    </p>
                    </div>
                )}

                {mobileStep?.status === "verified" ? (
                    <Alert className="border-green-500/20 bg-green-500/5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-500">Verified</AlertTitle>
                    <AlertDescription>
                        Your mobile number has been successfully verified.
                    </AlertDescription>
                    </Alert>
                ) : !otpSent ? (
                    <Button
                    onClick={handleSendOtp}
                    disabled={mobileNumber.length !== 10 || isSendingOtp}
                    className="w-full"
                    >
                    {isSendingOtp ? (
                        <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending OTP...
                        </>
                    ) : (
                        "Send OTP"
                    )}
                    </Button>
                ) : (
                    <Button
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6 || isVerifyingMobile}
                    className="w-full"
                    >
                    {isVerifyingMobile ? (
                        <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                        </>
                    ) : (
                        "Verify OTP"
                    )}
                    </Button>
                )}
                </CardContent>
            </Card>
            </div>

            {/* Document Upload */}
            <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <FileCheck className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                    <CardTitle className="text-lg">Document Upload</CardTitle>
                    <CardDescription>Upload supporting documents for verification</CardDescription>
                    </div>
                </div>
                {getStatusBadge(documentsStep?.status || "pending")}
                </div>
            </CardHeader>
            <CardContent>
                {documentsStep?.status === "verified" ? (
                <Alert className="border-green-500/20 bg-green-500/5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-500">Documents Uploaded</AlertTitle>
                    <AlertDescription>
                    Your documents have been successfully uploaded and are under review.
                    </AlertDescription>
                </Alert>
                ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    <div
                    className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={handleDocumentUpload}
                    >
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Aadhar Card (Front)</p>
                    <p className="text-xs text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                    </div>
                    <div
                    className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={handleDocumentUpload}
                    >
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Aadhar Card (Back)</p>
                    <p className="text-xs text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                    </div>
                </div>
                )}
            </CardContent>
            </Card>
        </div>
    </StudentLayout>
);
};

export default KYC;