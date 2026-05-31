import { MailCheck } from "lucide-react";
import { Button } from "../../components/ui/Button";

export function VerificationPage() {
  return (
    <section>
      <div className="rounded-md bg-blue-50 p-3 text-trust">
        <MailCheck size={24} />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-slate-950">Verifikasi Email</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Link verifikasi dikirim ke email user. Setelah verified, user bisa masuk ke dashboard sesuai role.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button type="button">Kirim Ulang</Button>
        <Button variant="secondary" to="/login">Kembali Login</Button>
      </div>
    </section>
  );
}
