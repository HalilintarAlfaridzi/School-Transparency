import { UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";

export function RegisterPage() {
  const { signUpParent } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }

    setIsLoading(true);
    try {
      setMessage(await signUpParent({ fullName, email, password }));
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Registrasi gagal.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-slate-950">Register Parent</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Role default untuk registrasi publik adalah parent. Role internal ditentukan admin, bukan input user.
      </p>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="label">Nama</span>
          <input className="field" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Nama lengkap" required />
        </label>
        <label className="grid gap-2">
          <span className="label">Email</span>
          <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@contoh.com" required />
        </label>
        <label className="grid gap-2">
          <span className="label">Password</span>
          <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimal 8 karakter" required minLength={8} />
        </label>
        <label className="grid gap-2">
          <span className="label">Konfirmasi Password</span>
          <input className="field" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Ulangi password" required minLength={8} />
        </label>
        {message && <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Button className="w-full" icon={<UserPlus size={16} />} disabled={isLoading}>
          {isLoading ? "Mendaftarkan..." : "Register"}
        </Button>
      </div>
      <p className="mt-5 text-sm text-slate-600">
        Sudah punya akun? <Link className="font-semibold text-trust" to="/login">Login</Link>
      </p>
    </form>
  );
}
