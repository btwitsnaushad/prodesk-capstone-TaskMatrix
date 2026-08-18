# TaskMatrix — AI Prompt Engineering Log

> A structured record of AI-assisted architectural reasoning used during the planning and blueprint phase of the TaskMatrix capstone project.

---

## 1. Purpose

This document records the key AI-assisted prompts used while planning the architecture, database design, security model, API structure, user experience, and feature scope of **TaskMatrix**.

AI was used as an engineering support tool for evaluating design alternatives, identifying edge cases, and improving the clarity of the project blueprint. Final architectural decisions were reviewed and adapted specifically for the TaskMatrix requirements.

---

## 2. Project Context

**Project:** TaskMatrix
**Track:** Fullstack Developer
**Application Type:** Agile Project Management Platform
**Frontend:** React + Vite
**Backend:** Node.js + Express.js
**Database:** MongoDB + Mongoose

TaskMatrix is designed as a Jira/Asana-inspired platform for software development teams. Its core workflow revolves around projects, tasks, assignments, deadlines, priorities, Kanban status management, team collaboration, and activity tracking.

---

## 3. Prompt — Full-Stack Architecture

### Objective

Design the complete client-server architecture before implementation and clearly separate presentation, API, business logic, authentication, and persistence responsibilities.

### Prompt

> Act as a senior full-stack software architect. Design the system architecture for TaskMatrix, a Jira/Asana-inspired Agile project management platform for software development teams.
>
> The frontend will use React with Vite, the backend will use Node.js with Express.js, and MongoDB with Mongoose will be used for persistence.
>
> The system must support authentication, role-based access control, project management, task management, Kanban workflow, comments, deadlines, priorities, and project activity tracking.
>
> Define the responsibility of each application layer, explain how requests should flow from the client to MongoDB, and identify where authentication and authorization should be enforced.
>
> Keep the architecture suitable for an individual developer while maintaining commercial-grade separation of concerns.

### Engineering Outcome

The architecture was divided into:

`React + Vite → Express REST API → Controllers/Services → MongoDB`

JWT authentication and role-based authorization were planned as part of the protected API layer.

---

## 4. Prompt — MongoDB Data Model & ERD

### Objective

Create a database structure that supports the application's core workflows without introducing unnecessary collections.

### Prompt

> Act as a database architect and design a MongoDB data model for TaskMatrix.
>
> The application requires users, projects, tasks, comments, and project activity tracking.
>
> Use five primary collections:
>
> * Users
> * Projects
> * Tasks
> * Comments
> * Activities
>
> For each collection, define the important fields, ObjectId references, ownership relationships, task assignment relationships, and audit/activity relationships.
>
> Explain how Users, Projects, Tasks, Comments, and Activities should be connected so that common queries such as "tasks belonging to a project", "comments on a task", "tasks assigned to a user", and "project activity history" can be supported efficiently.
>
> Avoid unnecessary collections and keep the schema practical for a MongoDB + Mongoose implementation.

### Engineering Outcome

The resulting ERD established references between users, projects, tasks, comments, and activities.

Important relationships include:

* Project ownership through `ownerId`
* Task membership through `projectId`
* Task assignment through `assignedTo`
* Comments through `taskId` and `userId`
* Activities through `projectId`, `userId`, and `taskId`

The final ERD was documented separately using dbdiagram.io.

---

## 5. Prompt — Role-Based Access Control

### Objective

Define realistic permissions for different users without making the authorization model unnecessarily complex.

### Prompt

> Design a role-based access control model for TaskMatrix with three roles: Admin, Manager, and Member.
>
> Admin should have system-level management capabilities.
>
> Manager should be responsible for project and team-level operations.
>
> Member should primarily work with assigned projects and tasks.
>
> Create a permission matrix covering users, projects, tasks, comments, team membership, and activity monitoring.
>
> Identify operations that should be restricted at the API level rather than relying only on frontend UI restrictions.
>
> Keep the model simple enough to implement using JWT authentication and Express middleware.

### Engineering Outcome

Three roles were defined:

**Admin**

* User management
* Project management
* Role management
* System activity monitoring

**Manager**

* Project creation and management
* Team member management
* Task assignment
* Priority and deadline management

**Member**

* Assigned project access
* Assigned task updates
* Status changes
* Comments
* Personal task tracking

Authorization is intended to be enforced server-side through protected API routes and middleware.

---

## 6. Prompt — Kanban Workflow Design

### Objective

Define the task lifecycle and prevent inconsistent status transitions.

### Prompt

> Design a practical Kanban workflow for TaskMatrix with four statuses:
> To Do, In Progress, Review, and Done.
>
> Each task should support assignment, priority, deadline, description, and status.
>
> Define how a task moves between statuses, what information should be visible on a Kanban card, and what backend validation should occur when a task is moved.
>
> The workflow should support drag-and-drop on the frontend while keeping the backend as the source of truth.

### Engineering Outcome

The Kanban board was structured around:

