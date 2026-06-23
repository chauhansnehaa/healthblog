import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

const API_BASE = 'http://localhost:8080';

const AuthorAvatar = ({ profilePicture, name }) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [profilePicture]);

  const hasPhoto = !failed && profilePicture && profilePicture !== 'default.jpg';

  if (hasPhoto) {
    return (
      <img
        key={profilePicture}
        src={`${API_BASE}/uploads/${profilePicture}`}
        alt={name}
        className="author-avatar"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="author-avatar-letter">
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
};

const PostCard = ({
  post,
  onDelete,
  showAuthor  = true,
  showActions = false,
  currentUserId = null,   // ✅ compare with post.authorId (numbers match numbers)
}) => {

  // ✅ Only show Edit/Delete when:
  //    1. parent says actions are allowed (showActions)
  //    2. the logged-in user is the actual author of this specific post
  const canEditDelete = showActions && Number(currentUserId) === Number(post.authorId);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post.id);
    }
  };

  const createdDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div className="post-card">
      {/* Title + status badge */}
      <div className="post-header">
        <h3 className="post-title">
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h3>
        <div className="post-badges">
          {post.status === 'Draft'     && <span className="badge badge-warning">Draft</span>}
          {post.status === 'Published' && <span className="badge badge-success">Published</span>}
        </div>
      </div>

      {/* Author row */}
      {showAuthor && (
        <div className="post-meta">
          <div className="author-info">
            <AuthorAvatar
              profilePicture={post.authorProfilePicture}
              name={post.authorName}
            />
            <div>
              <div className="author-name">{post.authorName}</div>
              <div className="post-date">{createdDate}</div>
            </div>
          </div>
        </div>
      )}

      {/* Category */}
      {post.category && (
        <div className="post-category">📁 {post.category}</div>
      )}

      {/* Summary / excerpt */}
      <p className="post-summary">
        {post.summary || (post.content?.substring(0, 120) + '…')}
      </p>

      {/* Footer */}
      <div className="post-footer">
        <Link to={`/post/${post.id}`} className="btn btn-outline read-more-btn">
          Read More
        </Link>

        {/* ✅ Edit/Delete only rendered when user owns the post */}
        {canEditDelete && (
          <div className="post-actions">
            <Link to={`/edit-post/${post.id}`} className="btn btn-primary">
              ✏️ Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;