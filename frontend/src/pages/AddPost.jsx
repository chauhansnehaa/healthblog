import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import './PostForm.css';

const AddPost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    status: 'Draft',
  });

  // Predefined Health Categories
  const predefinedCategories = [
    'General Health',
    'Nutrition & Diet',
    'Fitness & Exercise',
    'Mental Health',
    'Heart Health',
    'Diabetes Care',
    'Skin Care',
    "Women's Health",
    "Men's Health",
    'Child Health',
    'Preventive Care',
    'Lifestyle & Wellness',
    'Medical News',
    'Doctor Advice',
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');

      // Extract category names from API
      const apiCategories = response.data.map(cat => cat.name);

      // Merge predefined + API categories & remove duplicates
      const mergedCategories = [
        ...new Set([...predefinedCategories, ...apiCategories])
      ];

      setCategories(mergedCategories);
    } catch (err) {
      console.error('Failed to fetch categories', err);

      // Fallback to predefined categories
      setCategories(predefinedCategories);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        setError('Title and content are required');
        setLoading(false);
        return;
      }

      const response = await axiosInstance.post('/posts', formData);
      navigate(`/post/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
      setLoading(false);
    }
  };

  return (
    <div className="post-form-container">
      <div className="container">
        <div className="post-form-header">
          <h1>✍️ Write New Article</h1>
          <p>Share your medical insights with our community</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="post-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Article Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter an engaging title"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">
                    Select a category
                  </option>

                  {categories.map((cat, index) => (
                    <option
                      key={index}
                      value={cat}
                    >
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Draft">📝 Draft</option>
                  <option value="Published">📰 Published</option>
                </select>
              </div>
            </div>

            {/* <div className="form-group">
              <label>Summary</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Brief summary of your article (optional)"
                rows="2"
              />
            </div> */}

            <div className="form-group">
              <label>Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your full article here..."
                rows="12"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/doctor-dashboard')}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
               {loading
                  ? 'Publishing...'
                  : formData.status === 'Draft'
                  ? 'Save Draft'
                  : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
