import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";
import type {
  Approval,
  AuditLog,
  Category,
  Evidence,
  NotificationItem,
  Profile,
  Report,
  School,
  SchoolYear,
  Transaction,
  TransactionType,
  Visibility,
} from "../types";

interface ReviewInput {
  transactionId: string;
  reviewerId: string;
  note: string;
}

interface CreateTransactionInput {
  type: TransactionType;
  categoryId: string;
  title: string;
  description: string;
  amount: number;
  transactionDate: string;
  visibility: Visibility;
  status: "draft" | "pending";
}

interface FinanceContextValue {
  school: School | null;
  schoolYears: SchoolYear[];
  profiles: Profile[];
  categories: Category[];
  transactions: Transaction[];
  evidence: Evidence[];
  approvals: Approval[];
  reports: Report[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  approveTransaction: (input: ReviewInput) => Promise<boolean>;
  rejectTransaction: (input: ReviewInput) => Promise<boolean>;
  createTransaction: (input: CreateTransactionInput) => Promise<Transaction | null>;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

function readString(row: Record<string, unknown>, key: string) {
  const value = row[key];
  return value == null ? "" : String(value);
}

function isDemoUser(userId: string) {
  return userId.startsWith("demo-");
}

function assertRealUser(userId: string) {
  if (isDemoUser(userId)) {
    throw new Error("Akun demo hanya untuk akses role UI. Aksi tulis ke Supabase perlu login Supabase asli.");
  }
}

function mapSchool(row: Record<string, unknown>, activeYear = "-"): School {
  return {
    id: readString(row, "id"),
    name: readString(row, "name"),
    slug: readString(row, "slug"),
    address: readString(row, "address"),
    phone: readString(row, "phone"),
    email: readString(row, "email"),
    logoUrl: readString(row, "logo_url"),
    description: readString(row, "description"),
    activeYear,
    studentCount: Number(row.student_count ?? 0),
    classCount: Number(row.class_count ?? 0),
    programCount: Number(row.program_count ?? 0),
  };
}

function mapSchoolYear(row: Record<string, unknown>): SchoolYear {
  return {
    id: readString(row, "id"),
    schoolId: readString(row, "school_id"),
    name: readString(row, "name"),
    startDate: readString(row, "start_date"),
    endDate: readString(row, "end_date"),
    isActive: Boolean(row.is_active),
  };
}

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: readString(row, "id"),
    schoolId: readString(row, "school_id"),
    fullName: readString(row, "full_name"),
    email: readString(row, "email"),
    role: row.role as Profile["role"],
    status: (row.status as Profile["status"]) ?? "active",
    lastLogin: readString(row, "updated_at") || readString(row, "created_at"),
  };
}

function mapCategory(row: Record<string, unknown>, type: TransactionType): Category {
  return {
    id: readString(row, "id"),
    schoolId: readString(row, "school_id"),
    name: readString(row, "name"),
    type,
    description: readString(row, "description"),
    isActive: Boolean(row.is_active),
  };
}

function mapTransaction(row: Record<string, unknown>, categories: Category[]): Transaction {
  const type = row.type as TransactionType;
  const categoryId =
    type === "income" ? readString(row, "income_category_id") : readString(row, "expense_category_id");
  const categoryName = categories.find((category) => category.id === categoryId)?.name;

  return {
    id: readString(row, "id"),
    schoolId: readString(row, "school_id"),
    schoolYearId: readString(row, "school_year_id"),
    createdBy: readString(row, "created_by"),
    type,
    categoryId,
    categoryName,
    title: readString(row, "title"),
    description: readString(row, "description"),
    amount: Number(row.amount ?? 0),
    transactionDate: readString(row, "transaction_date"),
    status: row.status as Transaction["status"],
    visibility: row.visibility as Visibility,
    isPublic: Boolean(row.is_public),
    approvedAt: readString(row, "approved_at") || undefined,
    rejectedAt: readString(row, "rejected_at") || undefined,
    publishedAt: readString(row, "published_at") || undefined,
    createdAt: readString(row, "created_at"),
    updatedAt: readString(row, "updated_at"),
  };
}

