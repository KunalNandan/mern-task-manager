# 🚀 MERN Task Manager

A full-stack task management application built with the MERN stack, featuring secure authentication, task management, password reset, and cloud deployment.

## 🌐 Live Demo

https://mern-task-manager-qyg6hqcjk-kunal-93ea.vercel.app

## ✨ Features

- 🔐 User registration and login
- 🔑 JWT-based authentication
- 🔒 Change password
- 📧 Forgot password / password reset
- ➕ Create tasks
- ✏️ Edit tasks
- 🗑️ Delete tasks
- ✅ Complete tasks
- 📅 Task due dates
- 🚦 Task priority levels
- 🏷️ Task categories
- 👤 User profile management
- ☁️ Cloud database with MongoDB Atlas
- 🌍 Production deployment

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Toastify

### Backend
- Node.js
- Express.js
- JWT
- bcrypt
- Nodemailer / Resend

### Database
- MongoDB
- MongoDB Atlas

### Deployment
- Vercel
- Render

## 📁 Project Structure

```text
mern-task-manager/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
└── README.md
