/**
 * Test script for Enquiry Form Submission
 * This script tests the enquiry form API endpoint
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3000'; // Adjust if your API runs on a different port
const API_PREFIX = '/api/public';

// Test data
const testEnquiries = [
  {
    name: 'Test Case 1: Valid submission with car',
    data: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+60123456789',
      state: 'Kuala Lumpur',
      pdpaConsent: true,
      marketingConsent: true,
      carId: 1 // Assuming car ID 1 exists
    },
    expected: 'success'
  },
  {
    name: 'Test Case 2: Valid submission without car',
    data: {
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '0123456789',
      state: 'Selangor',
      pdpaConsent: true,
      marketingConsent: false
    },
    expected: 'success'
  },
  {
    name: 'Test Case 3: Missing required field (email)',
    data: {
      fullName: 'Test User',
      phone: '0123456789',
      state: 'Penang',
      pdpaConsent: true,
      marketingConsent: false
    },
    expected: 'error'
  },
  {
    name: 'Test Case 4: Invalid email format',
    data: {
      fullName: 'Invalid Email User',
      email: 'invalid-email',
      phone: '0123456789',
      state: 'Johor',
      pdpaConsent: true,
      marketingConsent: false
    },
    expected: 'error'
  },
  {
    name: 'Test Case 5: Missing PDPA consent',
    data: {
      fullName: 'No Consent User',
      email: 'no.consent@example.com',
      phone: '0123456789',
      state: 'Melaka',
      pdpaConsent: false,
      marketingConsent: false
    },
    expected: 'error'
  }
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test results tracking
let passed = 0;
let failed = 0;
const results = [];

/**
 * Submit enquiry to API
 */
async function submitEnquiry(data) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_PREFIX}/enquiry`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

/**
 * Run a single test case
 */
async function runTest(testCase) {
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}Running: ${testCase.name}${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

  console.log('\n📤 Request Data:');
  console.log(JSON.stringify(testCase.data, null, 2));

  const result = await submitEnquiry(testCase.data);

  console.log('\n📥 Response:');
  console.log(`Status: ${result.status}`);
  console.log(JSON.stringify(result.success ? result.data : result.error, null, 2));

  // Validate result
  const isValid = (testCase.expected === 'success' && result.success) ||
                  (testCase.expected === 'error' && !result.success);

  if (isValid) {
    console.log(`\n${colors.green}✅ PASSED${colors.reset}`);
    passed++;
    results.push({ name: testCase.name, status: 'PASSED', result });
  } else {
    console.log(`\n${colors.red}❌ FAILED${colors.reset}`);
    console.log(`Expected: ${testCase.expected}, Got: ${result.success ? 'success' : 'error'}`);
    failed++;
    results.push({ name: testCase.name, status: 'FAILED', result });
  }
}

/**
 * Print summary
 */
function printSummary() {
  console.log('\n\n');
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.yellow}              TEST SUMMARY                  ${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

  console.log(`\nTotal Tests: ${passed + failed}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);

  console.log('\n📋 Detailed Results:');
  results.forEach((result, index) => {
    const statusColor = result.status === 'PASSED' ? colors.green : colors.red;
    const statusIcon = result.status === 'PASSED' ? '✅' : '❌';
    console.log(`${index + 1}. ${statusIcon} ${result.name} - ${statusColor}${result.status}${colors.reset}`);
  });

  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
}

/**
 * Check API server connectivity
 */
async function checkApiServer() {
  console.log(`${colors.yellow}Checking API server connectivity...${colors.reset}`);
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    console.log(`${colors.green}✅ API server is running${colors.reset}\n`);
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ API server is not responding${colors.reset}`);
    console.log(`${colors.red}Please start the API server first:${colors.reset}`);
    console.log(`${colors.yellow}cd /path/to/api && npm start${colors.reset}\n`);
    return false;
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log(`${colors.cyan}`);
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║    ENQUIRY FORM SUBMISSION TEST SUITE         ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log(`${colors.reset}\n`);

  // Check if API server is running
  const isServerRunning = await checkApiServer();
  if (!isServerRunning) {
    process.exit(1);
  }

  // Run all test cases
  for (const testCase of testEnquiries) {
    await runTest(testCase);
    // Add small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Print summary
  printSummary();

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
