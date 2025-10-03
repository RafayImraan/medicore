# TODO: Patient Dashboard Enhancement

## Backend
- [x] Create server/models/LabResult.js
- [x] Create server/models/Prescription.js
- [x] Update server/controllers/patientController.js: Add getLabResults, getPrescriptions, getBilling, getNotifications, submitBill
- [x] Update server/routes/patientRoutes.js: Add routes for lab-results, prescriptions, billing, notifications, submit bill

## Frontend
- [x] Create client/src/pages/Dashboard/PatientLabResults.jsx
- [x] Create client/src/pages/Dashboard/PatientPrescriptions.jsx
- [x] Create client/src/pages/Dashboard/PatientBilling.jsx
- [x] Update client/src/pages/Dashboard/PatientDashboard.jsx: Change links, fetch real notifications

## Data Seeding
- [x] Update server/seedData.js: Add fake data for LabResult, Prescription, Billing, Notification

## Testing
- [x] Test API endpoints
- [x] Run seed data
- [x] Verify pages and data integrity
