const http = require('http');

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: body
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testPatientCreation() {
  try {
    console.log('Testing patient creation...');

    // First, login to get a token
    console.log('Logging in...');
    const loginOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const loginData = JSON.stringify({
      email: 'admin@example.com',
      password: 'admin123'
    });

    const loginResponse = await makeRequest(loginOptions, loginData);

    if (loginResponse.status !== 200) {
      console.log('Login failed. Response:', loginResponse.body);
      return;
    }

    const loginResult = JSON.parse(loginResponse.body);
    console.log('Login successful');
    const token = loginResult.token;

    // Now create a patient
    console.log('Creating patient...');
    const patientData = JSON.stringify({
      userEmail: 'testpatient2@example.com',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      phone: '1234567890'
    });

    const createOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/patients',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const createResponse = await makeRequest(createOptions, patientData);

    console.log('Response status:', createResponse.status);
    console.log('Response body:', createResponse.body);

    try {
      const responseData = JSON.parse(createResponse.body);
      if (createResponse.status === 201) {
        console.log('Patient created successfully!');
        console.log('Patient data:', responseData);
      } else {
        console.log('Patient creation failed');
        console.log('Error details:', responseData);
      }
    } catch (parseError) {
      console.log('Failed to parse response as JSON:', createResponse.body);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testPatientCreation();
