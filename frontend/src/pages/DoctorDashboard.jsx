import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import PostCard from '../components/PostCard';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDrafts, setShowDrafts] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [showDrafts]);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      let endpoint = '/posts';
      if (showDrafts) {
        endpoint = '/posts/drafts/my';
      } else {
        endpoint = '/posts';
      }
      
      const response = await axiosInstance.get(endpoint);
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, Dr. {user?.firstName}! 👨‍⚕️</h1>
            <p>Manage your health articles and insights</p>
          </div>
          <button 
            onClick={() => navigate('/add-post')} 
            className="btn btn-primary btn-lg"
          >
            ✍️ Write New Article
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-controls">
          <button
            onClick={() => setShowDrafts(false)}
            className={`toggle-btn ${!showDrafts ? 'active' : ''}`}
          >
            📰 Published Articles
          </button>
          <button
            onClick={() => setShowDrafts(true)}
            className={`toggle-btn ${showDrafts ? 'active' : ''}`}
          >
            📝 Draft Articles
          </button>
        </div>

        {loading && <div className="loading">Loading posts...</div>}

        {!loading && posts.length === 0 && (
          <div className="empty-state">
            <p>No {showDrafts ? 'draft' : 'published'} articles yet.</p>
            {!showDrafts && (
              <button 
                onClick={() => navigate('/add-post')} 
                className="btn btn-primary"
              >
                Create Your First Article
              </button>
            )}
          </div>
        )}

        <div className="posts-grid">
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post}
              showAuthor={false}
              showActions={true}
              currentUserEmail={user?.email}
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
