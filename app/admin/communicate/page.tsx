/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"


import { useEffect, useState } from "react";
import { Plus, Search, Bell, Mail, MessageSquare, Phone, Send, Eye, Trash2,  Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { toast } from "sonner";

type Template = {
  id: string
  type: string
  title: string
  content: string
  createdAt: string
}

type EmailTemplate  = {
  id: number
  name: string
  subject: string
  content: string
  lastUsed: string
}

type SmsTemplate = {
  id: string
  name: string
  content: string
  lastUsed: string
}

type WhatsappTemplate = {
  id: string
  name: string
  content: string
  lastUsed: string
}

type MessageLog = {
  id: string
  type: "EMAIL" | "SMS" | "WHATSAPP" | "INFO"
  to: string
  subject: string
  sentAt: string
  status: "DELIVERED" | "FAILED" | "PENDING"
}

type Pagination = {
  currentPage: number
  totalPages: number
  totalTemplates: number
  perPage: number
}

const Page = () => {
    const [activeTab, setActiveTab] = useState("notices");
    const [openAdd, setOpenAdd] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openView, setOpenView] = useState(false)

    const [templates, setTemplates] = useState<Template[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
    const [emailTemplate, setEmailTemplate] = useState<EmailTemplate[]>([])

    const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>([])
    const [selectedSmsTemplate, setSelectedSmsTemplate] = useState<SmsTemplate | null>(null)

    const [openAddSms, setOpenAddSms] = useState(false)
    const [openEditSms, setOpenEditSms] = useState(false)
    const [openViewSms, setOpenViewSms] = useState(false)

    const [smsFormData, setSmsFormData] = useState({
        title: "",
        content: ""
    })

    const [page, setPage] = useState(1)
    const perPage = 10

    const [loading, setLoading] = useState(false)

    const [search, setSearch] = useState("")

    const [selectedNotice, setSelectedNotice] = useState<Template | null>(null)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
    })

    const [formEmailData, setFormEmailData] = useState({
        title: "",
        content: "",
    })

    const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsappTemplate[]>([])
    const [selectedWhatsappTemplate, setSelectedWhatsappTemplate] = useState<WhatsappTemplate | null>(null)

    const [openAddWhatsapp, setOpenAddWhatsapp] = useState(false)
    const [openEditWhatsapp, setOpenEditWhatsapp] = useState(false)
    const [openViewWhatsapp, setOpenViewWhatsapp] = useState(false)

    const [messageLogs, setMessageLogs] = useState<MessageLog[]>([])
    const [logType, setLogType] = useState<string>("all")
    const [loadingLogs, setLoadingLogs] = useState(false)

    const [whatsappFormData, setWhatsappFormData] = useState({
        title: "",
        content: ""
    })

    const [recipient, setRecipient] = useState<string>("")
    const [templateId, setTemplateId] = useState<string>("")
    const [subject, setSubject] = useState("")
    const [content, setContent] = useState("")
    const [sending, setSending] = useState(false)

    const [smsTemplateId, setSmsTemplateId] = useState<string>("")
    const [smsContent, setSmsContent] = useState("")
    const [sendingSms, setSendingSms] = useState(false)

    const [whatsappRecipient, setWhatsappRecipient] = useState("")
    const [whatsappTemplateId, setWhatsappTemplateId] = useState("")
    const [whatsappMessage, setWhatsappMessage] = useState("")
    const [sendingWhatsapp, setSendingWhatsapp] = useState(false)

    const [selectedLog, setSelectedLog] = useState<any>(null)
    const [viewOpen, setViewOpen] = useState(false)

{/* Notice Board */}

const fetchTemplates = async () => {
  try {
    setLoading(true)

    const res = await axiosInstance.get(
      `/api/v1/message/templates?type=NOTICE`,
      {
        params:{
          page,
          perPage,
          title:search
        }
      }
    )

    setTemplates(res.data.data)
    setPagination(res.data.pagination)

  } catch (error) {
    console.error("Error fetching templates", error)
  } finally {
    setLoading(false)
  }
} 

const createTemplate = async () => {
  try {

    await axiosInstance.post("/api/v1/message/templates", {
      type: "NOTICE",
      title: formData.title,
      content: formData.description
    })

    setOpenAdd(false)

    setFormData({
      title: "",
      description: ""
    })

    fetchTemplates()

  } catch (error) {
    console.error("Create template error", error)
  }
}

const updateTemplate = async () => {
  if (!selectedNotice) return

  try {

    await axiosInstance.put(
      `/api/v1/message/templates/${selectedNotice.id}`,
      {
        title: formData.title,
        content: formData.description
      }
    )

    setOpenEdit(false)

    fetchTemplates()

  } catch (error) {
    console.error("Update error", error)
  }
}

const deleteTemplate = async (id: string) => {
  try {

    await axiosInstance.delete(`/api/v1/message/templates/${id}`)

    fetchTemplates()

  } catch (error) {
    console.error("Delete error", error)
  }
}

{/*Email Template*/}

const fetchEmailTemplates = async () => {
  try {
    setLoading(true)

    const res = await axiosInstance.get(
      `/api/v1/message/templates`,
      {
        params: {
          type: "EMAIL",
          page,
          perPage,
        }
      }
    )

    const formatted = res.data.data.map((t: any) => ({
      id: t.id,
      name: t.title,
      subject: t.title,
      content: t.content,
      lastUsed: new Date(t.createdAt).toLocaleDateString()
    }))

    setEmailTemplate(formatted)

  } catch (error) {
    console.error("Error fetching email templates", error)
  } finally {
    setLoading(false)
  }
}

