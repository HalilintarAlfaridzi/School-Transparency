import { Activity, Database, FileClock, Users } from "lucide-react";
import { MetricCard } from "../../components/ui/MetricCard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";

export function AdminDashboardPage() {
  const { auditLogs, transactions, evidence, profiles } = useFinance();

  return (
    <section>
      <SectionHeader
        title="Admin Dashboard"
        description="Monitoring sistem: user, transaksi, upload evidence, dan audit log aktivitas penting."
      />
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={profiles.length.toString()}
          helper="Akun aktif"
          icon={<Users size={20} />}
          accent="blue"
        />
        <MetricCard
          title="Transactions"
          value={transactions.length.toString()}
          helper="Semua status"
          icon={<Database size={20} />}
          accent="emerald"
        />
        <MetricCard
          title="Uploads"
          value={evidence.length.toString()}
          helper="Metadata evidence"
          icon={<Activity size={20} />}
          accent="amber"
        />
        <MetricCard
          title="Audit Logs"
          value={auditLogs.length.toString()}
          helper="Tidak dapat dihapus dari UI"
          icon={<FileClock size={20} />}
          accent="slate"
        />
      </div>
    </section>
  );
}
