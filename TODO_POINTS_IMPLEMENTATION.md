# User-Specific Points Implementation

## Tasks
- [x] Add points field to User model (default 0)
- [x] Create server/controllers/userController.js with getUserPoints and updateUserPoints
- [x] Create server/routes/userRoutes.js with /api/user/points endpoints
- [x] Update server/routes/authRoutes.js login to assign points based on mode
- [x] Update client/src/context/AuthContext.jsx to include points
- [x] Update client/src/components/Hero.jsx to use auth context, fetch points on mount if logged in, update on booking
- [x] Add environment variable for POINTS_MODE (fake/real) - handled in authRoutes.js
- [ ] Test the implementation
