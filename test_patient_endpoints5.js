const axios = require('axios');

async function testEndpoints() {
  const baseURL = 'http://localhost:5000/api';

  try {
    // Test login to get token
    console.log('Testing login...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'patient1@example.com',
      password: 'password123'
    });
    const token = loginResponse.data.token;
    console.log('Login successful, token received');

    // Get user ID from the response
    const userId = loginResponse.data.user._id;
    console.log('User ID:', userId);

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // Test lab results
    console.log('Testing lab results endpoint...');
    const labResults = await axios.get(`${baseURL}/patients/${userId}/lab-results`, config);
    console.log('Lab results:', labResults.data.length, 'records');

    // Test prescriptions
    console.log('Testing prescriptions endpoint...');
    const prescriptions = await axios.get(`${baseURL}/patients/${userId}/prescriptions`, config);
    console.log('Prescriptions:', prescriptions.data.length, 'records');

    // Test billing
    console.log('Testing billing endpoint...');
    const billing = await axios.get(`${baseURL}/patients/${userId}/billing`, config);
    console.log('Billing:', billing.data.length, 'records');

    // Test notifications
    console.log('Testing notifications endpoint...');
    const notifications = await axios.get(`${baseURL}/patients/${userId}/notifications`, config);
    console.log('Notifications:', notifications.data.length, 'records');

    console.log('All endpoints tested successfully!');

  } catch (error) {
    console.error('Error testing endpoints:', error.response ? error.response.data : error.message);
  }
}

testEndpoints();
