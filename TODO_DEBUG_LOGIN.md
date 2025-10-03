# TODO: Debug Login 401 Unauthorized Error

## Information Gathered
- Client sends POST to `http://localhost:5000/api/auth/login` with email and password.
- Server validates email format, checks if user exists in DB, compares password using bcrypt.
- If user not found or password mismatch, returns 401 with "Invalid credentials".
- Seeded users have password "password123" hashed with bcrypt.
- Rate limiting allows 5 attempts per 15 minutes (1000 in test mode).
- JWT_SECRET must be set for token generation.
- Auth middleware verifies tokens for protected routes.

## Plan
1. ✅ Verify server is running and DB connected.
2. ✅ Check if users exist in DB (e.g., doctor1@example.com).
3. ✅ Test login with known credentials (doctor1@example.com / password123).
4. Check server console for errors during login attempt.
5. Verify JWT_SECRET environment variable is set.
6. ✅ Test API directly with curl/Postman to isolate client issues.
7. ✅ Check for rate limiting if multiple failed attempts.
8. Ensure password hashing is consistent (bcrypt with salt 10).

## Dependent Files
- server/routes/authRoutes.js (login logic)
- server/models/User.js (user schema)
- client/src/pages/Login.jsx (client login form)
- server/seedData.js (user seeding)

## Followup Steps
- ✅ Run server and check logs.
- ✅ Query DB for users.
- ✅ Attempt login and observe errors.
- Fix any identified issues (e.g., missing env vars, DB connection).
- Test successful login.
