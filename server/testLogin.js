const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

async function testLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/khaan');
    console.log('Connected to MongoDB');

    // Test login with admin@example.com
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123'
      })
      .set('Content-Type', 'application/json');

    console.log('Response status:', response.status);
    console.log('Response body:', response.body);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Test error:', error);
  }
}

testLogin();
