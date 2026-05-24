import axios from 'axios';

// Use local backend for development, AWS Lambda for production
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://3ynqb3302m.execute-api.us-east-1.amazonaws.com' 
    : 'http://localhost:8081');

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Separate instance for endpoints served by THIS repo's Express (e.g. /api/user/admin/all
// reading from portfolio.users). Shares the JWT via the cookie-token interceptor below.
const LOCAL_API_BASE_URL =
  process.env.REACT_APP_LOCAL_API_BASE_URL || 'http://localhost:3003';

export const apiLocal = axios.create({
  baseURL: LOCAL_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const attachCookieToken = (config) => {
  let token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('accesstoken='))
    ?.split('=')[1];

  if (token && token.startsWith('JWT ')) {
    token = token.substring(4);
  }

  if (token) {
    config.headers.Authorization = token;
  }
  return config;
};

api.interceptors.request.use(attachCookieToken, (error) => Promise.reject(error));
apiLocal.interceptors.request.use(attachCookieToken, (error) => Promise.reject(error));

// Response interceptor for error handling
const AUTH_REQUIRED_PREFIXES = ['/admin', '/profile', '/checkout', '/order'];

// Pages where we EXPLICITLY refuse to bounce the user to /login even on 401.
// Articles, project case studies, blog list, etc. are public reading material.
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

const isOnAuthRequiredPage = () => {
  const path = window.location.pathname;
  if (PUBLIC_READ_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))) {
    return false;
  }
  if (path === '/') return false;
  return AUTH_REQUIRED_PREFIXES.some((p) => path.startsWith(p));
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const reqUrl = error.config?.url;
    console.log('[authService] response error', { status, reqUrl, pathname: window.location.pathname });

    if (status === 401) {
      const onAuthRoute = isOnAuthRequiredPage();
      console.log('[authService] 401 — clearing creds, redirect?', onAuthRoute);

      localStorage.removeItem('firstLogin');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('isAdmin');
      document.cookie =
        'accesstoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie =
        'refreshtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      if (onAuthRoute) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User's email address
   * @param {string} userData.username - Optional username
   * @param {string} userData.password - User's password (min 6 characters)
   * @param {string} userData.role - Optional role (default: "basic")
   * @param {string} userData.application - Optional application type ("blog", etc.)
   * @param {string} userData.status - Optional status ("PENDING" or "APPROVED")
   * @returns {Promise} Response with accesstoken or pending status
   */
  register: async (userData) => {
    const response = await api.post('/register', userData);
    
    // If token is returned, save it to a client-accessible cookie
    if (response.data.accesstoken) {
      document.cookie = `accesstoken=${response.data.accesstoken}; path=/; max-age=${7 * 24 * 60 * 60}`;
      console.log('✅ Token saved to cookie after registration');
    }
    
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   * @param {boolean} credentials.rememberMe - Remember user session
   * @returns {Promise} Response with accesstoken
   */
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    
    // If token is returned, save it to a client-accessible cookie
    if (response.data.accesstoken) {
      const maxAge = credentials.rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60; // 7 days or 1 day
      document.cookie = `accesstoken=${response.data.accesstoken}; path=/; max-age=${maxAge}`;
      console.log('✅ Token saved to cookie after login');
    }
    
    return response.data;
  },

  /**
   * Check user registration status
   * @param {string} email - User's email to check
   * @returns {Promise} User status information
   */
  checkStatus: async (email) => {
    const response = await api.post('/check-status', { email });
    return response.data;
  },

  /**
   * Request password reset
   * @param {string} email - User's email
   * @returns {Promise} Success message
   */
  forgotPassword: async (email) => {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  /**
   * Verify password reset token
   * @param {string} token - Reset token from email
   * @returns {Promise} Token validity status
   */
  verifyResetToken: async (token) => {
    const response = await api.post('/verify-reset-token', { token });
    return response.data;
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token from email
   * @param {string} password - New password (min 6 characters)
   * @returns {Promise} Success message
   */
  resetPassword: async (token, password) => {
    const response = await api.post(`/reset-password/${token}`, { password });
    return response.data;
  },

  /**
   * Get current user profile
   * @returns {Promise} Current user data
   */
  getMe: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    console.log('[authService] logout() called from', new Error().stack?.split('\n').slice(2, 5).join(' <- '));
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('firstLogin');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    document.cookie = 'accesstoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  },

  /**
   * Refresh token
   * @returns {Promise} New access token
   */
  refreshToken: async () => {
    const response = await api.get('/refresh_token');
    return response.data;
  }
};

export default authService;
