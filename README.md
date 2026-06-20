## Live Demo

Frontend (Vercel):
[https://mini-project-management-portal-zeta.vercel.app](https://mini-project-management-portal-zeta.vercel.app/#/login)

Backend (Render):
https://mini-project-management-portal-0v8n.onrender.com

# Mini Project Management Portal

This repository contains a full-stack mini project management portal with:
- `backend/` — Express API with MySQL database support, JWT authentication, and task management routes
- `frontend/` — React + Vite SPA using Axios to communicate with the backend API

---


## Project Structure

```text
Project Management Portal/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection configuration
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   └── taskController.js   # Task CRUD operations
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT authentication middleware
│   ├── models/
│   │   ├── taskModel.js        # Task database queries/model
│   │   └── userModel.js        # User database queries/model
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication routes
│   │   └── taskRoutes.js       # Task routes
│   ├── tests/
│   │   └── task.test.js        # Unit tests for task APIs
│   ├── package.json            # Backend dependencies
│   └── server.js               # Main backend entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Application pages
│   │   ├── services/           # API service calls
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # React entry point
│   ├── package.json            # Frontend dependencies
│
└── README.md                   # Project documentation
```


## Prerequisites

Install the tools below before setup:
- Node.js 18+ / npm
- MySQL server (or compatible MySQL/MariaDB database)
- Optional: `git` if cloning the repo

---

## Backend Setup

1. Open a terminal and navigate to the backend folder:

```bash
cd "Mini-Project-Management-Portal/backend"
```

2. Install backend dependencies:

```bash
npm install
```

3. Create a MySQL database and tables.

Use MySQL Workbench, the MySQL CLI, or another client. Example SQL:

```sql
CREATE DATABASE IF NOT EXISTS project_management;
USE project_management;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

4. Configure backend environment variables.

Copy or create a `.env` file in `backend/` with values for your local environment:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=project_management
DB_PORT=3306
JWT_SECRET=your_jwt_secret
```

> Replace `your_database_password` and `your_jwt_secret` with secure values.

5. Start the backend server:

```bash
npm run dev
```

The backend API should now be running at:

- `http://localhost:5000`

---

## Frontend Setup

1. Open a terminal and navigate to the frontend folder:

```bash
cd "Mini-Project-Management-Portal/frontend"
```

2. Install frontend dependencies:

```bash
npm install
```

3. Start the React development server:

```bash
npm run dev
```

4. Open the app in your browser:

- `http://localhost:5173`

The frontend is configured to call the backend API at `http://localhost:5000/api`.

---

## Useful Commands

### Backend
- `npm run dev` — start backend with nodemon
- `npm start` — start backend with Node
- `npm test` — run backend tests with Jest

### Frontend
- `npm run dev` — start Vite development server
- `npm run build` — build production assets
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

---

## Notes

- The backend uses JWT authentication and requires `JWT_SECRET`.
- The frontend stores the authentication token in `localStorage` and sends it in `Authorization` headers.
- If you change backend ports or API URL, update `frontend/src/services/api.js` accordingly.

---

## Troubleshooting

- If the frontend cannot connect, verify the backend is running on port `5000`.
- If login or registration fails, confirm the MySQL database and tables exist and `.env` values are correct.
- If tests fail, make sure `NODE_ENV=test` is not accidentally set for normal development.
