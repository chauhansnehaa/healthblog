# HealthBlog - Doctor-Patient Medical Blog Platform

A full-stack web application built with **Spring Boot**, **React**, and **MySQL/H2** database. This platform allows doctors to create and manage health articles while patients can read and explore medical content.

## 📋 Project Overview

### Features
✅ **User Authentication** - Secure JWT-based login/signup for Doctors and Patients
✅ **Doctor Dashboard** - Create, edit, publish, and save draft articles
✅ **Patient Dashboard** - Read published articles, filter by categories
✅ **Categories** - Organize articles by medical categories
✅ **Article Management** - Full CRUD operations on posts
✅ **Role-Based Access** - Different features for doctors vs patients
✅ **Responsive Design** - Works on desktop and mobile devices

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java 17+** - Download from [java.oracle.com](https://www.oracle.com/java/technologies/downloads/)
- **Node.js 16+** - Download from [nodejs.org](https://nodejs.org/)
- **Maven** - Included with Spring Boot starter, or install separately from [maven.apache.org](https://maven.apache.org/)

---

## 🔧 Backend Setup (Spring Boot)

### 1. Navigate to Backend Directory
```bash
cd healthblog/backend
```

### 2. Install Dependencies
Maven will download dependencies automatically when you build/run.

### 3. Run the Backend Server
```bash
# Using Maven wrapper (recommended - no need to install Maven)
./mvnw spring-boot:run

# OR if Maven is installed globally
mvn spring-boot:run

# OR using IDE
# - Open in IntelliJ IDEA / Eclipse
# - Right-click HealthBlogApplication.java → Run
```

### Expected Output
```
Started HealthBlogApplication in 5.123 seconds
Tomcat started on port(s): 8080 with context path ''
```

### 4. Access Backend
- **API Base URL**: `http://localhost:8080/api`
- **H2 Database Console**: `http://localhost:8080/h2-console`

### Database Configuration
- **Type**: H2 (file-based, no setup needed)
- **Location**: `./data/healthblog` directory
- **Auto-migrations**: Enabled (schema created automatically)

---

## 🎨 Frontend Setup (React + Vite)

### 1. Navigate to Frontend Directory
```bash
cd healthblog/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

### Expected Output
```
VITE v5.0.0 ready in 120 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### 4. Access Frontend
- **Application URL**: `http://localhost:5173`
- **Live Reload**: Enabled (changes auto-refresh)

---

## 📝 API Endpoints Reference

### Authentication
```
POST /api/auth/signup     - Register new user
POST /api/auth/login      - Login user (returns JWT token)
```

### Posts (Articles)
```
GET    /api/posts                 - Get all published posts
GET    /api/posts/{id}            - Get single post
POST   /api/posts                 - Create post (auth required)
PUT    /api/posts/{id}            - Update post (author only)
DELETE /api/posts/{id}            - Delete post (author only)
GET    /api/posts/my/published    - Get my published posts
GET    /api/posts/drafts/my       - Get my draft posts
```

### Categories
```
GET  /api/categories              - Get all categories
POST /api/categories              - Create category
GET  /api/categories/{name}/posts - Get posts by category
```

---

## 👥 User Roles & Features

### 👨‍⚕️ Doctor Account
- Create health articles
- Save articles as drafts or publish immediately
- Edit own articles
- Delete own articles
- View published and draft articles
- Assign categories to articles

**Test Doctor Account**:
- Email: `doctor@example.com` (Create your own in signup)
- Password: Any password you set

### 👤 Patient Account
- View all published articles from doctors
- Read full article content
- Filter articles by categories
- Cannot create or edit articles

**Test Patient Account**:
- Email: `patient@example.com` (Create your own in signup)
- Password: Any password you set

---

## 🔐 Authentication Flow

1. **Signup**: User registers with email, password, and role (Doctor/Patient)
2. **Login**: User logs in with email, password, and role
3. **JWT Token**: Server returns JWT token valid for 24 hours
4. **Request**: Frontend sends token in `Authorization: Bearer {token}` header
5. **Validation**: Backend validates token before processing requests
6. **Expiry**: Token expires in 24 hours, user must login again

### Example Request with Token
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:8080/api/posts
```

---

## 📁 Project Structure

```
healthblog/
├── backend/                    # Spring Boot Application
│   ├── pom.xml               # Maven dependencies
│   ├── src/main/java/com/healthblog/
│   │   ├── model/            # Entity classes (User, Post, Category)
│   │   ├── repository/       # JPA Repositories (data access)
│   │   ├── service/          # Business logic
│   │   ├── controller/       # REST endpoints
│   │   ├── security/         # JWT utilities and filters
│   │   ├── config/           # Spring Security configuration
│   │   └── HealthBlogApplication.java
│   └── src/main/resources/
│       └── application.properties  # DB config, JWT secret
│
├── frontend/                   # React Application
│   ├── package.json          # NPM dependencies
│   ├── vite.config.js        # Vite build config
│   ├── index.html            # Entry HTML
│   └── src/
│       ├── App.jsx           # Main app with routing
│       ├── main.jsx          # React initialization
│       ├── index.css         # Global styles
│       ├── api/
│       │   └── axios.js      # API client with interceptors
│       ├── context/
│       │   └── AuthContext.jsx  # Auth state management
│       ├── pages/
│       │   ├── Login.jsx     # Login page
│       │   ├── Signup.jsx    # Registration page
│       │   ├── DoctorDashboard.jsx
│       │   ├── PatientDashboard.jsx
│       │   ├── AddPost.jsx
│       │   ├── EditPost.jsx
│       │   ├── ArticleDetail.jsx
│       │   └── CategoryView.jsx
│       └── components/
│           ├── Navbar.jsx    # Navigation bar
│           ├── PostCard.jsx  # Post display component
│           └── ProtectedRoute.jsx  # Route protection
```

---

## 🔄 Full Development Workflow

### Terminal Window 1 - Backend
```bash
cd healthblog/backend
./mvnw spring-boot:run
# Wait for: "Started HealthBlogApplication"
```

### Terminal Window 2 - Frontend
```bash
cd healthblog/frontend
npm install          # Run once
npm run dev          # Start Vite dev server
```

### Terminal Window 3 - Optional: Testing API
```bash
# Create a test doctor account
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "userType": "Doctor"
  }'
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Clear Maven cache
rm -rf ~/.m2/repository
./mvnw clean install

# Check Java version
java -version  # Should be 17+

# Kill process on port 8080 if needed
lsof -i :8080
kill -9 <PID>
```

### Frontend won't start
```bash
# Clear Node modules and reinstall
rm -rf node_modules
npm install

# Check Node version
node -v  # Should be 16+

# Kill process on port 5173 if needed
lsof -i :5173
kill -9 <PID>
```

### Cannot login
- Make sure **both backend and frontend** are running
- Check that your email/password are correct
- Verify user role (Doctor/Patient) matches
- Check browser console for error messages

### CORS errors
- Backend already configured for CORS at `http://localhost:5173`
- If using different URL, update `app.jwt.secret` in `application.properties`

---

## 🚀 Deployment Guide

### Deploy Backend to Production
1. **Build**: `./mvnw clean package`
2. **Run**: `java -jar target/healthblog-0.0.1-SNAPSHOT.jar`
3. **Database**: Switch to PostgreSQL (modify `application.properties`)
4. **JWT Secret**: Use strong random secret in environment variable
5. **CORS**: Update allowed origins

### Deploy Frontend to Production
1. **Build**: `npm run build`
2. **Output**: Check `dist/` directory
3. **Host**: Deploy on Netlify, Vercel, or any static host
4. **Environment**: Update API_BASE_URL to production backend

---

## 📚 Technologies Used

### Backend
- **Spring Boot 3.2** - Web framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **JJWT 0.12.3** - JWT token management
- **H2 Database** - File-based database
- **Lombok** - Code generation (annotations)
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **Vite 5** - Build tool (fast development)
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling (vanilla CSS, responsive)

---

## 📖 How to Use the Application

### As a Doctor

1. **Sign Up**: Click "Sign Up" → Select "Doctor" → Fill form
2. **Login**: Enter credentials → Select "Doctor" → Login
3. **Write Article**: 
   - Click "✍️ Write" button
   - Fill title, content, select category
   - Choose "Draft" or "Published"
   - Click "Publish Article"
4. **Manage Articles**:
   - View all published articles in dashboard
   - Click "📝 Draft Articles" to see unpublished articles
   - Edit articles: Click "Edit"
   - Delete articles: Click "Delete"
5. **View Single Article**: Click "Read More" on any article

### As a Patient

1. **Sign Up**: Click "Sign Up" → Select "Patient" → Fill form
2. **Login**: Enter credentials → Select "Patient" → Login
3. **Explore Articles**:
   - See all published articles from doctors
   - Click "Read More" to read full article
   - Filter by category using buttons at top
4. **View Author**: Each article shows doctor's name and date

---

## 🔒 Security Features

✅ **Password Hashing** - BCrypt with salt
✅ **JWT Tokens** - 24-hour expiration
✅ **CORS Protection** - Whitelist allowed origins
✅ **Authorization** - Role-based and author-based checks
✅ **HTTPS Ready** - Works with SSL/TLS
✅ **Input Validation** - Server-side validation on all inputs

---

## 📞 Support

For issues or questions:
1. Check browser console for error messages
2. Check backend logs in terminal
3. Verify both backend and frontend are running
4. Check that ports 8080 and 5173 are available
5. Clear browser cache and localStorage if needed

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🎓 Learning Resources

- **Spring Boot**: https://spring.io/projects/spring-boot
- **React Docs**: https://react.dev
- **JWT Guide**: https://jwt.io/introduction
- **REST API Design**: https://restfulapi.net/

---

Happy Coding! 🚀 If you found this helpful, give it a ⭐ on GitHub!
