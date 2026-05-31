import { LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { roleHome, roleLabels } from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";
import type { Role } from "../../types";

const demoRoles: Array<Exclude<Role, "guest">> = ["parent", "treasurer", "principal", "admin"];

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [demoRole, setDemoRole] = useState<Exclude<Role, "guest">>("treasurer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signInAs } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const profile = await signIn(email, password);
      if (!profile) {
        setError("Profile belum tersedia. Pastikan profile akun sudah dibuat.");
        return;
      }
      navigate(roleHome[profile.role], { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login gagal.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDemoLogin() {
    setIsLoading(true);
    setError(null);
    try {
      const profile = await signInAs(demoRole);
      if (profile) navigate(roleHome[profile.role], { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login demo gagal.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-slate-950">Login</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Data aplikasi selalu diambil dari database. Akun demo hanya membuka role UI tanpa membuat session login asli.
      </p>
      <div className="mt-6 grid gap-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label className="grid gap-2">
            <span className="label">Demo Role</span>
            <select className="field" value={demoRole} onChange={(event) => setDemoRole(event.target.value as Exclude<Role, "guest">)}>
              {demoRoles.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </select>
          </label>
          <Button className="mt-3 w-full" variant="secondary" type="button" onClick={handleDemoLogin} disabled={isLoading}>
            Masuk Demo
          </Button>
        </div>
        <label className="grid gap-2">
          <span className="label">Email</span>
          <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="label">Password</span>
          <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Button className="w-full" icon={<LogIn size={16} />} disabled={isLoading}>
          {isLoading ? "Masuk..." : "Login"}
        </Button>
      </div>
      <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm">
        <Link className="font-semibold text-trust" to="/forgot-password">
          Lupa password
        </Link>
        <Link className="font-semibold text-trust" to="/register">
          Register parent
        </Link>
      </div>
    </form>
  );
}
