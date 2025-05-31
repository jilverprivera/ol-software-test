import { create } from 'zustand';

import { IUser } from '@/interface/user-interface';

interface AuthState {
  authStatus: 'authenticated' | 'unauthenticated' | 'checking';
  accessToken: string | null;
  data: IUser | null;
}
interface AuthStore extends AuthState {
  setAuthStatus: (authStatus: 'authenticated' | 'unauthenticated' | 'checking') => void;
  setAccessToken: (accessToken: string | null) => void;
  setData: (data: IUser) => void;
}

export const useAuth = create<AuthStore>()((set) => ({
  authStatus: 'checking',
  accessToken: null,
  data: null,

  setAuthStatus: (authStatus: 'authenticated' | 'unauthenticated' | 'checking') => set({ authStatus }),
  setAccessToken: (accessToken: string | null) => set({ accessToken }),
  setData: (data: IUser) => set({ data }),
}));
