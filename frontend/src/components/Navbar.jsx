import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const API_BASE = 'http://localhost:8080';

// Mini avatar that shows photo or letter fallback - no onError loop
const Avatar = ({ user, size = 40 }) => {
  const [failed, setFailed] = useState(false);

  // Reset when profilePicture changes
  useEffect(() => setFailed(false), [user?.profilePicture]);

  const hasPhoto =
    !failed &&
    user?.profilePicture &&
    user.profilePicture !== 'default.jpg';

  const imgUrl = hasPhoto
    ? `${API_BASE}/uploads/${user.profilePicture}`
    : null;

  if (hasPhoto) {
    return (
      <img
        key={imgUrl}
        src={imgUrl}
        alt={user?.firstName}
        className="profile-picture-small"
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
      />
    );
  }

  // Letter fallback - no broken-image requests
  return (
    <div
      className="avatar-letter"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {user?.firstName?.[0]?.toUpperCase() || '?'}
    </div>
  );
};

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to={isAuthenticated ? '/home' : '/login'} className="nav-logo">
            🏥 HealthBlog
          </Link>

          {isAuthenticated ? (
            <div className="nav-menu">
              <Link to="/home" className="nav-link">
                🏠 Home
              </Link>

              {user?.userType === 'Doctor' && (
                <Link to="/add-post" className="nav-link">
                  ✍️ Write
                </Link>
              )}

              <Link to="/profile" className="profile-link">
                <Avatar user={user} size={40} />
                <span className="profile-tooltip">{user?.firstName}</span>
              </Link>

              <button onClick={handleLogout} className="nav-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-menu">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