`To Do → In Progress → Review → Done`

Drag-and-drop is treated as a UI interaction, while the resulting status change is persisted through the backend API.

---

## 7. Prompt — REST API Architecture

### Objective

Plan consistent API boundaries before backend implementation.

### Prompt

> Design a RESTful API structure for TaskMatrix using Express.js.
>
> Group endpoints logically around authentication, users, projects, tasks, comments, and activities.
>
> Use appropriate HTTP methods for CRUD operations.
>
> Projects contain tasks, tasks contain comments, and projects maintain an activity history.
>
> Include protected routes where authentication or role authorization is required.
>
> Keep endpoint naming consistent and scalable for future frontend integration.

### Engineering Outcome

The API was organized around resources such as:

* `/api/auth`
* `/api/users`
* `/api/projects`
* `/api/tasks`
* `/api/tasks/:taskId/comments`
* `/api/projects/:projectId/activities`

The API planning was completed before implementation to reduce integration issues during later development sprints.

---

## 8. Prompt — Scope & MVP Prioritization

### Objective

Prevent scope creep and keep the first implementation achievable.

### Prompt

> Review the proposed TaskMatrix feature set and divide it into P0, P1, and P2 priorities.
>
> P0 should contain only features required for a usable Agile project management MVP.
>
> P1 should contain features that improve collaboration and productivity after the core workflow is stable.
>
> P2 should contain advanced or optional functionality such as real-time updates, notifications, AI assistance, and analytics.
>
> Evaluate each feature based on implementation complexity, dependency on other modules, and value to the primary user workflow.
>
> Keep the MVP realistic for an individual full-stack developer.

### Engineering Outcome

The feature roadmap was separated into:

**P0 — Core MVP**

* Authentication
* Project management
* Task management
* Kanban workflow

**P1 — Important**

* Search
* Filtering
* Comments
* Activity feed
* Dashboard statistics
* Team management

**P2 — Future**

* Real-time updates
* Notifications
* AI assistance
* Advanced analytics

This prioritization was used to keep the project scope controlled during the capstone.

---

## 9. Prompt — Responsive UI/UX Planning

### Objective

Translate the functional requirements into practical desktop and mobile layouts before development.

### Prompt

> Act as a product designer for TaskMatrix and define a responsive UI structure for an Agile project management platform.
>
> The core screens are Login, Dashboard, and Kanban Board.
>
> For desktop, prioritize project overview, task visibility, Kanban columns, navigation, and team information.
>
> For mobile, simplify navigation and ensure Kanban cards and task information remain usable within a smaller viewport.
>
> Define the main components, information hierarchy, and responsive behavior without adding unnecessary UI elements.

### Engineering Outcome

The Figma planning was organized around:

**Desktop**

1. Login
2. Dashboard
3. Kanban Board

**Mobile**

1. Mobile Login
2. Mobile Dashboard
3. Mobile Kanban Board

The design was planned before implementation so that the frontend structure could follow the approved layout rather than being designed reactively during coding.

---

## 10. Prompt — Architecture Review

### Objective

Identify potential weaknesses in the blueprint before implementation begins.

### Prompt

> Review the complete TaskMatrix architecture as a senior engineering reviewer.
>
> Check the proposed technology stack, five-collection MongoDB schema, REST API structure, role model, Kanban workflow, and P0/P1/P2 feature priorities.
>
> Identify possible architectural risks, unnecessary complexity, missing relationships, authorization weaknesses, API inconsistencies, and scope-creep risks.
>
> Do not redesign the project unnecessarily. Recommend only changes that materially improve maintainability, security, or implementation feasibility for an individual full-stack developer.

### Engineering Outcome

The review was used as a final planning checkpoint before moving from the blueprint phase into implementation.

---

## 11. Key Engineering Decisions

The following decisions were finalized during the planning phase:

| Area                 | Decision                                     |
| -------------------- | -------------------------------------------- |
| Frontend             | React + Vite                                 |
| Styling              | Tailwind CSS + Shadcn UI                     |
| State Management     | Zustand                                      |
| Backend              | Node.js + Express.js                         |
| API Style            | REST API                                     |
| Authentication       | JWT                                          |
| Database             | MongoDB + Mongoose                           |
| Core Collections     | Users, Projects, Tasks, Comments, Activities |
| User Roles           | Admin, Manager, Member                       |
| Kanban States        | To Do, In Progress, Review, Done             |
| Architecture         | Client → API → Business Logic → Database     |
| UI Planning          | Figma                                        |
| ERD Tool             | dbdiagram.io                                 |
| Architecture Diagram | Draw.io                                      |

---

## 12. Final Note

The purpose of AI assistance in this project was not to generate the entire application automatically. It was primarily used during the planning phase to challenge architectural assumptions, structure complex requirements, explore database relationships, review feature scope, and improve implementation readiness.

The final TaskMatrix blueprint combines these AI-assisted insights with project requirements and engineering decisions made for the capstone.
