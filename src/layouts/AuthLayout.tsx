import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="text-white">
          <img src="/school-mark.svg" alt="" className="h-12 w-12 rounded-lg" />
          <h1 className="mt-6 text-4xl font-bold tracking-normal">School Transparency</h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">
            Masuk ke dashboard sesuai role untuk mengelola transaksi, approval, laporan, dan audit trail.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-300">
            <p>Draft &gt; Pending Approval &gt; Approved / Rejected &gt; Published</p>
            <p>Evidence default internal, publikasi dilakukan secara eksplisit setelah approval.</p>
          </div>
        </section>
        <div className="card p-6 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