function mapEvidence(row: Record<string, unknown>): Evidence {
  return {
    id: readString(row, "id"),
    transactionId: readString(row, "transaction_id"),
    uploadedBy: readString(row, "uploaded_by"),
    fileName: readString(row, "file_name"),
    filePath: readString(row, "file_path"),
    fileType: readString(row, "file_type"),
    fileSize: Number(row.file_size ?? 0),
    visibility: row.visibility as Visibility,
    description: readString(row, "description"),
    createdAt: readString(row, "created_at"),
  };
}

function mapApproval(row: Record<string, unknown>): Approval {
  return {
    id: readString(row, "id"),
    transactionId: readString(row, "transaction_id"),
    reviewerId: readString(row, "reviewer_id"),
    status: row.status as Approval["status"],
    note: readString(row, "note"),
    reviewedAt: readString(row, "reviewed_at"),
  };
}

function mapReport(row: Record<string, unknown>): Report {
  return {
    id: readString(row, "id"),
    title: readString(row, "title"),
    period: readString(row, "period"),
    schoolYear: readString(row, "school_year"),
    totalIncome: Number(row.total_income ?? 0),
    totalExpense: Number(row.total_expense ?? 0),
    publishedAt: readString(row, "published_at"),
    status: row.status as Report["status"],
    fileType: (readString(row, "file_type") || "PDF") as Report["fileType"],
  };
}

function mapAudit(row: Record<string, unknown>): AuditLog {
  return {
    id: readString(row, "id"),
    schoolId: readString(row, "school_id"),
    actorId: readString(row, "actor_id"),
    action: readString(row, "action"),
    targetTable: readString(row, "target_table"),
    targetId: readString(row, "target_id"),
    oldValues: row.old_values as Record<string, unknown> | undefined,
    newValues: row.new_values as Record<string, unknown> | undefined,
    createdAt: readString(row, "created_at"),
  };
}

function mapNotification(row: Record<string, unknown>): NotificationItem {
  return {
    id: readString(row, "id"),
    userId: readString(row, "user_id"),
    title: readString(row, "title"),
    message: readString(row, "message"),
    type: row.type as NotificationItem["type"],
    isRead: Boolean(row.is_read),
    linkUrl: readString(row, "link_url"),
    createdAt: readString(row, "created_at"),
  };
}

