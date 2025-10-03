# Healthcare Management System API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All API endpoints require authentication except for health checks and authentication endpoints themselves.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Endpoints

### Authentication

#### POST /auth/login
Login user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin|doctor|patient"
  }
}
```

#### POST /auth/register
Register new user.

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "patient"
}
```

#### GET /auth/me
Get current user profile.

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "patient"
  }
}
```

### Admin Dashboard

#### GET /admin/stats
Get admin dashboard statistics.

**Response:**
```json
{
  "appointmentsToday": 15,
  "doctorsAvailable": 8,
  "newPatients": 25,
  "reportsGenerated": 12
}
```

#### GET /admin/users
Get all users (Admin only).

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `role`: Filter by role

#### POST /admin/users
Create new user (Admin only).

#### PUT /admin/users/:id
Update user (Admin only).

#### DELETE /admin/users/:id
Delete user (Admin only).

### Appointments

#### GET /appointments
Get user's appointments.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status
- `startDate`: Filter by start date
- `endDate`: Filter by end date

#### POST /appointments
Create new appointment.

**Request Body:**
```json
{
  "doctorId": "doctor_id",
  "patientId": "patient_id",
  "date": "2024-01-15",
  "time": "10:00",
  "type": "consultation",
  "notes": "Follow-up appointment"
}
```

#### PUT /appointments/:id
Update appointment.

#### DELETE /appointments/:id
Cancel appointment.

### Billing Integration

#### POST /billing
Create billing record.

**Request Body:**
```json
{
  "patientId": "patient_id",
  "appointmentId": "appointment_id",
  "amount": 150.00,
  "description": "Consultation fee",
  "dueDate": "2024-01-30"
}
```

#### POST /billing/:id/process-payment
Process payment for billing record.

**Request Body:**
```json
{
  "paymentMethod": "credit_card",
  "amount": 150.00,
  "cardToken": "card_token"
}
```

### Telehealth

#### POST /telehealth/session
Create telehealth session (Doctor/Admin only).

**Request Body:**
```json
{
  "patientId": "patient_id",
  "appointmentId": "appointment_id",
  "scheduledTime": "2024-01-15T10:00:00Z"
}
```

#### GET /telehealth/session/:sessionId
Get telehealth session details.

#### POST /telehealth/session/:sessionId/join
Join telehealth session.

#### POST /telehealth/session/:sessionId/end
End telehealth session (Doctor/Admin only).

### Calendar

#### POST /calendar
Create calendar event.

**Request Body:**
```json
{
  "title": "Team Meeting",
  "description": "Weekly team sync",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z",
  "eventType": "meeting",
  "assignedTo": ["user_id_1", "user_id_2"]
}
```

#### GET /calendar/user/:userId
Get user's calendar events.

**Query Parameters:**
- `start`: Start date filter
- `end`: End date filter

#### PUT /calendar/:eventId
Update calendar event.

#### DELETE /calendar/:eventId
Delete calendar event.

### Feedback

#### POST /feedback
Submit feedback.

**Request Body:**
```json
{
  "type": "feature_request",
  "category": "ui/ux",
  "title": "Improve dashboard layout",
  "description": "The dashboard could be more intuitive...",
  "rating": 4
}
```

#### GET /feedback/my-feedback
Get user's submitted feedback.

#### GET /feedback
Get all feedback (Admin only).

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status
- `type`: Filter by type

#### PUT /feedback/:feedbackId
Update feedback status (Admin only).

### Activity Monitoring

#### GET /activity/my-activity
Get user's activity logs.

#### GET /activity/user/:userId
Get specific user's activity (Admin only).

#### GET /activity
Get all activity logs (Admin only).

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `userId`: Filter by user
- `action`: Filter by action
- `startDate`: Start date filter
- `endDate`: End date filter

#### GET /activity/stats
Get activity statistics (Admin only).

#### GET /activity/security-alerts
Get security alerts (Admin only).

### Health Monitoring

#### GET /health
Basic health check (No auth required).

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00Z",
  "uptime": "2h 30m",
  "memory": {
    "usagePercent": 45
  },
  "database": {
    "status": "connected"
  }
}
```

#### GET /health/metrics
Detailed system metrics (Admin only).

#### GET /health/database
Database performance metrics (Admin only).

#### GET /health/app
Application performance metrics (Admin only).

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- General API: 100 requests per 15 minutes
- Authentication: 5 attempts per 15 minutes
- File uploads: 10 uploads per hour

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## WebSocket Events

Real-time features use WebSocket connections:

### Connection
```
ws://localhost:5000/ws?token=<jwt_token>
```

### Events
- `notification`: New notification
- `appointment_update`: Appointment status change
- `telehealth_session`: Telehealth session updates
- `activity_log`: New activity logged

## File Upload

File upload endpoints accept multipart/form-data:

```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('type', 'document');

fetch('/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

## Data Validation

All endpoints validate input data. Common validation rules:

- Email: Valid email format
- Password: Minimum 8 characters
- Dates: ISO 8601 format
- IDs: Valid MongoDB ObjectId format
- Files: Supported formats and size limits

## Versioning

API versioning is handled through URL paths:
- Current version: No prefix (v1)
- Future versions: `/v2/endpoint`

## SDKs and Libraries

### JavaScript Client
```javascript
import HealthcareAPI from 'healthcare-api-client';

const client = new HealthcareAPI({
  baseURL: 'http://localhost:5000/api',
  token: 'jwt_token'
});

// Example usage
const appointments = await client.appointments.getAll();
```

### Mobile SDKs
- iOS SDK: Available on CocoaPods
- Android SDK: Available on Maven Central

## Support

For API support and questions:
- API Documentation: `/api/docs` (development only)
- GitHub Issues: Report bugs and request features
- Email Support: api-support@healthcare-system.com