const createEmailTemplate = async () => {
  try {

    await axiosInstance.post("/api/v1/message/templates", {
      type: "EMAIL",
      title: formEmailData.title,
      content: formEmailData.content
    })

    setOpenAdd(false)

    setFormEmailData({
      title: "",
      content: ""
    })

    fetchEmailTemplates()

  } catch (error) {
    console.error("Create template error", error)
  }
}

const updateEmailTemplate = async () => {
  if (!selectedTemplate) return

  try {

    await axiosInstance.put(
      `/api/v1/message/templates/${selectedTemplate.id}`,
      {
        title: formEmailData.title,
        content: formEmailData.content
      }
    )

    setOpenEdit(false)

    fetchEmailTemplates()

  } catch (error) {
    console.error("Update template error", error)
  }
}

const deleteEmailTemplate = async (id: string) => {
  try {

    await axiosInstance.delete(`/api/v1/message/templates/${id}`)

    fetchEmailTemplates()

  } catch (error) {
    console.error("Delete template error", error)
  }
}

{/*SMS Template*/}

const fetchSmsTemplates = async () => {
  try {

    const res = await axiosInstance.get(
      "/api/v1/message/templates",
      {
        params: {
          type: "SMS",
          page: 1,
          perPage: 10
        }
      }
    )

    const formatted = res.data.data.map((t: any) => ({
      id: t.id,
      name: t.title,
      content: t.content,
      lastUsed: new Date(t.createdAt).toLocaleDateString()
    }))

    setSmsTemplates(formatted)

  } catch (error) {
    console.error("SMS template fetch error", error)
  }
}

const createSmsTemplate = async () => {
  try {

    await axiosInstance.post("/api/v1/message/templates", {
      type: "SMS",
      title: smsFormData.title,
      content: smsFormData.content
    })

    setOpenAddSms(false)

    setSmsFormData({
      title: "",
      content: ""
    })

    fetchSmsTemplates()

  } catch (error) {
    console.error("Create SMS template error", error)
  }
}

const updateSmsTemplate = async () => {

  if (!selectedSmsTemplate) return

  try {

    await axiosInstance.put(
      `/api/v1/message/templates/${selectedSmsTemplate.id}`,
      {
        title: smsFormData.title,
        content: smsFormData.content
      }
    )

    setOpenEditSms(false)

    fetchSmsTemplates()

  } catch (error) {
    console.error("Update SMS template error", error)
  }
}

const deleteSmsTemplate = async (id: string) => {
  try {

    await axiosInstance.delete(`/api/v1/message/templates/${id}`)

    fetchSmsTemplates()

  } catch (error) {
    console.error("Delete SMS template error", error)
  }
}

{/*WhatsApp Template*/}

const fetchWhatsappTemplates = async () => {
  try {

    const res = await axiosInstance.get(
      "/api/v1/message/templates",
      {
        params: {
          type: "WHATSAPP",
          page: 1,
          perPage: 10
        }
      }
    )

    const formatted = res.data.data.map((t: any) => ({
      id: t.id,
      name: t.title,
      content: t.content,
      lastUsed: new Date(t.createdAt).toLocaleDateString()
    }))

    setWhatsappTemplates(formatted)

  } catch (error) {
    console.error("WhatsApp template fetch error", error)
  }
} 

const createWhatsappTemplate = async () => {
  try {

    await axiosInstance.post("/api/v1/message/templates", {
      type: "WHATSAPP",
      title: whatsappFormData.title,
      content: whatsappFormData.content
    })

    setOpenAddWhatsapp(false)

    setWhatsappFormData({
      title: "",
      content: ""
    })

    fetchWhatsappTemplates()

  } catch (error) {
    console.error("Create WhatsApp template error", error)
  }
}

const updateWhatsappTemplate = async () => {

  if (!selectedWhatsappTemplate) return

  try {

    await axiosInstance.put(
      `/api/v1/message/templates/${selectedWhatsappTemplate.id}`,
      {
        title: whatsappFormData.title,
        content: whatsappFormData.content
      }
    )

    setOpenEditWhatsapp(false)

    fetchWhatsappTemplates()

  } catch (error) {
    console.error("Update WhatsApp template error", error)
  }
}

const deleteWhatsappTemplate = async (id: string) => {
  try {

    await axiosInstance.delete(`/api/v1/message/templates/${id}`)

    fetchWhatsappTemplates()

  } catch (error) {
    console.error("Delete WhatsApp template error", error)
  }
}

useEffect(() => {
  fetchTemplates()
}, [page,search])

useEffect(() => {
  fetchEmailTemplates()
}, [page])

useEffect(() => {
  fetchWhatsappTemplates()
}, [page])

useEffect(() => {
  fetchSmsTemplates()
}, [page])

const sendEmail = async () => {
  try {

    if (!recipient || !subject || !content) {
      toast.error("Recipient, subject and message are required")
      return
    }

    setSending(true)

    const res = await axiosInstance.post("/api/v1/message", {
      type: "EMAIL",
      title: subject,
      content: content,
      recipient: recipient
    })

    if (res.data.success) {

      toast.success(res.data.message)

      setRecipient("")
      setTemplateId("")
      setSubject("")
      setContent("")

    }

  } catch (error: any) {

    toast.error(error?.response?.data?.message || "Failed to send email")

  } finally {

    setSending(false)

  }
}

const handleTemplateChange = (id: string) => {

  setTemplateId(id)

  const template = emailTemplate.find((t) => String(t.id) === id)

  if (template) {
    setSubject(template.subject)
    setContent(template.content)
  }

}

const handleSmsTemplateChange = (id: string) => {

  setSmsTemplateId(id)

  const template = smsTemplates.find((t) => String(t.id) === id)

  if (template) {
    setSmsContent(template.content)
  }

}

