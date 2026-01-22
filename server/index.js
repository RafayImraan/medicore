const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");

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

// Import Middleware
const { verifyToken, requireAnyAuthenticated } = require("./middleware/auth");
const { compressionMiddleware, securityMiddleware, corsMiddleware, requestLogger } = require("./middleware/performance");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5176"],
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
app.use("/api", insightsRoutes);  // Insights Routes
app.use("/api/health", healthRoutes);  // Health Routes

// Health check endpoint
// Deprecated: use /api/health instead
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

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

// Simulate and emit live stats updates for hero section
setInterval(() => {
  const beds = Math.max(0, 42 + Math.floor(Math.random() * 10 - 5)); // Simulate bed occupancy updates
  const doctorsOnline = Math.max(1, 18 + Math.floor(Math.random() * 6 - 3)); // Simulate doctor online/offline status
  io.emit('liveStatsUpdate', { beds, doctorsOnline });
}, 5000); // Emit every 5 seconds to make UI look alive

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
  console.log("✅ MongoDB Connected Successfully");
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
