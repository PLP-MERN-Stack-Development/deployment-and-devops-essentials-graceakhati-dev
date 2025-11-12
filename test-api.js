// test-api.js - Backend API Test Script
// Tests the bug tracker backend API at https://bug-tracker-backend.onrender.com

const API_BASE_URL = 'https://bug-tracker-backend-na6z.onrender.com';

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// Helper function to print colored messages
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logTest(message) {
  log(`\n${'='.repeat(60)}`, 'bright');
  log(`🧪 ${message}`, 'bright');
  log('='.repeat(60), 'bright');
}

// Helper function to make API requests
async function makeRequest(method, endpoint, body = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If not JSON, get text and try to parse
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        // If parsing fails, return the text
        data = { error: 'Non-JSON response', content: text.substring(0, 200) };
      }
    }
    
    return { response, data };
  } catch (error) {
    throw error;
  }
}

// Test functions
async function testHealthCheck() {
  logTest('Testing GET /api/health');
  try {
    const { response, data } = await makeRequest('GET', '/api/health');
    
    if (response.ok && data.success) {
      logSuccess(`Health check passed! Status: ${data.status}`);
      logInfo(`Timestamp: ${data.timestamp}`);
      if (data.uptime) {
        logInfo(`Uptime: ${Math.round(data.uptime)}s`);
      }
      if (data.memory) {
        logInfo(`Memory: ${data.memory.used}MB / ${data.memory.total}MB`);
      }
      return true;
    } else {
      logError(`Health check failed! Status: ${response.status}`);
      logError(`Response: ${JSON.stringify(data, null, 2)}`);
      return false;
    }
  } catch (error) {
    if (error.message.includes('fetch')) {
      logError(`Network error: Unable to connect to ${API_BASE_URL}`);
      logError(`Please check if the server is running and accessible.`);
    } else {
      logError(`Health check error: ${error.message}`);
    }
    return false;
  }
}

async function testGetBugs() {
  logTest('Testing GET /api/bugs');
  try {
    const { response, data } = await makeRequest('GET', '/api/bugs');
    
    if (response.ok) {
      logSuccess(`GET /api/bugs successful! Status: ${response.status}`);
      if (Array.isArray(data)) {
        logInfo(`Retrieved ${data.length} bug(s)`);
        if (data.length > 0) {
          logInfo(`First bug: ${JSON.stringify(data[0], null, 2)}`);
        }
      } else {
        logInfo(`Response: ${JSON.stringify(data, null, 2)}`);
      }
      return { success: true, bugs: data };
    } else {
      logError(`GET /api/bugs failed! Status: ${response.status}`);
      logError(`Response: ${JSON.stringify(data, null, 2)}`);
      return { success: false, bugs: null };
    }
  } catch (error) {
    if (error.message.includes('fetch')) {
      logError(`Network error: Unable to connect to ${API_BASE_URL}`);
    } else {
      logError(`GET /api/bugs error: ${error.message}`);
    }
    return { success: false, bugs: null };
  }
}

async function testCreateBug() {
  logTest('Testing POST /api/bugs');
  try {
    const newBug = {
      title: `Test Bug - ${new Date().toISOString()}`,
      description: 'This is a test bug created by the API test script',
      priority: 'medium',
      status: 'open',
    };

    logInfo(`Creating bug: ${JSON.stringify(newBug, null, 2)}`);
    
    const { response, data } = await makeRequest('POST', '/api/bugs', newBug);
    
    if (response.ok || response.status === 201) {
      logSuccess(`POST /api/bugs successful! Status: ${response.status}`);
      logInfo(`Created bug: ${JSON.stringify(data, null, 2)}`);
      return { success: true, bug: data };
    } else {
      logError(`POST /api/bugs failed! Status: ${response.status}`);
      logError(`Response: ${JSON.stringify(data, null, 2)}`);
      return { success: false, bug: null };
    }
  } catch (error) {
    if (error.message.includes('fetch')) {
      logError(`Network error: Unable to connect to ${API_BASE_URL}`);
    } else {
      logError(`POST /api/bugs error: ${error.message}`);
    }
    return { success: false, bug: null };
  }
}

async function testGetBugById(bugId) {
  logTest(`Testing GET /api/bugs/${bugId}`);
  try {
    const { response, data } = await makeRequest('GET', `/api/bugs/${bugId}`);
    
    if (response.ok) {
      logSuccess(`GET /api/bugs/${bugId} successful! Status: ${response.status}`);
      logInfo(`Bug details: ${JSON.stringify(data, null, 2)}`);
      return { success: true, bug: data };
    } else {
      logError(`GET /api/bugs/${bugId} failed! Status: ${response.status}`);
      logError(`Response: ${JSON.stringify(data, null, 2)}`);
      return { success: false, bug: null };
    }
  } catch (error) {
    if (error.message.includes('fetch')) {
      logError(`Network error: Unable to connect to ${API_BASE_URL}`);
    } else {
      logError(`GET /api/bugs/${bugId} error: ${error.message}`);
    }
    return { success: false, bug: null };
  }
}

