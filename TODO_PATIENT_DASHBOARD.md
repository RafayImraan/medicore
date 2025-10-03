# TODO: Patient Dashboard Enhancement

## Backend
- [x] Create server/models/LabResult.js
- [x] Create server/models/Prescription.js
- [x] Update server/controllers/patientController.js: Add getLabResults, getPrescriptions, getBilling, getNotifications, submitBill
- [x] Update server/routes/patientRoutes.js: Add routes for lab-results, prescriptions, billing, notifications, submit bill

## Frontend
- [ ] Create client/src/pages/Dashboard/PatientLabResults.jsx
- [ ] Create client/src/pages/Dashboard/PatientPrescriptions.jsx
- [ ] Create client/src/pages/Dashboard/PatientBilling.jsx
- [ ] Update client/src/pages/Dashboard/PatientDashboard.jsx: Change links, fetch real notifications

## Data Seeding
- [ ] Update server/seedData.js: Add fake data for LabResult, Prescription, Billing, Notification

## Testing
- [ ] Test API endpoints
- [ ] Run seed data
- [ ] Verify pages and data integrity
