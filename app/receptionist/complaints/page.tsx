/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";

import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
} from "@/components/ui/dialog";

import { DataTable } from "@/components/receptionist/DataTable";
import { StatusBadge } from "@/components/receptionist/StatusBadge";

import type { Complaint } from "@/components/receptionist/types/frontOffice";

import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ReceptionistLayout } from "@/components/receptionist/receptionistLayout";

import { axiosInstance } from "@/apiHome/axiosInstanc";

const API = "/api/v1/complaints";

const empty = {
complaintBy: "",
phone: "",
type: "General",
source: "In Person",
description: "",
actionTaken: "",
date: new Date().toISOString().split("T")[0],
status: "Pending",
note: "",
};

export default function ComplaintsPage() {

const [data, setData] = useState<any[]>([]);
const [loading, setLoading] = useState(false);

const [modal, setModal] = useState<"add" | "edit" | "view" | null>(null);

const [form, setForm] = useState<any>(empty);
const [editId, setEditId] = useState<string | null>(null);


// ================= FETCH =================

const fetchData = async () => {

setLoading(true);

try {

const res = await axiosInstance.get(API);

const formatted = res?.data?.data?.map((i:any)=>({

id: i._id || i.id,

complaintBy:
i.complaintBy ||
i.name ||
"",


phone:
i.phone ||
"",


type:
i.type ||
"General",

source:
i.source ||
"In Person",

description:
i.description ||
"",


actionTaken:
i.actionTaken ||
"",


date:
i.date ?
new Date(i.date).toISOString().split("T")[0]
: "",

status:
i.status ||
"Pending",

note:
i.note ||
"",

}));

setData(formatted || []);

} catch (err) {

console.error(err);

toast.error("Failed to fetch complaints");

}

setLoading(false);

};

useEffect(()=>{

fetchData();

},[]);


// ================= SAVE =================

const handleSave = async () => {

if(!form.complaintBy || !form.description){

toast.error("Required fields missing");
return;
}

try{

if(modal==="add"){

await axiosInstance.post(API, form);

toast.success("Complaint Added");

}else{

await axiosInstance.put(
`${API}/${editId}`,
form
);

toast.success("Complaint Updated");

}

setModal(null);
setForm(empty);
setEditId(null);

fetchData();

}catch(err){

toast.error("Something went wrong");

}

};


// ================= DELETE =================

const handleDelete = async(id:string)=>{

try{

await axiosInstance.delete(`${API}/${id}`);

toast.success("Deleted");

fetchData();

}catch{

toast.error("Delete failed");

}

};


// ================= TABLE COLUMNS =================

const columns = [

{ key:"complaintBy", label:"Complaint By" },

{ key:"phone", label:"Phone" },

{ key:"type", label:"Type" },

{ key:"source", label:"Source" },

{ key:"date", label:"Date" },

{
key:"status",
label:"Status",
render:(i:any)=>
<StatusBadge status={i.status}/>
},

];

const isView = modal==="view";


return (

<ReceptionistLayout>

<div className="space-y-6 p-4">

{/* Header */}

<div className="flex justify-between items-center">

<div>

<h2 className="text-2xl font-bold">
Complaints
</h2>

<p className="text-muted-foreground">
Manage complaints
</p>

</div>

<Button
className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
onClick={()=>{

setForm(empty);
setModal("add");

}}
>

<Plus className="w-4 h-4 mr-2"/>

Add Complaint

</Button>

</div>


{/* Table */}

<DataTable

data={data}

columns={columns}

loading={loading}

searchKey="complaintBy"

onView={(i:any)=>{

const {id,...rest}=i;

setForm(rest);

setEditId(id);

setModal("view");

}}

onEdit={(i:any)=>{

const {id,...rest}=i;

setForm(rest);

setEditId(id);

setModal("edit");

}}

onDelete={(i:any)=>{

handleDelete(i.id);

}}

/>



{/* Dialog */}

<Dialog

open={modal!==null}

onOpenChange={()=>{

setModal(null);
setEditId(null);

}}

>

<DialogContent
className="max-w-3xl max-h-[85vh] overflow-y-auto"
>

<DialogHeader>

<DialogTitle>

{modal==="add" && "Add Complaint"}

{modal==="edit" && "Edit Complaint"}

{modal==="view" && "View Complaint"}

</DialogTitle>

</DialogHeader>


<div className="grid grid-cols-2 gap-4">


{/* Complaint By */}

<div>

<Label>Complaint By *</Label>

<Input

value={form.complaintBy}

disabled={isView}

onChange={(e)=>

setForm({

...form,

complaintBy:e.target.value

})

}

/>

</div>


{/* Phone */}

<div>

<Label>Phone</Label>

<Input

value={form.phone}

disabled={isView}

onChange={(e)=>

setForm({

...form,

phone:e.target.value

})

}

/>

</div>


{/* Type */}

<div>

<Label>Type</Label>

<Select

value={form.type}

disabled={isView}

onValueChange={(v)=>{

setForm({

...form,

type:v

})

}}

>

<SelectTrigger>

<SelectValue/>

</SelectTrigger>

<SelectContent>

{

[

"General",

"Academic",

"Facility",

"Staff",

"Transport",

"Hostel",

"Canteen",

"Other"

]

.map((t)=>(

<SelectItem key={t} value={t}>

{t}

</SelectItem>

))

}

</SelectContent>

</Select>

</div>


{/* Source */}

<div>

<Label>Source</Label>

<Select

value={form.source}

disabled={isView}

onValueChange={(v)=>{

setForm({

...form,

source:v

})

}}

>

<SelectTrigger>

<SelectValue/>

</SelectTrigger>

<SelectContent>

{

[

"In Person",

"Phone",

"Email",

"Written",

"Online"

]

.map((s)=>(

<SelectItem key={s} value={s}>

{s}

</SelectItem>

))

}

</SelectContent>

</Select>

</div>


{/* Status */}

<div>

<Label>Status</Label>

<Select

value={form.status}

disabled={isView}

onValueChange={(v)=>{

setForm({

...form,

status:v

})

}}

>

<SelectTrigger>

<SelectValue/>

</SelectTrigger>

<SelectContent>

{

[

"Pending",

"In Progress",

"Resolved"

]

.map((s)=>(

<SelectItem key={s} value={s}>

{s}

</SelectItem>

))

}

</SelectContent>

</Select>

</div>


{/* Date */}

<div>

<Label>Date</Label>

<Input

type="date"

value={form.date}

disabled={isView}

onChange={(e)=>{

setForm({

...form,

date:e.target.value

})

}}

/>

</div>


{/* Description */}

<div className="col-span-2">

<Label>Description *</Label>

<Textarea

value={form.description}

disabled={isView}

onChange={(e)=>{

setForm({

...form,

description:e.target.value

})

}}

/>

</div>


{/* Action */}

<div className="col-span-2">

<Label>Action Taken</Label>

<Textarea

value={form.actionTaken}

disabled={isView}

onChange={(e)=>{

setForm({

...form,

actionTaken:e.target.value

})

}}

/>

</div>


{/* Note */}

<div className="col-span-2">

<Label>Note</Label>

<Textarea

value={form.note}

disabled={isView}

onChange={(e)=>{

setForm({

...form,

note:e.target.value

})

}}

/>

</div>

</div>


{!isView && (

<div className="flex justify-end gap-2 pt-4">

<Button

variant="outline"

onClick={()=>setModal(null)}

>

Cancel

</Button>

<Button

className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"

onClick={handleSave}

>

{modal==="add" ? "Add" : "Update"}

</Button>

</div>

)}

</DialogContent>

</Dialog>

</div>

</ReceptionistLayout>

);

}