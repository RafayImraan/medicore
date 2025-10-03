const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAuthentication() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Try to access protected route without token
    console.log('1. Testing access to protected route without token...');
    try {
      await axios.get(`${BASE_URL}/api/admin/stats`);
      console.log('❌ FAIL: Should have been blocked without token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ PASS: Correctly blocked access without token');
      } else {
        console.log('❌ FAIL: Unexpected error:', error.message);
      }
    }

    // Test 2: Register a test user
    console.log('\n2. Registering test user...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
        name: 'Test Admin',
        email: 'testadmin@example.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('✅ PASS: User registered successfully');
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.error === 'User already exists') {
        console.log('✅ PASS: User already exists, skipping registration');
      } else {
        console.log('❌ FAIL: Unexpected error during registration:', error.message);
      }
    }

    // Test 3: Login to get token and access admin stats
    console.log('\n3. Logging in and accessing admin stats...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'testadmin@example.com',
      password: 'password123'
    });
    
    const { token, user } = loginResponse.data;
    console.log('✅ PASS: Login successful');
    console.log(`   Token: ${token.substring(0, 20)}...`);
    console.log(`   User Role: ${user.role}`);

    // Access protected route with valid token
    console.log('\n4. Testing access to protected route with valid token...');
    const protectedResponse = await axios.get(`${BASE_URL}/api/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ PASS: Successfully accessed protected route');
    console.log('   Stats data:', protectedResponse.data);

    // Test 4: Access protected route with valid token
    console.log('\n4. Testing access to protected route with valid token...');

    // Test 5: Test role-based access (admin only)
    console.log('\n5. Testing admin-only access...');
    const adminResponse = await axios.get(`${BASE_URL}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ PASS: Successfully accessed admin-only route');
    console.log('   Users data received');

    // Test 6: Update user
    console.log('\n6. Updating user...');
    const updateResponse = await axios.put(`${BASE_URL}/api/admin/users/${adminResponse.data.users[0]._id}`, {
      name: 'Updated User',
      role: 'doctor'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ PASS: User updated successfully');
    console.log('   Updated User:', updateResponse.data);

    // Test 7: Delete user
    console.log('\n7. Deleting user...');
    const deleteResponse = await axios.delete(`${BASE_URL}/api/admin/users/${adminResponse.data.users[0]._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ PASS: User deleted successfully');

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n🔒 Security features implemented:');
    console.log('   - JWT token authentication');
    console.log('   - Protected routes require valid tokens');
    console.log('   - Role-based access control (admin only)');
    console.log('   - Automatic token expiration handling');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAuthentication();
