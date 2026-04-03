"use client"

import { useState } from "react";
import { Search, Send, Paperclip, MoreVertical, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";

interface Message {
  id: number;
  text: string;
  time: string;
  sender: "me" | "them";
}

interface Conversation {
  id: number;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: 1, name: "Priya Sharma", role: "Teacher - Math", avatar: "PS", lastMessage: "Please share the exam schedule", time: "10:30 AM", unread: 2, online: true,
    messages: [
      { id: 1, text: "Good morning! I need the exam schedule for Class 10.", sender: "them", time: "10:25 AM" },
      { id: 2, text: "Sure, I'll share it shortly.", sender: "me", time: "10:28 AM" },
      { id: 3, text: "Please share the exam schedule", sender: "them", time: "10:30 AM" },
    ],
  },
  {
    id: 2, name: "Rahul Verma", role: "Parent", avatar: "RV", lastMessage: "Thank you for the update", time: "9:15 AM", unread: 0, online: false,
    messages: [
      { id: 1, text: "How is my son performing in class?", sender: "them", time: "9:00 AM" },
      { id: 2, text: "He is doing well. Scored 85% in the last test.", sender: "me", time: "9:10 AM" },
      { id: 3, text: "Thank you for the update", sender: "them", time: "9:15 AM" },
    ],
  },
  {
    id: 3, name: "Anita Desai", role: "Accountant", avatar: "AD", lastMessage: "Fees report is ready", time: "Yesterday", unread: 1, online: true,
    messages: [
      { id: 1, text: "The monthly fees report is ready for review.", sender: "them", time: "Yesterday" },
    ],
  },
  {
    id: 4, name: "Vikram Singh", role: "Librarian", avatar: "VS", lastMessage: "New books have arrived", time: "Yesterday", unread: 0, online: false,
    messages: [
      { id: 1, text: "50 new books have arrived. Should I catalog them?", sender: "them", time: "Yesterday" },
      { id: 2, text: "Yes, please proceed with cataloging.", sender: "me", time: "Yesterday" },
    ],
  },
];

const Page = () => {
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const selected = conversations.find(c => c.id === selectedId)!;
  const filtered = conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
        <div className="flex h-[calc(100vh-7.5rem)] bg-card rounded-xl border border-border overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">Messages</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            </div>
            <ScrollArea className="flex-1">
            {filtered.map(c => (
                <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors text-left ${selectedId === c.id ? "bg-secondary" : ""}`}
                >
                <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">{c.avatar}</div>
                    {c.online && <Circle className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-stat-green text-card" />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                    <span className="text-[10px] text-muted-foreground">{c.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                    {c.unread > 0 && <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">{c.unread}</Badge>}
                    </div>
                </div>
                </button>
            ))}
            </ScrollArea>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">{selected.avatar}</div>
                <div>
                <p className="text-sm font-medium text-foreground">{selected.name}</p>
                <p className="text-xs text-muted-foreground">{selected.role}</p>
                </div>
            </div>
            <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
            </div>

            <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
                {selected.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${msg.sender === "me" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-foreground rounded-bl-md"}`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                    </div>
                </div>
                ))}
            </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
                <Input
                className="flex-1"
                placeholder="Type a message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && setNewMessage("")}
                />
                <Button size="icon"><Send className="h-4 w-4" /></Button>
            </div>
            </div>
        </div>
        </div>
    </AdminLayout>
  );
};

export default Page;
