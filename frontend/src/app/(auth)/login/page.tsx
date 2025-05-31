'use client';

import { Header } from '@/components/layout/header';
import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/context/auth-ctx';
import { getToken, isTokenValid } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from '@/components/ui/loader';

export default function LoginPage() {
  const router = useRouter();
  const { authStatus, setAuthStatus, setAccessToken } = useAuth();

  useEffect(() => {
    const validateToken = async () => {
      const token = getToken();

      if (token && isTokenValid(token)) {
        setAccessToken(token);
        setAuthStatus('authenticated');
        router.replace('/home');
      } else {
        setAuthStatus('unauthenticated');
        setAccessToken(null);
      }
    };

    if (authStatus === 'checking') {
      validateToken();
    }

    if (authStatus === 'authenticated') {
      router.replace('/home');
    }
  }, [authStatus, router, setAuthStatus, setAccessToken]);

  if (authStatus === 'checking') {
    return <Loader />;
  }

  return (
    <div className="min-h-screen relative">
      <Header />
      <LoginForm />
    </div>
  );
}
