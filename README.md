# 🏫 College Staff Meeting Management System
### MERN Stack Project — Complete Setup Guide for Beginners

---

## 📁 FOLDER STRUCTURE

```
staff-meeting-app/
├── backend/                   ← Node.js + Express server
│   ├── models/
│   │   ├── User.js            ← Database schema for users
│   │   └── Meeting.js         ← Database schema for meetings
│   ├── routes/
│   │   ├── auth.js            ← Login / Register routes
│   │   ├── meetings.js        ← Meeting CRUD routes
│   │   └── staff.js           ← Staff list routes
│   ├── middleware/
│   │   └── auth.js            ← JWT token checker
│   ├── server.js              ← Main entry point
│   ├── .env                   ← Secret config values
│   └── package.json
│
└── frontend/                  ← React app
    ├── public/
    │   └── index.html
    └── src/
        ├── pages/
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Dashboard.js
        │   ├── Meetings.js
        │   ├── CreateMeeting.js
        │   └── MeetingDetail.js
        ├── components/
        │   └── Navbar.js
        ├── api.js             ← All API calls
        ├── App.js             ← Main app with routing
        ├── App.css            ← Styles
        └── index.js
```

---

## 🛠️ STEP 1 — Install Required Software

### 1.1 Install Node.js
- Go to: https://nodejs.org
- Download the **LTS version** (the green button)
- Install it (just click Next → Next → Finish)
- Verify: open Command Prompt / Terminal and type:
  ```
  node --version
  ```
  You should see something like: `v18.17.0`

### 1.2 Install MongoDB (Database)
- Go to: https://www.mongodb.com/try/download/community
- Download MongoDB Community Server for your OS
- Install it (keep default settings)
- MongoDB will run automatically as a service

  **Alternative (easier):** Use MongoDB Atlas (free cloud database)
  1. Go to https://cloud.mongodb.com
  2. Create a free account → Create a free cluster
  3. Click "Connect" → "Connect your application"
  4. Copy the connection string
  5. In your `.env` file, replace `MONGO_URI=mongodb://localhost:27017/staff_meetings`
     with your Atlas connection string

---

## 🚀 STEP 2 — Set Up the Backend

Open a terminal/command prompt:

```bash
# Navigate to backend folder
cd staff-meeting-app/backend

# Install all required packages
npm install

# Start the backend server
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected
```

> ⚠️ If you see an error about MongoDB, make sure MongoDB is running.
> On Windows: Search "Services" → find "MongoDB" → Start it.

---

## ⚛️ STEP 3 — Set Up the Frontend

**Open a NEW terminal window** (keep the backend running):

```bash
# Navigate to frontend folder
cd staff-meeting-app/frontend

# Install all required packages
npm install

# Start the React app
npm start
```

Your browser will automatically open: **http://localhost:3000**

---

## 🧪 STEP 4 — Test the Application

### Register Your First Admin Account:
1. Click "Register here"
2. Fill in your name, email, password
3. Select **Role: Admin (HOD / Principal)**
4. Click Create Account

### Register Some Staff Accounts:
1. Open an incognito/private window OR logout
2. Register 2-3 more accounts with Role: **Staff Member**

### Create a Meeting (Admin):
1. Login as Admin
2. Click "+ New Meeting" in the navbar
3. Fill in title, date, time, venue, agenda
4. Select staff members as attendees
5. Click Create Meeting

### Staff Responds to Invite:
1. Login as a staff member
2. Go to Meetings → click on the meeting
3. See "Your Invitation" section
4. Click ✅ Accept or ❌ Decline

---

## 🔗 API Endpoints Reference

| Method | Endpoint | What it does | Who can use |
|--------|----------|-------------|-------------|
| POST | /api/auth/register | Create new account | Anyone |
| POST | /api/auth/login | Login | Anyone |
| GET | /api/meetings | Get all meetings | Logged in users |
| POST | /api/meetings | Create meeting | Admin only |
| PUT | /api/meetings/:id | Update meeting | Admin only |
| DELETE | /api/meetings/:id | Delete meeting | Admin only |
| PUT | /api/meetings/:id/respond | Accept/Decline invite | Staff |
| GET | /api/staff | Get all staff | Logged in users |

---

## ❓ COMMON ERRORS & FIXES

**Error: Cannot connect to MongoDB**
→ Start MongoDB service. On Windows: Services → MongoDB → Start

**Error: Port 5000 already in use**
→ Change PORT=5001 in backend/.env

**Error: Module not found**
→ Make sure you ran `npm install` in both backend and frontend folders

**Blank page in browser**
→ Make sure backend is running (npm run dev in backend folder)

**CORS error in browser console**
→ Make sure backend has `app.use(cors())` in server.js ✓ (already added)

---

## 📋 PROJECT FEATURES SUMMARY

✅ User Registration & Login with JWT authentication
✅ Role-based access (Admin vs Staff)
✅ Admin can schedule meetings with date, time, venue, agenda
✅ Admin can invite specific staff members
✅ Staff can see their invited meetings
✅ Staff can Accept or Decline invitations
✅ Admin can mark meetings as Completed or Cancelled
✅ Admin can delete meetings
✅ Dashboard with meeting statistics
✅ Filter meetings by status

---

## 🎓 HOW TO SUBMIT (Google Sheet)

Fill in the Google Sheet provided by your teacher with:
- **Project Name:** College Staff Meeting Management System
- **Domain:** Enterprise
- **Technology:** MERN Stack (MongoDB, Express, React, Node.js)
- **Features:** Meeting scheduling, Role-based access, Invitation management
- **Team Members:** (your name + partner's name)

---

*Built with ❤️ using MongoDB + Express.js + React + Node.js*
