import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../page';
import { useAuth } from '@/context/auth-ctx';
import { getToken, isTokenValid } from '@/lib/auth';
import { Mock } from 'jest-mock';

// Mock the auth functions
jest.mock('@/lib/auth', () => ({
  getToken: jest.fn(),
  isTokenValid: jest.fn(),
}));

// Mock Zustand store
jest.mock('@/context/auth-ctx', () => ({
  useAuth: jest.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (useAuth as unknown as Mock).mockImplementation(() => ({
      authStatus: 'checking',
      setAuthStatus: jest.fn(),
      setAccessToken: jest.fn(),
      accessToken: null,
      signOut: jest.fn(),
      data: null,
      setData: jest.fn(),
    }));
  });

  it('renders login form when user is unauthenticated', async () => {
    (getToken as jest.Mock).mockReturnValue(null);
    (isTokenValid as jest.Mock).mockReturnValue(false);
    (useAuth as unknown as Mock).mockImplementation(() => ({
      authStatus: 'unauthenticated',
      setAuthStatus: jest.fn(),
      setAccessToken: jest.fn(),
      accessToken: null,
      signOut: jest.fn(),
      data: null,
      setData: jest.fn(),
    }));

    render(<LoginPage />);

    // Wait for the auth check to complete
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    });
  });

  it('shows loading state while checking auth status', () => {
    (useAuth as unknown as Mock).mockImplementation(() => ({
      authStatus: 'checking',
      setAuthStatus: jest.fn(),
      setAccessToken: jest.fn(),
      accessToken: null,
      signOut: jest.fn(),
      data: null,
      setData: jest.fn(),
    }));

    render(<LoginPage />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('redirects to home when user is authenticated', async () => {
    const mockSetAuthStatus = jest.fn();
    const mockSetAccessToken = jest.fn();
    (getToken as jest.Mock).mockReturnValue('valid-token');
    (isTokenValid as jest.Mock).mockReturnValue(true);
    (useAuth as unknown as Mock).mockImplementation(() => ({
      authStatus: 'checking',
      setAuthStatus: mockSetAuthStatus,
      setAccessToken: mockSetAccessToken,
      accessToken: null,
      signOut: jest.fn(),
      data: null,
      setData: jest.fn(),
    }));

    render(<LoginPage />);

    await waitFor(() => {
      expect(mockSetAuthStatus).toHaveBeenCalledWith('authenticated');
      expect(mockSetAccessToken).toHaveBeenCalledWith('valid-token');
    });
  });
}); 