const sendSMS = async () => {

  try {

    if (!recipient || !smsContent) {
      toast.error("Recipient and message are required")
      return
    }

    setSendingSms(true)

    const res = await axiosInstance.post("/api/v1/message", {
      type: "SMS",
      title: "SMS Notification",
      content: smsContent,
      recipient: recipient
    })

    if (res.data.success) {

      toast.success(res.data.message)

      setSmsTemplateId("")
      setSmsContent("")

    }

  } catch (error: any) {

    toast.error(error?.response?.data?.message || "Failed to send SMS")

  } finally {

    setSendingSms(false)

  }

}

const handleWhatsappTemplateChange = (id: string) => {

  setWhatsappTemplateId(id)

  const template = whatsappTemplates.find((t) => String(t.id) === id)

  if (template) {
    setWhatsappMessage(template.content)
  }

}

const sendWhatsapp = async () => {

  try {

    if (!whatsappRecipient || !whatsappMessage) {
      toast.error("Recipient and message are required")
      return
    }

    setSendingWhatsapp(true)

    const res = await axiosInstance.post("/api/v1/message", {
      type: "WHATSAPP",
      title: "WhatsApp Notification",
      content: whatsappMessage,
      recipient: whatsappRecipient
    })

    if (res.data.success) {

      toast.success(res.data.message)

      setWhatsappRecipient("")
      setWhatsappTemplateId("")
      setWhatsappMessage("")

    }

  } catch (error: any) {

    toast.error(error?.response?.data?.message || "Failed to send WhatsApp message")

  } finally {

    setSendingWhatsapp(false)

  }

}

const fetchMessageLogs = async () => {
  try {

    setLoadingLogs(true)

    const res = await axiosInstance.get("/api/v1/message", {
      params: {
        page,
        perPage
      }
    })

    let logs = res.data.data.map((msg: any) => ({
      id: msg.id,
      type: msg.type,
      to: msg.recipient || "ALL",
      subject: msg.title,
      content:msg.content,
      sentAt: new Date(msg.createdAt).toLocaleString(),
      status: "DELIVERED"
    }))

    if (logType !== "all") {
      logs = logs.filter((l: MessageLog) => l.type === logType.toUpperCase())
    }

    setMessageLogs(logs)

  } catch (error) {

    console.error("Error fetching logs", error)

  } finally {

    setLoadingLogs(false)

  }
}

