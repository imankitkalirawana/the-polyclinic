/**
 * Simple test script to verify email and password authentication
 * Run this with: node test-auth.js
 */

const BASE_URL = 'http://localhost:3000';

async function testAuthEndpoints() {
  console.log('🧪 Testing Email & Password Authentication Endpoints\n');

  // Test 1: Check if the auth endpoints are accessible
  console.log('1. Testing endpoint accessibility...');

  try {
    const response = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword123',
      }),
    });

    console.log(`   Sign-up endpoint status: ${response.status}`);

    if (response.status === 200 || response.status === 400) {
      console.log('   ✅ Sign-up endpoint is accessible');
    } else {
      console.log('   ❌ Sign-up endpoint returned unexpected status');
    }
  } catch (error) {
    console.log('   ❌ Sign-up endpoint test failed:', error.message);
  }

  // Test 2: Check sign-in endpoint
  try {
    const response = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword123',
      }),
    });

    console.log(`   Sign-in endpoint status: ${response.status}`);

    if (response.status === 200 || response.status === 400 || response.status === 401) {
      console.log('   ✅ Sign-in endpoint is accessible');
    } else {
      console.log('   ❌ Sign-in endpoint returned unexpected status');
    }
  } catch (error) {
    console.log('   ❌ Sign-in endpoint test failed:', error.message);
  }

  // Test 3: Check password reset endpoint
  try {
    const response = await fetch(`${BASE_URL}/api/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    console.log(`   Password reset endpoint status: ${response.status}`);

    if (response.status === 200 || response.status === 400) {
      console.log('   ✅ Password reset endpoint is accessible');
    } else {
      console.log('   ❌ Password reset endpoint returned unexpected status');
    }
  } catch (error) {
    console.log('   ❌ Password reset endpoint test failed:', error.message);
  }

  // Test 4: Check email OTP endpoint
  try {
    const response = await fetch(`${BASE_URL}/api/auth/email-otp/send-verification-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        type: 'email-verification',
      }),
    });

    console.log(`   Email OTP endpoint status: ${response.status}`);

    if (response.status === 200 || response.status === 400) {
      console.log('   ✅ Email OTP endpoint is accessible');
    } else {
      console.log('   ❌ Email OTP endpoint returned unexpected status');
    }
  } catch (error) {
    console.log('   ❌ Email OTP endpoint test failed:', error.message);
  }

  console.log('\n📋 Test Summary:');
  console.log('   - Make sure your development server is running on http://localhost:3000');
  console.log('   - Check that your MongoDB connection is working');
  console.log('   - Verify that your email configuration is set up correctly');
  console.log('   - Test the registration flow manually in the browser');
}

// Run the tests
testAuthEndpoints().catch(console.error);
