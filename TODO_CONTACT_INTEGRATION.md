# Contact Page Backend Integration TODO

## Backend Infrastructure
- [x] Create Contact model (server/models/Contact.js)
- [x] Create Agent model (server/models/Agent.js)
- [x] Create Branch model (server/models/Branch.js)
- [x] Create Settings model (server/models/Settings.js)
- [x] Create contactController.js
- [x] Create supportController.js (for stats and agents)
- [x] Create chatbotController.js
- [x] Create branchController.js
- [x] Create settingsController.js
- [x] Create contactRoutes.js
- [x] Create supportRoutes.js
- [x] Create chatbotRoutes.js
- [x] Create branchRoutes.js
- [x] Create settingsRoutes.js
- [x] Update server/index.js to register new routes

## Frontend Updates
- [x] Update Contact.jsx to use API calls with fetchWithFallback
- [x] Add loading states (spinners/skeletons)
- [x] Replace alert with toast notifications
- [x] Add error messages below components
- [x] Merge API data with faker fallbacks
- [ ] Implement branch selector if multiple branches

## Testing
- [x] Test API endpoints
- [x] Verify fallback data works when backend is down
- [x] Ensure multilingual toggle remains static
- [x] Confirm toast notifications and loading states function properly