useEffect(() => {
  fetchMessageLogs()
}, [page, logType])


  return (
    <AdminLayout>
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-xl border shadow-sm">
            
            <div className="flex items-center gap-4">
                
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md">
                📢
                </div>

                {/* Text */}
                <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Communicate
                </h1>

                <p className="text-sm text-gray-600 mt-1">
                    Manage notices, emails, SMS, and WhatsApp communications
                </p>
                </div>
            </div>

            {/* Badge */}
            <span className="hidden sm:inline-flex items-center px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                Messaging Center
            </span>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                {/* Notices */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-blue-600 font-medium">Total Notices</p>
                            <p className="text-2xl font-bold text-blue-700 mt-1">{templates.length}</p>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Bell className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-purple-600 font-medium">Email Templates</p>
                            <p className="text-2xl font-bold text-purple-700 mt-1">{emailTemplate.length}</p>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <Mail className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* SMS */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-green-600 font-medium">SMS Templates</p>
                            <p className="text-2xl font-bold text-green-700 mt-1">{smsTemplates.length}</p>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <Phone className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* WhatsApp */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-xl shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-emerald-600 font-medium">WhatsApp Templates</p>
                            <p className="text-2xl font-bold text-emerald-700 mt-1">{whatsappTemplates.length}</p>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-lg">
                            <MessageSquare className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </div>

            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
                
                <TabsList className="flex flex-wrap gap-2 p-2 bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50 rounded-xl shadow-sm border">

                    <TabsTrigger
                        value="notices"
                        className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-blue-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                        📢 Notice Board
                    </TabsTrigger>

                    <TabsTrigger
                        value="email-template"
                        className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-purple-100 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                    >
                        ✉️ Email Template
                    </TabsTrigger>

                    <TabsTrigger
                        value="sms-template"
                        className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-green-100 data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    >
                        📱 SMS Template
                    </TabsTrigger>

                    <TabsTrigger
                        value="whatsapp-template"
                        className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-emerald-100 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                    >
                        💬 WhatsApp Template
                    </TabsTrigger>

                    <TabsTrigger
                        value="send-email"
                        className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-indigo-100 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                    >
                        📤 Send Email
                    </TabsTrigger>

                    <TabsTrigger
                        value="send-sms"
                        className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-teal-100 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
                    >
                        📤 Send SMS
                    </TabsTrigger>

                    <TabsTrigger
                        value="send-whatsapp"
                        className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-emerald-100 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                    >
                        📤 Send WhatsApp
                    </TabsTrigger>

                    <TabsTrigger
                        value="logs"
                        className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-orange-100 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                        📜 Message Logs
                    </TabsTrigger>

                </TabsList>

                {/* Notice Board */}
                <TabsContent value="notices">
                    <div className="rounded-xl border shadow-sm bg-white overflow-hidden">

                        {/* Header */}
                        <div className="p-4 border-b bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 flex justify-between items-center">

                            <div className="flex items-center gap-2 bg-white border rounded-lg px-3 h-9 w-full max-w-sm shadow-sm">
                                <Search className="w-4 h-4 text-muted-foreground" />
                                <Input
                                placeholder="Search notices..."
                                value={search}
                                onChange={(e)=>setSearch(e?.target?.value)}
                                className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-8 text-sm"
                                />
                            </div>

                            <Button
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow hover:opacity-90"
                                onClick={() => setOpenAdd(true)}
                                >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Notice
                            </Button>

                        </div>

                        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                            <DialogContent className="max-w-lg">

                                <DialogHeader>
                                    <DialogTitle>Add Notice</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4">

                                    <Input
                                    placeholder="Notice Title"
                                    value={formData.title}
                                    onChange={(e)=>setFormData({...formData,title:e.target.value})}
                                    />

                                    <Textarea placeholder="Notice Content" 
                                    value={formData.description}
                                    onChange={(e)=>setFormData({...formData,description:e.target.value})}
                                    />

                                </div>

                                <DialogFooter>
                                    <Button variant="outline" onClick={()=>setOpenAdd(false)}>
                                    Cancel
                                    </Button>

                                    <Button className="bg-indigo-600 text-white"
                                    onClick={createTemplate}>
                                    Add Notice
                                    </Button>
                                </DialogFooter>

                            </DialogContent>
                        </Dialog>

                        {/* Table */}
                        <Table>

                        <TableHeader>
                            <TableRow className="bg-slate-100">
                            <TableHead className="text-xs font-semibold text-slate-600">Title</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-600">Date</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-600">Description</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-600">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {templates.map((n) => (
                            <TableRow
                                key={n.id}
                                className="hover:bg-blue-50 transition-colors"
                            >

                                <TableCell className="text-sm font-medium text-slate-700">
                                    {n.title}
                                </TableCell>

                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(n.createdAt).toLocaleDateString()}
                                </TableCell>

                                <TableCell className="text-sm text-muted-foreground">
                                    {n.content}
                                </TableCell>

                                <TableCell>
                                <div className="flex gap-1">

                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 hover:bg-blue-100"
                                    onClick={() => {
                                    setSelectedNotice(n)
                                    setOpenView(true)
                                    }}
                                    >
                                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                                    </Button>

                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 hover:bg-green-100"
                                    onClick={() => {
                                    setSelectedNotice(n)
                                    setFormData({
                                        title: n.title,
                                        description: n.content
                                    })
                                    setOpenEdit(true)
                                    }}
                                    >
                                        <Edit className="w-3.5 h-3.5 text-green-600" />
                                    </Button>

                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 hover:bg-red-100"
                                    onClick={()=>deleteTemplate(n.id)}
                                    >
                                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                    </Button>

                                </div>
                                
                                <Dialog open={openView} onOpenChange={setOpenView}>
                                    <DialogContent>

                                        <DialogHeader>
                                            <DialogTitle>Notice Details</DialogTitle>
                                        </DialogHeader>

                                        {selectedNotice && (

                                            <div className="space-y-3 text-sm">

                                                <p><b>Title:</b> {selectedNotice.title}</p>

                                                <p><b>Date:</b> {new Date(selectedNotice.createdAt).toLocaleDateString()}</p>

                                                <p><b>Description:</b> {selectedNotice.content}</p>

                                            </div>

                                        )}

                                    </DialogContent>
                                </Dialog>

                                <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                                    <DialogContent className="max-w-lg">

                                        <DialogHeader>
                                            <DialogTitle>Edit Notice</DialogTitle>
                                        </DialogHeader>

                                        <div className="space-y-4">

                                            <Input
                                            value={formData.title}
                                            onChange={(e)=>setFormData({...formData,title:e.target.value})}
                                            />

                                            <Input
                                            value={formData.description}
                                            onChange={(e)=>setFormData({...formData,description :e.target.value})}
                                            />

                                        </div>

                                        <DialogFooter>

                                            <Button
                                            variant="outline"
                                            onClick={()=>setOpenEdit(false)}
                                            >
                                            Cancel
                                            </Button>

                                            <Button className="bg-green-600 text-white"
                                            onClick={updateTemplate}
                                            >
                                            Update Notice
                                            </Button>

                                        </DialogFooter>

                                    </DialogContent>
                                </Dialog>                                
                                </TableCell>

                            </TableRow>
                            ))}
                        </TableBody>

                        </Table>

                        <div className="flex justify-between items-center p-4 border-t">

                            <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </Button>

                            <p className="text-sm">
                                Page {pagination?.currentPage} of {pagination?.totalPages}
                            </p>

                            <Button
                            variant="outline"
                            disabled={page === pagination?.totalPages}
                            onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>

                        </div>

                    </div>
                </TabsContent>

                {/* Email Templates */}
                <TabsContent value="email-template">
                    <div className="rounded-xl border shadow-sm bg-white overflow-hidden">

                        {/* Header */}
                        <div className="p-4 border-b bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 flex justify-between items-center">

                            <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
                                ✉️ Email Templates
                            </div>

                            <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow hover:opacity-90"
                             onClick={() => setOpenAdd(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Template
                            </Button>

                        </div>

                        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                            <DialogContent className="max-w-lg">

                                <DialogHeader>
                                <DialogTitle>Create Email Template</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4">

                                <Input
                                    placeholder="Template Name"
                                    value={formEmailData.title}
                                    onChange={(e)=>setFormEmailData({...formEmailData,title:e.target.value})}
                                />

                                <Textarea
                                    placeholder="Template Content"
                                    value={formEmailData.content}
                                    onChange={(e)=>setFormEmailData({...formEmailData,content:e.target.value})}
                                />

                                </div>

                                <DialogFooter>

                                <Button variant="outline" onClick={()=>setOpenAdd(false)}>
                                    Cancel
                                </Button>

                                <Button className="bg-purple-600 text-white"
                                onClick={createEmailTemplate}
                                >
                                    Create Template
                                </Button>

                                </DialogFooter>

                            </DialogContent>
                        </Dialog>

                        {/* Table */}
                        <Table>

                            <TableHeader>
                                <TableRow className="bg-slate-100">
                                <TableHead className="text-xs font-semibold text-slate-600">Title</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600">Descrpition</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600"> Date</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {emailTemplate.map((t: any) => (
                                    <TableRow
                                        key={t.id}
                                        className="hover:bg-purple-50 transition-colors"
                                    >

                                        <TableCell className="text-sm font-medium text-slate-700">
                                            {t.name}
                                        </TableCell>

                                        <TableCell className="text-sm text-muted-foreground">
                                            {t.content}
                                        </TableCell>

                                        <TableCell className="text-sm text-muted-foreground">
                                            {t.lastUsed}
                                        </TableCell>

                                        <TableCell>
                                        <div className="flex gap-1">

                                            <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 hover:bg-blue-100"
                                            onClick={() => {
                                                setSelectedTemplate(t)
                                                setOpenView(true)
                                            }}
                                            >
                                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                                            </Button>

                                            <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 hover:bg-green-100"
                                            onClick={() => {
                                            setSelectedTemplate(t)
                                            setFormEmailData({
                                                title: t.name,
                                                content: t.content
                                            })
                                            setOpenEdit(true)
                                            }}
                                            >
                                            <Edit className="w-3.5 h-3.5 text-green-600" />
                                            </Button>

                                            <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 hover:bg-red-100"
                                            onClick={()=>deleteEmailTemplate(t.id)}
                                            >
                                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                            </Button>

                                        </div>

                                        <Dialog open={openView} onOpenChange={setOpenView}>
                                        <DialogContent>

                                            <DialogHeader>
                                            <DialogTitle>Email Template Details</DialogTitle>
                                            </DialogHeader>

                                            {selectedTemplate && (

                                            <div className="space-y-3 text-sm">

                                                <p><b>Name:</b> {selectedTemplate.name}</p>

                                                <p><b>Subject:</b> {selectedTemplate.subject}</p>

                                                <p><b>Description:</b> {selectedTemplate.content}</p>

                                                <p><b>Date:</b> {selectedTemplate.lastUsed}</p>

                                            </div>

                                            )}

                                        </DialogContent>
                                        </Dialog>

                                        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                                        <DialogContent className="max-w-lg">

                                            <DialogHeader>
                                            <DialogTitle>Edit Email Template</DialogTitle>
                                            </DialogHeader>

                                            <div className="space-y-4">

                                            <Input
                                                value={formEmailData.title}
                                                onChange={(e)=>setFormEmailData({...formEmailData,title:e.target.value})}
                                            />

                                            <Textarea
                                                value={formEmailData.content}
                                                onChange={(e)=>setFormEmailData({...formEmailData,content:e.target.value})}
                                            />

                                            </div>

                                            <DialogFooter>

                                            <Button
                                            variant="outline"
                                            onClick={()=>setOpenEdit(false)}
                                            >
                                                Cancel
                                            </Button>

                                            <Button className="bg-green-600 text-white"
                                            onClick={updateEmailTemplate}
                                            >
                                                Update Template
                                            </Button>

                                            </DialogFooter>

                                        </DialogContent>
                                        </Dialog>

                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>

                        <div className="flex justify-between items-center p-4 border-t">

                            <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </Button>

                            <p className="text-sm">
                                Page {pagination?.currentPage} of {pagination?.totalPages}
                            </p>

                            <Button
                            variant="outline"
                            disabled={page === pagination?.totalPages}
                            onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>

                        </div>

                    </div>
                </TabsContent>

                {/* SMS Templates */}
                <TabsContent value="sms-template">
                    <div className="rounded-xl border shadow-sm bg-white overflow-hidden">

                        {/* Header */}
                        <div className="p-4 border-b bg-gradient-to-r from-green-50 via-teal-50 to-emerald-50 flex justify-between items-center">

                            <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                                📱 SMS Templates
                            </div>

                            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow hover:opacity-90"
                            onClick={() => setOpenAddSms(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Template
                            </Button>

                        </div>

                        <Dialog open={openAddSms} onOpenChange={setOpenAddSms}>
                            <DialogContent>

                                <DialogHeader>
                                    <DialogTitle>Create SMS Template</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4">

                                    <Input
                                    placeholder="Template Name"
                                    value={smsFormData.title}
                                    onChange={(e)=>setSmsFormData({...smsFormData,title:e.target.value})}
                                    />

                                    <Textarea
                                    placeholder="SMS Content"
                                    value={smsFormData.content}
                                    onChange={(e)=>setSmsFormData({...smsFormData,content:e.target.value})}
                                    />

                                </div>

                                <DialogFooter>

                                    <Button
                                    variant="outline"
                                    onClick={()=>setOpenAddSms(false)}
                                    >
                                    Cancel
                                    </Button>

                                    <Button
                                    className="bg-green-600 text-white"
                                    onClick={createSmsTemplate}
                                    >
                                    Create
                                    </Button>

                                </DialogFooter>

                            </DialogContent>
                        </Dialog>           

                        {/* Table */}
                        <Table>

                            <TableHeader>
                                <TableRow className="bg-slate-100">
                                <TableHead className="text-xs font-semibold text-slate-600">Template Name</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600">Content Preview</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600">Date</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {smsTemplates.map((t) => (
                                <TableRow
                                    key={t.id}
                                    className="hover:bg-green-50 transition-colors"
                                >

                                    <TableCell className="text-sm font-medium text-slate-700">
                                    {t.name}
                                    </TableCell>

                                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                                    {t.content}
                                    </TableCell>

                                    <TableCell className="text-sm text-muted-foreground">
                                    {t.lastUsed}
                                    </TableCell>

                                    <TableCell>
                                    <div className="flex gap-1">

                                        <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 hover:bg-blue-100"
                                            onClick={()=>{
                                                setSelectedSmsTemplate(t)
                                                setOpenViewSms(true)
                                            }}
                                        >
                                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                                        </Button>

                                        <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 hover:bg-green-100"
                                            onClick={()=>{
                                                setSelectedSmsTemplate(t)

                                                setSmsFormData({
                                                title: t.name,
                                                content: t.content
                                                })

                                                setOpenEditSms(true)
                                            }}
                                        >
                                        <Edit className="w-3.5 h-3.5 text-green-600" />
                                        </Button>

                                        <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 hover:bg-red-100"
                                        onClick={() => deleteSmsTemplate(t.id)}
                                        >
                                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                        </Button>

                                    </div>
                                        <Dialog open={openEditSms} onOpenChange={setOpenEditSms}>
                                            <DialogContent>

                                                <DialogHeader>
                                                    <DialogTitle>Edit SMS Template</DialogTitle>
                                                </DialogHeader>

                                                <div className="space-y-4">

                                                    <Input
                                                    value={smsFormData.title}
                                                    onChange={(e)=>setSmsFormData({...smsFormData,title:e.target.value})}
                                                    />

                                                    <Textarea
                                                    value={smsFormData.content}
                                                    onChange={(e)=>setSmsFormData({...smsFormData,content:e.target.value})}
                                                    />

                                                </div>

                                                <Button
                                                className="bg-green-600 text-white"
                                                onClick={updateSmsTemplate}
                                                >
                                                Update
                                                </Button>

                                            </DialogContent>
                                        </Dialog>

                                        <Dialog open={openViewSms} onOpenChange={setOpenViewSms}>
                                            <DialogContent>

                                                <DialogHeader>
                                                    <DialogTitle>SMS Template</DialogTitle>
                                                </DialogHeader>

                                                {selectedSmsTemplate && (

                                                    <div className="space-y-3">

                                                        <p><b>Name:</b> {selectedSmsTemplate.name}</p>

                                                        <p><b>Content:</b> {selectedSmsTemplate.content}</p>

                                                        <p><b>Date:</b> {selectedSmsTemplate.lastUsed}</p>

                                                    </div>

                                                )}

                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>

                                </TableRow>
                                ))}
                            </TableBody>

                        </Table>

                        <div className="flex justify-between items-center p-4 border-t">

                            <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </Button>

                            <p className="text-sm">
                                Page {pagination?.currentPage} of {pagination?.totalPages}
                            </p>

                            <Button
                            variant="outline"
                            disabled={page === pagination?.totalPages}
                            onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>

                        </div>

                    </div>
                </TabsContent>

                {/* WhatsApp Templates */}
                <TabsContent value="whatsapp-template">
                    <div className="rounded-xl border shadow-sm bg-white overflow-hidden">

                        {/* Header */}
                        <div className="p-4 border-b bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 flex justify-between items-center">

                            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                                💬 WhatsApp Templates
                            </div>

                            <Button className="bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow hover:opacity-90"
                            onClick={() => setOpenAddWhatsapp(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Template
                            </Button>

                        </div>
                        <Dialog open={openAddWhatsapp} onOpenChange={setOpenAddWhatsapp}>
                            <DialogContent>

                                <DialogHeader>
                                <DialogTitle>Create WhatsApp Template</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4">

                                    <Input
                                    placeholder="Template Name"
                                    value={whatsappFormData.title}
                                    onChange={(e)=>setWhatsappFormData({...whatsappFormData,title:e.target.value})}
                                    />

                                    <Textarea
                                    placeholder="WhatsApp Content"
                                    value={whatsappFormData.content}
                                    onChange={(e)=>setWhatsappFormData({...whatsappFormData,content:e.target.value})}
                                    />

                                </div>

                                <DialogFooter>

                                    <Button
                                    variant="outline"
                                    onClick={()=>setOpenAddWhatsapp(false)}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                    className="bg-emerald-600 text-white"
                                    onClick={createWhatsappTemplate}
                                    >
                                        Create
                                    </Button>

                                </DialogFooter>

                            </DialogContent>
                        </Dialog>

       

                        {/* Table */}
                        <Table>

                            <TableHeader>
                                <TableRow className="bg-slate-100">
                                <TableHead className="text-xs font-semibold text-slate-600">Template Name</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600">Content Preview</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600">Date</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {whatsappTemplates.map((t) => (
                                <TableRow
                                    key={t.id}
                                    className="hover:bg-emerald-50 transition-colors"
                                >

                                    <TableCell className="text-sm font-medium text-slate-700">
                                    {t.name}
                                    </TableCell>

                                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                                    {t.content}
                                    </TableCell>

                                    <TableCell className="text-sm text-muted-foreground">
                                    {t.lastUsed}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex gap-1">

                                            <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 hover:bg-blue-100"
                                            onClick={()=>{
                                                setSelectedWhatsappTemplate(t)
                                                setOpenViewWhatsapp(true)
                                            }}
                                            >
                                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                                            </Button>

                                            <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 hover:bg-green-100"
                                            onClick={()=>{
                                            setSelectedWhatsappTemplate(t)

                                            setWhatsappFormData({
                                            title: t.name,
                                            content: t.content
                                            })

                                            setOpenEditWhatsapp(true)
                                            }}
                                            >
                                            <Edit className="w-3.5 h-3.5 text-green-600" />
                                            </Button>

                                            <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 hover:bg-red-100"
                                            onClick={()=>deleteWhatsappTemplate(t.id)}
                                            >
                                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                            </Button>

                                        </div>

                                        <Dialog open={openEditWhatsapp} onOpenChange={setOpenEditWhatsapp}>
                                            <DialogContent>

                                                <DialogHeader>
                                                    <DialogTitle>Edit WhatsApp Template</DialogTitle>
                                                </DialogHeader>

                                                <div className="space-y-4">

                                                    <Input
                                                    value={whatsappFormData.title}
                                                    onChange={(e)=>setWhatsappFormData({...whatsappFormData,title:e.target.value})}
                                                    />

                                                    <Textarea
                                                    value={whatsappFormData.content}
                                                    onChange={(e)=>setWhatsappFormData({...whatsappFormData,content:e.target.value})}
                                                    />

                                                </div>

                                                <Button
                                                className="bg-emerald-600 text-white"
                                                onClick={updateWhatsappTemplate}
                                                >
                                                    Update
                                                </Button>

                                            </DialogContent>
                                        </Dialog>

                                        <Dialog open={openViewWhatsapp} onOpenChange={setOpenViewWhatsapp}>
                                            <DialogContent>

                                                <DialogHeader>
                                                    <DialogTitle>WhatsApp Template</DialogTitle>
                                                </DialogHeader>

                                                {selectedWhatsappTemplate && (

                                                    <div className="space-y-3">

                                                        <p><b>Name:</b> {selectedWhatsappTemplate.name}</p>

                                                        <p><b>Content:</b> {selectedWhatsappTemplate.content}</p>

                                                        <p><b>Date:</b> {selectedWhatsappTemplate.lastUsed}</p>

                                                    </div>

                                                )}

                                            </DialogContent>
                                        </Dialog>

                                    </TableCell>

                                </TableRow>
                                ))}
                            </TableBody>

                        </Table>

                        <div className="flex justify-between items-center p-4 border-t">

                            <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </Button>

                            <p className="text-sm">
                                Page {pagination?.currentPage} of {pagination?.totalPages}
                            </p>

                            <Button
                            variant="outline"
                            disabled={page === pagination?.totalPages}
                            onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>

                        </div>

                    </div>
                </TabsContent>

                {/* Send Email */}
                <TabsContent value="send-email">
                    <Card className="rounded-xl border shadow-md bg-white overflow-hidden">

                        <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b p-4">
                            <CardTitle className="text-lg font-heading flex items-center gap-2 text-blue-700">
                                <Mail className="w-5 h-5 text-blue-500" />
                                Send Email
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6 p-6">

                            {/* Recipient and Template */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                <Label>Send To</Label>
                                <Select value={recipient} onValueChange={setRecipient}>
                                    <SelectTrigger className="border border-blue-200 shadow-sm">
                                    <SelectValue placeholder="Select recipients" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All</SelectItem>
                                        <SelectItem value="STUDENT">All Students</SelectItem>
                                        <SelectItem value="TEACHER">All Teacher</SelectItem>
                                        <SelectItem value="PARENT">All Parents</SelectItem>
                                        <SelectItem value="STAFF">All Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                                </div>

                                <div className="space-y-2">
                                <Label>Template</Label>
                                <Select value={templateId} onValueChange={handleTemplateChange}>
                                    <SelectTrigger className="border border-blue-200 shadow-sm">
                                    <SelectValue placeholder="Choose template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {emailTemplate.map((t) => (
                                        <SelectItem key={t.id} value={String(t.id)}>
                                        {t.name}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Input 
                                value={subject}
                                onChange={(e)=>setSubject(e.target.value)}
                                placeholder="Enter email subject..." className="border border-blue-200 shadow-sm" />
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <Label>Message</Label>
                                <Textarea
                                value={content}
                                onChange={(e)=>setContent(e.target.value)}
                                placeholder="Type your email message here..."
                                className="min-h-[150px] border border-blue-200 shadow-sm"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 justify-end">
                                <Button
                                onClick={sendEmail}
                                disabled={sending}
                                 className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90">
                                <Send className="w-4 h-4 mr-1.5" />
                                    {sending ? "Sending..." : "Send Email"}
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Send SMS */}
                <TabsContent value="send-sms">
                    <Card className="rounded-xl border shadow-md bg-white overflow-hidden">

                        {/* Header */}
                        <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b p-4">
                            <CardTitle className="text-lg font-heading flex items-center gap-2 text-green-700">
                                <Phone className="w-5 h-5 text-green-500" />
                                Send SMS
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6 p-6">

                            {/* Recipient and Template */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Send To</Label>
                                    <Select value={recipient} onValueChange={setRecipient}>
                                        <SelectTrigger className="border border-green-200 shadow-sm">
                                        <SelectValue placeholder="Select recipients" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">All</SelectItem>
                                            <SelectItem value="STUDENT">All Students</SelectItem>
                                            <SelectItem value="TEACHER">All Teacher</SelectItem>
                                            <SelectItem value="PARENT">All Parents</SelectItem>
                                            <SelectItem value="STAFF">All Staff</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Template</Label>
                                    <Select value={smsTemplateId} onValueChange={handleSmsTemplateChange}>
                                        <SelectTrigger className="border border-green-200 shadow-sm">
                                        <SelectValue placeholder="Choose template" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        {smsTemplates.map((t) => (
                                            <SelectItem key={t.id} value={String(t.id)}>
                                            {t.name}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <Label>
                                Message <span className="text-muted-foreground text-xs">(Max 160 characters)</span>
                                </Label>
                                <Textarea
                                value={smsContent}
                                onChange={(e)=>setSmsContent(e.target.value)}
                                placeholder="Type your SMS message here..."
                                className="min-h-[100px] border border-green-200 shadow-sm"
                                maxLength={160}
                                />
                            </div>

                            {/* Send Button */}
                            <div className="flex gap-3 justify-end">
                                <Button
                                onClick={sendSMS}
                                disabled={sending}
                                 className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90">
                                <Send className="w-4 h-4 mr-1.5" />
                                {sendingSms ? "Sending..." : "Send SMS"}
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Send WhatsApp */}
                <TabsContent value="send-whatsapp">
                    <Card className="rounded-xl border shadow-md bg-white overflow-hidden">

                        <CardHeader className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border-b p-4">
                            <CardTitle className="text-lg font-heading flex items-center gap-2 text-emerald-700">
                                <MessageSquare className="w-5 h-5 text-emerald-500" />
                                Send WhatsApp
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6 p-6">

                            {/* Recipient and Template */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Send To</Label>
                                    <Select value={whatsappRecipient} onValueChange={setWhatsappRecipient}>
                                        <SelectTrigger className="border border-green-200 shadow-sm">
                                        <SelectValue placeholder="Select recipients" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">All</SelectItem>
                                            <SelectItem value="STUDENT">All Students</SelectItem>
                                            <SelectItem value="TEACHER">All Teacher</SelectItem>
                                            <SelectItem value="PARENT">All Parents</SelectItem>
                                            <SelectItem value="STAFF">All Staff</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Template</Label>
                                    <Select value={whatsappTemplateId} onValueChange={handleWhatsappTemplateChange}>
                                        <SelectTrigger className="border border-green-200 shadow-sm">
                                        <SelectValue placeholder="Choose template" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        {whatsappTemplates.map((t) => (
                                            <SelectItem key={t.id} value={String(t.id)}>
                                            {t.name}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <Label>Message</Label>
                                <Textarea
                                value={whatsappMessage}
                                onChange={(e)=>setWhatsappMessage(e.target.value)}
                                placeholder="Type your WhatsApp message here..."
                                className="min-h-[150px] border border-green-200 shadow-sm"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 justify-end">
                                <Button
                                onClick={sendWhatsapp}
                                disabled={sendingWhatsapp}
                                 className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90">
                                <Send className="w-4 h-4 mr-1.5" />
                                {sendingWhatsapp ? "Sending...":"Send WhatsApp" }
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </TabsContent>


                {/* Message Logs */}
                <TabsContent value="logs">
                    <div className="rounded-xl border shadow-sm bg-white overflow-hidden">

                        {/* Header */}
                        <div className="p-4 border-b bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50 flex justify-between items-center">
                            <p className="text-sm font-medium text-slate-700">Email / SMS / WhatsApp Logs</p>
                            <div className="flex items-center gap-2">
                                <Select value={logType} onValueChange={setLogType}>
                                    <SelectTrigger className="w-36 h-8 border border-slate-200 shadow-sm">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Types</SelectItem>
                                        <SelectItem value="EMAIL">Email</SelectItem>
                                        <SelectItem value="SMS">SMS</SelectItem>
                                        <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Table */}
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100">
                                    <TableHead className="text-xs font-semibold text-slate-600">Type</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-600">To</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-600">Title</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-600">Sent At</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-600">Status</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-600">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loadingLogs && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                    Loading logs...
                                    </TableCell>
                                </TableRow>
                                )}

                                {!loadingLogs && messageLogs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                        No message logs found
                                        </TableCell>
                                    </TableRow>
                                )}
                                
                                { !loadingLogs && messageLogs.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] flex items-center gap-1"
                                            >
                                                {log.type === "EMAIL" && <Mail className="w-3 h-3 text-blue-500" />}
                                                {log.type === "SMS" && <Phone className="w-3 h-3 text-green-500" />}
                                                {log.type === "WHATSAPP" && <MessageSquare className="w-3 h-3 text-emerald-500" />}
                                                {log.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">{log.to}</TableCell>
                                        <TableCell className="text-sm font-medium">{log.subject}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{log.sentAt}</TableCell>
                                        <TableCell>
                                        <Badge
                                            variant={log.status === "DELIVERED" ? "default" : log.status === "FAILED" ? "destructive" : "secondary"}
                                            className="text-[10px]"
                                        >
                                            {log.status}
                                        </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 hover:bg-blue-100"
                                                onClick={()=>{
                                                    setSelectedLog(log)
                                                    setViewOpen(true)
                                                }}
                                            >
                                                <Eye className="text-blue-600" />
                                            </Button>

                                            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                                            <DialogContent className="max-w-lg">

                                                <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    <Eye className="w-5 h-5 text-blue-500" />
                                                    Message Details
                                                </DialogTitle>
                                                </DialogHeader>

                                                {selectedLog && (
                                                <div className="space-y-4 text-sm">

                                                    <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Type</span>
                                                    <Badge variant="outline">{selectedLog.type}</Badge>
                                                    </div>

                                                    <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Recipient</span>
                                                    <span>{selectedLog.to}</span>
                                                    </div>

                                                    <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Status</span>
                                                    <Badge
                                                        variant={
                                                        selectedLog.status === "DELIVERED"
                                                            ? "default"
                                                            : selectedLog.status === "FAILED"
                                                            ? "destructive"
                                                            : "secondary"
                                                        }
                                                    >
                                                        {selectedLog.status}
                                                    </Badge>
                                                    </div>

                                                    <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Sent At</span>
                                                    <span>{selectedLog.sentAt}</span>
                                                    </div>

                                                    <div>
                                                    <p className="text-muted-foreground mb-1">Title</p>
                                                    <div className="p-3 rounded-md border bg-muted/30">
                                                        {selectedLog.subject}
                                                    </div>
                                                    </div>

                                                    <div>
                                                    <p className="text-muted-foreground mb-1">Message</p>
                                                    <div className="p-3 rounded-md border bg-muted/30 whitespace-pre-wrap">
                                                        {selectedLog.content || "No message content available"}
                                                    </div>
                                                    </div>

                                                </div>
                                                )}

                                            </DialogContent>
                                            </Dialog>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-between items-center p-4">

                            <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </Button>

                            <span className="text-sm">
                                Page {page}
                            </span>

                            <Button
                            variant="outline"
                            onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>

                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    </AdminLayout>
  );
};

export default Page;