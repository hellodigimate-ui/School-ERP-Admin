// fakeScheduleApi.ts

type Schedule = {
  id: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  day: string;
  periodId: string;
  sectionId: string;
};

const defaultSchedules: Schedule[] = [];

let schedules: Schedule[] = defaultSchedules;

if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem("schedules");
    if (stored) schedules = JSON.parse(stored);
  } catch (e) {
    schedules = defaultSchedules;
  }
}

const save = () => {
  localStorage.setItem("schedules", JSON.stringify(schedules));
};

export const fakeScheduleApi = {
  async getSchedules(sectionId: string) {
    return {
      data: schedules.filter((s) => s.sectionId === sectionId),
    };
  },

  async createSchedule(data: any) {
    const newItem = {
      id: Date.now().toString(),
      ...data,
    };

    schedules.push(newItem);
    save();

    return { data: newItem };
  },

  async updateSchedule(id: string, data: any) {
    schedules = schedules.map((s) =>
      s.id === id ? { ...s, ...data } : s
    );
    save();
    return { success: true };
  },

  async deleteSchedule(id: string) {
    schedules = schedules.filter((s) => s.id !== id);
    save();
    return { success: true };
  },
};