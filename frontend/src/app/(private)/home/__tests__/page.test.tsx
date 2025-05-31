import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../page';
import { useAuth } from '@/context/auth-ctx';
import { useMerchant } from '@/hooks/use-merchant';
import { Mock } from 'jest-mock';

jest.mock('@/context/auth-ctx');
jest.mock('@/hooks/use-merchant');
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
  usePathname() {
    return '/home';
  },
}));


jest.mock('@/components/auth/protected-route', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockMerchants = [
  {
    id: '1',
    name: 'Test Merchant',
    phone: '1234567890',
    email: 'test@example.com',
    registrationDate: '2024-03-20T00:00:00.000Z',
    status: 'ACTIVE',
    establishments: [
      { employeeCount: 10, revenue: '1000' },
      { employeeCount: 5, revenue: '500' },
    ],
  },
];

const mockMeta = {
  totalPages: 3,
  currentPage: 1,
  totalItems: 25,
};

const defaultMockImplementation = {
  merchants: mockMerchants,
  meta: mockMeta,
  loadingMerchants: false,
  errorMerchants: null,
  currentPage: 1,
  setCurrentPage: jest.fn(),
  limit: 10,
  setLimit: jest.fn(),
  handlePageChange: jest.fn(),
  handleUpdateMerchantStatus: jest.fn(),
  handleExportCsv: jest.fn(),
  handleDeleteMerchant: jest.fn(),
};

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as unknown as Mock).mockImplementation(() => ({
      accessToken: 'mock-token',
      data: { role: 'Usuario' },
    }));
    (useMerchant as unknown as Mock).mockImplementation(() => defaultMockImplementation);
  });

  it('renders loading state', () => {
    (useMerchant as unknown as Mock).mockImplementation(() => ({
      ...defaultMockImplementation,
      loadingMerchants: true,
    }));
    render(<HomePage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const errorMessage = 'Failed to fetch merchants';
    (useMerchant as unknown as Mock).mockImplementation(() => ({
      ...defaultMockImplementation,
      loadingMerchants: false,
      errorMerchants: { message: errorMessage },
    }));
    render(<HomePage />);
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders merchant table with data', () => {
    render(<HomePage />);
    expect(screen.getByText('Lista Formularios Creados')).toBeInTheDocument();
    expect(screen.getByText('Test Merchant')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('2 Establecimientos')).toBeInTheDocument();
  });

  it('shows delete button only for admin users', () => {
    render(<HomePage />);
    const deleteButtons = screen.queryByRole('button', { name: 'Eliminar' });
    expect(deleteButtons).toBeNull();
    (useAuth as unknown as Mock).mockImplementation(() => ({
      accessToken: 'mock-token',
      data: { role: 'Administrador' },
    }));
    render(<HomePage />);
    const adminDeleteButtons = screen.getByRole('button', { name: 'Eliminar' });
    expect(adminDeleteButtons).toBeInTheDocument();
  });

  it('handles status update', () => {
    const mockHandleUpdateStatus = jest.fn();
    (useMerchant as unknown as Mock).mockImplementation(() => ({
      ...defaultMockImplementation,
      handleUpdateMerchantStatus: mockHandleUpdateStatus,
    }));

    render(<HomePage />);
    const statusButton = screen.getByRole('button', { name: 'Inactivar' });
    fireEvent.click(statusButton);
    expect(mockHandleUpdateStatus).toHaveBeenCalledWith('1', 'INACTIVE');
  });

  it('handles CSV export', () => {
    const mockExportCsv = jest.fn();
    (useMerchant as unknown as Mock).mockImplementation(() => ({
      ...defaultMockImplementation,
      handleExportCsv: mockExportCsv,
    }));
    render(<HomePage />);
    const exportButton = screen.getByText('Descargar Reporte en CSV');
    fireEvent.click(exportButton);
    expect(mockExportCsv).toHaveBeenCalled();
  });

  it('handles pagination', () => {
    const mockHandlePageChange = jest.fn();
    (useMerchant as unknown as Mock).mockImplementation(() => ({
      ...defaultMockImplementation,
      handlePageChange: mockHandlePageChange,
    }));
    render(<HomePage />);
    const nextPageButton = screen.getByText('>');
    fireEvent.click(nextPageButton);
    expect(mockHandlePageChange).toHaveBeenCalledWith(2);
  });

  it('handles items per page change', () => {
    const mockSetLimit = jest.fn();
    const mockSetCurrentPage = jest.fn();
    (useMerchant as unknown as Mock).mockImplementation(() => ({
      ...defaultMockImplementation,
      setLimit: mockSetLimit,
      setCurrentPage: mockSetCurrentPage,
    }));
    render(<HomePage />);
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    const option = screen.getByText('15');
    fireEvent.click(option);
    expect(mockSetLimit).toHaveBeenCalledWith(15);
    expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
  });
});
