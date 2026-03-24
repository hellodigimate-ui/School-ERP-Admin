// fakeSchoolApi.ts

type School = {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  principalName: string;
  isActive: boolean;
  studentCount: number;
  teacherCount: number;
  logo?: string;
  type: string;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const defaultSchools: School[] = [
  {
    id: 1,
    name: "ABC School",
    address: "Main Road",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    phone: "9999999999",
    email: "abc@gmail.com",
    principalName: "Mr. Sharma",
    isActive: true,
    studentCount: 500,
    teacherCount: 30,
    logo: "",
    type: "Private",
  },
];

let schools: School[] = defaultSchools;

if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem("schools");
    if (stored) schools = JSON.parse(stored);
  } catch (e) {
    schools = defaultSchools;
  }
}

const save = () => {
  localStorage.setItem("schools", JSON.stringify(schools));
};

export const fakeSchoolApi = {
  async getSchools(params: any) {
    await delay(300);

    let data = [...schools];

    if (params?.name) {
      data = data.filter(
        (s) =>
          s.name.toLowerCase().includes(params.name.toLowerCase()) ||
          s.city.toLowerCase().includes(params.name.toLowerCase()) ||
          s.pincode.includes(params.name)
      );
    }

    if (params?.isActive !== undefined) {
      data = data.filter((s) => s.isActive === params.isActive);
    }

    const total = data.length;

    const start = (params.page - 1) * params.perPage;
    const end = start + params.perPage;

    return {
      data: data.slice(start, end),
      total,
    };
  },

  async createSchool(payload: any) {
    await delay(300);

    const newSchool: School = {
      id: Date.now(),
      ...payload,
      isActive: true,
      studentCount: 0,
      teacherCount: 0,
    };

    schools.unshift(newSchool);
    save();

    return { data: newSchool };
  },

  async updateSchool(id: number, payload: any) {
    await delay(300);

    schools = schools.map((s) =>
      s.id === id ? { ...s, ...payload } : s
    );

    save();
    return { success: true };
  },

  async deleteSchool(id: number) {
    await delay(200);

    schools = schools.filter((s) => s.id !== id);
    save();

    return { success: true };
  },

  async getStats() {
    await delay(200);

    return {
      data: {
        totalSchools: schools.length,
        activeSchools: schools.filter((s) => s.isActive).length,
        totalStudents: schools.reduce((a, b) => a + b.studentCount, 0),
        totalTeachers: schools.reduce((a, b) => a + b.teacherCount, 0),
      },
    };
  },
};