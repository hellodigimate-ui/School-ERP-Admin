// fakeApi.ts

type Branch = {
  id: number;
  name: string;
  schoolId: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  school?: {
    id: string;
    name: string;
  };
};

type School = {
  id: string;
  name: string;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

let schools: School[] = [
  { id: "1", name: "ABC School" },
  { id: "2", name: "XYZ School" },
];

const defaultBranches: Branch[] = [
  {
    id: 1,
    name: "Main Branch",
    schoolId: "1",
    address: "Jaipur Road",
    city: "Jaipur",
    phone: "9876543210",
    email: "main@gmail.com",
    school: { id: "1", name: "ABC School" },
  },
  {
    id: 2,
    name: "Delhi Branch",
    schoolId: "2",
    address: "Delhi Center",
    city: "Delhi",
    phone: "9999999999",
    email: "delhi@gmail.com",
    school: { id: "2", name: "XYZ School" },
  },
];

let branches: Branch[] = defaultBranches;

if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem("branches");
    if (stored) branches = JSON.parse(stored);
  } catch (e) {
    branches = defaultBranches;
  }
}

const save = () => {
  localStorage.setItem("branches", JSON.stringify(branches));
};

export const fakeApi = {
  async getBranches(params: any) {
    await delay(300);

    let data = [...branches];

    if (params?.name) {
      data = data.filter((b) =>
        b.name.toLowerCase().includes(params.name.toLowerCase())
      );
    }

    if (params?.schoolId) {
      data = data.filter((b) => b.schoolId === params.schoolId);
    }

    const total = data.length;

    const start = (params.page - 1) * params.perPage;
    const end = start + params.perPage;

    return {
      data: data.slice(start, end),
      total,
    };
  },

  async getSchools() {
    await delay(200);
    return { data: schools };
  },

  async createBranch(payload: any) {
    await delay(300);

    const school = schools.find((s) => s.id === payload.schoolId);

    const newBranch: Branch = {
      id: Date.now(),
      ...payload,
      school: school
        ? { id: school.id, name: school.name }
        : undefined,
    };

    branches.unshift(newBranch);
    save();

    return { data: newBranch };
  },

  async getBranchById(id: number) {
    await delay(200);
    return { data: branches.find((b) => b.id === id) };
  },

  async updateBranch(id: number, payload: any) {
    await delay(300);

    branches = branches.map((b) => {
      if (b.id === id) {
        const school = schools.find((s) => s.id === payload.schoolId);
        return {
          ...b,
          ...payload,
          school: school
            ? { id: school.id, name: school.name }
            : undefined,
        };
      }
      return b;
    });

    save();
    return { success: true };
  },

  async deleteBranch(id: number) {
    await delay(200);
    branches = branches.filter((b) => b.id !== id);
    save();
    return { success: true };
  },
};