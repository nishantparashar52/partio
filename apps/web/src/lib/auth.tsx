import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

type User = { id: string; email: string; name?: string } | null;

const AuthCtx = createContext<{
  user: User;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}>({ user: null, refresh: async () => {}, logout: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  async function refresh() {
    try {
      const res = await api.me();
      setUser(res.user || null);
    } catch {
      setUser(null);
    }
  }
  async function logout() {
    await api.logout();
    setUser(null);
  }

  useEffect(() => { refresh(); }, []);

  return (
    <AuthCtx.Provider value={{ user, refresh, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
export const useAuth = () => useContext(AuthCtx);
