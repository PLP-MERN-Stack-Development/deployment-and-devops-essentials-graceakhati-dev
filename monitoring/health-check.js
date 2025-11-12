/**
 * Health Check Script
 * 
 * This script can be used to monitor the health of your deployed application.
 * Run it periodically using a cron job or monitoring service.
 * 
 * Usage:
 *   node monitoring/health-check.js [backend-url]
 * 
 * Example:
 *   node monitoring/health-check.js https://your-backend.railway.app
 */

const https = require('https');
const http = require('http');

const BACKEND_URL = process.argv[2] || process.env.BACKEND_URL || 'http://localhost:5000';
const TIMEOUT = 5000; // 5 seconds

function checkHealth(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const startTime = Date.now();
    
    const request = client.get(`${url}/api/health`, {
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'Health-Check-Script/1.0'
      }
    }, (response) => {
      const responseTime = Date.now() - startTime;
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 200) {
          try {
            const healthData = JSON.parse(data);
            resolve({
              status: 'healthy',
              statusCode: response.statusCode,
              responseTime,
              data: healthData
            });
          } catch (e) {
            resolve({
              status: 'unhealthy',
              statusCode: response.statusCode,
              responseTime,
              error: 'Invalid JSON response'
            });
          }
        } else {
          resolve({
            status: 'unhealthy',
            statusCode: response.statusCode,
            responseTime,
            error: `Unexpected status code: ${response.statusCode}`
          });
        }
      });
    });
    
    request.on('error', (error) => {
      reject({
        status: 'unhealthy',
        error: error.message,
        responseTime: Date.now() - startTime
      });
    });
    
    request.on('timeout', () => {
      request.destroy();
      reject({
        status: 'unhealthy',
        error: 'Request timeout',
        responseTime: TIMEOUT
      });
    });
  });
}

async function main() {
  console.log(`🔍 Checking health of: ${BACKEND_URL}`);
  console.log('─'.repeat(50));
  
  try {
    const result = await checkHealth(BACKEND_URL);
    
    if (result.status === 'healthy') {
      console.log('✅ Status: HEALTHY');
      console.log(`📊 Response Time: ${result.responseTime}ms`);
      console.log(`📝 Status Code: ${result.statusCode}`);
      console.log(`📄 Response Data:`, JSON.stringify(result.data, null, 2));
      process.exit(0);
    } else {
      console.log('❌ Status: UNHEALTHY');
      console.log(`📊 Response Time: ${result.responseTime}ms`);
      console.log(`📝 Status Code: ${result.statusCode || 'N/A'}`);
      console.log(`⚠️  Error: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ Status: UNHEALTHY');
    console.log(`⚠️  Error: ${error.error || error.message}`);
    console.log(`📊 Response Time: ${error.responseTime || 'N/A'}ms`);
    process.exit(1);
  }
}

main();

