/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";





interface CalendarEvent {
  id: number;
  name: string;
  date: string;
  eventType: "TOURNAMENT" | "REUNION" | "WEBINAR" | "WORKSHOP" | "CONFERENCE" | "FUNDRAISER" | "MEETUP" | "OTHER";
  description: string;
}

interface Branch {
  id: string;
  name: string;
}


const typeColors: Record<string, string> = {
  TOURNAMENT: "bg-red-100 text-red-700",
  REUNION: "bg-blue-100 text-blue-700",
  WEBINAR: "bg-green-100 text-green-700",
  WORKSHOP: "bg-purple-100 text-purple-700",
  CONFERENCE: "bg-red-100 text-red-700",
  FUNDRAISER: "bg-blue-100 text-blue-700",
  MEETUP: "bg-green-100 text-green-700",
  OTHER: "bg-purple-100 text-purple-700",
};

const Page = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", branchId: "",date:"",eventType:"",description:"" });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const monthName = currentDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });


const fetchEvents = async () => {
  try {
    setLoading(true);

    const response = await axiosInstance.get("/api/v1/events", {
      params: {
        page: 1,
        perPage: 50
      }
    });

    const data = response.data.data.map((e: any) => ({
      id: e.id,
      title: e.name,
      date: e.date.split("T")[0],
      type: e.eventType,
      description: e.description || ""
    }));

    setEvents(data);

  } catch (error) {
    console.error("Fetch Events Error:", error);
  } finally {
    setLoading(false);
  }
};

const handleUpdateEvent = async () => {
  if (!editEvent) return;

  try {
    const payload = {
      name: editEvent.name,
      description: editEvent.description,
      date: new Date(editEvent.date).toISOString(),
      eventType: editEvent.eventType
    };

    await axiosInstance.put(`/api/v1/events/${editEvent.id}`, payload);

    setEvents(events.map(e => e.id === editEvent.id ? editEvent : e));

    setEditDialogOpen(false);
    setEditEvent(null);

  } catch (error) {
    console.error("Update event failed:", error);
  }
};

const handleDeleteEvent = async (id: number) => {
  try {
    await axiosInstance.delete(`/api/v1/events/${id}`);

    setEvents(events.filter(e => e.id !== id));

  } catch (error) {
    console.error("Delete event failed:", error);
  }
};


const fetchBranches = async () => {
  try {
    // Replace with your actual API call if available
    const response = await axiosInstance.get("/api/v1/branches"); 
    setBranches(response.data.data);
  } catch (error) {
    console.error("Failed to fetch branches:", error);
  }
};

useEffect(() => {
  fetchBranches();
  fetchEvents();
}, []);


  // Calendar calculations
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);


  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

const upcomingEvents = events
  .filter(e => new Date(e.date) >= today)
  .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(0,5);

const getEventsForDay = (day: number) => {
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return events.filter(e => e.date === dateStr);
};


