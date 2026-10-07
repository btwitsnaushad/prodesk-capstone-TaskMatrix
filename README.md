# 🚀 TaskMatrix

> **A full-stack Agile project management platform for modern software teams.**

TaskMatrix is a Jira/Asana-inspired project management platform designed to help software teams manage **projects, tasks, priorities, deadlines, responsibilities, and team collaboration** from a centralized workspace.

The application follows a scalable full-stack architecture using **React, Express.js, MongoDB, JWT authentication, Gemini AI, and modern deployment infrastructure.**

---

## ✨ Project Highlights

| Area | Technology / Capability |
|---|---|
| 🎯 Project Type | Full-Stack Agile Project Management |
| 👨‍💻 Designated Track | Fullstack Developer |
| ⚛️ Frontend | React.js + Vite |
| 🎨 Styling | Tailwind CSS + Shadcn UI |
| 🛠️ Backend | Node.js + Express.js |
| 🔐 Authentication | JWT + bcryptjs |
| 🗄️ Database | MongoDB + Mongoose |
| 🤖 AI | Google Gemini API |
| 🛡️ Validation | Zod |
| 🚦 Rate Limiting | express-rate-limit |
| 💳 Payments | Stripe Test Mode |
| ☁️ Frontend Deployment | Vercel |
| ☁️ Backend Deployment | Render |
| 🍃 Database Hosting | MongoDB Atlas |

---

## 📌 Project Overview

TaskMatrix is a Jira/Asana-inspired project management platform for software development teams.

It provides a centralized workspace where teams can:

- Create and manage projects
- Create and manage tasks
- Assign responsibilities
- Track priorities and deadlines
- Manage Agile workflows
- Collaborate with team members
- Monitor project activity
- Work with Kanban-based workflows

The application is designed as a scalable full-stack solution with:

