// fakeParentApi.ts

type Parent = {
  id: string;
  email: string;
  fatherName: string;
  fatherPhone: string;
  fatherOccupation?: string;
  motherName: string;
  motherPhone: string;
  motherOccupation?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  childrenCount: number;
  Student?: any[];
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const defaultParents: Parent[] = [
  {
    id: "1",
    email: "parent1@gmail.com",
    fatherName: "Ramesh Sharma",
    fatherPhone: "9876543210",
    motherName: "Sita Sharma",
    motherPhone: "9999999999",
    childrenCount: 2,
    Student: [{ id: "1", name: "Aman" }, { id: "2", name: "Riya" }],
  },
  {
    id: "2",
    email: "parent2@gmail.com",
    fatherName: "Mahesh Verma",
    fatherPhone: "8888888888",
    motherName: "Kiran Verma",
    motherPhone: "7777777777",
    childrenCount: 1,
    Student: [{ id: "3", name: "Rohit" }],
  },
];

let parents: Parent[] = defaultParents;

if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem("parents");
    if (stored) parents = JSON.parse(stored);
  } catch (e) {
    parents = defaultParents;
  }
}

const save = () => {
  localStorage.setItem("parents", JSON.stringify(parents));
};

export const fakeParentApi = {
  async getParents(params: any) {
    await delay(300);

    let data = [...parents];

    if (params?.name) {
      data = data.filter(
        (p) =>
          p.fatherName.toLowerCase().includes(params.name.toLowerCase()) ||
          p.email.toLowerCase().includes(params.name.toLowerCase())
      );
    }

    const total = data.length;

    const start = (params.page - 1) * params.perPage;
    const end = start + params.perPage;

    return {
      data: data.slice(start, end),
      total,
    };
  },

  async getParentById(id: string) {
    await delay(200);
    return { data: parents.find((p) => p.id === id) };
  },

  async updateParent(id: string, payload: any) {
    await delay(300);

    parents = parents.map((p) =>
      p.id === id ? { ...p, ...payload } : p
    );

    save();
    return { success: true };
  },

  async deleteParent(id: string) {
    await delay(200);
    parents = parents.filter((p) => p.id !== id);
    save();
    return { success: true };
  },
};