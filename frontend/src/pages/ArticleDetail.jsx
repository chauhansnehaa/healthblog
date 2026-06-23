import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import './ArticleDetail.css';

const API_BASE = 'http://localhost:8080';

// Shows author photo or their initial — never breaks
const AuthorAvatar = ({ profilePicture, name, size = 60 }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [profilePicture]);

  const hasPhoto =
    !failed &&
    profilePicture &&
    profilePicture !== 'default.jpg';

  if (hasPhoto) {
    return (
      <img
        key={profilePicture}
        src={`${API_BASE}/uploads/${profilePicture}`}
        alt={name}
        className="large-avatar"
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className="large-avatar-placeholder"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
};

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchPost(); }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`);
      setPost(response.data);
    } catch (err) {
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await axiosInstance.delete(`/posts/${id}`);
        navigate('/home');
      } catch (err) {
        setError('Failed to delete article');
      }
    }
  };

  if (loading) return <div className="loading">Loading article...</div>;
  if (error)   return <div className="error-message" style={{ margin: 40 }}>{error}</div>;
  if (!post)   return <div className="error-message" style={{ margin: 40 }}>Article not found</div>;

  const isAuthor = user?.userId === post.authorId;
  const createdDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <article className="article-detail-container">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-link">
          ← Go Back
        </button>

        <div className="article-header">
          <h1>{post.title}</h1>

          <div className="article-meta">
            <div className="author-section">
              {/* ✅ Real author picture, no broken image */}
              <AuthorAvatar
                profilePicture={post.authorProfilePicture}
                name={post.authorName}
                size={60}
              />
              <div>
                <div className="author-name">Dr. {post.authorName}</div>
                <div className="article-date">{createdDate}</div>
              </div>
            </div>

            {post.category && (
              <span className="category-tag">📁 {post.category}</span>
            )}
          </div>

          <div className="article-status">
            {post.status === 'Draft'     && <span className="badge badge-warning">Draft</span>}
            {post.status === 'Published' && <span className="badge badge-success">Published</span>}
          </div>
        </div>

        {isAuthor && (
          <div className="article-actions">
            <button onClick={() => navigate(`/edit-post/${post.id}`)} className="btn btn-primary">
              ✏️ Edit
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              🗑️ Delete
            </button>
          </div>
        )}

        <div className="article-content">
          {post.summary && (
            <div className="article-summary">
              <strong>Summary</strong>
              <p>{post.summary}</p>
            </div>
          )}
          <div className="article-body">
            {post.content.split('\n').map((paragraph, index) =>
              paragraph.trim() ? <p key={index}>{paragraph}</p> : null
            )}
          </div>
        </div>

        <div className="article-footer">
          <div className="article-info">
            <span>📅 {createdDate}</span>
            <span>👨‍⚕️ Dr. {post.authorName} (@{post.authorUsername})</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;