```text
React Frontend
      ↓
Express.js REST API
      ↓
Business Logic
      ↓
MongoDB Database

🎯 Project Objective
The primary objective of TaskMatrix is to provide software teams with a simple and centralized platform for managing Agile workflows.
Core Objectives
- 📁 Project management
- ✅ Task management
- 👥 Team collaboration
- 👤 Task assignment
- 🚨 Priority and deadline tracking
- 📋 Kanban workflow management
- 🔐 Role-based access control
- 📊 Project activity tracking
🧑‍💻 Designated Track
Fullstack Developer
TaskMatrix is developed under the Fullstack Developer track with a focus on:
- Frontend development
- Backend REST APIs
- Authentication
- Database integration
- API security
- AI integration
- Production deployment
- End-to-end application testing
🛠️ Tech Stack
Frontend
- React.js
- Vite
- Tailwind CSS
- Shadcn UI
- React Router
- Zustand
Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- bcryptjs
- Zod
- express-rate-limit
- Stripe
AI Integration
- Google Gemini API
- Gemini 2.5 Flash
Database
- MongoDB
- Mongoose
Development & Design
- Git
- GitHub
- Postman
- Figma
- Draw.io / dbdiagram.io
Deployment
- Vercel
- Render
- MongoDB Atlas
👥 User Roles
TaskMatrix is designed around role-based access control.
Role	Responsibilities
🔴 Admin	Manage users, projects, roles, project deletion and system activity
🟡 Manager	Create projects, manage teams, assign tasks and monitor progress
🟢 Member	View assigned projects, update tasks, change status and track personal tasks


Admin
- Manage users
- Manage projects
- Manage user roles
- Delete projects
- Monitor system activity
Manager
- Create and manage projects
- Add team members
- Create and assign tasks
- Manage task priorities and deadlines
- Monitor project progress
Member
- View assigned projects
- View and update assigned tasks
- Change task status
- Add comments
- Track personal tasks
🚀 Core Features
P0 — Must Have
🔐 Authentication
- User registration
- User login
- JWT-based authentication
- Protected routes
- Logout
📁 Project Management
- Create project
- View projects
- Update project
- Delete project
- Add and manage team members
✅ Task Management
- Create tasks
- Edit tasks
- Delete tasks
- Assign tasks to team members
- Set task priority
- Set task deadline
- Automated deadline tracking using cron jobs
- Update task status
📋 Kanban Board
Workflow columns:
┌──────────┐
│  To Do   │
└──────────┘
      ↓
┌──────────────┐
│ In Progress  │
└──────────────┘
      ↓
┌──────────┐
│  Review  │
└──────────┘
      ↓
┌──────────┐
│   Done   │
└──────────┘

- To Do
- In Progress
- Review
- Done
- Drag-and-drop task management
P1 — Important Features
- 🔎 Task search
- 🎛️ Task filtering
- ↕️ Task sorting
- 💬 Task comments
- ⚡ Real-time project activity feed
- 📊 Dashboard statistics
- 👥 Team management
P2 — Future Features
- ⚡ Real-time task updates
- 🔔 Notifications
- 📈 Advanced analytics
🗄️ Database Design
TaskMatrix is designed around the following MongoDB collections:
Users
Projects
Tasks
Comments
Activities

Relationships between these collections are documented through the Entity Relationship Diagram.
Entity Relationship Diagram

🏗️ System Architecture
Architecture Diagram

Application Flow
                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   TaskMatrix Frontend  │
              │     React + Vite       │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │   Express.js REST API  │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │    Business Logic      │
              │ Controllers / Services │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │      MongoDB Atlas     │
              │ Users / Projects /     │
              │ Tasks / Comments /     │
              │ Activities             │
              └────────────────────────┘

JWT authentication is used to secure protected API routes, while role-based access control determines which actions different users can perform.
🔌 Planned API Architecture
Authentication
POST /api/auth/register
POST /api/auth/login

Users
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id

Projects
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id

Tasks
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

Comments
GET  /api/tasks/:taskId/comments
POST /api/tasks/:taskId/comments

Activities
GET /api/projects/:projectId/activities

🎨 UI/UX Design
The TaskMatrix interface is designed using Figma with responsive layouts for desktop and mobile devices.
Desktop Screens
1. Login
2. Dashboard
3. Kanban Board
Mobile Screens
1. Mobile Login
2. Mobile Dashboard
3. Mobile Kanban Board
🎨 Figma Design
TaskMatrix UI/UX Design
🗺️ Project Roadmap
Sprint 13 — Planning & Architecture
- Product Requirements Document
- UI/UX wireframes
- Database ERD
- System architecture
- API planning
- Prompt engineering documentation
Sprint 14 — Authentication & Routing
- Frontend authentication setup
- Backend authentication setup
- MongoDB User model
- Password hashing using bcryptjs
- JWT authentication
- Login and registration APIs
- Protected dashboard route
- JWT verification middleware
- Protected task API
- Logout functionality
- Authentication testing
- Frontend deployment on Vercel
- Backend deployment on Render
Sprint 15 — Full Feature Completion
- Task CRUD operations
- Create, read, update and delete tasks
- JWT-protected task APIs
- User-specific task ownership validation
- Unauthorized access handling with 403 responses
- React frontend and REST API integration
- Optimistic task deletion
- Stripe Checkout integration in Test Mode
- Stripe payment success and cancellation handling
Sprint 16 — AI Integration & UX Polish
- Gemini AI integration
- AI-powered task subtask suggestions
- Protected AI suggestion API
- Structured JSON AI responses
- Zod request validation
- Invalid request handling with 400 responses
- Rate limiting for authentication and AI routes
- AI-generated subtasks displayed in the dashboard
- Add AI-generated subtasks as tasks
- Mobile responsive dashboard testing
- Production console.log cleanup
Sprint 17 — Deployment & Go-Live
- Production backend deployed on Render
- Production frontend deployed on Vercel
- MongoDB Atlas network access configured
- Production CORS restricted to the live frontend
- VITE_API_URL configured with the live Render backend
- End-to-end production testing completed
- Live authentication verified
- Live task creation verified
- MongoDB task persistence verified
- Production refresh and persistence verified
- Render backend health endpoint verified
- Render proxy configuration fixed for production rate limiting
- Final production environment verification completed
📚 Documentation
Document	Purpose
README.md	Product Requirements & Project Documentation
Prompts.md	AI Prompt Engineering Log
TaskMatrix-ERD.png	Database Entity Relationship Diagram
TaskMatrix-Architecture.png	System Architecture Diagram


📊 Project Status
Current Phase
Sprint 17 — Deployment & Go-Live
Development Status
Authentication, Task CRUD, Data Ownership, Stripe Checkout, AI Integration, Request Validation, Rate Limiting, Mobile Responsiveness and Production Deployment Completed.

✅ Sprint 14 Completed
- User registration and login
- Password hashing using bcryptjs
- JWT-based authentication
- Protected dashboard route
- JWT verification middleware
- Protected task API
- Logout functionality
- MongoDB integration
- Frontend deployed on Vercel
- Backend deployed on Render
✅ Sprint 15 Completed
- Task creation using REST API
- Task retrieval for authenticated users
- Task update functionality
- Task deletion functionality
- JWT-protected task routes
- User-specific task ownership validation
- 403 handling for unauthorized task access
- React frontend and backend API integration
- Optimistic UI update for task deletion
- Stripe Checkout Test Mode integration
- Stripe success and cancellation flow
✅ Sprint 16 Completed
- Gemini AI integration
- AI-powered task subtask generation
- Protected AI suggestion API
- Structured JSON AI responses
- Zod request validation
- Invalid payload handling with 400 responses
- Rate limiting for authentication and AI routes
- AI-generated subtasks displayed in dashboard
- Add AI-generated subtasks as tasks
- Mobile responsiveness testing
- Production console.log cleanup
🏁 Final Status
TaskMatrix Fullstack project — Sprint 17 Deployment & Go-Live completed.

The production environment has been deployed and manually verified across the frontend, backend, and database layers.
🔗 Project Links
Resource	Link
💻 GitHub Repository	TaskMatrix GitHub Repository
🌐 Live Frontend	TaskMatrix Live Application
⚙️ Backend API	TaskMatrix Backend API


👨‍💻 Project
TaskMatrix — Fullstack Developer Track
Built as a full-stack Agile project management solution with modern web technologies, secure authentication, AI integration, REST APIs, database persistence, and production deployment.
⭐ TaskMatrix — Plan. Manage. Collaborate. Deliver.