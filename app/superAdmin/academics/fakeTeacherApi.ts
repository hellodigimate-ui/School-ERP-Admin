// fakeTeacherApi.ts

type Teacher = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  branchId: string;
  subjectId: string;
  qualification: string;
  experienceYears: number;
  isActive: boolean;
};

type Branch = { id: string; name: string };
type Subject = { id: string; name: string };

const defaultTeachers: Teacher[] = [];

const defaultBranches: Branch[] = [
  { id: "1", name: "Science" },
  { id: "2", name: "Commerce" },
];

const defaultSubjects: Subject[] = [
  { id: "1", name: "Math" },
  { id: "2", name: "Physics" },
];

let teachers: Teacher[] = defaultTeachers;
let branches: Branch[] = defaultBranches;
let subjects: Subject[] = defaultSubjects;

if (typeof window !== "undefined") {
  try {
    const storedTeachers = localStorage.getItem("teachers");
    if (storedTeachers) teachers = JSON.parse(storedTeachers);
  } catch (e) {
    teachers = defaultTeachers;
  }

  try {
    const storedBranches = localStorage.getItem("branches");
    if (storedBranches) branches = JSON.parse(storedBranches);
  } catch (e) {
    branches = defaultBranches;
  }

  try {
    const storedSubjects = localStorage.getItem("subjects");
    if (storedSubjects) subjects = JSON.parse(storedSubjects);
  } catch (e) {
    subjects = defaultSubjects;
  }
}

const save = () => {
  localStorage.setItem("teachers", JSON.stringify(teachers));
};

export const fakeTeacherApi = {
  async getTeachers() {
    return { data: teachers };
  },

  async getBranches() {
    return { data: branches };
  },

  async getSubjects() {
    return { data: subjects };
  },

  async createTeacher(data: any) {
    const newTeacher = {
      id: Date.now().toString(),
      ...data,
    };

    teachers.unshift(newTeacher);
    save();

    return { data: newTeacher };
  },

  async updateTeacher(id: string, data: any) {
    teachers = teachers.map((t) =>
      t.id === id ? { ...t, ...data } : t
    );
    save();
    return { success: true };
  },

  async deleteTeacher(id: string) {
    teachers = teachers.filter((t) => t.id !== id);
    save();
    return { success: true };
  },
};