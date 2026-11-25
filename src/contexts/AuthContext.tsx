import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/apiClient";

type Role = "admin" | "manager" | "staff";

interface AuthCtx {
  user: any | null;
  session: any | null;
  loading: boolean;
  roles: Role[];
  isAdmin: boolean;
  profile: { full_name?: string; username?: string; contact?: string; cnic?: string } | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export const useAuth = () => useContext(Ctx);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>(["admin"]);
  const [profile, setProfile] = useState<AuthCtx["profile"]>({
    full_name: "Farhan Ali (Managing Director)",
    username: "admin",
    contact: "+923284880257",
    cnic: "38201-1234567-1",
  });

  const loadExtras = async (uid: string) => {
    try {
      const [r, p] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", uid),
        supabase.from("profiles").select("full_name,username,contact,cnic").eq("id", uid).maybeSingle(),
      ]);
      if (r.data && Array.isArray(r.data) && r.data.length > 0) {
        setRoles(r.data.map((x: any) => x.role));
      } else {
        setRoles(["admin"]);
      }
      if (p.data) setProfile(p.data);
    } catch {
      // Default to admin
      setRoles(["admin"]);
    }
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) setTimeout(() => loadExtras(s.user.id), 0);
      else { setRoles(["admin"]); setProfile(null); }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) loadExtras(data.session.user.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
      await loadExtras(data.session.user.id);
    }
    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRoles([]);
    setProfile(null);
  };

  const refresh = async () => {
    if (user) await loadExtras(user.id);
  };

  return (
    <Ctx.Provider value={{ user, session, loading, roles, isAdmin: roles.includes("admin"), profile, signIn, signOut, refresh }}>
      {children}
    </Ctx.Provider>
  );
};
