// fakeSubjectApi.ts

type Subject = {
  id: number;
  name: string;
  code: string;
  description?: string;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const defaultSubjects: Subject[] = [
  { id: 1, name: "Math", code: "MATH101", description: "Basic Math" },
  { id: 2, name: "Science", code: "SCI101", description: "Basic Science" },
];

let subjects: Subject[] = defaultSubjects;

if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem("subjects");
    if (stored) subjects = JSON.parse(stored);
  } catch (e) {
    subjects = defaultSubjects;
  }
}

const save = () => {
  localStorage.setItem("subjects", JSON.stringify(subjects));
};

export const fakeSubjectApi = {
  async getSubjects(params: any) {
    await delay(300);

    let data = [...subjects];

    if (params?.name) {
      data = data.filter(
        (s) =>
          s.name.toLowerCase().includes(params.name.toLowerCase()) ||
          s.code.toLowerCase().includes(params.name.toLowerCase())
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

  async createSubject(payload: any) {
    await delay(200);

    const newSubject = {
      id: Date.now(),
      ...payload,
    };

    subjects.unshift(newSubject);
    save();

    return { data: newSubject };
  },

  async updateSubject(id: number, payload: any) {
    await delay(200);

    subjects = subjects.map((s) =>
      s.id === id ? { ...s, ...payload } : s
    );

    save();
    return { success: true };
  },

  async deleteSubject(id: number) {
    await delay(200);

    subjects = subjects.filter((s) => s.id !== id);
    save();

    return { success: true };
  },
};