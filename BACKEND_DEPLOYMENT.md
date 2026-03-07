# Backend Deployment

This backend is ready to deploy on Railway with MongoDB Atlas.

- Backend host: Railway
- Database: MongoDB Atlas free cluster

## Pricing note

Railway's official pricing is not permanently free. As of March 2026, it offers a 30-day free trial with $5 credits, then starts at $1/month on the Free tier.

## Why this pairing

- The backend is a long-running Express + Socket.IO server, so it should run as a web service, not a serverless function.
- The app already uses MongoDB via Mongoose, so MongoDB Atlas avoids any database rewrite.

## Backend env vars

Set these on the backend host:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<your mongodb atlas connection string>
JWT_SECRET=<long random secret>
ALLOWED_ORIGINS=https://medicore-amber.vercel.app
SEED_ON_START=
```

If you use a Vercel preview domain too, add it to `ALLOWED_ORIGINS` as a comma-separated list.

Example:

```env
ALLOWED_ORIGINS=https://medicore-amber.vercel.app
```

## Railway setup

1. Push this repository to GitHub.
2. In Railway, create a new project from GitHub.
3. Create a service from this repository.
4. Set the root directory to `server`.
5. Set the start command to `npm start` if Railway does not detect it.
6. Add the env vars listed above.
7. In the service Networking tab, generate a public domain.
8. Copy the backend URL, for example `https://medicare-backend-production.up.railway.app`.

You can also use the included `railway.toml` config file.

## MongoDB Atlas setup

1. Create a free Atlas cluster.
2. Create a database user.
3. In Network Access, allow the backend host IPs or use `0.0.0.0/0` if needed for initial setup.
4. Copy the SRV connection string into `MONGODB_URI`.

## Vercel frontend env

Set this in your Vercel project:

```env
VITE_API_BASE_URL=https://your-service.up.railway.app
```

Then redeploy the frontend.

## Notes

- Socket.IO now uses the same deployed backend base URL on the frontend dashboard page.
- Backend CORS and Socket.IO origins now use `ALLOWED_ORIGINS` so the deployed frontend can connect cleanly.
