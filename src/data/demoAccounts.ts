import type { Profile } from "../types";

export const demoProfiles: Profile[] = [
  {
    id: "demo-parent",
    schoolId: "demo-account",
    fullName: "Budi Santoso",
    email: "parent@demo.local",
    role: "parent",
    status: "active",
    lastLogin: "2026-05-31T08:00:00+07:00",
  },
  {
    id: "demo-treasurer",
    schoolId: "demo-account",
    fullName: "Sari Bendahara",
    email: "treasurer@demo.local",
    role: "treasurer",
    status: "active",
    lastLogin: "2026-05-31T08:10:00+07:00",
  },
  {
    id: "demo-principal",
    schoolId: "demo-account",
    fullName: "Ahmad Prasetyo",
    email: "principal@demo.local",
    role: "principal",
    status: "active",
    lastLogin: "2026-05-31T08:20:00+07:00",
  },
  {
    id: "demo-admin",
    schoolId: "demo-account",
    fullName: "Dina Admin",
    email: "admin@demo.local",
    role: "admin",
    status: "active",
    lastLogin: "2026-05-31T08:30:00+07:00",
  },
];
