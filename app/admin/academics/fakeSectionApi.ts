// fakeSectionApi.ts

type Branch = {
  id: string;
  name: string;
};

type Class = {
  id: string;
  name: string;
  branchId: string;
};

type Section = {
  id: string;
  name: string;
  branchId: string;
  classId: string;
  capacity: number;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const defaultBranches: Branch[] = [
  { id: "1", name: "Science" },
  { id: "2", name: "Commerce" },
];

const defaultClasses: Class[] = [
  { id: "1", name: "Class 10", branchId: "1" },
  { id: "2", name: "Class 11", branchId: "2" },
];

const defaultSections: Section[] = [
  { id: "1", name: "A", branchId: "1", classId: "1", capacity: 40 },
];

let branches: Branch[] = defaultBranches;
let classes: Class[] = defaultClasses;
let sections: Section[] = defaultSections;

if (typeof window !== "undefined") {
  try {
    const storedBranches = localStorage.getItem("branches");
    if (storedBranches) branches = JSON.parse(storedBranches);
  } catch (e) {
    branches = defaultBranches;
  }

  try {
    const storedClasses = localStorage.getItem("classes");
    if (storedClasses) classes = JSON.parse(storedClasses);
  } catch (e) {
    classes = defaultClasses;
  }

  try {
    const storedSections = localStorage.getItem("sections");
    if (storedSections) sections = JSON.parse(storedSections);
  } catch (e) {
    sections = defaultSections;
  }
}

const save = () => {
  localStorage.setItem("sections", JSON.stringify(sections));
};

export const fakeSectionApi = {
  async getSections(params: any) {
    await delay(200);

    let data = [...sections];

    if (params?.search) {
      data = data.filter((s) =>
        s.name.toLowerCase().includes(params.search.toLowerCase())
      );
    }

    if (params?.branchId && params.branchId !== "all") {
      data = data.filter((s) => s.branchId === params.branchId);
    }

    const total = data.length;

    const start = (params.page - 1) * params.perPage;
    const end = start + params.perPage;

    const formatted = data.slice(start, end).map((s) => {
      const cls = classes.find((c) => c.id === s.classId);
      const branch = branches.find((b) => b.id === s.branchId);

      return {
        ...s,
        class: {
          ...cls,
          branch,
        },
      };
    });

    return { data: formatted, total };
  },

  async getBranches() {
    return { data: branches };
  },

async getClasses(branchId?: string) {
  if (!branchId) return { data: classes }; // ✅ return ALL

  return {
    data: classes.filter((c) => c.branchId === branchId),
  };
},

  async createSection(payload: any) {
    const newSection = {
      id: Date.now().toString(),
      ...payload,
      capacity: Number(payload.capacity),
    };

    sections.unshift(newSection);
    save();

    return { data: newSection };
  },

  async updateSection(id: string, payload: any) {
    sections = sections.map((s) =>
      s.id === id ? { ...s, ...payload } : s
    );
    save();
    return { success: true };
  },

  async deleteSection(id: string) {
    sections = sections.filter((s) => s.id !== id);
    save();
    return { success: true };
  },
};