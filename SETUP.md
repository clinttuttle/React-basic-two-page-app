# Todo List Manager - Setup Instructions

## Overview
Your Todo List Manager is now connected to your AWS RDS MySQL database. The app includes a Node.js/Express backend server that handles all database operations.

## Setup

### 1. Install Dependencies
Run the following command to install all required packages:
```bash
npm install
```

### 2. Environment Configuration
The `.env` file has already been created with your database credentials:
- **Database**: clintdb
- **Host**: my-db.cr1b9933gaye.us-east-1.rds.amazonaws.com
- **Port**: 3306
- **Server Port**: 5000

**Important**: Never commit the `.env` file to version control. It's already added to `.gitignore`.

### 3. Database Table
The backend automatically creates the `tasks` table on first run with the following schema:
- `id` (INT, Primary Key, Auto Increment)
- `description` (VARCHAR)
- `due_date` (DATE)
- `status` (ENUM: Pending, In Progress, Completed)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Running the Application

### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev:full
```
This will start:
- Backend server on: `http://localhost:5000`
- React frontend on: `http://localhost:5173` (or similar)

### Option 2: Run Separately
In terminal 1, start the backend:
```bash
npm run server
```

In terminal 2, start the frontend:
```bash
npm run dev
```

## API Endpoints

### Get All Tasks
```
GET http://localhost:5000/api/tasks
```

### Create a New Task
```
POST http://localhost:5000/api/tasks
Content-Type: application/json

{
  "description": "Task description",
  "due_date": "2026-02-25",
  "status": "Pending"
}
```

### Update a Task
```
PUT http://localhost:5000/api/tasks/:id
Content-Type: application/json

{
  "description": "Updated description",
  "due_date": "2026-02-26",
  "status": "In Progress"
}
```

### Delete a Task
```
DELETE http://localhost:5000/api/tasks/:id
```

### Health Check
```
GET http://localhost:5000/api/health
```

## Features

✅ **Add Tasks** - Create new tasks with description, due date, and status
✅ **Edit Tasks** - Modify existing tasks
✅ **Delete Tasks** - Remove tasks with confirmation
✅ **Status Tracking** - Track task status (Pending, In Progress, Completed)
✅ **Database Persistence** - All data is stored in your AWS RDS MySQL database
✅ **Responsive Design** - Works on desktop and mobile devices
✅ **Error Handling** - Comprehensive error messages for debugging

## Troubleshooting

### Cannot connect to database
- Verify your database credentials in `.env`
- Check that your security group allows inbound traffic on port 3306
- Ensure your database instance is running

### CORS errors
- The backend has CORS enabled for local development
- For production, update CORS configuration in `server.js`

### Port 5000 already in use
- Change `SERVER_PORT` in `.env` to a different port
- Update the API URL in `src/pages/Page2.jsx`

### Tasks not loading
- Check browser console for errors
- Verify the backend server is running
- Check that the API URL is correct: `http://localhost:5000/api`

## Project Structure

```
├── server.js                 # Express backend server
├── .env                      # Database credentials (DO NOT COMMIT)
├── src/
│   ├── pages/
│   │   ├── Page2.jsx        # Todo List UI (connected to API)
│   │   └── Page2.css        # Styling
│   └── ...
└── package.json
```

## Technology Stack

- **Frontend**: React 19, React Router
- **Backend**: Node.js, Express
- **Database**: MySQL 8.0 (AWS RDS)
- **Utilities**: axios, cors, dotenv

---

Happy task managing! 📝