const handleCreateEvent = async () => {
  try {
    const formattedDate = new Date(formData.date).toISOString();
    const payload = {
      branchId: formData.branchId,
      name: formData.name,
      description: formData.description,
      date: formattedDate,
      eventType: formData.eventType
    };
    const res = await axiosInstance.post("/api/v1/events", payload);
    console.log(res.data);
    setEvents([...events, {
      id: res.data.data.id,
      name: res.data.data.name,
      date: res.data.data.date.split("T")[0],
      eventType: res.data.data.eventType,
      description: res.data.data.description || ""
    }]);
    setDialogOpen(false);
    setFormData({ name: "", branchId: "", date: "", eventType: "", description: "" });
  } catch (error) {
    console.error("Failed to create event:", error);
  }
};


  return (
   <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">School Calendar</h1>
            <p className="text-sm text-muted-foreground">View events, exams, and holidays</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600">
                <Plus className="h-4 w-4" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md space-y-4">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Add Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input
                  placeholder="Event title"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                </div>
                
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Branch</Label>
                  <Select
                    value={formData.branchId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, branchId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Type</Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value) => setFormData({...formData, eventType: value})}
                  >
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TOURNAMENT">Tournament</SelectItem>
                      <SelectItem value="REUNION">Reunion</SelectItem>
                      <SelectItem value="WEBINAR">Webinar</SelectItem>
                      <SelectItem value="WORKSHOP">Workshop</SelectItem>
                      <SelectItem value="CONFERENCE">Conference</SelectItem>
                      <SelectItem value="FUNDRAISER">Fundraiser</SelectItem>
                      <SelectItem value="MEETUP">Meet-Up</SelectItem>
                      <SelectItem value="OTHER">other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    placeholder="Brief description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"  onClick={handleCreateEvent}>Save Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <Card className="lg:col-span-2 shadow-lg border border-border/50">
            <CardHeader className="flex items-center justify-between space-y-0 pb-4">
              <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-5 w-5" /></Button>
              <CardTitle className="text-lg font-semibold">{monthName}</CardTitle>
              <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-5 w-5" /></Button>
            </CardHeader>
            <CardContent>
              {/* Weekdays */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, idx) => (
                  <div key={idx} className={`text-center text-xs font-medium py-2 ${idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : "text-muted-foreground"}`}>{d}</div>
                ))}
              </div>
              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                  const events = day ? getEventsForDay(day) : [];
                  const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                  return (
                    <div 
                      key={i} 
                      className={`min-h-[90px] p-2 rounded-lg border border-border/30 transition-all duration-150
                        ${day ? "bg-card hover:shadow-lg hover:scale-105 cursor-pointer" : "bg-transparent border-transparent"}
                        ${isToday ? "ring-4 ring-gradient-to-r from-indigo-400 via-pink-400 to-yellow-400" : ""}`}
                    >
                      {day && (
                        <>
                          <span className={`text-sm font-medium ${isToday ? "text-indigo-600 font-bold" : "text-foreground"}`}>{day}</span>
                          <div className="mt-1 space-y-1">
                            {events.map(ev => (
                              <div
                                key={ev.id}
                                className="text-[10px] p-1 rounded-md bg-white shadow-sm border border-gray-200 space-y-[2px]"
                              >
                                {/* Event Name */}
                                <p className="truncate font-medium text-gray-800">
                                  {ev.name}
                                </p>

                                {/* Event Type Label */}
                                <span
                                  className={`inline-block px-1 py-[1px] rounded text-[9px] font-semibold ${typeColors[ev.eventType]}`}
                                >
                                  {ev.eventType}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="shadow-lg border border-border/50 max-h-[500px] overflow-y-auto bg-gradient-to-b from-white/70 to-white/100">
            <CardHeader><CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map(ev => (
                <div key={ev.id} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-pink-50 hover:from-indigo-100 hover:to-pink-100 transition cursor-pointer">
                  <div className="text-center min-w-[40px]">
                    <p className="text-lg font-bold text-foreground">{new Date(ev.date).getDate()}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{new Date(ev.date).toLocaleDateString("en-IN", { month: "short" })}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{ev.name}</p>
                    <p className="text-xs text-muted-foreground">{ev.description}</p>
                    <Badge className={`mt-1 text-[10px] ${typeColors[ev.eventType]}`}>{ev.eventType}</Badge>
                  </div>
                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2">
                    <Pencil
                      className="h-4 w-4 cursor-pointer text-indigo-500 hover:text-indigo-700"
                      onClick={() => {
                        setEditEvent(ev);
                        setEditDialogOpen(true);
                      }}
                    />

                    <Trash2
                      className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteEvent(ev.id)}
                    />
                  </div>
                  <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent className="max-w-md space-y-4">
                      <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                      </DialogHeader>

                      {editEvent && (
                        <div className="space-y-3">

                          <Input
                            value={editEvent.name}
                            onChange={(e) =>
                              setEditEvent({ ...editEvent, name: e.target.value })
                            }
                          />

                          <Input
                            type="date"
                            value={editEvent.date}
                            onChange={(e) =>
                              setEditEvent({ ...editEvent, date: e.target.value })
                            }
                          />

                            <Label>Type</Label>
                            <Select
                              value={editEvent.eventType}
                              onValueChange={(value) => setEditEvent({...editEvent, eventType: value as "TOURNAMENT" | "REUNION" | "WEBINAR" | "WORKSHOP" | "CONFERENCE" | "FUNDRAISER" | "MEETUP" | "OTHER"})}
                            >
                              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="TOURNAMENT">Tournament</SelectItem>
                                <SelectItem value="REUNION">Reunion</SelectItem>
                                <SelectItem value="WEBINAR">Webinar</SelectItem>
                                <SelectItem value="WORKSHOP">Workshop</SelectItem>
                                <SelectItem value="CONFERENCE">Conference</SelectItem>
                                <SelectItem value="FUNDRAISER">Fundraiser</SelectItem>
                                <SelectItem value="MEETUP">Meet-Up</SelectItem>
                                <SelectItem value="OTHER">other</SelectItem>
                              </SelectContent>
                            </Select>

                          <Input
                            value={editEvent.description}
                            onChange={(e) =>
                              setEditEvent({ ...editEvent, description: e.target.value })
                            }
                          />

                          <Button
                            className="w-full bg-indigo-500 hover:bg-indigo-600"
                            onClick={handleUpdateEvent}
                          >
                            Update Event
                          </Button>

                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
   </AdminLayout>
  );
};

export default Page;