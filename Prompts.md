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
