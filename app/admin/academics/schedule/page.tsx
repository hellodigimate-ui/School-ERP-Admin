"use client"

import { useState } from "react";
 import { AdminLayout } from "@/components/layout/AdminLayout";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { Calendar } from "@/components/ui/calendar";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from "@/components/ui/dialog";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import {
   Calendar as CalendarIcon,
   Clock,
   Plus,
   BookOpen,
   Users,
   MapPin,
 } from "lucide-react";
 import { toast } from "sonner";
 
 const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
 const timeSlots = [
   "08:00 - 08:45",
   "09:00 - 09:45",
   "10:00 - 10:45",
   "11:00 - 11:45",
   "12:30 - 13:15",
   "13:30 - 14:15",
   "14:30 - 15:15",
 ];
 
 const classes = [
   { id: 1, name: "11-A", grade: "11th Grade" },
   { id: 1, name: "11-B", grade: "11th Grade" },
   { id: 1, name: "10-A", grade: "10th Grade" },
   { id: 2, name: "10-B", grade: "10th Grade" },
   { id: 3, name: "9-A", grade: "9th Grade" },
   { id: 4, name: "9-B", grade: "9th Grade" },
 ];
 
 const initialTimetable: Record<string, Record<string, { subject: string; teacher: string; room: string } | null>> = {
   Monday: {
     "08:00 - 08:45": { subject: "Mathematics", teacher: "Mr. Smith", room: "101" },
     "09:00 - 09:45": { subject: "Physics", teacher: "Ms. Davis", room: "Lab 2" },
     "10:00 - 10:45": { subject: "English", teacher: "Mrs. Wilson", room: "205" },
     "11:00 - 11:45": { subject: "Chemistry", teacher: "Dr. Brown", room: "Lab 1" },
     "12:30 - 13:15": { subject: "History", teacher: "Mr. Taylor", room: "302" },
     "13:30 - 14:15": { subject: "Computer Science", teacher: "Ms. Lee", room: "Comp Lab" },
     "14:30 - 15:15": null,
   },
   Tuesday: {
     "08:00 - 08:45": { subject: "English", teacher: "Mrs. Wilson", room: "205" },
     "09:00 - 09:45": { subject: "Mathematics", teacher: "Mr. Smith", room: "101" },
     "10:00 - 10:45": { subject: "Biology", teacher: "Dr. Green", room: "Lab 3" },
     "11:00 - 11:45": { subject: "Geography", teacher: "Mr. Adams", room: "203" },
     "12:30 - 13:15": { subject: "Physics", teacher: "Ms. Davis", room: "Lab 2" },
     "13:30 - 14:15": { subject: "Art", teacher: "Ms. Parker", room: "Art Room" },
     "14:30 - 15:15": { subject: "PE", teacher: "Coach Miller", room: "Gym" },
   },
   Wednesday: {
     "08:00 - 08:45": { subject: "Chemistry", teacher: "Dr. Brown", room: "Lab 1" },
     "09:00 - 09:45": { subject: "History", teacher: "Mr. Taylor", room: "302" },
     "10:00 - 10:45": { subject: "Mathematics", teacher: "Mr. Smith", room: "101" },
     "11:00 - 11:45": { subject: "English", teacher: "Mrs. Wilson", room: "205" },
     "12:30 - 13:15": { subject: "Computer Science", teacher: "Ms. Lee", room: "Comp Lab" },
     "13:30 - 14:15": { subject: "Music", teacher: "Mr. Bach", room: "Music Room" },
     "14:30 - 15:15": null,
   },
   Thursday: {
     "08:00 - 08:45": { subject: "Physics", teacher: "Ms. Davis", room: "Lab 2" },
     "09:00 - 09:45": { subject: "Biology", teacher: "Dr. Green", room: "Lab 3" },
     "10:00 - 10:45": { subject: "Geography", teacher: "Mr. Adams", room: "203" },
     "11:00 - 11:45": { subject: "Mathematics", teacher: "Mr. Smith", room: "101" },
     "12:30 - 13:15": { subject: "English", teacher: "Mrs. Wilson", room: "205" },
     "13:30 - 14:15": { subject: "History", teacher: "Mr. Taylor", room: "302" },
     "14:30 - 15:15": { subject: "PE", teacher: "Coach Miller", room: "Gym" },
   },
   Friday: {
     "08:00 - 08:45": { subject: "English", teacher: "Mrs. Wilson", room: "205" },
     "09:00 - 09:45": { subject: "Chemistry", teacher: "Dr. Brown", room: "Lab 1" },
     "10:00 - 10:45": { subject: "Physics", teacher: "Ms. Davis", room: "Lab 2" },
     "11:00 - 11:45": { subject: "Computer Science", teacher: "Ms. Lee", room: "Comp Lab" },
     "12:30 - 13:15": { subject: "Mathematics", teacher: "Mr. Smith", room: "101" },
     "13:30 - 14:15": null,
     "14:30 - 15:15": null,
   },
 };
 
 const upcomingEvents = [
   { id: 1, title: "Parent-Teacher Meeting", date: "Feb 10, 2026", time: "10:00 AM", type: "meeting" },
   { id: 2, title: "Science Fair", date: "Feb 15, 2026", time: "9:00 AM", type: "event" },
   { id: 3, title: "Mid-Term Exams", date: "Feb 20, 2026", time: "8:00 AM", type: "exam" },
   { id: 4, title: "Sports Day", date: "Feb 25, 2026", time: "8:00 AM", type: "event" },
 ];
 
 const subjectColors: Record<string, string> = {
   Mathematics: "bg-primary/10 text-primary border-primary/20",
   Physics: "bg-accent/10 text-accent border-accent/20",
   English: "bg-success/10 text-success border-success/20",
   Chemistry: "bg-warning/10 text-warning border-warning/20",
   History: "bg-destructive/10 text-destructive border-destructive/20",
   Biology: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
   Geography: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
   "Computer Science": "bg-violet-500/10 text-violet-600 border-violet-500/20",
   Art: "bg-pink-500/10 text-pink-600 border-pink-500/20",
   Music: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
   PE: "bg-orange-500/10 text-orange-600 border-orange-500/20",
 };
 
 const eventTypeColors: Record<string, string> = {
   meeting: "bg-accent/10 text-accent",
   event: "bg-success/10 text-success",
   exam: "bg-warning/10 text-warning",
 };
 
 export default function Schedule() {
   const [selectedClass, setSelectedClass] = useState("10-A");
   const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [newEvent, setNewEvent] = useState({
     title: "",
     date: "",
     time: "",
     type: "event",
   });
 
   const handleAddEvent = () => {
     if (!newEvent.title || !newEvent.date || !newEvent.time) {
       toast.error("Please fill in all fields");
       return;
     }
     toast.success("Event added successfully");
     setIsDialogOpen(false);
     setNewEvent({ title: "", date: "", time: "", type: "event" });
   };
 
   return (
     <AdminLayout>
       <div className="space-y-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
             <h1 className="text-2xl font-bold">Schedule Management</h1>
             <p className="text-muted-foreground">
               Manage class timetables and school events
             </p>
           </div>
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
             <DialogTrigger asChild>
               <Button>
                 <Plus className="w-4 h-4 mr-2" />
                 Add Event
               </Button>
             </DialogTrigger>
             <DialogContent>
               <DialogHeader>
                 <DialogTitle>Add New Event</DialogTitle>
               </DialogHeader>
               <div className="space-y-4 py-4">
                 <div className="space-y-2">
                   <Label htmlFor="title">Event Title</Label>
                   <Input
                     id="title"
                     value={newEvent.title}
                     onChange={(e) =>
                       setNewEvent({ ...newEvent, title: e.target.value })
                     }
                     placeholder="Enter event title"
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="date">Date</Label>
                     <Input
                       id="date"
                       type="date"
                       value={newEvent.date}
                       onChange={(e) =>
                         setNewEvent({ ...newEvent, date: e.target.value })
                       }
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="time">Time</Label>
                     <Input
                       id="time"
                       type="time"
                       value={newEvent.time}
                       onChange={(e) =>
                         setNewEvent({ ...newEvent, time: e.target.value })
                       }
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="type">Event Type</Label>
                   <Select
                     value={newEvent.type}
                     onValueChange={(value) =>
                       setNewEvent({ ...newEvent, type: value })
                     }
                   >
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="event">Event</SelectItem>
                       <SelectItem value="meeting">Meeting</SelectItem>
                       <SelectItem value="exam">Exam</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <Button onClick={handleAddEvent} className="w-full">
                   Add Event
                 </Button>
               </div>
             </DialogContent>
           </Dialog>
         </div>
 
         {/* Stats */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           <Card>
             <CardContent className="p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Classes Today</p>
                   <p className="text-3xl font-bold mt-1">42</p>
                 </div>
                 <div className="p-3 rounded-xl bg-primary/10 text-primary">
                   <BookOpen className="w-6 h-6" />
                 </div>
               </div>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Teachers Active</p>
                   <p className="text-3xl font-bold mt-1">28</p>
                 </div>
                 <div className="p-3 rounded-xl bg-success/10 text-success">
                   <Users className="w-6 h-6" />
                 </div>
               </div>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Rooms in Use</p>
                   <p className="text-3xl font-bold mt-1">18</p>
                 </div>
                 <div className="p-3 rounded-xl bg-accent/10 text-accent">
                   <MapPin className="w-6 h-6" />
                 </div>
               </div>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Upcoming Events</p>
                   <p className="text-3xl font-bold mt-1">4</p>
                 </div>
                 <div className="p-3 rounded-xl bg-warning/10 text-warning">
                   <CalendarIcon className="w-6 h-6" />
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>
 
         <Tabs defaultValue="timetable" className="space-y-4">
           <TabsList>
             <TabsTrigger value="timetable">Class Timetable</TabsTrigger>
             <TabsTrigger value="calendar">Calendar</TabsTrigger>
           </TabsList>
 
           <TabsContent value="timetable" className="space-y-4">
             {/* Class Selector */}
             <div className="flex items-center gap-4">
               <Label>Select Class:</Label>
               <Select value={selectedClass} onValueChange={setSelectedClass}>
                 <SelectTrigger className="w-48">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   {classes.map((cls) => (
                     <SelectItem key={cls.id} value={cls.name}>
                       {cls.name} - {cls.grade}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
 
             {/* Timetable Grid */}
             <Card>
               <CardHeader className="pb-3">
                 <CardTitle className="text-lg">
                   Weekly Timetable - Class {selectedClass}
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="overflow-x-auto">
                   <table className="w-full border-collapse">
                     <thead>
                       <tr>
                         <th className="p-3 text-left text-sm font-medium text-muted-foreground border-b">
                           Time
                         </th>
                         {weekDays.map((day) => (
                           <th
                             key={day}
                             className="p-3 text-left text-sm font-medium text-muted-foreground border-b min-w-[150px]"
                           >
                             {day}
                           </th>
                         ))}
                       </tr>
                     </thead>
                     <tbody>
                       {timeSlots.map((slot) => (
                         <tr key={slot} className="border-b border-border/50">
                           <td className="p-3 text-sm font-medium text-muted-foreground whitespace-nowrap">
                             {slot}
                           </td>
                           {weekDays.map((day) => {
                             const session = initialTimetable[day]?.[slot];
                             return (
                               <td key={`${day}-${slot}`} className="p-2">
                                 {session ? (
                                   <div
                                     className={`p-2 rounded-lg border ${
                                       subjectColors[session.subject] ||
                                       "bg-muted/50 text-foreground"
                                     }`}
                                   >
                                     <p className="font-medium text-sm">
                                       {session.subject}
                                     </p>
                                     <p className="text-xs opacity-80">
                                       {session.teacher}
                                     </p>
                                     <p className="text-xs opacity-60">
                                       {session.room}
                                     </p>
                                   </div>
                                 ) : (
                                   <div className="p-2 rounded-lg bg-muted/30 text-muted-foreground text-center text-sm">
                                     Free
                                   </div>
                                 )}
                               </td>
                             );
                           })}
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
 
           <TabsContent value="calendar" className="space-y-4">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Calendar */}
               <Card className="lg:col-span-2">
                 <CardHeader className="pb-3">
                   <CardTitle className="text-lg">School Calendar</CardTitle>
                 </CardHeader>
                 <CardContent className="flex justify-center">
                   <Calendar
                     mode="single"
                     selected={selectedDate}
                     onSelect={setSelectedDate}
                     className="rounded-md border"
                   />
                 </CardContent>
               </Card>
 
               {/* Upcoming Events */}
               <Card>
                 <CardHeader className="pb-3">
                   <CardTitle className="text-lg flex items-center gap-2">
                     <CalendarIcon className="w-5 h-5" />
                     Upcoming Events
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-3">
                     {upcomingEvents.map((event) => (
                       <div
                         key={event.id}
                         className="p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                       >
                         <div className="flex items-start justify-between gap-2">
                           <p className="font-medium text-sm">{event.title}</p>
                           <Badge
                             className={
                               eventTypeColors[event.type] || "bg-muted"
                             }
                           >
                             {event.type}
                           </Badge>
                         </div>
                         <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                           <span className="flex items-center gap-1">
                             <CalendarIcon className="w-3 h-3" />
                             {event.date}
                           </span>
                           <span className="flex items-center gap-1">
                             <Clock className="w-3 h-3" />
                             {event.time}
                           </span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             </div>
           </TabsContent>
         </Tabs>
       </div>
     </AdminLayout>
   );
 }