"use client";

import { useState } from "react";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { DashboardHeader } from "@/components/teacher/DashboardHeader";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isOwn: boolean;
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Parent",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Thank you for the update on Emma's progress.",
    time: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Parent",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Can we schedule a meeting this week?",
    time: "9:15 AM",
    unread: 1,
    online: true,
  },
  {
    id: "3",
    name: "Dr. Robert Wilson",
    role: "Principal",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Please submit the quarterly report by Friday.",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "4",
    name: "Emily Davis",
    role: "Co-Teacher",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    lastMessage: "I've shared the lesson plan for next week.",
    time: "Yesterday",
    unread: 0,
    online: true,
  },
];

const messageHistory: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      senderId: "1",
      text: "Hi Ms. Doe, I wanted to ask about Emma's performance in Mathematics this semester.",
      time: "10:00 AM",
      isOwn: false,
    },
    {
      id: "m2",
      senderId: "me",
      text: "Hello Sarah! Emma has been doing very well.",
      time: "10:15 AM",
      isOwn: true,
    },
  ],
};

export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(messageHistory);

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = messages[selectedContact.id] || [];

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: `m${Date.now()}`,
      senderId: "me",
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), msg],
    }));

    setNewMessage("");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TeacherSidebar />

      <main className="flex-1 flex flex-col">
        <DashboardHeader />

        <div className="flex-1 flex overflow-hidden">
          {/* Contacts */}
          <div className="w-80 border-r border-border flex flex-col bg-card">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={cn(
                    "w-full flex gap-3 p-3 text-left hover:bg-muted/50 rounded-lg",
                    selectedContact.id === contact.id && "bg-muted"
                  )}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="font-medium truncate">{contact.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {contact.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {contact.lastMessage}
                    </p>
                  </div>

                  {contact.unread > 0 && (
                    <Badge className="h-5">{contact.unread}</Badge>
                  )}
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <div className="h-16 border-b flex items-center justify-between px-6 bg-card">
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback>
                    {selectedContact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedContact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedContact.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              {currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex mb-3",
                    msg.isOwn ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-2 rounded-2xl max-w-[70%]",
                      msg.isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-[10px] opacity-70 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>

            <div className="p-4 border-t bg-card">
              <div className="flex gap-3">
                <Textarea
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button onClick={handleSend} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
