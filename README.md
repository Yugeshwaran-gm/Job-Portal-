# Job Portal - Full Stack Application

A comprehensive job portal platform built with the MERN stack (MongoDB, Express, React, Node.js) that connects job seekers with employers. The platform features real-time messaging, application tracking, and role-based access control for Admin, Employer, and Job Seeker roles.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Environment Variables](#environment-variables)
- [Default Admin Credentials](#default-admin-credentials)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Job Seekers
- 🔍 **Job Search & Filtering** - Browse and search jobs with advanced filters
- 📝 **Application Management** - Apply for jobs and track application status
- 💬 **Real-time Messaging** - Communicate with employers via Socket.io
- 📊 **Dashboard** - Track all job applications in one place

### For Employers
- 📢 **Job Posting** - Create and manage job listings
- 👥 **Candidate Management** - View and manage job applications
- 📧 **Messaging System** - Contact potential candidatesn
- 📊 **Dashboard** - Overview of all posted jobs and applications

### For Administrators
- 👨‍💼 **User Management** - Manage all users and their roles
- 📋 **Job Management** - Approve, edit, or delete job postings
- 📊 **Admin Dashboard** - Platform analytics and monitoring

### General Features
- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- 🌐 **RESTful API** - Well-structured API endpoints
- 📚 **API Documentation** - Interactive Swagger/OpenAPI documentation
- 💾 **Data Validation** - Express-validator for request validation
- 🔒 **Protected Routes** - Role-based access control
- ⚡ **Real-time Updates** - Socket.io for instant messaging and notifications

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router DOM** - Client-side routing
- **Redux** - State management
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **FontAwesome** - Icons
- **Vite** - Fast build tool and dev server
- **CSS3** - Styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.io** - Real-time bidirectional communication
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **Express Validator** - Request validation
- **Swagger** - API documentation

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for version control)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/job-portal.git
cd job-portal
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Copy the environment variables from the example below
```

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/jobportal
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Twilio Configuration (Optional - for SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

```bash
# Start backend server
npm start
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Swagger API Docs**: http://localhost:5000/api/docs

## 📖 Usage

### First Time Setup

1. **Start the Backend**: The backend automatically creates a default admin user on first startup
2. **Start the Frontend**: Access the application at http://localhost:5173
3. **Register**: Create accounts for job seekers and employers
4. **Admin Access**: Use the default admin credentials (see below)

### Creating Different User Types

When registering, select your role:
- **Job Seeker** - For candidates looking for jobs
- **Employer** - For companies posting jobs
- **Admin** - Can only be assigned by existing admin

### Workflow

#### Job Seeker Flow:
1. Register/Login as a Job Seeker
2. Complete your profile
3. Browse available jobs
4. Apply for jobs you're interested in
5. Track application status on your dashboard
6. Communicate with employers via messaging

#### Employer Flow:
1. Register/Login as an Employer
2. Create/Update company profile
3. Post job openings
4. Review applications
5. Message candidates
7. Update application status

#### Admin Flow:
1. Login with admin credentials
2. Manage all users, and jobs
3. Approve or reject job postings
4. Assign user roles
5. Monitor platform activity

## 📁 Project Structure

```
Job-Portal/
│
├── backend/
│   ├── controllers/          # Request handlers
│   │   ├── adminControllers.js
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   ├── companyControllers.js
│   │   ├── interviewControllers.js
│   │   ├── jobControllers.js
│   │   ├── messageController.js
│   │   ├── notificationControllers.js
│   │   └── userControllers.js
│   │
│   ├── middleware/           # Custom middleware
│   │   ├── authMiddleware.js       # JWT authentication
│   │   ├── errorMiddleware.js      # Error handling
│   │   └── validateMiddleware.js   # Input validation
│   │
│   ├── models/               # Mongoose schemas
│   │   ├── Application.js
│   │   ├── Auth.js
│   │   ├── Company.js
│   │   ├── Interview.js
│   │   ├── Job.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   └── User.js
│   │
│   ├── routes/               # API routes
│   │   ├── adminRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── interviewRoutes.js
│   │   ├── JobRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── utils/                # Utility functions
│   │   ├── generateToken.js
│   │   └── sendMail.js
│   │
│   ├── server.js             # Entry point
│   ├── swagger.js            # Swagger configuration
│   ├── package.json
│   └── SWAGGER_SETUP.md      # API documentation guide
│
├── frontend/
│   ├── public/               # Static assets
│   │
│   ├── src/
│   │   ├── assets/          # Images, icons, etc.
│   │   │
│   │   ├── components/      # React components
│   │   │   ├── Admin/              # Admin-specific components
│   │   │   ├── Auth/               # Authentication components
│   │   │   ├── Common/             # Shared components (Navbar, Footer)
│   │   │   ├── Company/            # Company management
│   │   │   ├── Dashboard/          # Role-based dashboards
│   │   │   ├── Interviews/         # Interview scheduling
│   │   │   ├── Jobs/               # Job listing and applications
│   │   │   ├── Messages/           # Messaging system
│   │   │   ├── Network/            # Professional connections
│   │   │   ├── Notifications/      # Notification system
│   │   │   └── Users/              # User profile management
│   │   │
│   │   ├── context/         # React Context API
│   │   │   ├── authContext.jsx     # Authentication state
│   │   │   └── messagesContext.jsx # Messages state
│   │   │
│   │   ├── App.jsx          # Main app component with routing
│   │   ├── main.jsx         # Entry point
│   │   ├── App.css          # Global styles
│   │   └── index.css        # Base styles
│   │
│   ├── index.html
│   ├── vite.config.js       # Vite configuration
│   ├── package.json
│   └── README.md
│
└── README.md                # This file
```

## 📚 API Documentation

The project includes comprehensive Swagger documentation for all API endpoints.

### Accessing API Documentation

Once the backend server is running, visit:
```
http://localhost:5000/api/docs
```

### API Endpoints Overview

#### Authentication (`/api/auth`)
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password/:token` - Reset password with token

#### Users (`/api/users`)
- POST `/api/users` - Register new user
- POST `/api/users/login` - User login
- GET `/api/users/profile` - Get user profile (Protected)
- PUT `/api/users/profile` - Update profile (Protected)
- GET `/api/users/:id` - Get user by ID
- DELETE `/api/users/:id` - Delete user

#### Jobs (`/api/jobs`)
- POST `/api/jobs` - Create job
- GET `/api/jobs` - Get all jobs (with filters)
- GET `/api/jobs/:id` - Get job details
- PUT `/api/jobs/:id` - Update job
- DELETE `/api/jobs/:id` - Delete job
- GET `/api/jobs/employer/jobs` - Get employer's jobs (Protected)

#### Applications (`/api/applications`)
- POST `/api/applications` - Apply for job
- GET `/api/applications` - Get all applications
- GET `/api/applications/user/:userId` - Get user's applications
- GET `/api/applications/job/:jobId` - Get job applications
- PUT `/api/applications/update-status/:id` - Update status
- GET `/api/applications/employer/jobs` - Get job postings with candidates

#### Messages (`/api/messages`)
- POST `/api/messages` - Send message
- GET `/api/messages/:senderId/:receiverId` - Get conversation
- PUT `/api/messages/status` - Update message status
- DELETE `/api/messages/:id` - Delete message

#### Interviews (`/api/interviews`)
- POST `/api/interviews` - Schedule interview
- GET `/api/interviews` - Get all interviews
- GET `/api/interviews/:id` - Get interview details
- PUT `/api/interviews/:id` - Update interview
- DELETE `/api/interviews/:id` - Delete interview

#### Notifications (`/api/notifications`)
- POST `/api/notifications` - Create notification
- GET `/api/notifications` - Get all notifications
- GET `/api/notifications/:id` - Get notification by ID
- DELETE `/api/notifications/:id` - Delete notification

#### Companies (`/api/companies`)
- POST `/api/companies` - Create company
- GET `/api/companies` - Get all companies
- GET `/api/companies/:id` - Get company details
- PUT `/api/companies/:id` - Update company
- DELETE `/api/companies/:id` - Delete company

#### Admin (`/api/admin`)
- GET `/api/admin/users` - Get all users (Admin only)
- PUT `/api/admin/users/:id` - Update user role (Admin only)
- DELETE `/api/admin/users/:id` - Delete user (Admin only)
- GET `/api/admin/jobs` - Get all jobs (Admin only)
- DELETE `/api/admin/jobs/:id` - Delete job (Admin only)

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

The platform supports three user roles with different permissions:

### 1. Job Seeker
- Browse and search jobs
- Apply for jobs
- Manage applications
- Update profile
- Message employers

### 2. Employer
- Post jobs
- View applications
- Message candidates
- Update application status

### 3. Admin
- Full access to all features
- Manage users (CRUD operations)
- Manage jobs (CRUD operations)
- Platform monitoring

## 🔐 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `EMAIL_HOST` | SMTP server host | Yes |
| `EMAIL_PORT` | SMTP server port | Yes |
| `EMAIL_USER` | Email account username | Yes |
| `EMAIL_PASSWORD` | Email account password | Yes |
| `FRONTEND_URL` | Frontend application URL | Yes |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | No |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | No |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | No |

### Frontend Configuration

The frontend uses Vite's environment variables. Create a `.env` file in the `frontend` directory if needed:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## 🔑 Default Admin Credentials

The application automatically creates a default admin user on first startup:

```
Email: admin@workhunt.com
Password: Admin@123
```

**Important**: Change these credentials immediately after first login in production!

## 🛡️ Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Middleware-based route protection
- **Input Validation**: Express-validator for all inputs
- **CORS Configuration**: Controlled cross-origin requests
- **Error Handling**: Centralized error handling middleware
- **SQL Injection Prevention**: Mongoose built-in protection
- **XSS Protection**: React's built-in XSS protection

## 🧪 Testing

### Manual Testing with Swagger
1. Start the backend server
2. Navigate to http://localhost:5000/api/docs
3. Test endpoints directly from the Swagger UI

### Testing with Postman
- Import the API endpoints from the Swagger documentation
- Set up environment variables for base URL and tokens
- Test all CRUD operations

## 🚀 Deployment

### Backend Deployment (Example: Heroku)

```bash
# Install Heroku CLI and login
heroku login

# Create Heroku app
heroku create job-portal-backend

# Add MongoDB Atlas as database
# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGO_URI=your_mongo_uri
# Set other environment variables...

# Deploy
git push heroku main
```

### Frontend Deployment (Example: Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow the prompts to complete deployment
```

### Environment Configuration for Production

- Update `FRONTEND_URL` in backend .env to point to your deployed frontend
- Update `VITE_API_URL` in frontend to point to your deployed backend
- Ensure MongoDB is accessible from your hosting provider
- Use environment variables for all sensitive data

## 🐛 Troubleshooting

### Common Issues

**Backend not starting**
- Ensure MongoDB is running
- Check if port 5000 is available
- Verify all environment variables are set

**Frontend not connecting to backend**
- Check if backend is running on port 5000
- Verify CORS settings in backend
- Check browser console for errors

**Database connection errors**
- Verify MongoDB URI is correct
- Ensure MongoDB service is running
- Check network connectivity for MongoDB Atlas

**Authentication issues**
- Clear browser localStorage
- Check if JWT_SECRET is set
- Verify token is being sent in headers

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow ESLint rules configured in the project
- Use meaningful variable and function names
- Add comments for complex logic
- Update documentation for new features


## 👨‍💻 Authors

- Your Name - Yugeshwaran G

## 🙏 Acknowledgments

- Thanks to all contributors who helped with this project
- Inspired by modern job portal platforms
- Built with love using the MERN stack

## 📞 Support

For support, email yugeshwarangm@gmail.com or open an issue in the GitHub repository.

---

**Made with ❤️ by Job Portal Team**
