# Expense Tracker Full Stack App

This is a full stack expense tracker application built with React, Vite, Tailwind CSS, Node.js, Express and MongoDB. The app allows users to manage expenses, track spending by category and view summaries through a mobile-first interface.

The frontend currently uses a mock backend to simulate API calls and data flow, while the actual Express backend code is included in the server folder.

## Features

- User authentication using JWT
- Add, edit and delete expenses
- Dashboard with spending summary by category
- Recent transactions view
- Offline support for viewing cached data
- Responsive mobile-first UI
- Loading and empty states

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- Context API + useReducer
- LocalStorage for caching

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs
- express-validator

## Project Structure

```text
/
├── server/
│   ├── src/models/
│   ├── src/routes/
│   ├── src/controllers/
│   └── src/middleware/

├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── screens/
│   ├── utils/
│   ├── App.tsx
│   └── index.css

└── README.md
```

## Running the Project

### Frontend

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

Open:

```bash
http://localhost:5173
```
## Backend

The backend is built with Node.js, Express and MongoDB Atlas for cloud database storage. It handles authentication, expense management APIs and data persistence.

### Backend Stack
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- express-validator

## Running the Backend

Move into the server folder

```bash
cd server
npm install
```

Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

Start the server

```bash
npm run dev
```

## API Routes

Authentication
- POST /auth/register
- POST /auth/login
- GET /auth/me

Expenses
- GET /expenses
- POST /expenses
- PUT /expenses/:id
- DELETE /expenses/:id
- GET /expenses/summary


## Offline Support

The app stores the latest fetched data in local storage so users can still view expense data when offline.

For now, creating or editing expenses while offline is disabled to avoid sync issues.

## Test Login

You can create a user from the UI or use:

Email: test@example.com  
Password: password123