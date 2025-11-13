// connectionTest.js - Utility to test backend API connectivity
// Can be used during development or in production to verify backend connection

/**
 * Get the current API base URL being used
 * @returns {string} The API base URL (with /api suffix)
 */
export const getApiBaseUrl = () => {
  // Vite environment variable (primary)
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    // Ensure we have /api suffix
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  }
  // Fallback based on environment
  // In production (Vercel), use Render backend
  // In development, use localhost
  if (import.meta.env?.MODE === 'production' || import.meta.env?.PROD) {
    return 'https://bug-tracker-backend-na6z.onrender.com/api';
  }
  // Development fallback
  return 'http://localhost:5000/api';
};

/**
 * Test backend health endpoint
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export const testBackendHealth = async (timeout = 5000) => {
  const apiBaseUrl = getApiBaseUrl();
  const baseUrl = apiBaseUrl.replace('/api', '');
  const healthUrl = `${baseUrl}/api/health`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        message: `Backend returned status ${response.status}`,
        status: response.status,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Backend is healthy and reachable',
      data,
      status: response.status,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: `Backend health check timed out after ${timeout}ms`,
        error: 'Timeout',
      };
    }
    return {
      success: false,
      message: `Failed to connect to backend: ${error.message}`,
      error: error.message,
    };
  }
};

/**
 * Test a specific API endpoint
 * @param {string} endpoint - API endpoint path (e.g., '/bugs')
 * @param {Object} options - Fetch options
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export const testApiEndpoint = async (endpoint, options = {}) => {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Endpoint returned status ${response.status}`,
        status: response.status,
        error: errorText,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Endpoint is accessible',
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to reach endpoint: ${error.message}`,
      error: error.message,
    };
  }
};

/**
 * Run comprehensive connection tests
 * @returns {Promise<{overall: boolean, tests: Array}>}
 */
export const runConnectionTests = async () => {
  const results = {
    overall: false,
    tests: [],
    apiBaseUrl: getApiBaseUrl(),
  };

  // Test 1: Health check
  const healthTest = await testBackendHealth();
  results.tests.push({
    name: 'Health Check',
    endpoint: '/api/health',
    ...healthTest,
  });

  // Test 2: Bugs endpoint (if health check passes)
  if (healthTest.success) {
    const bugsTest = await testApiEndpoint('/bugs');
    results.tests.push({
      name: 'Bugs Endpoint',
      endpoint: '/api/bugs',
      ...bugsTest,
    });
  }

  // Overall success if all tests pass
  results.overall = results.tests.every(test => test.success);

  return results;
};

/**
 * Log connection test results to console
 * @param {Object} results - Results from runConnectionTests
 */
export const logConnectionTestResults = (results) => {
  console.group('🔍 Backend Connection Test Results');
  console.log(`API Base URL: ${results.apiBaseUrl}`);
  console.log(`Overall Status: ${results.overall ? '✅ Connected' : '❌ Failed'}`);
  console.group('Test Details');
  results.tests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name} (${test.endpoint})`);
    console.log(`   Status: ${test.success ? '✅' : '❌'} ${test.message}`);
    if (test.data) {
      console.log(`   Response:`, test.data);
    }
    if (test.error) {
      console.error(`   Error:`, test.error);
    }
  });
  console.groupEnd();
  console.groupEnd();
};

// Export default function for easy import
export default {
  getApiBaseUrl,
  testBackendHealth,
  testApiEndpoint,
  runConnectionTests,
  logConnectionTestResults,
};

