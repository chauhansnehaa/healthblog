import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import PostCard from '../components/PostCard';
import './Dashboard.css';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      let endpoint = '/posts';
      if (selectedCategory) {
        endpoint = `/categories/${selectedCategory}/posts`;
      }
      
      const response = await axiosInstance.get(endpoint);
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.firstName}! 👤</h1>
            <p>Discover health insights from our expert doctors</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="category-filter">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`filter-btn ${selectedCategory === null ? 'active' : ''}`}
          >
            All Articles
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`filter-btn ${selectedCategory === category.name ? 'active' : ''}`}
            >
              📁 {category.name}
            </button>
          ))}
        </div>

        {loading && <div className="loading">Loading articles...</div>}

        {!loading && posts.length === 0 && (
          <div className="empty-state">
            <p>No articles available in this category yet.</p>
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

export default PatientDashboard;
