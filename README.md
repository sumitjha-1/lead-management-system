# Lead Management System

A full-stack Lead Management Application built with the MERN stack (MongoDB, Express, React, Node.js). Supports public lead capture, role-based authentication (Admin/Member), lead lifecycle tracking (status, assignment, notes, activity history), search/filter/pagination, and a complete REST API.

**Live URL:** _[add your deployed frontend URL here after deployment]_

---

## Built for Digital Heroes Training Task

This project was built as part of the Digital Heroes Full Stack Development assessment task.

### AI Usage Disclosure

This project was built with AI assistance (Claude) for scaffolding the backend architecture, React components, and boilerplate code. I reviewed and tested each part manually — verifying auth flows, role-based access control, and API responses against Postman before wiring the frontend — and made corrections to routing, access-control edge cases, and data flow where the initial generated code needed adjustment. _(Edit this paragraph to match what you actually did before submitting.)_

---

## Tech Stack

**Frontend:** React, Vite, React Router DOM, Tailwind CSS, Axios, React Icons
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Auth:** JWT, httpOnly cookies, bcryptjs
**Validation:** express-validator
**Security:** Helmet, CORS
**Testing:** Jest, Supertest, mongodb-memory-server
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

---

## Project Structure

lead-management-system/
├── backend/
│ ├── config/ # DB connection
│ ├── controllers/ # Business logic
│ ├── middlewares/ # Auth, validation, error handling
│ ├── models/ # Mongoose schemas (User, Lead, Note, ActivityLog)
│ ├── routes/ # Express route definitions
│ ├── services/ # Reusable logic (activity logging)
│ ├── utils/ # Token generation, cookie config, seed script
│ ├── validators/ # express-validator rule sets
│ ├── tests/ # Jest + Supertest test suites
│ ├── app.js # Express app (testable, no listen())
│ └── server.js # Entry point
└── frontend/
└── src/
├── api/ # Axios instance + API call functions
├── components/ # Reusable UI components
├── context/ # Auth, Theme, Toast context providers
├── pages/ # Route-level page components
├── routes/ # ProtectedRoute / RoleRoute guards
└── utils/ # Nav config, helpers


---

## Getting Started Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a long random string>


Seed the first admin account:
```bash
node utils/seedAdmin.js
```
This creates `admin@leadsystem.com` / `ChangeMe123` — change this password after first login via the Profile page.

Run the backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

VITE_API_URL=http://localhost:5000/api


Run the frontend:
```bash
npm run dev
```

Visit `http://localhost:5173`.

### Running Tests

```bash
cd backend
npm test
```

Covers: authentication rules (login, protected routes, role-based access), and two core flows (admin creates → assigns → member updates lead status; public lead capture → admin visibility).

---

## Role Permissions Summary

| Action | Admin | Member |
|---|---|---|
| Submit public lead form | ✅ (no login required) | ✅ (no login required) |
| View all leads | ✅ | ❌ (only assigned leads) |
| Create / edit / delete leads | ✅ | ❌ |
| Assign leads to members | ✅ | ❌ |
| Update lead status | ✅ | ✅ (only on assigned leads) |
| Add notes | ✅ | ✅ (only on assigned leads) |
| View activity log | ✅ (all) | ✅ (own actions only) |
| Create / edit / delete members | ✅ | ❌ |
| Edit own profile | ✅ | ✅ |

All permissions above are enforced **server-side** (middleware) as the source of truth; the frontend additionally hides/redirects inaccessible pages for UX.

---

## API Documentation

**Base URL (local):** `http://localhost:5000/api`
**Base URL (production):** `<your deployed backend URL>/api`

All authenticated endpoints require a valid JWT sent automatically via an httpOnly cookie (set on login). No `Authorization` header is used.

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Log in with email/password. Sets httpOnly JWT cookie. |
| POST | `/auth/logout` | Private | Clears the auth cookie. |
| GET | `/auth/me` | Private | Returns the currently logged-in user. |
| PUT | `/auth/profile` | Private | Update own name and/or password. |

**POST `/auth/login`**
```json
// Request body
{ "email": "admin@leadsystem.com", "password": "ChangeMe123" }

// 200 Response
{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "role": "admin" } }

// 401 Response
{ "success": false, "message": "Invalid credentials" }
```

