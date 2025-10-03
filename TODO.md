# TODO: Fix Prescription API Errors

## Issues Identified
1. Frontend uses `user.id` but user object has `_id` from MongoDB.
2. `fetchWithFallback` in Prescriptions.jsx called without fallbackGenerator.
3. Backend expects Doctor/Patient document _id but receives User _id.
4. Return value of fetchWithFallback is {data, isRealData} but code expects just data.

## Tasks
- [x] Fix user.id to user._id in Prescriptions.jsx and DoctorDashboard.jsx
- [x] Update fetchWithFallback calls in Prescriptions.jsx to include fallbackGenerator and destructure return value
- [x] Modify prescriptionController.js getDoctorPrescriptions and getPatientPrescriptions to find by userId
- [ ] Test the fixes by running the app and checking console for errors

## Followup
- Verify API calls work without 500 errors
- Ensure fallback data is used when API fails
