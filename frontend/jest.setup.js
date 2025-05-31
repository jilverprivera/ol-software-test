import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '/login';
  },
}));

class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}

global.ResizeObserver = ResizeObserver;
