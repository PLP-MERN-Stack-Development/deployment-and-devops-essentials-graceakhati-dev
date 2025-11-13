// api.js - Central API configuration
// This file provides a single source of truth for all API endpoints

/**
 * Get the API base URL from environment variables
 * NEVER uses hardcoded URLs - always from environment
 * @returns {string} The API base URL (with /api suffix)
 */
export const getApiBaseUrl = () => {
  // Vite environment variable (REQUIRED)
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    // Ensure we have /api suffix
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  }

  // If environment variable is not set, throw an error
  // This ensures we never silently fall back to wrong URLs
  throw new Error(
    'VITE_API_BASE_URL environment variable is not set. ' +
    'Please set it in your .env file or Vercel environment variables. ' +
    'For development: VITE_API_BASE_URL=http://localhost:5000 ' +
    'For production: VITE_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com'
  );
};

// API Endpoints helper functions
export const API_ENDPOINTS = {
  BUGS: () => `${getApiBaseUrl()}/bugs`,
  BUG_BY_ID: (id) => `${getApiBaseUrl()}/bugs/${id}`,
  HEALTH: () => {
    const baseUrl = getApiBaseUrl().replace('/api', '');
    return `${baseUrl}/api/health`;
  },
};

// Export default function
export default getApiBaseUrl;
