import { FormEvent, useState } from "react";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";

export function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      setMessage(await sendPasswordReset(email));
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Gagal mengirim reset link.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-slate-950">Forgot Password</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Masukkan email untuk menerima link reset password dari Supabase Auth.
      </p>
      <label className="mt-6 grid gap-2">
        <span className="label">Email</span>
        <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@contoh.com" required />
      </label>
      {message && <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <Button className="mt-5 w-full">Kirim Reset Link</Button>
    </form>
  );
}
