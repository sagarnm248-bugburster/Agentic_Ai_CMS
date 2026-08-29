# ResolveDesk — Complaint Management System

A beautiful, modern, and production-ready Web-Based Complaint Management System built to streamline campus facility/service reports (classrooms, labs, hostels, Wi-Fi, infrastructure, transport, cleanliness, etc.) and track them from submission to closure. 

ResolveDesk leverages a role-based workflow tailored for **Students** (submitting and tracking reports) and **Administrators** (triaging, department/staff assignment, commenting, resolving, and viewing analytics).

---

## 🚀 Key Features

### 🎓 Student Features
- **Issue Submission**: Report issues with category, location, priority level, details, and optional image attachments.
- **AI Category Auto-Suggestion**: Features an integrated Google Gemini API classification tool that automatically suggests categories based on description text on blur.
- **Complaint History Dashboard**: Monitor active, pending, and resolved complaints in a timeline history.
- **Complaint Details Page**: Review department assignments, staff handlings, administrative updates/comments, and resolution details.

### 🛠️ Admin Features
- **Consolidated Workspace**: Track total tickets, critical status issues, and categories requiring triage.
- **Analytics & Stats Panel**: View ticket distributions by status and category in real-time.
- **Advanced Triage Controls**: Set severity levels, override priority, and record resolution details.
- **Assignment Handling**: Assign tickets to departments (e.g., Electrical, Cleanliness) and individual staff members.
- **Activity & Comment Logs**: Append status updates and administrative logs readable by students.
- **Ticket Deletion**: Delete tickets with double-confirm guards.

---

## 💻 Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router v6, Zustand (State Management), Axios, Lucide React
- **Backend**: Node.js, Express, MongoDB (Mongoose ODM)
- **Security & Utilities**: JSON Web Tokens (JWT), bcrypt (cost 12), express-validator (body validation), helmet (secure headers), CORS
- **AI Integration**: Google Gemini API (Fallback Keyword Classifier included)

---

## 📂 Project Structure

```
project/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/       # ProtectedRoute, Navbar
│   │   ├── pages/            # Login, Register, Dashboards, Complaints, Detail Views
│   │   ├── services/         # Axios API interceptor configurations
│   │   ├── store/            # Zustand authentication & complaint stores
│   │   ├── App.jsx           # React Router client routing configuration
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/           # db.js, env.js (Environment variables handler)
│   │   ├── controllers/      # authController, complaintController
│   │   ├── middleware/       # auth, validation, errorHandler
│   │   ├── models/           # User schema, Complaint schema
│   │   ├── routes/           # authRoutes, complaintRoutes, adminRoutes
│   │   └── index.js          # Express app server entrypoint
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB running locally or a MongoDB Atlas connection string

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sagarnm248-bugburster/Agentic_Ai_CMS.git
   cd Agentic_Ai_CMS
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory using the variables described below.
   Start the backend server in development mode:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env.local` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## 🔒 Required Environment Variables

To run the application in production, you must set the following environment variables:

### Backend (`server/`)
- `PORT`: Port number (e.g., `5000`)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Random string for signing authentication tokens
- `JWT_EXPIRES_IN`: Duration token remains valid (e.g., `7d`)
- `FRONTEND_URL`: URL of the client application (CORS restriction)
- `NODE_ENV`: Runtime environment (`development` / `production`)
- `GEMINI_API_KEY`: API key for Google Gemini category auto-suggestions (Optional)

### Frontend (`client/`)
- `VITE_API_URL`: Root path or external base URL for backend API requests

---

## 🛡️ Security Best Practices
- **Password Protection**: Salting and hashing passwords via `bcryptjs` with cost 12.
- **Route Authorization**: JWT verifying middleware protection on all user scopes.
- **Data Validation**: Sanitization and validation check on client payloads using `express-validator`.
- **Headers Protection**: Secure HTTP headers configuration via `helmet`.
