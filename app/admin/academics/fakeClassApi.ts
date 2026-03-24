// fakeClassApi.ts

type Branch = {
  id: string;
  name: string;
};

type ClassData = {
  id: string;
  name: string;
  branchId: string;
  branch?: Branch;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

let branches: Branch[] = [
  { id: "1", name: "Science" },
  { id: "2", name: "Commerce" },
  { id: "3", name: "Arts" },
];

const defaultClasses: ClassData[] = [
  {
    id: "1",
    name: "Class 9-A",
    branchId: "1",
    branch: { id: "1", name: "Science" },
  },
  {
    id: "2",
    name: "Class 9-B",
    branchId: "2",
    branch: { id: "2", name: "Commerce" },
  },
];

let classes: ClassData[] = defaultClasses;

const getClasses = () => {
  // Load from localStorage only on the client side
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("classes");
      if (stored) {
        classes = JSON.parse(stored);
      }
    } catch (e) {
      classes = defaultClasses;
    }
  }
  return classes;
};

const save = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("classes", JSON.stringify(classes));
  }
};

export const fakeClassApi = {
  async getBranches() {
    await delay(200);
    return { data: branches };
  },

  async getClasses(params: any) {
    await delay(300);

    let data = [...classes];

    if (params?.name) {
      data = data.filter((c) =>
        c.name.toLowerCase().includes(params.name.toLowerCase())
      );
    }

    if (params?.branchId && params.branchId !== "all") {
      data = data.filter((c) => c.branchId === params.branchId);
    }

    const total = data.length;

    const start = (params.page - 1) * params.perPage;
    const end = start + params.perPage;

    return {
      data: data.slice(start, end),
      pagination: {
        currentPage: params.page,
        totalPages: Math.ceil(total / params.perPage),
        perPage: params.perPage,
        totalClasses: total,
      },
    };
  },

  async createClass(payload: any) {
    await delay(300);

    const branch = branches.find((b) => b.id === payload.branchId);

    const newClass: ClassData = {
      id: Date.now().toString(),
      ...payload,
      branch,
    };

    classes.unshift(newClass);
    save();

    return { data: newClass };
  },

  async updateClass(id: string, payload: any) {
    await delay(300);

    classes = classes.map((c) => {
      if (c.id === id) {
        const branch = branches.find((b) => b.id === payload.branchId);
        return { ...c, ...payload, branch };
      }
      return c;
    });

    save();
    return { success: true };
  },

  async deleteClass(id: string) {
    await delay(200);
    classes = classes.filter((c) => c.id !== id);
    save();
    return { success: true };
  },
};