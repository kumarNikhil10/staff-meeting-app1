# 🏫 College Staff Meeting Management System
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
```
## 📋 PROJECT FEATURES SUMMARY
✅Principal can manage the HOD request to register
✅principal is like admin who can control HOD,blacklist staff 
✅ User Registration & Login with JWT authentication
✅ Role-based access (Admin vs Staff)
✅ Admin can schedule meetings with date, time, venue, agenda
✅ Staff can see their invited meetings
✅ Staff can Accept or Decline invitations
✅ Admin can mark meetings as Completed or Cancelled
✅ Admin can delete meetings
✅ Dashboard with meeting statistics
✅ Filter meetings by status

*Built with ❤️ using MongoDB + Express.js + React + Node.js*
