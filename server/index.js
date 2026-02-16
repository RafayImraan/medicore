const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { spawn } = require("child_process");

// Load environment variables
dotenv.config();

// Import Routes

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { router: appointmentRoutes, createAppointment } = require("./routes/appointmentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const doctorController = require("./controllers/doctorController");
const billingRoutes = require("./routes/billingRoutes");
const billingIntegrationRoutes = require("./routes/billingIntegrationRoutes");
const telehealthRoutes = require("./routes/telehealthRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const activityRoutes = require("./routes/activityRoutes");
const healthRoutes = require("./routes/healthRoutes");
const orderRoutes = require("./routes/orderRoutes");
const vitalsRoutes = require("./routes/vitalsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const supportRoutes = require("./routes/supportRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const branchRoutes = require("./routes/branchRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const userRoutes = require("./routes/userRoutes");
const certificationRoutes = require("./routes/certificationRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const cartRoutes = require("./routes/cartRoutes");
const labResultRoutes = require("./routes/labResultRoutes");
const publicRoutes = require("./routes/publicRoutes");
const staffChatRoutes = require("./routes/staffChatRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const activityController = require("./controllers/activityController");
const engagementRoutes = require("./routes/engagementRoutes");
const servicesRoutes = require("./routes/servicesRoutes");
const serviceEngagementRoutes = require("./routes/serviceEngagementRoutes");
const departmentEngagementRoutes = require("./routes/departmentEngagementRoutes");

// Import Middleware
const { verifyToken, requireAnyAuthenticated } = require("./middleware/auth");
const { compressionMiddleware, securityMiddleware, corsMiddleware, requestLogger } = require("./middleware/performance");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5176"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middlewares - CORS must be first
app.use(corsMiddleware);
app.use(securityMiddleware);
app.use(compressionMiddleware);
app.use(express.json());
app.use(requestLogger);

// Public Routes
app.use('/api/auth', authRoutes);
app.get('/api/doctors/featured', doctorController.getFeaturedDoctor);
app.use('/api/public', publicRoutes);
app.post('/api/activity/public', activityController.logPublicActivity);
app.use('/api/engagements', engagementRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/service-engagements', serviceEngagementRoutes);
app.use('/api/department-engagements', departmentEngagementRoutes);

// Protected Routes (require authentication)
app.use("/api/admin", verifyToken, requireAnyAuthenticated, adminRoutes);  // Admin Routes

// Appointment Routes - POST is public for booking, others are protected
app.post("/api/appointments", createAppointment);  // Public booking
app.use("/api/appointments", verifyToken, requireAnyAuthenticated, appointmentRoutes);  // Other routes protected
app.use("/reports", verifyToken, requireAnyAuthenticated, reportRoutes);  // Report Routes
app.use("/api/patients", verifyToken, requireAnyAuthenticated, patientRoutes);  // Patient Routes
app.use("/api/doctors", verifyToken, requireAnyAuthenticated, doctorRoutes);  // Doctor Routes
app.use("/api/billing", verifyToken, requireAnyAuthenticated, billingRoutes);  // Billing Routes
app.use("/api/billing-integration", verifyToken, requireAnyAuthenticated, billingIntegrationRoutes);  // Billing Integration Routes
app.use("/api/telehealth", verifyToken, requireAnyAuthenticated, telehealthRoutes);  // Telehealth Routes
app.use("/api/calendar", verifyToken, requireAnyAuthenticated, calendarRoutes);  // Calendar Routes
app.use("/api/feedback", verifyToken, requireAnyAuthenticated, feedbackRoutes);  // Feedback Routes
app.use("/api/activity", verifyToken, requireAnyAuthenticated, activityRoutes);  // Activity Routes
app.use("/api/orders", verifyToken, requireAnyAuthenticated, orderRoutes);  // Order Routes
app.use("/api/cart", verifyToken, requireAnyAuthenticated, cartRoutes);  // Cart Routes
app.use("/api/vitals", verifyToken, requireAnyAuthenticated, vitalsRoutes);  // Vitals Routes
app.use("/api/notifications", verifyToken, requireAnyAuthenticated, notificationRoutes);  // Notification Routes
app.use("/api/user", verifyToken, requireAnyAuthenticated, userRoutes);  // User Routes
app.use("/api/certifications", certificationRoutes);  // Certification Routes
app.use("/api", contactRoutes);  // Public API Routes
app.use("/api", supportRoutes);  // Support Routes
app.use("/api", insightsRoutes);  // Insights Routes
app.use("/api/health", healthRoutes);  // Health Routes
app.use("/api/lab-results", verifyToken, requireAnyAuthenticated, labResultRoutes);  // Lab Results Routes
app.use("/api/staff-chat", verifyToken, requireAnyAuthenticated, staffChatRoutes);  // Staff Chat Routes
app.use("/api/schedule", verifyToken, requireAnyAuthenticated, scheduleRoutes);  // Schedule Routes

// Health check endpoint
// Deprecated: use /api/health instead
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve static files from the React app build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Catch all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user-specific room for notifications
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Simulate and emit live stats updates for dashboard
setInterval(() => {
  const beds = Math.max(0, 42 + Math.floor(Math.random() * 10 - 5)); // Simulate bed occupancy updates
  const doctorsOnline = Math.max(1, 18 + Math.floor(Math.random() * 6 - 3)); // Simulate doctor online/offline status
  io.emit('liveStatsUpdate', { beds, doctorsOnline });
}, 5000); // Emit every 5 seconds to make UI look alive

// Live streams for dashboard
setInterval(() => {
  const erQueueLength = Math.max(0, 5 + Math.floor(Math.random() * 15 - 7)); // ER queue lengths
  io.emit('erQueueUpdate', { erQueueLength });
}, 3000); // 3 seconds

setInterval(() => {
  const activeSurgeries = Math.max(0, 2 + Math.floor(Math.random() * 6 - 3)); // Active surgeries
  io.emit('activeSurgeriesUpdate', { activeSurgeries });
}, 4000); // 4 seconds

setInterval(() => {
  const ambulanceETA = Math.max(1, 5 + Math.floor(Math.random() * 20 - 10)); // Ambulance arrival ETA in minutes
  io.emit('ambulanceETAUpdate', { ambulanceETA });
}, 2000); // 2 seconds

setInterval(() => {
  const infectionSpikes = Math.random() > 0.8 ? Math.floor(Math.random() * 5) + 1 : 0; // Infection spikes (rare)
  io.emit('infectionSpikesUpdate', { infectionSpikes });
}, 10000); // 10 seconds

setInterval(() => {
  const deviceTelemetry = {
    ventilators: Math.max(0, 12 + Math.floor(Math.random() * 8 - 4)),
    monitors: Math.max(0, 25 + Math.floor(Math.random() * 10 - 5)),
    infusionPumps: Math.max(0, 18 + Math.floor(Math.random() * 6 - 3))
  }; // Device telemetry
  io.emit('deviceTelemetryUpdate', deviceTelemetry);
}, 1000); // 1 second

// Streaming AI insights
setInterval(() => {
  const insights = [
    { type: 'prediction', message: `Bed occupancy expected to ${Math.random() > 0.5 ? 'rise' : 'fall'} by ${Math.floor(Math.random() * 10) + 5}% in next hour`, trend: Math.random() > 0.5 ? 'up' : 'down' },
    { type: 'alert', message: `ER wait times may increase due to ${['weather', 'holiday', 'staff shortage'][Math.floor(Math.random() * 3)]}`, severity: 'medium' },
    { type: 'optimization', message: `AI suggests reallocating ${Math.floor(Math.random() * 5) + 1} beds to ICU`, impact: 'high' }
  ];
  const randomInsight = insights[Math.floor(Math.random() * insights.length)];
  io.emit('aiInsightUpdate', randomInsight);
}, 6000); // 6 seconds

// Function to emit notifications to specific users
const emitNotification = (userId, notification) => {
  io.to(`user_${userId}`).emit('notification', notification);
};

// Export io instance for use in controllers
global.io = io;
global.emitNotification = emitNotification;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB Connected Successfully");
  const seedFlag = (process.env.SEED_ON_START || '').toLowerCase();
  if (seedFlag) {
    const shouldReset = seedFlag.includes('reset');
    const wantAll = seedFlag.includes('all') || seedFlag === 'true';
    const runSeed = (file) => {
      const args = [file];
      if (shouldReset) args.push('--reset');
      const proc = spawn(process.execPath, args, { cwd: __dirname, stdio: 'inherit' });
      proc.on('error', (err) => console.error(`Seed ${file} failed:`, err));
    };

    if (wantAll || seedFlag.includes('activity')) runSeed('seedActivity.js');
    if (wantAll || seedFlag.includes('engagement')) runSeed('seedEngagements.js');
  }
  // Start server only after DB is connected and not in test mode
  if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }
})
.catch((err) => {
  console.error("❌ MongoDB Connection Error:", err.message);
  console.log("💡 Make sure MongoDB is running and MONGODB_URI is set in .env file");
});

// Export app for testing
module.exports = app;

