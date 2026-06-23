import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Dashboard Pages
import Home from './pages/Home';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Profile from './pages/Profile';

// Post Pages
import AddPost from './pages/AddPost';
import EditPost from './pages/EditPost';
import ArticleDetail from './pages/ArticleDetail';
import CategoryView from './pages/CategoryView';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Home - For all authenticated users */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Profile - For all authenticated users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Home Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected Routes - Doctor Only */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute requiredRole="Doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-post"
            element={
              <ProtectedRoute requiredRole="Doctor">
                <AddPost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-post/:id"
            element={
              <ProtectedRoute requiredRole="Doctor">
                <EditPost />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Patient Only */}
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute requiredRole="Patient">
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Both Roles */}
          <Route
            path="/post/:id"
            element={
              <ProtectedRoute>
                <ArticleDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/category/:name"
            element={
              <ProtectedRoute>
                <CategoryView />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
