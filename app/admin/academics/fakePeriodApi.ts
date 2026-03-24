// fakePeriodApi.ts

type Period = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  branchId: string;
  sectionId: string;
};

type Branch = {
  id: string;
  name: string;
};

type Section = {
  id: string;
  name: string;
  branchId: string;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const defaultBranches: Branch[] = [
  { id: "1", name: "Science" },
  { id: "2", name: "Commerce" },
];

const defaultSections: Section[] = [
  { id: "1", name: "A", branchId: "1" },
  { id: "2", name: "B", branchId: "2" },
];

const defaultPeriods: Period[] = [];

let branches: Branch[] = defaultBranches;
let sections: Section[] = defaultSections;
let periods: Period[] = defaultPeriods;

if (typeof window !== "undefined") {
  try {
    const storedBranches = localStorage.getItem("branches");
    if (storedBranches) branches = JSON.parse(storedBranches);
  } catch (e) {
    branches = defaultBranches;
  }

  try {
    const storedSections = localStorage.getItem("sections");
    if (storedSections) sections = JSON.parse(storedSections);
  } catch (e) {
    sections = defaultSections;
  }

  try {
    const storedPeriods = localStorage.getItem("periods");
    if (storedPeriods) periods = JSON.parse(storedPeriods);
  } catch (e) {
    periods = defaultPeriods;
  }
}

const save = () => {
  localStorage.setItem("periods", JSON.stringify(periods));
};

export const fakePeriodApi = {
  async getBranches() {
    await delay(100);
    return { data: branches };
  },

  async getSections(branchId?: string) {
    await delay(100);
    if (!branchId || branchId === "all") return { data: sections };

    return {
      data: sections.filter((s) => s.branchId === branchId),
    };
  },

  async getPeriods({ branchId }: any) {
    await delay(100);

    let data = [...periods];

    if (branchId && branchId !== "all") {
      data = data.filter((p) => p.branchId === branchId);
    }

    return { data };
  },

  async createPeriod(payload: any) {
    const newPeriod = {
      id: Date.now().toString(),
      ...payload,
    };

    periods.unshift(newPeriod);
    save();

    return { data: newPeriod };
  },

  async updatePeriod(id: string, payload: any) {
    periods = periods.map((p) =>
      p.id === id ? { ...p, ...payload } : p
    );
    save();
    return { success: true };
  },

  async deletePeriod(id: string) {
    periods = periods.filter((p) => p.id !== id);
    save();
    return { success: true };
  },
};