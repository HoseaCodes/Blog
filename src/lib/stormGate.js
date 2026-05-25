import { createStormGateClient } from '@storm-gate/client';

const STORM_GATE_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://3ynqb3302m.execute-api.us-east-1.amazonaws.com'
    : 'http://localhost:8081');

const LOCAL_API_BASE_URL =
  process.env.REACT_APP_LOCAL_API_BASE_URL || 'http://localhost:3003';

const AUTH_REQUIRED_PREFIXES = ['/admin', '/profile', '/checkout', '/order'];

const PUBLIC_READ_PREFIXES = [
  '/blog',
  '/project',
  '/about',
  '/contact',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/check-status',
];

const isAuthRequiredRoute = (pathname) => {
  if (PUBLIC_READ_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return false;
  }
  if (pathname === '/') return false;
  return AUTH_REQUIRED_PREFIXES.some((p) => pathname.startsWith(p));
};

const clearLocalSession = () => {
  localStorage.removeItem('firstLogin');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('isAdmin');
  // SDK clears its own accesstoken cookie. The refresh cookie is set server-side
  // by Storm-Gate and not managed by the SDK — clear it defensively here.
  document.cookie = 'refreshtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

const sdk = createStormGateClient({
  baseURL: STORM_GATE_BASE_URL,
  rememberMeMaxAge: 7 * 24 * 60 * 60,
  defaultMaxAge: 24 * 60 * 60,
  isAuthRequiredRoute,
  onUnauthenticated: () => {
    clearLocalSession();
    window.location.href = '/login';
  },
});

export const auth = {
  register: sdk.register,
  login: sdk.login,
  getMe: sdk.getMe,
  refreshToken: sdk.refreshToken,
  checkStatus: sdk.checkStatus,
  forgotPassword: sdk.forgotPassword,
  verifyResetToken: sdk.verifyResetToken,
  resetPassword: sdk.resetPassword,
  async logout() {
    try {
      await sdk.logout();
    } finally {
      clearLocalSession();
      window.location.href = '/login';
    }
  },
};

export const apiLocal = sdk.createAuthedAxios({ baseURL: LOCAL_API_BASE_URL });
