'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import { getToken, isTokenValid } from '@/lib/auth';
import { useAuth } from '@/context/auth-ctx';
import { Loader } from '../ui/loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { authStatus, setAuthStatus, setAccessToken, setData } = useAuth();

  useEffect(() => {
    const validateToken = async () => {
      const token = getToken();

      if (token && isTokenValid(token)) {
        setAccessToken(token);
        setAuthStatus('authenticated');
        const decodedToken = jwtDecode<{ name: string; email: string; role: string }>(token);
        setData({ name: decodedToken.name, email: decodedToken.email, role: decodedToken.role });
      } else {
        setAuthStatus('unauthenticated');
        setAccessToken(null);
        router.replace('/login');
      }
    };

    if (authStatus === 'checking') {
      validateToken();
    }

    if (authStatus === 'unauthenticated') {
      router.replace('/login');
    }
  }, [authStatus, router, setAuthStatus, setAccessToken, setData]);

  if (authStatus === 'checking') {
    return <Loader />;
  }

  if (authStatus === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
};
