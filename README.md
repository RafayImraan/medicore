# Healthcare Management System

A comprehensive full-stack healthcare management system built with React, Node.js, Express, and MongoDB. This system provides role-based dashboards for administrators, doctors, and patients with advanced features for appointment management, billing, telehealth, and more.

## 🚀 Features

### Core Functionality
- **Multi-role Authentication**: Secure JWT-based authentication for Admin, Doctor, and Patient roles
- **Customizable Dashboards**: Drag-and-drop dashboard customization with persistent layouts
- **Appointment Management**: Complete appointment scheduling and management system
- **Billing Integration**: Automated billing and payment processing
- **Telehealth Support**: Real-time video consultations with session management
- **Calendar Integration**: Advanced calendar system with recurring events
- **User Feedback System**: Comprehensive feedback collection and management
- **Activity Monitoring**: Detailed logging and monitoring of all system activities

### Advanced Features
- **Mobile Responsive**: Fully responsive design optimized for all devices
- **Performance Optimized**: Compression, caching, and rate limiting for optimal performance
- **Accessibility Compliant**: WCAG 2.1 AA compliant with screen reader support
- **Real-time Notifications**: Live notifications and updates
- **Analytics Dashboard**: Comprehensive analytics and reporting
- **Security Enhanced**: Advanced security measures and audit trails

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Grid Layout** - Dashboard customization
- **Chart.js/Recharts** - Data visualization
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing

### DevOps & Security
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API rate limiting
- **Compression** - Response compression
- **PM2** - Process management (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB 5.0+
- Git

## 🔧 Recent Fixes & Improvements

### Dashboard Loading Issues Fixed
- **504 Timeout Error**: Resolved by implementing lazy loading for react-grid-layout with fallback component
- **MetaMask Connection Errors**: Added global error handlers for MetaMask-related errors
- **Error Boundary**: Implemented comprehensive error boundary to catch and handle React errors gracefully
- **Fallback Dashboard**: Created DashboardLayoutFallback component for when react-grid-layout fails to load

### Key Improvements
- Added Suspense wrapper around DashboardLayout for better loading states
- Implemented proxy configuration for client-server communication
- Added loading spinner component for better user experience
- Created batch script to start both client and server simultaneously
- Enhanced error handling for network connectivity issues
- Added graceful degradation for third-party library loading failures

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd healthcare-management-system
```

### 2. Environment Setup
Create `.env` files in both client and server directories:

**server/.env**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthcare_db
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Healthcare Management System
```

### 3. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 4. Start MongoDB
Make sure MongoDB is running on your system.

### 5. Start the Application

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

### 6. Create Admin User
```bash
cd server
node createAdmin.js
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
healthcare-management-system/
├── client/                          # React frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── widgets/            # Dashboard widgets
│   │   │   └── ui/                 # UI components
│   │   ├── pages/                  # Page components
│   │   │   └── Dashboard/          # Dashboard pages
│   │   ├── context/                # React context
│   │   ├── hooks/                  # Custom hooks
│   │   ├── services/               # API services
│   │   ├── utils/                  # Utility functions
│   │   └── routes/                 # Route configurations
│   ├── package.json
│   └── vite.config.js
├── server/                          # Node.js backend
│   ├── controllers/                 # Route controllers
│   ├── models/                     # MongoDB models
│   ├── routes/                     # API routes
│   ├── middleware/                 # Custom middleware
│   ├── config/                     # Configuration files
│   ├── package.json
│   └── index.js
├── docs/                           # Documentation
├── tests/                          # Test files
└── README.md
```

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full system access, user management, analytics
- **Doctor**: Patient management, appointments, prescriptions
- **Patient**: Personal health records, appointments, billing

### Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Rate limiting and security headers
- Input validation and sanitization
- Audit logging for all actions

## 📊 API Documentation

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
```

### Dashboard Endpoints
```
GET  /api/admin/stats
GET  /api/admin/users
POST /api/admin/users
PUT  /api/admin/users/:id
```

### Appointment Endpoints
```
GET  /api/appointments
POST /api/appointments
PUT  /api/appointments/:id
DELETE /api/appointments/:id
```

### Complete API documentation available at `/api/docs` when running in development mode.

## 🎨 Customization

### Dashboard Customization
Users can customize their dashboards by:
1. Dragging and dropping widgets
2. Resizing widgets
3. Showing/hiding widgets
4. Saving custom layouts

### Theme Customization
The system supports:
- Light/Dark mode toggle
- Custom color schemes
- Font size adjustments
- High contrast mode

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## ♿ Accessibility

The system follows WCAG 2.1 AA guidelines:
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode support
- Focus management
- Semantic HTML structure

## 🔍 Monitoring & Analytics

### System Monitoring
- Real-time performance metrics
- Database connection monitoring
- Memory usage tracking
- Error logging and alerting

### User Analytics
- User activity tracking
- Feature usage statistics
- Performance analytics
- Custom reporting

## 🚀 Deployment

### Production Build
```bash
# Client build
cd client
npm run build

# Server build (if using PM2)
cd server
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb://production-server/healthcare_db
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://yourdomain.com
```

### Recommended Production Setup
- Use PM2 for process management
- Set up Nginx as reverse proxy
- Configure SSL/TLS certificates
- Set up database backups
- Configure monitoring and alerting

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [User Guide](./docs/user-guide.md)
- [Developer Guide](./docs/developer-guide.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

**Built with ❤️ for healthcare professionals and patients worldwide.**
