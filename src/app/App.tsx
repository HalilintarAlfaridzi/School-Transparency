import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { FinanceProvider } from "../contexts/FinanceContext";
import { AuthLayout } from "../layouts/AuthLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AuditLogsPage } from "../pages/admin/AuditLogsPage";
import { CategoryManagementPage } from "../pages/admin/CategoryManagementPage";
import { RoleManagementPage } from "../pages/admin/RoleManagementPage";
import { SchoolSettingsPage } from "../pages/admin/SchoolSettingsPage";
import { UserManagementPage } from "../pages/admin/UserManagementPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { ResetPasswordPage } from "../pages/auth/ResetPasswordPage";
import { UnauthorizedPage } from "../pages/auth/UnauthorizedPage";
import { VerificationPage } from "../pages/auth/VerificationPage";
import { ParentFinancialSummaryPage } from "../pages/parent/ParentFinancialSummaryPage";
import { ParentOverviewPage } from "../pages/parent/ParentOverviewPage";
import { ParentReportsPage } from "../pages/parent/ParentReportsPage";
import { ParentTransactionsPage } from "../pages/parent/ParentTransactionsPage";
import { ApprovalDetailPage } from "../pages/principal/ApprovalDetailPage";
import { ApprovalHistoryPage } from "../pages/principal/ApprovalHistoryPage";
import { PendingApprovalsPage } from "../pages/principal/PendingApprovalsPage";
import { PrincipalAnalyticsPage } from "../pages/principal/PrincipalAnalyticsPage";
import { PrincipalDashboardPage } from "../pages/principal/PrincipalDashboardPage";
import { ContactPage } from "../pages/public/ContactPage";
import { FaqPage } from "../pages/public/FaqPage";
import { FinancialDetailPage } from "../pages/public/FinancialDetailPage";
import { LandingPage } from "../pages/public/LandingPage";
import { PublicDashboardPage } from "../pages/public/PublicDashboardPage";
import { ReportsPage } from "../pages/public/ReportsPage";
import { StatisticsPage } from "../pages/public/StatisticsPage";
import { TimelinePage } from "../pages/public/TimelinePage";
import { AddTransactionPage } from "../pages/treasurer/AddTransactionPage";
import { ApprovalRequestsPage } from "../pages/treasurer/ApprovalRequestsPage";
import { EvidencePage } from "../pages/treasurer/EvidencePage";
import { InternalTransactionDetailPage } from "../pages/treasurer/InternalTransactionDetailPage";
import { ManageTransactionsPage } from "../pages/treasurer/ManageTransactionsPage";
import { TreasurerDashboardPage } from "../pages/treasurer/TreasurerDashboardPage";
import { RequireRole } from "../routes/RequireRole";

const routerBasename = import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

export function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <HashRouter basename={routerBasename}>
          <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="/transparency" element={<PublicDashboardPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/:id" element={<FinancialDetailPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerificationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          <Route
            path="/parent"
            element={
              <RequireRole allowed={["parent"]}>
                <DashboardLayout />
              </RequireRole>
            }
          >
            <Route index element={<Navigate to="/parent/overview" replace />} />
            <Route path="overview" element={<ParentOverviewPage />} />
            <Route path="financial-summary" element={<ParentFinancialSummaryPage />} />
            <Route path="transactions" element={<ParentTransactionsPage />} />
            <Route path="reports" element={<ParentReportsPage />} />
          </Route>

          <Route
            path="/treasurer"
            element={
              <RequireRole allowed={["treasurer"]}>
                <DashboardLayout />
              </RequireRole>
            }
          >
            <Route index element={<Navigate to="/treasurer/dashboard" replace />} />
            <Route path="dashboard" element={<TreasurerDashboardPage />} />
            <Route path="transactions" element={<ManageTransactionsPage />} />
            <Route path="transactions/new" element={<AddTransactionPage />} />
            <Route path="transactions/:id" element={<InternalTransactionDetailPage />} />
            <Route path="transactions/:id/edit" element={<InternalTransactionDetailPage />} />
            <Route path="evidence" element={<EvidencePage />} />
            <Route path="approval-requests" element={<ApprovalRequestsPage />} />
          </Route>

          <Route
            path="/principal"
            element={
              <RequireRole allowed={["principal"]}>
                <DashboardLayout />
              </RequireRole>
            }
          >
            <Route index element={<Navigate to="/principal/dashboard" replace />} />
            <Route path="dashboard" element={<PrincipalDashboardPage />} />
            <Route path="pending-approvals" element={<PendingApprovalsPage />} />
            <Route path="approvals/:id" element={<ApprovalDetailPage />} />
            <Route path="analytics" element={<PrincipalAnalyticsPage />} />
            <Route path="approval-history" element={<ApprovalHistoryPage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <RequireRole allowed={["admin"]}>
                <DashboardLayout />
              </RequireRole>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="roles" element={<RoleManagementPage />} />
            <Route path="school-settings" element={<SchoolSettingsPage />} />
            <Route path="categories" element={<CategoryManagementPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </FinanceProvider>
    </AuthProvider>
  );
}