async function optionalSelect<T>(
  query: PromiseLike<{ data: T[] | null; error: { message: string; code?: string } | null }>,
) {
  const { data, error } = await query;
  if (error) {
    if (
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      error.message.includes("does not exist") ||
      error.message.includes("Could not find")
    ) {
      return [];
    }
    throw error;
  }
  return data ?? [];
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user, role, isLoading: authLoading } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (authLoading) return;
    setIsLoading(true);
    setError(null);

    if (!supabase) {
      setError("Supabase belum dikonfigurasi.");
      setIsLoading(false);
      return;
    }

    try {
      const [schoolRows, yearRows, incomeRows, expenseRows, reportRows, profileRows] = await Promise.all([
        optionalSelect(supabase.from("schools").select("*").eq("is_active", true).limit(1)),
        optionalSelect(supabase.from("school_years").select("*").order("start_date", { ascending: false })),
        optionalSelect(supabase.from("income_categories").select("*").eq("is_active", true).order("name")),
        optionalSelect(supabase.from("expense_categories").select("*").eq("is_active", true).order("name")),
        optionalSelect(supabase.from("financial_reports").select("*").order("published_at", { ascending: false })),
        optionalSelect(supabase.from("profiles").select("*").order("full_name")),
      ]);

      const mappedYears = yearRows.map((row) => mapSchoolYear(row as Record<string, unknown>));
      const activeYear = mappedYears.find((year) => year.isActive)?.name ?? mappedYears[0]?.name ?? "-";
      const mappedSchool = schoolRows[0] ? mapSchool(schoolRows[0] as Record<string, unknown>, activeYear) : null;
      const mappedCategories = [
        ...incomeRows.map((row) => mapCategory(row as Record<string, unknown>, "income")),
        ...expenseRows.map((row) => mapCategory(row as Record<string, unknown>, "expense")),
      ];

      const transactionRows = await optionalSelect(
        supabase.from("transactions").select("*").order("transaction_date", { ascending: false }),
      );
      const evidenceRows = await optionalSelect(
        supabase.from("transaction_evidence").select("*").order("created_at", { ascending: false }),
      );
      const approvalRows = await optionalSelect(
        supabase.from("approvals").select("*").order("reviewed_at", { ascending: false }),
      );
      const notificationRows =
        user?.id && !isDemoUser(user.id)
          ? await optionalSelect(
              supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
            )
          : [];
      const auditRows =
        role === "admin" && user?.id && !isDemoUser(user.id)
          ? await optionalSelect(supabase.from("audit_logs").select("*").order("created_at", { ascending: false }))
          : [];

      setSchool(mappedSchool);
      setSchoolYears(mappedYears);
      setCategories(mappedCategories);
      setTransactions(transactionRows.map((row) => mapTransaction(row as Record<string, unknown>, mappedCategories)));
      setEvidence(evidenceRows.map((row) => mapEvidence(row as Record<string, unknown>)));
      setApprovals(approvalRows.map((row) => mapApproval(row as Record<string, unknown>)));
      setReports(reportRows.map((row) => mapReport(row as Record<string, unknown>)));
      setProfiles(profileRows.map((row) => mapProfile(row as Record<string, unknown>)));
      setNotifications(notificationRows.map((row) => mapNotification(row as Record<string, unknown>)));
      setAuditLogs(auditRows.map((row) => mapAudit(row as Record<string, unknown>)));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data Supabase.");
    } finally {
      setIsLoading(false);
    }
  }, [authLoading, role, user?.id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const approveTransaction = useCallback(
    async (input: ReviewInput) => {
      assertRealUser(input.reviewerId);
      if (!supabase) return false;
      const { error: approvalError } = await supabase.from("approvals").insert({
        transaction_id: input.transactionId,
        reviewer_id: input.reviewerId,
        status: "approved",
        note: input.note,
      });
      if (approvalError) throw approvalError;
      await refresh();
      return true;
    },
    [refresh],
  );

  const rejectTransaction = useCallback(
    async (input: ReviewInput) => {
      assertRealUser(input.reviewerId);
      if (!supabase) return false;
      const { error: approvalError } = await supabase.from("approvals").insert({
        transaction_id: input.transactionId,
        reviewer_id: input.reviewerId,
        status: "rejected",
        note: input.note,
      });
      if (approvalError) throw approvalError;
      await refresh();
      return true;
    },
    [refresh],
  );

  const createTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      if (!user || !school) return null;
      assertRealUser(user.id);
      const category = categories.find((item) => item.id === input.categoryId);
      const activeYear = schoolYears.find((year) => year.isActive) ?? schoolYears[0];
      if (!category || !activeYear) {
        throw new Error("Kategori atau tahun ajaran aktif belum tersedia.");
      }
      if (!supabase) return null;

      const payload = {
        school_id: school.id,
        school_year_id: activeYear.id,
        created_by: user.id,
        type: input.type,
        income_category_id: input.type === "income" ? input.categoryId : null,
        expense_category_id: input.type === "expense" ? input.categoryId : null,
        title: input.title,
        description: input.description,
        amount: input.amount,
        transaction_date: input.transactionDate,
        status: input.status,
        visibility: input.visibility,
        is_public: input.visibility === "public",
      };

      const { data, error: insertError } = await supabase
        .from("transactions")
        .insert(payload)
        .select("*")
        .single();
      if (insertError) throw insertError;

      await refresh();
      return data ? mapTransaction(data as Record<string, unknown>, categories) : null;
    },
    [categories, refresh, school, schoolYears, user],
  );

  const value = useMemo<FinanceContextValue>(
    () => ({
      school,
      schoolYears,
      profiles,
      categories,
      transactions,
      evidence,
      approvals,
      reports,
      notifications,
      auditLogs,
      isLoading,
      error,
      refresh,
      approveTransaction,
      rejectTransaction,
      createTransaction,
    }),
    [
      school,
      schoolYears,
      profiles,
      categories,
      transactions,
      evidence,
      approvals,
      reports,
      notifications,
      auditLogs,
      isLoading,
      error,
      refresh,
      approveTransaction,
      rejectTransaction,
      createTransaction,
    ],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used inside FinanceProvider");
  }
  return context;
}
