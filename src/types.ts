export type Role = "guest" | "parent" | "treasurer" | "principal" | "admin";

export type TransactionType = "income" | "expense";
export type TransactionStatus = "draft" | "pending" | "approved" | "rejected";
export type Visibility = "public" | "internal";

export interface School {
  id: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  description?: string;
  activeYear: string;
  studentCount: number;
  classCount: number;
  programCount: number;
}

export interface SchoolYear {
  id: string;
  schoolId: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Profile {
  id: string;
  schoolId: string;
  fullName: string;
  email: string;
  role: Exclude<Role, "guest">;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
}

export interface Category {
  id: string;
  schoolId: string;
  name: string;
  type: TransactionType;
  description: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  schoolId: string;
  schoolYearId: string;
  createdBy: string;
  type: TransactionType;
  categoryId: string;
  categoryName?: string;
  title: string;
  description: string;
  amount: number;
  transactionDate: string;
  status: TransactionStatus;
  visibility: Visibility;
  isPublic: boolean;
  approvedAt?: string;
  rejectedAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  reviewNote?: string;
}

export interface Evidence {
  id: string;
  transactionId: string;
  uploadedBy: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  visibility: Visibility;
  description: string;
  createdAt: string;
}

export interface Approval {
  id: string;
  transactionId: string;
  reviewerId: string;
  status: "approved" | "rejected";
  note: string;
  reviewedAt: string;
}

export interface Report {
  id: string;
  title: string;
  period: string;
  schoolYear: string;
  totalIncome: number;
  totalExpense: number;
  publishedAt: string;
  status: "published" | "draft";
  fileType: "PDF" | "CSV";
}

export interface AuditLog {
  id: string;
  schoolId: string;
  actorId: string;
  action: string;
  targetTable: string;
  targetId: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "approval" | "report" | "system";
  isRead: boolean;
  linkUrl: string;
  createdAt: string;
}
