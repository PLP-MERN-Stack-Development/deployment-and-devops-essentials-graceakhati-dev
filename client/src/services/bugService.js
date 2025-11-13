const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Health check
export const checkBackendHealth = async () => {
  try {
    console.log(`[bugService] Checking backend health at: ${API_BASE}/api/health`);
    const response = await fetch(`${API_BASE}/api/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('[bugService] Backend health check successful:', data);
    return data;
  } catch (error) {
    console.error('[bugService] Backend health check failed:', error);
    throw new Error(`Unable to connect to the backend server at ${API_BASE}. Please ensure:
1. The backend server is running
2. MongoDB is running and accessible
3. No firewall is blocking the connection
4. Check the backend console for any errors
5. Verify the API URL in your .env file: ${API_BASE}/api`);
  }
};

// Get all bugs - renamed to match what BugContext expects
export const getBugs = async () => {
  try {
    console.log(`[bugService] Fetching bugs from: ${API_BASE}/api/bugs`);
    const response = await fetch(`${API_BASE}/api/bugs`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('[bugService] Bugs fetched successfully');
    return data;
  } catch (error) {
    console.error('[bugService] Error fetching bugs:', error);
    throw error;
  }
};

// Get bug by ID
export const getBugById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/api/bugs/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[bugService] Error fetching bug ${id}:`, error);
    throw error;
  }
};

// Create new bug - renamed to match what BugContext expects
export const createBug = async (bugData) => {
  try {
    const response = await fetch(`${API_BASE}/api/bugs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bugData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[bugService] Error creating bug:', error);
    throw error;
  }
};

// Update bug - renamed to match what BugContext expects
export const updateBug = async (id, bugData) => {
  try {
    const response = await fetch(`${API_BASE}/api/bugs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bugData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[bugService] Error updating bug ${id}:`, error);
    throw error;
  }
};

// Delete bug - renamed to match what BugContext expects
export const deleteBug = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/api/bugs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[bugService] Error deleting bug ${id}:`, error);
    throw error;
  }
};

// Export fetchBugs as alias for getBugs for compatibility
export const fetchBugs = getBugs;
export const fetchBugById = getBugById;