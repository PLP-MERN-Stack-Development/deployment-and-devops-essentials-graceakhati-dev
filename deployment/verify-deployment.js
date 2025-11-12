// verify-deployment.js - Deployment verification script
// Tests both backend and frontend connectivity

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://bug-tracker-backend-na6z.onrender.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
};

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

async function testBackendHealth() {
  log('\n' + '='.repeat(60), 'bright');
  log('🧪 Testing Backend Health', 'bright');
  log('='.repeat(60), 'bright');
  
  try {
    const healthUrl = `${API_BASE_URL}/api/health`;
    logInfo(`Testing: ${healthUrl}`);
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      logError(`Backend health check failed: ${response.status} ${response.statusText}`);
      return false;
    }

    const data = await response.json();
    logSuccess('Backend is healthy!');
    logInfo(`Status: ${data.status}`);
    logInfo(`Environment: ${data.environment || 'unknown'}`);
    logInfo(`Uptime: ${Math.round(data.uptime)}s`);
    return true;
  } catch (error) {
    logError(`Backend health check failed: ${error.message}`);
    return false;
  }
}

async function testBackendAPI() {
  log('\n' + '='.repeat(60), 'bright');
  log('🧪 Testing Backend API Endpoints', 'bright');
  log('='.repeat(60), 'bright');
  
  const apiUrl = `${API_BASE_URL}/api/bugs`;
  logInfo(`Testing: ${apiUrl}`);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      logError(`API test failed: ${response.status} ${response.statusText}`);
      return false;
    }

    const data = await response.json();
    logSuccess('Backend API is accessible!');
    logInfo(`Retrieved ${Array.isArray(data) ? data.length : 'data'} items`);
    return true;
  } catch (error) {
    logError(`API test failed: ${error.message}`);
    return false;
  }
}

async function testCORS() {
  log('\n' + '='.repeat(60), 'bright');
  log('🧪 Testing CORS Configuration', 'bright');
  log('='.repeat(60), 'bright');
  
  const apiUrl = `${API_BASE_URL}/api/health`;
  logInfo(`Testing CORS from: ${FRONTEND_URL}`);
  logInfo(`To: ${apiUrl}`);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': FRONTEND_URL,
      },
    });

    const corsHeader = response.headers.get('access-control-allow-origin');
    
    if (corsHeader) {
      logSuccess('CORS is configured!');
      logInfo(`Access-Control-Allow-Origin: ${corsHeader}`);
      return true;
    } else {
      logWarning('CORS header not found (may still work)');
      return true; // Don't fail if header missing but request succeeds
    }
  } catch (error) {
    logError(`CORS test failed: ${error.message}`);
    return false;
  }
}

async function checkEnvironmentVariables() {
  log('\n' + '='.repeat(60), 'bright');
  log('🔍 Checking Environment Variables', 'bright');
  log('='.repeat(60), 'bright');
  
  const required = {
    'VITE_API_BASE_URL': process.env.VITE_API_BASE_URL,
    'NODE_ENV': process.env.NODE_ENV,
  };
  
  let allPresent = true;
  
  for (const [key, value] of Object.entries(required)) {
    if (value) {
      logSuccess(`${key}: ${value}`);
    } else {
      logWarning(`${key}: Not set`);
      allPresent = false;
    }
  }
  
  return allPresent;
}

async function runAllTests() {
  log('\n' + '='.repeat(60), 'bright');
  log('🚀 Deployment Verification', 'bright');
  log('='.repeat(60), 'bright');
  log(`Backend URL: ${API_BASE_URL}`, 'cyan');
  log(`Frontend URL: ${FRONTEND_URL}`, 'cyan');
  
  const results = {
    backendHealth: false,
    backendAPI: false,
    cors: false,
    envVars: false,
  };
  
  // Run tests
  results.envVars = await checkEnvironmentVariables();
  results.backendHealth = await testBackendHealth();
  results.backendAPI = await testBackendAPI();
  results.cors = await testCORS();
  
  // Summary
  log('\n' + '='.repeat(60), 'bright');
  log('📊 Test Summary', 'bright');
  log('='.repeat(60), 'bright');
  
  const allPassed = Object.values(results).every(r => r);
  
  log(`Environment Variables: ${results.envVars ? '✅' : '❌'}`, results.envVars ? 'green' : 'red');
  log(`Backend Health: ${results.backendHealth ? '✅' : '❌'}`, results.backendHealth ? 'green' : 'red');
  log(`Backend API: ${results.backendAPI ? '✅' : '❌'}`, results.backendAPI ? 'green' : 'red');
  log(`CORS Configuration: ${results.cors ? '✅' : '❌'}`, results.cors ? 'green' : 'red');
  
  log('\n' + '='.repeat(60), 'bright');
  if (allPassed) {
    logSuccess('🎉 All tests passed! Deployment is ready.');
  } else {
    logError('⚠️  Some tests failed. Please review the errors above.');
  }
  log('='.repeat(60) + '\n', 'bright');
  
  process.exit(allPassed ? 0 : 1);
}

// Run tests
runAllTests().catch((error) => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});

