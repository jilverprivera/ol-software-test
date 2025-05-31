'use client';

import { useAuth } from '@/context/auth-ctx';
import { getToken, isTokenValid } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from '@/components/ui/loader';

export default function Home() {
  const router = useRouter();
  const { setAuthStatus, setAccessToken } = useAuth();

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
        router.replace('/login');
      }
    };

    validateToken();
  }, [router, setAuthStatus, setAccessToken]);

  return <Loader />;
}
