// bugService.js - API service functions for bug operations

// Support both Vite (import.meta.env) and Create React App (process.env) for compatibility
const getApiBaseUrl = () => {
  // Vite environment variable (preferred for Vite projects)
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // Create React App environment variable (for CRA projects)
  // Check both REACT_APP_API_BASE_URL and REACT_APP_API_URL for compatibility
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Default fallback for development
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Fetch all bugs from the API
 * @param {Object} filters - Optional filters (status, priority, sort)
 * @returns {Promise} Promise that resolves to bugs array
 */
// Helper function to check backend health
const checkBackendHealth = async () => {
  try {
    // Extract base URL without /api suffix for health check
    const baseUrl = API_BASE_URL.replace('/api', '');
    const healthUrl = `${baseUrl}/api/health`;
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    // Timeout or network error - backend is not available
    if (error.name === 'AbortError') {
      console.warn('[bugService] Backend health check timed out after 5 seconds');
    } else {
      console.warn('[bugService] Backend health check failed:', error.message);
    }
    return false;
  }
};

// Helper function to get user-friendly error message
const getConnectionErrorMessage = (apiUrl) => {
  const baseUrl = apiUrl.replace('/api', '');
  return `Unable to connect to the backend server at ${baseUrl}. ` +
    `Please ensure:\n` +
    `1. The backend server is running\n` +
    `2. MongoDB is running and accessible\n` +
    `3. No firewall is blocking the connection\n` +
    `4. Check the backend console for any errors\n` +
    `5. Verify the API URL in your .env file: ${apiUrl}`;
};

export const getBugs = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.sort) queryParams.append('sort', filters.sort);

    const url = `${API_BASE_URL}/bugs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    console.log(`[bugService] Fetching bugs from: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[bugService] Response error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch bugs: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[bugService] Successfully fetched ${data.count || data.length || 0} bugs`);
    return data.data || data;
  } catch (error) {
    console.error('[bugService] Error fetching bugs:', error);
    
    // Provide user-friendly error message for connection issues
    if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.name === 'AbortError') {
      // Check if backend is reachable
      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        throw new Error(getConnectionErrorMessage(API_BASE_URL));
      }
      throw new Error('Network error: Unable to reach the server. Please check your connection.');
    }
    throw error;
  }
};

/**
 * Fetch a single bug by ID
 * @param {string} id - Bug ID
 * @returns {Promise} Promise that resolves to bug object
 */
export const getBug = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bugs/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch bug: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching bug:', error);
    if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.name === 'AbortError') {
      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        throw new Error(getConnectionErrorMessage(API_BASE_URL));
      }
      throw new Error('Network error: Unable to reach the server. Please check your connection.');
    }
    throw error;
  }
};

/**
 * Create a new bug
 * @param {Object} bugData - Bug data (title, description, status, priority, reporter)
 * @returns {Promise} Promise that resolves to created bug object
 */
export const createBug = async (bugData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bugs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bugData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create bug: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error creating bug:', error);
    if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.name === 'AbortError') {
      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        throw new Error(getConnectionErrorMessage(API_BASE_URL));
      }
      throw new Error('Network error: Unable to reach the server. Please check your connection.');
    }
    throw error;
  }
};

/**
 * Update an existing bug
 * @param {string} id - Bug ID
 * @param {Object} bugData - Updated bug data
 * @returns {Promise} Promise that resolves to updated bug object
 */
export const updateBug = async (id, bugData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bugs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bugData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update bug: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error updating bug:', error);
    if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.name === 'AbortError') {
      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        throw new Error(getConnectionErrorMessage(API_BASE_URL));
      }
      throw new Error('Network error: Unable to reach the server. Please check your connection.');
    }
    throw error;
  }
};

/**
 * Delete a bug
 * @param {string} id - Bug ID
 * @returns {Promise} Promise that resolves when bug is deleted
 */
export const deleteBug = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bugs/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete bug: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting bug:', error);
    if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.name === 'AbortError') {
      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        throw new Error(getConnectionErrorMessage(API_BASE_URL));
      }
      throw new Error('Network error: Unable to reach the server. Please check your connection.');
    }
    throw error;
  }
};





