import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormPage from '../page';
import { useAuth } from '@/context/auth-ctx';
import { Mock } from 'jest-mock';

jest.mock('@/context/auth-ctx');

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
  usePathname() {
    return '/form';
  },
}));

jest.mock('@/components/auth/protected-route', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/layout/header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>,
}));

jest.mock('@/components/layout/container', () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-container">{children}</div>
  ),
}));

jest.mock('@/components/merchant/merchant-form', () => ({
  MerchantForm: () => <div data-testid="mock-merchant-form">Merchant Form</div>,
}));

describe('FormPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as unknown as Mock).mockImplementation(() => ({
      accessToken: 'mock-token',
      data: { role: 'Usuario' },
    }));
  });

  it('renders all components correctly', () => {
    render(<FormPage />);

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-container')).toBeInTheDocument();
    expect(screen.getByTestId('mock-merchant-form')).toBeInTheDocument();
  });

  it('renders within ProtectedRoute component', () => {
    render(<FormPage />);

    const header = screen.getByText('Header');
    const merchantForm = screen.getByText('Merchant Form');

    expect(header).toBeInTheDocument();
    expect(merchantForm).toBeInTheDocument();
  });

  it('has the correct background color class', () => {
    render(<FormPage />);

    const bgElement = screen.getByTestId('mock-container').parentElement;
    expect(bgElement).toHaveClass('bg-blue-100');
  });
}); 