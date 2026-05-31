import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { demoProfiles } from "../data/demoAccounts";
import { supabase } from "../lib/supabase";
import type { Profile, Role } from "../types";

interface AuthContextValue {
  user: Profile | null;
  session: Session | null;
  role: Role;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<Profile | null>;
  signInAs: (role: Exclude<Role, "guest">) => Promise<Profile | null>;
  signUpParent: (input: { fullName: string; email: string; password: string }) => Promise<string | null>;
  sendPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  refreshProfile: () => Promise<Profile | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const demoRoleStorageKey = "school-transparency-demo-role";

function getAppUrl(path: string) {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return new URL(`${normalizedBase}${normalizedPath}`, window.location.origin).toString();
}

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    schoolId: String(row.school_id ?? ""),
    fullName: String(row.full_name ?? ""),
    email: String(row.email ?? ""),
    role: row.role as Profile["role"],
    status: (row.status as Profile["status"]) ?? "active",
    lastLogin: String(row.updated_at ?? row.created_at ?? new Date().toISOString()),
  };
}

async function fetchProfile(userId: string) {
  if (!supabase) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data ? mapProfile(data) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const savedRole = window.localStorage.getItem(demoRoleStorageKey) as Exclude<Role, "guest"> | null;
    const savedProfile = savedRole ? demoProfiles.find((profile) => profile.role === savedRole) : null;
    if (savedProfile) {
      setSession(null);
      setUser(savedProfile);
      setIsLoading(false);
      return;
    }

    if (!supabase) {
      setError("Supabase belum dikonfigurasi.");
      setIsLoading(false);
      return;
    }

    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      setError(sessionError.message);
      setIsLoading(false);
      return;
    }

    setSession(data.session);
    if (data.session?.user.id) {
      try {
        setUser(await fetchProfile(data.session.user.id));
      } catch (profileError) {
        setError(profileError instanceof Error ? profileError.message : "Gagal memuat profile.");
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadSession();
    if (!supabase) return undefined;

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession?.user.id) {
        setUser(null);
        return;
      }

      void fetchProfile(nextSession.user.id)
        .then(setUser)
        .catch((profileError) => {
          setError(profileError instanceof Error ? profileError.message : "Gagal memuat profile.");
          setUser(null);
        });
    });

    return () => data.subscription.unsubscribe();
  }, [loadSession]);

  const refreshProfile = useCallback(async () => {
    if (user?.id.startsWith("demo-")) return user;
    if (!session?.user.id) return null;
    const profile = await fetchProfile(session.user.id);
    setUser(profile);
    return profile;
  }, [session?.user.id, user]);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      session,
      role: user?.role ?? "guest",
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      async signIn(email, password) {
        if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
        setIsLoading(true);
        setError(null);
        window.localStorage.removeItem(demoRoleStorageKey);
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setIsLoading(false);
          setError(signInError.message);
          throw signInError;
        }
        setSession(data.session);
        const profile = data.user ? await fetchProfile(data.user.id) : null;
        setUser(profile);
        setIsLoading(false);
        return profile;
      },
      async signInAs(role) {
        const profile = demoProfiles.find((item) => item.role === role) ?? null;
        if (!profile) throw new Error(`Demo profile untuk role ${role} tidak tersedia.`);
        if (supabase && session) await supabase.auth.signOut();
        window.localStorage.setItem(demoRoleStorageKey, role);
        setSession(null);
        setUser(profile);
        setError(null);
        return profile;
      },
      async signUpParent(input) {
        if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
        const { error: signUpError } = await supabase.auth.signUp({
          email: input.email,
          password: input.password,
          options: {
            emailRedirectTo: getAppUrl("/verify-email"),
            data: {
              full_name: input.fullName,
              role: "parent",
            },
          },
        });
        if (signUpError) throw signUpError;
        return "Registrasi berhasil. Cek email untuk verifikasi sebelum login.";
      },
      async sendPasswordReset(email) {
        if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: getAppUrl("/reset-password"),
        });
        if (resetError) throw resetError;
        return "Link reset password sudah dikirim.";
      },
      async updatePassword(password) {
        if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) throw updateError;
        return "Password berhasil diperbarui.";
      },
      async signOut() {
        window.localStorage.removeItem(demoRoleStorageKey);
        if (supabase && session) await supabase.auth.signOut();
        setSession(null);
        setUser(null);
      },
      refreshProfile,
    };
  }, [error, isLoading, refreshProfile, session, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
