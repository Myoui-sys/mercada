'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { AuthUser } from '@/types';

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  shippingAddress?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'mercatta:auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed: AuthResponse = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.accessToken);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  function persistSession(response: AuthResponse) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
    setUser(response.user);
    setToken(response.accessToken);
  }

  async function login(email: string, password: string) {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    persistSession(response);
  }

  async function register(payload: RegisterPayload) {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    persistSession(response);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken(null);
    router.push('/');
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider.');
  }

  return context;
}
