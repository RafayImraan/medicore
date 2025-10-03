async function testEndpoints() {
  const baseURL = 'http://localhost:5000/api';

  try {
    // Test login to get token
    console.log('Testing login...');
    const loginResponse = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'patient1@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginResponse.json();
    if (!loginResponse.ok) throw new Error(loginData.message);
    const token = loginData.token;
    console.log('Login successful, token received');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    // Test lab results
    console.log('Testing lab results endpoint...');
    const labResultsResponse = await fetch(`${baseURL}/patient/${loginData.user.id}/lab-results`, {
      headers: config.headers
    });
    const labResults = await labResultsResponse.json();
    if (!labResultsResponse.ok) throw new Error(labResults.message);
    console.log('Lab results:', labResults.length, 'records');

    // Test prescriptions
    console.log('Testing prescriptions endpoint...');
    const prescriptionsResponse = await fetch(`${baseURL}/patient/${loginData.user.id}/prescriptions`, {
      headers: config.headers
    });
    const prescriptions = await prescriptionsResponse.json();
    if (!prescriptionsResponse.ok) throw new Error(prescriptions.message);
    console.log('Prescriptions:', prescriptions.length, 'records');

    // Test billing
    console.log('Testing billing endpoint...');
    const billingResponse = await fetch(`${baseURL}/patient/${loginData.user.id}/billing`, {
      headers: config.headers
    });
    const billing = await billingResponse.json();
    if (!billingResponse.ok) throw new Error(billing.message);
    console.log('Billing:', billing.length, 'records');

    // Test notifications
    console.log('Testing notifications endpoint...');
    const notificationsResponse = await fetch(`${baseURL}/patient/${loginData.user.id}/notifications`, {
      headers: config.headers
    });
    const notifications = await notificationsResponse.json();
    if (!notificationsResponse.ok) throw new Error(notifications.message);
    console.log('Notifications:', notifications.length, 'records');

    console.log('All endpoints tested successfully!');

  } catch (error) {
    console.error('Error testing endpoints:', error.message);
  }
}

testEndpoints();
