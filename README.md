# Blog Web - Full Stack Blog Website

A full-stack blog website with both admin and user functionality.

## Tech Stack

### Frontend
- React
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Features

### Authentication System
- User Registration
- User Login
- JWT Authentication

### User Functionality
- Create, Read, Update, Delete blog posts
- Like posts
- Comment on posts
- Update profile

### Admin Functionality
- Manage users (View, Edit, Delete)
- Manage all posts
- View and manage reports

### UI Features
- Dark/Light Theme Toggle
- Responsive Design
- Minimalistic UI with Soft Color Theme

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository
```
git clone <repository-url>
cd blog-web
```

2. Install backend dependencies
```
cd server
npm install
```

3. Install frontend dependencies
```
cd ../client
npm install
```

4. Create a .env file in the server directory with the following variables
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog-web
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

5. Start the backend server
```
cd server
npm run dev
```

6. Start the frontend development server
```
cd client
npm start
```

7. Open your browser and navigate to http://localhost:3000

## Project Structure

```
blog-web/
│
├── client/                  # Frontend
│   ├── public/              # Public assets
│   ├── src/                 # Source files
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Context API
│   │   ├── utils/           # Utility functions
│   │   ├── assets/          # Assets (images, etc.)
│   │   ├── App.js           # Main App component
│   │   └── index.js         # Entry point
│   └── package.json         # Frontend dependencies
│
├── server/                  # Backend
│   ├── controllers/         # Controller files
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routes
│   ├── middleware/          # Middleware functions
│   ├── config/              # Configuration files
│   ├── server.js            # Entry point
│   └── package.json         # Backend dependencies
│
└── README.md                # Project documentation
```

## License

This project is licensed under the MIT License. 