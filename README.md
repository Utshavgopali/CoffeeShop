# BrewHaven — Coffeeshop Web App

Full-stack auth (register · login · profile update · password change) for BrewHaven coffee shop.

## Projects
- `coffeeshop_frontend` — Next.js 14 (App Router, TypeScript, Tailwind, espresso dark theme).
  Login / Register / Dashboard / Profile / Password pages.  
  Auth state held in a **React Context** (`AuthProvider`). Public vs protected routes enforced by
  **Next.js middleware** (cookie-based). Component → Action → API flow throughout.

- `coffeeshop_backend` — Express 5 + MongoDB + TypeScript.  
  Layered: Routes → Controllers → Services → Repositories → Models.  
  JWT auth, bcrypt hashing, **authorize middleware**, multer image upload, cookie-based sessions.

## Running locally

### 1. Backend
```bash
cd coffeeshop_backend
npm install
cp .env.example .env      # edit values if needed
npm run dev               # http://localhost:5001
```

### 2. Frontend
```bash
cd coffeeshop_frontend
npm install
npm run dev               # http://localhost:3000
```
The frontend proxies `/api/*` to port 5001 (see `next.config.js`). No CORS config needed.  
Uploaded avatars are served at `/api/uploads/<file>` and load through the same proxy.

## API (base: `/api/auth`)
| Method | Endpoint    | Auth | Body / Notes                                                        |
|--------|-------------|------|---------------------------------------------------------------------|
| POST   | `/register` | —    | `name`, `email`, `password` — 409 if email taken                   |
| POST   | `/login`    | —    | `email`, `password` — sets httpOnly cookie + returns token          |
| POST   | `/logout`   | ✅   | clears cookie                                                        |
| GET    | `/whoami`   | ✅   | returns full user detail (name, email, avatar, timestamps)          |
| PATCH  | `/update`   | ✅   | **profile:** `name`, `email`, `avatar` (file, multipart/form-data)  |
|        |             |      | **password:** `currentPassword`, `newPassword` (same endpoint)      |

### Sprint 3 additions
**Backend**
- `middleware/auth.middleware.ts` — JWT authorize middleware on `/logout`, `/whoami`, `/update`
- `middleware/upload.middleware.ts` — multer, images only, 2 MB max, saved to `uploads/`
- `repositories/user.repository.ts` — `updateUserById`, `findUserByIdWithPassword`
- `services/user.service.ts` — `getMeService`, `updateProfileService`, `changePasswordService`
- `index.ts` — added cookie-parser, serves `uploads/` at `/api/uploads`

**Frontend**
- `lib/context/AuthContext.tsx` — Context Provider (seeds from cookie, confirms via whoami)
- `middleware.ts` — edge middleware: protected routes need token cookie; auth pages redirect if logged in
- `app/profile/page.tsx` — prefilled form, live image preview, avatar upload
- `app/password/page.tsx` — change password using the same `/update` endpoint
- `app/dashboard/page.tsx` — shows avatar, links to Profile / Password pages

## Postman
Import `postman/BrewHaven.postman_collection.json`.  
Run top to bottom: Register → Login → Whoami → Update Profile → Change Password → Logout.