async function testUpdateBug(bugId) {
  logTest(`Testing PUT /api/bugs/${bugId}`);
  try {
    const updateData = {
      status: 'in-progress',
      priority: 'high',
      description: 'Updated description from API test script',
    };

    logInfo(`Updating bug with: ${JSON.stringify(updateData, null, 2)}`);
    
    const { response, data } = await makeRequest('PUT', `/api/bugs/${bugId}`, updateData);
    
    if (response.ok) {
      logSuccess(`PUT /api/bugs/${bugId} successful! Status: ${response.status}`);
      logInfo(`Updated bug: ${JSON.stringify(data, null, 2)}`);
      return { success: true, bug: data };
    } else {
      logError(`PUT /api/bugs/${bugId} failed! Status: ${response.status}`);
      logError(`Response: ${JSON.stringify(data, null, 2)}`);
      return { success: false, bug: null };
    }
  } catch (error) {
    if (error.message.includes('fetch')) {
      logError(`Network error: Unable to connect to ${API_BASE_URL}`);
    } else {
      logError(`PUT /api/bugs/${bugId} error: ${error.message}`);
    }
    return { success: false, bug: null };
  }
}

async function testDeleteBug(bugId) {
  logTest(`Testing DELETE /api/bugs/${bugId}`);
  try {
    const { response, data } = await makeRequest('DELETE', `/api/bugs/${bugId}`);
    
    if (response.ok || response.status === 204) {
      logSuccess(`DELETE /api/bugs/${bugId} successful! Status: ${response.status}`);
      if (data) {
        logInfo(`Response: ${JSON.stringify(data, null, 2)}`);
      }
      return true;
    } else {
      logError(`DELETE /api/bugs/${bugId} failed! Status: ${response.status}`);
      logError(`Response: ${JSON.stringify(data, null, 2)}`);
      return false;
    }
  } catch (error) {
    if (error.message.includes('fetch')) {
      logError(`Network error: Unable to connect to ${API_BASE_URL}`);
    } else {
      logError(`DELETE /api/bugs/${bugId} error: ${error.message}`);
    }
    return false;
  }
}

async function testInvalidEndpoint() {
  logTest('Testing Invalid Endpoint (404 test)');
  try {
    const { response, data } = await makeRequest('GET', '/api/invalid-endpoint');
    
    if (response.status === 404) {
      logSuccess(`404 handling works correctly! Status: ${response.status}`);
      logInfo(`Response: ${JSON.stringify(data, null, 2)}`);
      return true;
    } else {
      logWarning(`Expected 404 but got ${response.status}`);
      logInfo(`Response: ${JSON.stringify(data, null, 2)}`);
      return false;
    }
  } catch (error) {
    if (error.message.includes('fetch')) {
      logError(`Network error: Unable to connect to ${API_BASE_URL}`);
    } else {
      logError(`Invalid endpoint test error: ${error.message}`);
    }
    return false;
  }
}

// Main test runner
async function runTests() {
  log('\n' + '='.repeat(60), 'bright');
  log('🚀 Starting API Tests', 'bright');
  log(`📍 Testing: ${API_BASE_URL}`, 'bright');
  log('='.repeat(60) + '\n', 'bright');

  const results = {
    passed: 0,
    failed: 0,
    total: 0,
  };

  // Test 1: Health Check
  results.total++;
  const healthCheckPassed = await testHealthCheck();
  if (healthCheckPassed) results.passed++;
  else results.failed++;

  // Test 2: Get All Bugs
  results.total++;
  const getBugsResult = await testGetBugs();
  if (getBugsResult.success) results.passed++;
  else results.failed++;

  // Test 3: Create Bug
  results.total++;
  const createBugResult = await testCreateBug();
  if (createBugResult.success) results.passed++;
  else results.failed++;

  let createdBugId = null;
  if (createBugResult.success && createBugResult.bug) {
    // Extract bug ID (could be _id or id)
    createdBugId = createBugResult.bug._id || createBugResult.bug.id;
  }

  // Test 4: Get Bug by ID (if we have a bug ID)
  if (createdBugId) {
    results.total++;
    const getBugResult = await testGetBugById(createdBugId);
    if (getBugResult.success) results.passed++;
    else results.failed++;
  } else {
    // Try to get a bug from the list if available
    if (getBugsResult.success && Array.isArray(getBugsResult.bugs) && getBugsResult.bugs.length > 0) {
      const existingBugId = getBugsResult.bugs[0]._id || getBugsResult.bugs[0].id;
      if (existingBugId) {
        results.total++;
        const getBugResult = await testGetBugById(existingBugId);
        if (getBugResult.success) results.passed++;
        else results.failed++;
      }
    }
  }

  // Test 5: Update Bug (if we have a bug ID)
  if (createdBugId) {
    results.total++;
    const updateBugResult = await testUpdateBug(createdBugId);
    if (updateBugResult.success) results.passed++;
    else results.failed++;
  }

  // Test 6: Delete Bug (if we created one)
  if (createdBugId) {
    results.total++;
    const deleteBugResult = await testDeleteBug(createdBugId);
    if (deleteBugResult) results.passed++;
    else results.failed++;
  }

  // Test 7: Invalid Endpoint (404 test)
  results.total++;
  const invalidEndpointPassed = await testInvalidEndpoint();
  if (invalidEndpointPassed) results.passed++;
  else results.failed++;

  // Summary
  log('\n' + '='.repeat(60), 'bright');
  log('📊 Test Summary', 'bright');
  log('='.repeat(60), 'bright');
  log(`Total Tests: ${results.total}`, 'cyan');
  log(`✅ Passed: ${results.passed}`, 'green');
  log(`❌ Failed: ${results.failed}`, 'red');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`, 
      results.failed === 0 ? 'green' : 'yellow');
  log('='.repeat(60) + '\n', 'bright');
}

// Run tests
runTests().catch((error) => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});

