import { ProtectedRoute } from '@/components/auth/protected-route';
import { Container } from '@/components/layout/container';
import { Header } from '@/components/layout/header';
import { MerchantForm } from '@/components/merchant/merchant-form';

export default function FormPage() {
  return (
    <ProtectedRoute>
      <Header />
      <div className="bg-blue-100">
        <Container>
          <MerchantForm />
        </Container>
      </div>
    </ProtectedRoute>
  );
}
