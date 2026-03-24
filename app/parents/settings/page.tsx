import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Camera } from "lucide-react";
import ParentLayout from "@/components/parents/layout/parentLayout";

export default function Settings() {
  return (
    <ParentLayout>
        <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        {/* Profile Settings */}
        <Card>
            <CardHeader>
            <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
                <div className="relative">
                <Avatar className="w-20 h-20">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=parent" />
                    <AvatarFallback className="text-xl">PS</AvatarFallback>
                </Avatar>
                <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full"
                >
                    <Camera className="w-4 h-4" />
                </Button>
                </div>
                <div>
                <h3 className="font-medium">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">
                    JPG, GIF or PNG. Max size 2MB
                </p>
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Priya" />
                </div>
                <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Sharma" />
                </div>
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="priya.sharma@email.com" />
                </div>
                <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="+91 98765 43210" />
                </div>
            </div>

            <Button>Save Changes</Button>
            </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
            <CardHeader>
            <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                </p>
                </div>
                <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
                <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">
                    Receive important alerts via SMS
                </p>
                </div>
                <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
                <div>
                <p className="font-medium">Assignment Alerts</p>
                <p className="text-sm text-muted-foreground">
                    Get notified about new assignments
                </p>
                </div>
                <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
                <div>
                <p className="font-medium">Fee Reminders</p>
                <p className="text-sm text-muted-foreground">
                    Receive fee payment reminders
                </p>
                </div>
                <Switch defaultChecked />
            </div>
            </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
            <CardHeader>
            <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
                </div>
            </div>
            <Button>Update Password</Button>
            </CardContent>
        </Card>
        </div>
    </ParentLayout>
  );
}
