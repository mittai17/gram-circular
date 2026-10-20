import { expect, vi } from 'vitest';
import * as jestDomMatchers from '@testing-library/jest-dom/matchers';

// Register jest-dom matchers (toBeInTheDocument, toHaveAttribute, etc.) on
// Vitest's expect so they are available in every test file.
expect.extend(jestDomMatchers);

// Mock next/navigation so components using useRouter/usePathname don't crash.
vi.mock('next/navigation', () => {
  const navigate = vi.fn();
  const router = {
    push: navigate,
    replace: navigate,
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  };
  return {
    useRouter: () => router,
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
    NextRequest: class {},
    NextResponse: {
      json: vi.fn(),
      redirect: vi.fn(),
      rewrite: vi.fn(),
      next: vi.fn(),
    },
  };
});
