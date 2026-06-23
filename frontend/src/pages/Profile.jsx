import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import './Profile.css';

const API_BASE = 'http://localhost:8080';

// Build the full URL for a profile picture filename - stable helper
const buildImageUrl = (filename) => {
  if (!filename || filename === 'default.jpg') return null;
  return `${API_BASE}/uploads/${filename}`;
};

const Profile = () => {
  const { user, updateUser } = useAuth();

  // ✅ Key fix: image URL lives in local state - never recalculated from user context
  const [displayedImgUrl, setDisplayedImgUrl] = useState(
    () => buildImageUrl(user?.profilePicture)
  );
  const [imgFailed, setImgFailed] = useState(false);
  const [preview, setPreview] = useState(null);       // base64 for local preview
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // ✅ onError only runs once per image - flip flag, never loop
  const handleImgError = useCallback(() => {
    setImgFailed(true);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (jpg, png, gif, webp)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be under 5MB');
      return;
    }

    setSelectedFile(file);

    // Show local preview via FileReader
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axiosInstance.post('/users/upload-profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newFilename = response.data.profilePicture;
      const newUrl = buildImageUrl(newFilename);

      // ✅ Update image URL in local state - no context re-render cascade
      setDisplayedImgUrl(newUrl);
      setImgFailed(false);
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // ✅ updateUser only patches the profilePicture field - no blinking
      updateUser({ profilePicture: newFilename });

      setSuccess('Profile picture updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Make sure the backend is running.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelPreview = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setError('');
  };

  // Decide what src the main avatar img shows
  const avatarSrc = preview
    ? preview                            // local preview after file select
    : (!imgFailed && displayedImgUrl)
      ? displayedImgUrl                  // uploaded image from server
      : null;                            // show placeholder

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-card">
          <h1>👤 My Profile</h1>

          {error   && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* ── Profile Picture ─────────────────────────────────────── */}
          <div className="profile-picture-section">
            <div className="picture-wrapper">
              {avatarSrc ? (
                <img
                  key={avatarSrc}            /* ✅ key forces fresh mount, no onError loop */
                  src={avatarSrc}
                  alt={user?.firstName}
                  className="profile-picture-large"
                  onError={handleImgError}
                />
              ) : (
                <div className="avatar-placeholder">
                  {user?.firstName?.[0]?.toUpperCase() || '?'}
                </div>
              )}

              <div className="picture-overlay" onClick={() => fileInputRef.current?.click()}>
                <span className="camera-icon">📷</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {/* Show action buttons only when a file has been chosen */}
            {preview && (
              <div className="upload-actions">
                <button
                  onClick={handleUpload}
                  className="btn btn-success"
                  disabled={uploading}
                >
                  {uploading ? '⏳ Uploading...' : '✅ Confirm Upload'}
                </button>
                <button
                  onClick={handleCancelPreview}
                  className="btn btn-outline-danger"
                  disabled={uploading}
                >
                  ✕ Cancel
                </button>
              </div>
            )}

            {!preview && (
              <button
                className="btn btn-outline"
                onClick={() => fileInputRef.current?.click()}
                style={{ marginTop: 12 }}
              >
                📷 Change Photo
              </button>
            )}

            <p className="upload-hint">JPG, PNG, GIF or WEBP · Max 5 MB</p>
          </div>

          {/* ── User Information ─────────────────────────────────────── */}
          <div className="profile-info">
            <div className="info-section">
              <h2>Personal Information</h2>

              <div className="info-row">
                <label>Full Name</label>
                <p className="info-value">{user?.firstName} {user?.lastName}</p>
              </div>

              <div className="info-row">
                <label>Username</label>
                <p className="info-value">@{user?.username}</p>
              </div>

              <div className="info-row">
                <label>Email Address</label>
                <p className="info-value">{user?.email}</p>
              </div>

              <div className="info-row">
                <label>Role</label>
                <p className="info-value">
                  <span
                    className="badge"
                    style={{
                      backgroundColor: user?.userType === 'Doctor' ? '#dbeafe' : '#dcfce7',
                      color:           user?.userType === 'Doctor' ? '#0c2d6b' : '#166534',
                    }}
                  >
                    {user?.userType === 'Doctor' ? '👨‍⚕️ Doctor' : '👤 Patient'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="profile-footer">
            <p className="help-text">
              💡 Hover over your photo and click to change it
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

