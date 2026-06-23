import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import PostCard from '../components/PostCard';
import './ArticleDetail.css';

const CategoryView = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPostsByCategory();
  }, [name]);

  const fetchPostsByCategory = async () => {
    try {
      const response = await axiosInstance.get(`/categories/${name}/posts`);
      setPosts(response.data);
    } catch (err) {
      setError('Failed to load articles in this category');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading articles...</div>;
  }

  return (
    <div className="category-view-container" style={{ padding: '40px 0', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-link">
          ← Go Back
        </button>

        <div className="category-header" style={{
          padding: '40px 0',
          marginBottom: '40px',
          borderBottom: '2px solid var(--border-color)'
        }}>
          <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>
            📁 {name}
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '16px' }}>
            {posts.length} articles in this category
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {posts.length === 0 && !error && (
          <div className="empty-state">
            <p>No articles in this category yet.</p>
          </div>
        )}

        <div className="posts-grid">
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post}
              showAuthor={true}
              showActions={false}
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
