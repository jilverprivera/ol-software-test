'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { Header } from '@/components/layout/header';
import { Container } from '@/components/layout/container';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Loader } from '@/components/ui/loader';
import { MerchantForm } from '@/components/merchant/merchant-form';
import { useAuth } from '@/context/auth-ctx';

export default function UpdateFormPage() {
  const params = useParams();
  const { accessToken } = useAuth();

  const getMerchantDetails = async () => {
    if (!accessToken) return null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${params.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.json();
  };

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['merchant', params.id],
    queryFn: getMerchantDetails,
    enabled: !!accessToken,
  });

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <ProtectedRoute>
        <Header />
        <Container>
          <div className="text-red-500">Error: {error.message}</div>
        </Container>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Header />
      <div className="bg-blue-100">
        <Container>
          <h1 className="text-2xl font-bold mb-4">Actualizar Formulario</h1>
          {isLoading ? <Loader /> : <MerchantForm initialData={response?.data?.merchant} />}
        </Container>
      </div>
    </ProtectedRoute>
  );
}
