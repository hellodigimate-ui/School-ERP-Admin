/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  BookOpen,
  Clock,
  CalendarDays,
  Edit,
  Plus,
  Trash2,
} from "lucide-react"

// import { AdminLayout } from "@/components/layout/AdminLayout"
import { axiosInstance } from "@/apiHome/axiosInstanc"
import { toast } from "sonner"
import { AdminLayout } from "@/components/superAdmin/AdminLayout"

const days = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"]

/* ------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------ */

type Period = {
  id:string
  name:string
  startTime:string
  endTime:string
}

type Schedule = {
  id:string
  subject:string
  day:string
  teacher:{
    id:string
    name:string
  }
  period:{
    id:string
    startTime:string
    endTime:string
  }
}


interface ScheduleModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: any) => void
  schedule?: Schedule | null
  periods: Period[]
  teachers: any[]
  days: string[]
}

export default function AcademicsPage(){

  const [selectedBranch,setSelectedBranch] = useState("")
  const [selectedClass,setSelectedClass] = useState("")
  const [selectedSection,setSelectedSection] = useState("")

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)

  const [periods,setPeriods] = useState<Period[]>([])
  const [schedules,setSchedules] = useState<Schedule[]>([])
  const [branchList, setBranchList] = useState<any[]>([]);
  const [classList, setClassList] = useState<any[]>([]);
  const [sectionList, setSectionList] = useState<any[]>([]);
  const [teachers,setTeachers] = useState<any[]>([])


  const [loading,setLoading] = useState(false)



