# TaskMatrix — AI Prompt Engineering Log

> A short record of the main engineering decisions where AI was used as a planning support tool.

## 1. Architecture

**Problem:**  
I needed to decide how the frontend, backend, business logic, authentication, and database should be separated.

**AI Help:**  
I asked AI to review a practical architecture for React, Express.js, and MongoDB.

**Decision:**  
`React + Vite → Express REST API → Controllers/Services → MongoDB`

JWT authentication and role-based authorization are planned on protected backend routes.

---

## 2. Database & ERD

**Problem:**  
I needed a simple database structure with clear relationships between users, projects, tasks, comments, and activities.

**AI Help:**  
I asked AI to review the MongoDB collections and their ObjectId relationships.

**Decision:**  
Five primary collections were finalized:

- Users
- Projects
- Tasks
- Comments
- Activities

Key relationships include project ownership, task assignment, task comments, and project activity tracking.

The final ERD was created using dbdiagram.io.

---

## 3. Role-Based Access Control

**Problem:**  
Different users need different levels of access.

**AI Help:**  
I asked AI to review permissions for Admin, Manager, and Member roles.

**Decision:**

- **Admin:** User, role, project, and activity management
- **Manager:** Project, team, and task management
- **Member:** Assigned tasks, status updates, and comments

Authorization will be enforced through protected backend routes and middleware.

---

## 4. REST API

**Problem:**  
I wanted clear API boundaries before starting frontend-backend integration.

**AI Help:**  
I asked AI to review the resource structure and CRUD operations.

**Decision:**  
The API was organized around:

- `/api/auth`
- `/api/users`
- `/api/projects`
- `/api/tasks`
- `/api/tasks/:taskId/comments`
- `/api/projects/:projectId/activities`

---

## 5. MVP Scope

**Problem:**  
The project could become too large if every feature was included in the first version.

**AI Help:**  
I used AI to review the feature list and prioritize it by importance and implementation effort.

**Decision:**

**P0 — Core**
- Authentication
- Project management
- Task management
- Kanban board

**P1 — Important**
- Search and filtering
- Comments
- Activity feed
- Dashboard statistics
- Team management

**P2 — Future**
- Real-time updates
- Notifications
- AI assistance
- Advanced analytics

---

## 6. Final Review

Before moving into development, I used AI to review the overall blueprint for major gaps in architecture, database relationships, authorization, API structure, and project scope.

The final decisions were reviewed and adapted specifically for TaskMatrix.

## Final Note

AI was used as a planning and review tool, not to generate the complete project. The final architecture, database design, security model, API structure, and feature scope were decided for the TaskMatrix requirements.

---

## 7. Sprint 14 – Authentication & Routing

### Password Hashing

**Question:**  
How should I hash the password with bcryptjs before saving a new user in MongoDB? I want to make sure the plain password is never stored.

**What I did:**  
I implemented bcryptjs hashing during registration and checked the saved user in MongoDB to verify that the password was stored as a hash.

---

### JWT Login Flow

**Question:**  
After the user logs in successfully, what is the proper way to create a JWT and use it for authentication on the frontend?

**What I did:**  
I added JWT generation in the login and registration flow and stored the returned token in `localStorage` on the React side.

---

### JWT Middleware

**Question:**  
How can I verify the JWT sent in the Authorization header in Express and stop requests when the token is missing or expired?

**What I did:**  
I created JWT verification middleware and used it on protected backend routes.

---

### React Protected Route

**Question:**  
How do I stop someone from opening the dashboard directly when there is no login token?

**What I did:**  
I created a `PrivateRoute` component that checks `localStorage` and redirects the user to `/login` when the token is not available.

---

### Authentication Debugging

**Question:**  
My frontend, Express API and MongoDB are connected now. What should I test to make sure registration, login, logout and protected routes are actually working correctly?

**What I did:**  
I tested wrong passwords, new user registration, login, logout, dashboard protection, JWT storage and the protected task API. I also verified the hashed password directly in MongoDB.

---

## 8. Sprint 15 – Task CRUD, Ownership & Stripe

### JWT Data Ownership

**Question:**  

How should I make sure that an authenticated user can only update or delete their own tasks?

**What I did:**  

I added ownership validation by comparing the task owner's ID with the authenticated user's ID from the JWT. If the task belongs to another user, the API returns a `403 Forbidden` response.

### Optimistic Task Deletion

**Question:**  

How can I remove a task from the React UI immediately after clicking Delete while still handling an API failure safely?

**What I did:**  

I removed the task from the local React state immediately after the delete action. If the API request fails, the previous task list is restored.

### Stripe Checkout Integration

**Question:**  

How should I connect a React upgrade button with a backend Stripe Checkout Session and handle successful or canceled payments?

**What I did:**  

I implemented the Stripe Checkout flow through the backend, redirected the user to the Stripe Checkout page, and tested both successful and canceled payment scenarios using Test Mode.