"use client"

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import ParentLayout from "@/components/parents/layout/parentLayout";

const teachers = [
  {
    id: "1",
    name: "Mrs. Sharma",
    subject: "Mathematics",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sharma",
    lastMessage: "Please submit the homework by tomorrow.",
    time: "10:30 AM",
    unread: 2,
  },
  {
    id: "2",
    name: "Mr. Patel",
    subject: "Physics",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=patel",
    lastMessage: "Rahul did great in the lab today!",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "3",
    name: "Mrs. Gupta",
    subject: "Chemistry",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gupta",
    lastMessage: "Test next week, please prepare.",
    time: "2 days ago",
    unread: 0,
  },
  {
    id: "4",
    name: "Ms. Johnson",
    subject: "English",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=johnson",
    lastMessage: "Essay submission deadline extended.",
    time: "3 days ago",
    unread: 0,
  },
];

const mockMessages = [
  { id: "1", sender: "teacher", text: "Good morning! I wanted to discuss Rahul's progress.", time: "10:00 AM" },
  { id: "2", sender: "parent", text: "Good morning Mrs. Sharma. Yes, please go ahead.", time: "10:02 AM" },
  { id: "3", sender: "teacher", text: "Rahul has been doing great in Mathematics. He scored 95 in the last test!", time: "10:05 AM" },
  { id: "4", sender: "parent", text: "That's wonderful to hear! Thank you for letting me know.", time: "10:08 AM" },
  { id: "5", sender: "teacher", text: "Please ensure he submits the homework by tomorrow. It's important for his overall grade.", time: "10:30 AM" },
];

export default function Messages() {
  const [selectedTeacher, setSelectedTeacher] = useState(teachers[0]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <ParentLayout>
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Messages</h1>
                <p className="text-muted-foreground">Communicate with teachers</p>
            </div>

            {/* Messages Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
                {/* Teachers List */}
                <Card className="lg:col-span-1 flex flex-col">
                <CardHeader className="pb-3">
                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search teachers..." className="pl-10" />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0">
                    <div className="divide-y divide-border">
                    {teachers.map((teacher) => (
                        <button
                        key={teacher.id}
                        onClick={() => setSelectedTeacher(teacher)}
                        className={cn(
                            "w-full flex items-start gap-3 p-4 text-left hover:bg-muted/50 transition-colors",
                            selectedTeacher.id === teacher.id && "bg-muted"
                        )}
                        >
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={teacher.avatar} />
                            <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{teacher.name}</span>
                            <span className="text-xs text-muted-foreground">{teacher.time}</span>
                            </div>
                            <div className="text-xs text-primary">{teacher.subject}</div>
                            <p className="text-sm text-muted-foreground truncate mt-1">
                            {teacher.lastMessage}
                            </p>
                        </div>
                        {teacher.unread > 0 && (
                            <Badge className="bg-primary text-primary-foreground">
                            {teacher.unread}
                            </Badge>
                        )}
                        </button>
                    ))}
                    </div>
                </CardContent>
                </Card>

                {/* Chat Area */}
                <Card className="lg:col-span-2 flex flex-col">
                <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={selectedTeacher.avatar} />
                        <AvatarFallback>{selectedTeacher.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg">{selectedTeacher.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{selectedTeacher.subject}</p>
                    </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {mockMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                        "flex",
                        msg.sender === "parent" ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                        className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-2",
                            msg.sender === "parent"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted rounded-bl-md"
                        )}
                        >
                        <p className="text-sm">{msg.text}</p>
                        <span
                            className={cn(
                            "text-xs mt-1 block",
                            msg.sender === "parent" ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}
                        >
                            {msg.time}
                        </span>
                        </div>
                    </div>
                    ))}
                </CardContent>
                <div className="p-4 border-t">
                    <div className="flex gap-3">
                    <Textarea
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="min-h-[44px] max-h-32 resize-none"
                        rows={1}
                    />
                    <Button size="icon" className="flex-shrink-0">
                        <Send className="w-4 h-4" />
                    </Button>
                    </div>
                </div>
                </Card>
            </div>
        </div>
    </ParentLayout>
  );
}