---

### Users (Admin only)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin | List all members and admins |
| GET | `/users/:id` | Admin | Get one user |
| POST | `/users` | Admin | Create a new member/admin |
| PUT | `/users/:id` | Admin | Update name/email/role (not password) |
| DELETE | `/users/:id` | Admin | Soft-delete (deactivate) a user |

**POST `/users`**
```json
// Request body
{ "name": "Jane Doe", "email": "jane@company.com", "password": "password123", "role": "member" }

// 201 Response
{ "success": true, "user": { "id": "...", "name": "Jane Doe", "email": "jane@company.com", "role": "member" } }
```

---

### Leads

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/leads/public` | Public | Submit a lead from the public capture form |
| GET | `/leads` | Private | List leads (Admin: all, Member: only assigned) — supports search/filter/pagination |
| GET | `/leads/:id` | Private | Get a single lead (Member restricted to own assigned leads) |
| POST | `/leads` | Admin | Create a lead manually |
| PUT | `/leads/:id` | Admin | Update lead contact details |
| PUT | `/leads/:id/assign` | Admin | Assign/reassign a lead to a member |
| PUT | `/leads/:id/status` | Private | Update lead status (Admin: any lead, Member: own assigned leads only) |
| DELETE | `/leads/:id` | Admin | Delete a lead |

**Query parameters for `GET /leads`:**

| Param | Type | Description |
|---|---|---|
| `search` | string | Matches against fullName, email, phone, company |
| `status` | string | Filter by exact status (`New`, `Contacted`, `Qualified`, `Proposal Sent`, `Won`, `Lost`) |
| `assignedTo` | string (ObjectId) | Filter by assigned member (Admin only — ignored for Members) |
| `leadSource` | string | Filter by lead source |
| `startDate` / `endDate` | ISO date string | Filter by creation date range |
| `page` | number | Page number (default 1) |
| `limit` | number | Results per page (default 10) |

**GET `/leads?search=alice&status=New&page=1&limit=10`**
```json
// 200 Response
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "totalPages": 1,
  "leads": [
    {
      "_id": "...",
      "fullName": "Alice Test",
      "email": "alice@test.com",
      "status": "New",
      "assignedTo": { "_id": "...", "name": "John Member", "email": "john@..." },
      "createdAt": "..."
    }
  ]
}
```

**PUT `/leads/:id/status`**
```json
// Request body
{ "status": "Contacted" }

// 200 Response
{ "success": true, "lead": { "...": "...", "status": "Contacted", "statusHistory": [ ... ] } }

// 403 Response (member updating a lead not assigned to them)
{ "success": false, "message": "Not authorized to update this lead" }
```

---

### Notes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/leads/:leadId/notes` | Private | Get all notes for a lead, chronological order |
| POST | `/leads/:leadId/notes` | Private | Add a note (Admin or assigned Member only) |

**POST `/leads/:leadId/notes`**
```json
// Request body
{ "message": "Called, left voicemail." }

// 201 Response
{ "success": true, "note": { "_id": "...", "message": "...", "author": { "name": "...", "role": "admin" }, "createdAt": "..." } }
```

---

### Activity Logs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/activities` | Private | Paginated + filterable log (Admin: all, Member: own actions only) |
| GET | `/activities/recent` | Private | Last 10 activities, no pagination (dashboard widget) |

**Query parameters for `GET /activities`:** `userId`, `leadId`, `startDate`, `endDate`, `page`, `limit`

---

### HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Validation error / bad request |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized (wrong role / not lead owner) |
| 404 | Resource not found |
| 500 | Server error |

---

## Test Credentials (Deployed App)

| Role | Email | Password |
|---|---|---|
| Admin | `<add after deployment>` | `<add after deployment>` |
| Member | `<add after deployment>` | `<add after deployment>` |

---

## Design Decisions

- **Soft delete for members** (deactivation, not removal) — preserves lead assignment/note/activity history integrity.
- **Hard delete for leads** — no history-preservation requirement was specified for leads themselves.
- **JWT payload contains only the user ID** — role/permissions are always re-checked fresh from the DB on every request, so a role change takes effect immediately rather than waiting for token expiry.
- **httpOnly cookies over localStorage** for JWT storage — protects against XSS token theft.