const ScheduleModal = ({ open, onClose, onSave, schedule, periods, teachers, days }: ScheduleModalProps) => {

  const [subject,setSubject] = useState(schedule?.subject || "")
  const [teacherId,setTeacherId] = useState(schedule?.teacher?.id || "")
  const [day,setDay] = useState(schedule?.day || "")
  const [periodId,setPeriodId] = useState(schedule?.period?.id || "")

  useEffect(()=>{
    if(schedule){
      setSubject(schedule.subject)
      setTeacherId(schedule.teacher.id)
      setDay(schedule.day)
      setPeriodId(schedule.period.id)
    }
  },[schedule])

  const handleSave = () => {
    if(!subject  || !teacherId || !day || !periodId) {
      toast.error("Please fill all fields")
      return
    }
    onSave({ subject, teacherId, day, periodId, id: schedule?.id })
  }

  if(!open) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-80 shadow-lg border border-border">

        <h2 className="text-lg font-bold mb-4 text-foreground">{schedule ? "Edit Schedule" : "Add Schedule"}</h2>

        <input
          type="text"
          placeholder="Subject"
          className="w-full mb-2 border border-border rounded px-2 py-1 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          value={subject}
          onChange={(e)=>setSubject(e.target.value)}
        />

        {/* Branch */}
        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            {branchList.map((branch: any) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Class */}
        <Select
          value={selectedClass}
          onValueChange={setSelectedClass}
          disabled={!selectedBranch}
        >
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {classList
              .filter((cls: any) => cls.branchId === selectedBranch)
              .map((cls: any) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>


        <Select value={teacherId} onValueChange={setTeacherId}>
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="Select Teacher"/>
          </SelectTrigger>
          <SelectContent>
            {teachers.map(t=>(
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={day} onValueChange={setDay}>
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="Select Day"/>
          </SelectTrigger>
          <SelectContent>
            {days.map(d=>(
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={periodId} onValueChange={setPeriodId}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Select Period"/>
          </SelectTrigger>
          <SelectContent>
            {periods.map(p=>(
              <SelectItem key={p.id} value={p.id}>{p.startTime.slice(11,16)} - {p.endTime.slice(11,16)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{schedule ? "Update" : "Add"}</Button>
        </div>

      </div>
    </div>
  )
}




const fetchPeriods = async () => {

  try{

    const res = await axiosInstance.get("/api/v1/periods",{
      params:{ branchId:selectedBranch }
    })

    setPeriods(res.data?.data || [])

  }catch(error){

    console.log("Failed to load periods")

  }

}

const fetchBranches = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/branches", {
      params: { page: 1, perPage: 100 },
    });

    const branches = res.data.data || []
    setBranchList(branches);

    // Set default branch if not selected
    if(branches.length > 0 && !selectedBranch){
      setSelectedBranch(branches[0].id)
    }


  } catch (error) {
    toast.error("Failed to load branches");
  }
};

const fetchTeachers = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/teachers")
    setTeachers(res.data?.data || [])
  } catch { toast.error("Failed to load teachers") }
}

const fetchClasses = async (branchId:string) => {
  try {
    const res = await axiosInstance.get("/api/v1/classes",{
      params:{ branchId }
    });

    setClassList(res.data.data);
  } catch (error) {
    toast.error("Failed to load classes");
  }
};

const fetchSections = async (classId:string) => {
  try {
    const res = await axiosInstance.get("/api/v1/sections",{
      params:{ classId }
    });

    const list = res.data?.data || []
    setSectionList(list)
    if(list.length > 0) setSelectedSection(list[0].id)
  } catch (error) {
    toast.error("Failed to load sections");
  }
};


useEffect(()=>{

  if(selectedBranch){

    fetchClasses(selectedBranch)
    setSelectedClass("")
    setSelectedSection("")
    setSectionList([])

  }

},[selectedBranch])


  /* ------------------------------------------------ */
  /* FETCH SCHEDULES */
  /* ------------------------------------------------ */

  const fetchSchedules = async () => {

    try{

      setLoading(true)

      const res = await axiosInstance.get("/api/v1/schedules",{
        params:{ sectionId:selectedSection }
      })

      setSchedules(res.data?.data || [])

    }catch(error){

      console.log("Failed to load schedules")

    }finally{

      setLoading(false)

    }

  }

  /* ------------------------------------------------ */
  /* LOAD DATA */
  /* ------------------------------------------------ */

useEffect(() => {
  if(selectedSection){
    fetchPeriods()   // Periods may also depend on branch/class
    fetchSchedules()
  } else {
    setSchedules([])
    setPeriods([])
  }
}, [selectedSection])


  /* ------------------------------------------------ */
  /* GET CELL DATA */
  /* ------------------------------------------------ */

const getSchedule = (day: string, periodId: string) => {
  return schedules.find(
    (s) => s.day.toLowerCase() === day.toLowerCase() && s.period?.id === periodId
  )
}

  /* ------------------------------------------------ */
  /* DELETE SCHEDULE */
  /* ------------------------------------------------ */

  const deleteSchedule = async(id:string)=>{

    try{

      await axiosInstance.delete(`/api/v1/schedules/${id}`)

      fetchSchedules()

    }catch(error){

      console.log("Delete failed")

    }

  }

const handleAddSchedule = async(data:any) => {
  try {
    await axiosInstance.post("/api/v1/schedules", {
      subject: data.subject,
      teacherId: data.teacherId,
      day: data.day,
      periodId: data.periodId,
      sectionId: selectedSection
    })
    toast.success("Schedule added")
    fetchSchedules()
    setShowAddModal(false)
  } catch (error) {
    toast.error("Failed to add schedule")
  }
}

const handleEditSchedule = async(data:any) => {
  try {
    await axiosInstance.put(`/api/v1/schedules/${data.id}`, {
      subject: data.subject,
      teacherId: data.teacherId,
      day: data.day,
      periodId: data.periodId
    })
    toast.success("Schedule updated")
    fetchSchedules()
    setShowEditModal(false)
    setEditingSchedule(null)
  } catch (error) {
    toast.error("Failed to update schedule")
  }
}


useEffect(()=>{

  if(selectedSection){

    fetchPeriods()
    fetchSchedules()

  }

},[selectedSection,selectedBranch])


useEffect(()=>{

  if(selectedClass){

    fetchSections(selectedClass)
    setSelectedSection("")

  }

},[selectedClass])



useEffect(()=>{
  fetchBranches();
}, [])

useEffect(()=>{ 
  fetchBranches(); 
  fetchTeachers() 
},[])



  return(

  <AdminLayout>

    <div className="p-6 space-y-6 bg-gradient-to-br from-secondary/30 to-background min-h-screen">

      {/* HEADER */}

      <div className="flex items-center gap-3">

        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
        <BookOpen size={26}/>
        </div>

        <div>
        <h1 className="text-2xl font-bold text-foreground">Academics</h1>
        <p className="text-sm text-foreground/70">Manage timetable and teachers schedule</p>
        </div>

      </div>

      <Tabs defaultValue="class">

        <TabsContent value="class">

          <Card className="shadow-xl border-0">

            <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

              <CardTitle className="flex items-center gap-2">
                <CalendarDays size={18}/> Class Timetable
              </CardTitle>

              <div className="flex flex-wrap items-center gap-3">


                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                >
                  <SelectTrigger className="w-[140px]">
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

                <Select
                value={selectedClass}
                onValueChange={setSelectedClass}
                disabled={!selectedBranch}
                >
                  <SelectTrigger className="w-[140px]">
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

                <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
                disabled={!selectedClass}
                >
                  <SelectTrigger className="w-[120px]">
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

                <Button size="sm" onClick={()=>setShowAddModal(true)}>
                  <Plus size={14} className="mr-1"/> Add
                </Button>

              </div>

            </CardHeader>

            <CardContent>

              <div className="overflow-x-auto">

                <table className="w-full text-sm border rounded-lg overflow-hidden">

                  <thead className="bg-primary text-primary-foreground dark:bg-primary/90">

                    <tr>

                      <th className="p-3 text-left">Period</th>

                      {days.map(d=>(
                        <th key={d} className="p-3 text-center">{d}</th>
                      ))}

                    </tr>

                  </thead>

                  <tbody>

                    {periods.map((period,i)=>(

<tr key={period.id} className={i%2?"bg-secondary/30 dark:bg-secondary/20":""}>

                        <td className="p-3 font-medium text-slate-600">

                          <div className="flex items-center gap-1">
                            <Clock size={12}/> 
                            {period.startTime.slice(11,16)} - {period.endTime.slice(11,16)}
                          </div>

                        </td>

                        {days.map(day=>{

                          const cell = getSchedule(day,period.id)

                          return(

                            <td key={day} className="p-2">

                              {cell?

                                <div className="flex justify-between p-2 rounded-lg border-l-4 border-blue-400 shadow-sm hover:shadow-md">

                                  <div>
                                    <p className="text-xs font-bold">{cell.subject}</p>
                                    <p className="text-[11px] opacity-70">{cell.teacher?.name}</p>
                                  </div>

                                  <div className="flex items-center justify-end gap-2">

                                    <button onClick={()=>{ setEditingSchedule(cell); setShowEditModal(true) }}>
                                      <Edit className="w-4 h-4 text-indigo-600 cursor-pointer"/>
                                    </button>

                                    <button onClick={()=>deleteSchedule(cell.id)}>
                                      <Trash2 className="w-4 h-4 text-red-600 cursor-pointer"/>
                                    </button>
                                  </div>

                                </div>

                                :

                                <div className="text-center text-xs text-gray-400">—</div>

                              }

                            </td>

                          )

                        })}

                      </tr>

                    ))}

                  </tbody>

                </table>

                {loading && (
                  <p className="text-center py-4 text-gray-400">
                    Loading timetable...
                  </p>
                )}

              </div>

            </CardContent>

          </Card>

        </TabsContent>

      </Tabs>

        {/* ----------------------- MODALS ----------------------- */}
        <ScheduleModal
          open={showAddModal}
          onClose={()=>setShowAddModal(false)}
          onSave={handleAddSchedule}
          periods={periods}
          teachers={teachers}
          days={days}
        />

        <ScheduleModal
          open={showEditModal}
          onClose={()=>{ setShowEditModal(false); setEditingSchedule(null) }}
          onSave={handleEditSchedule}
          schedule={editingSchedule}
          periods={periods}
          teachers={teachers}
          days={days}
        />



    </div>

  </AdminLayout>

)

}