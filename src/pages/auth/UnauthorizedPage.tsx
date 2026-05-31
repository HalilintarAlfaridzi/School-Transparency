import { Button } from "../../components/ui/Button";

export function UnauthorizedPage() {
  return (
    <section className="page-container py-16">
      <div className="card mx-auto max-w-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-950">Akses tidak tersedia</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Role akun saat ini tidak memiliki permission untuk membuka halaman tersebut.
        </p>
        <div className="mt-6 flex justify-center">
          <Button to="/login" variant="secondary">Pilih Role Lain</Button>
        </div>
      </div>
    </section>
  );
}
