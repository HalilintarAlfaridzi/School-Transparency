import type { Role } from "../types";

export const roleHome: Record<Exclude<Role, "guest">, string> = {
  parent: "/parent",
  treasurer: "/treasurer",
  principal: "/principal",
  admin: "/admin",
};

export const roleLabels: Record<Role, string> = {
  guest: "Guest",
  parent: "Parent",
  treasurer: "Bendahara",
  principal: "Kepala Sekolah",
  admin: "System Admin",
};

export const statusLabels = {
  draft: "Draft",
  pending: "Menunggu Review",
  approved: "Disetujui",
  rejected: "Ditolak",
};
