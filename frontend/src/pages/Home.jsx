import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import PostCard from '../components/PostCard';
import './Home.css';

// ─────────────────────────────────────────────────────────────
//  DOCTOR VIEW
//  Top-level tabs: "All Articles"  |  "My Articles"
//  Under "My Articles": Published sub-toggle | Drafts sub-toggle
// ─────────────────────────────────────────────────────────────
const DoctorHome = ({ user }) => {
  const navigate = useNavigate();

  // 'all' shows every published post (read-only)
  // 'mine' shows only this doctor's posts (editable)
  const [activeTab, setActiveTab] = useState('all');
  const [showDrafts, setShowDrafts] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [activeTab, showDrafts]);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      let endpoint;
      if (activeTab === 'all') {
        endpoint = '/posts';                          // every published post
      } else {
        endpoint = showDrafts
          ? '/posts/drafts/my'                        // only MY drafts
          : '/posts/my/published';                    // only MY published
      }
      const res = await axiosInstance.get(endpoint);
      setPosts(res.data);
    } catch {
      setError('Failed to fetch posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch {
      setError('Failed to delete post.');
    }
  };

  const switchMainTab = (tab) => {
    setActiveTab(tab);
    setShowDrafts(false);   // reset sub-toggle when switching main tabs
  };

  return (
    <div className="home-container">
      <div className="container">

        {/* ── Header ─────────────────────────────── */}
        <div className="home-header">
          <div>
            <h1>Welcome, Dr. {user?.firstName}! 👨‍⚕️</h1>
            <p>Read every article, manage only your own</p>
          </div>
          <button onClick={() => navigate('/add-post')} className="btn btn-primary btn-lg">
            ✍️ Write New Article
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* ── Main tabs ──────────────────────────── */}
        <div className="main-tabs">
          <button
            className={`main-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => switchMainTab('all')}
          >
            🌐 All Articles
          </button>
          <button
            className={`main-tab-btn ${activeTab === 'mine' ? 'active' : ''}`}
            onClick={() => switchMainTab('mine')}
          >
            👨‍⚕️ My Articles
          </button>
        </div>

        {/* ── Sub-toggle (only visible under "My Articles") ── */}
        {activeTab === 'mine' && (
          <div className="dashboard-controls">
            <button
              className={`toggle-btn ${!showDrafts ? 'active' : ''}`}
              onClick={() => setShowDrafts(false)}
            >
              📰 My Published
            </button>
            <button
              className={`toggle-btn ${showDrafts ? 'active' : ''}`}
              onClick={() => setShowDrafts(true)}
            >
              📝 My Drafts
            </button>
          </div>
        )}

        {/* ── Description line ───────────────────── */}
        <p className="tab-description">
          {activeTab === 'all'
            ? 'Showing all published articles from every doctor — read-only view.'
            : showDrafts
              ? 'Showing your draft articles — only you can see these.'
              : 'Showing your published articles — visible to everyone.'}
        </p>

        {loading && <div className="loading">Loading posts…</div>}

        {!loading && posts.length === 0 && (
          <div className="empty-state">
            <p>
              {activeTab === 'all'
                ? 'No articles published yet.'
                : showDrafts
                  ? 'You have no drafts. Start writing!'
                  : 'You have no published articles yet.'}
            </p>
            {activeTab === 'mine' && (
              <button onClick={() => navigate('/add-post')} className="btn btn-primary">
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
              showAuthor={activeTab === 'all'}   // show author only in "All" tab
              // ✅ Edit/Delete only appear in "My Articles" tab
              showActions={activeTab === 'mine'}
              currentUserId={user?.userId}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
//  PATIENT VIEW
//  All published articles with category filter
// ─────────────────────────────────────────────────────────────
const PatientHome = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = selectedCategory
        ? `/categories/${selectedCategory}/posts`
        : '/posts';
      const res = await axiosInstance.get(endpoint);
      setPosts(res.data);
    } catch {
      setError('Failed to fetch articles.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/categories');
      setCategories(res.data);
    } catch {
      console.error('Failed to fetch categories');
    }
  };

  return (
    <div className="home-container">
      <div className="container">
        <div className="home-header">
          <div>
            <h1>🏠 Welcome, {user?.firstName}!</h1>
            <p>Discover health insights from our expert doctors</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="category-filter">
          <button
            className={`filter-btn ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Articles
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              📁 {cat.name}
            </button>
          ))}
        </div>

        {loading && <div className="loading">Loading articles…</div>}

        {!loading && posts.length === 0 && (
          <div className="empty-state">
            <p>No articles available{selectedCategory ? ' in this category' : ''} yet.</p>
          </div>
        )}

        <div className="posts-grid">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              showAuthor={true}
              showActions={false}    // patients can never edit
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
//  Root: pick the right view based on role
// ─────────────────────────────────────────────────────────────
const Home = () => {
  const { user } = useAuth();

  if (user?.userType === 'Doctor') return <DoctorHome user={user} />;
  return <PatientHome user={user} />;
};

export default Home;