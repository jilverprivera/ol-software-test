import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MerchantForm } from '../merchant-form';
import { useAuth } from '@/context/auth-ctx';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Mock } from 'jest-mock';
import { IMerchant } from '@/interface/merchant-interface';

jest.mock('@/context/auth-ctx');
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

global.fetch = jest.fn(() =>
  Promise.resolve(
    new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    }),
  ),
);

const mockCities = ['Bogotá', 'Medellín', 'Cali'];

const mockInitialData: IMerchant = {
  id: 1,
  name: 'Test Merchant',
  municipality: 'Bogotá',
  phone: '1234567890',
  email: 'test@example.com',
  registrationDate: new Date('2024-03-20T00:00:00.000Z'),
  status: 'ACTIVE',
  registeredById: 1,
  updatedById: 1,
  updatedAt: new Date(),
  createdAt: new Date(),
  registeredBy: {
    name: 'Test User',
    email: 'user@test.com',
  },
  updatedBy: {
    name: 'Test User',
    email: 'user@test.com',
  },
  establishments: [
    { name: 'Branch 1', employeeCount: 10, revenue: '1000' },
    { name: 'Branch 2', employeeCount: 5, revenue: '500' },
  ],
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe('MerchantForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as unknown as Mock).mockImplementation(() => ({
      accessToken: 'mock-token',
    }));
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: { data: mockCities },
      isLoading: false,
      error: null,
    }));
  });

  it('loads initial data correctly', () => {
    renderWithProviders(<MerchantForm initialData={mockInitialData} />);
    expect(screen.getByLabelText(/nombre o razón social/i)).toHaveValue(mockInitialData.name);
    expect(screen.getByLabelText(/teléfono/i)).toHaveValue(mockInitialData.phone);
    expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue(mockInitialData.email);
  });

  it('shows loading state when fetching cities', () => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      isLoading: true,
      error: null,
    }));

    renderWithProviders(<MerchantForm />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state when city fetch fails', () => {
    const errorMessage = 'Failed to fetch cities';
    (useQuery as jest.Mock).mockImplementation(() => ({
      isLoading: false,
      error: { message: errorMessage },
    }));

    renderWithProviders(<MerchantForm />);
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('toggles establishment fields when checkbox is clicked', () => {
    renderWithProviders(<MerchantForm />);

    const checkbox = screen.getByRole('checkbox', { name: /¿posee establecimientos\?/i });

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    expect(screen.getByText(/total ingresos formulario/i)).toBeInTheDocument();
    expect(screen.getByText(/cantidad de empleados/i)).toBeInTheDocument();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
