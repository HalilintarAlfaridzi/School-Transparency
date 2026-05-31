import { FormEvent, useState } from "react";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";

export function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }
    try {
      setMessage(await updatePassword(password));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Gagal update password.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-slate-950">Reset Password</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Buat password baru setelah token reset password divalidasi.
      </p>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="label">Password Baru</span>
          <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
        </label>
        <label className="grid gap-2">
          <span className="label">Konfirmasi Password</span>
          <input className="field" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} />
        </label>
        {message && <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Button className="w-full">Update Password</Button>
      </div>
    </form>
  );
}
