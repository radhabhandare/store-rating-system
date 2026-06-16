import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../../services/api';

const EnhancedDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
    averageRating: 0,
    newUsersWeek: 0,
    newRatingsWeek: 0,
    totalOwners: 0,
    ratingDistribution: [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
      { rating: 3, count: 0 },
      { rating: 2, count: 0 },
      { rating: 1, count: 0 }
    ],
    topStores: [],
    recentActivity: [],
    ratingTrends: [],
    categoryDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch dashboard stats
      const dashboardStats = await api.get('/stores/admin/dashboard/stats');
      
      // Fetch rating distribution
      const ratingDist = await api.get('/analytics/rating-distribution').catch(() => ({ data: stats.ratingDistribution }));
      
      // Fetch top stores
      const topStores = await api.get('/analytics/top-stores').catch(() => ({ data: [] }));
      
      // Fetch rating trends
      const trends = await api.get('/analytics/trends').catch(() => ({ data: [] }));
      
      // Fetch recent activity
      const activity = await api.get('/analytics/recent-activity').catch(() => ({ data: [] }));
      
      // Fetch category distribution
      const categories = await api.get('/analytics/category-stats').catch(() => ({ data: [] }));
      
      setStats(prev => ({
        ...prev,
        totalUsers: dashboardStats.data.totalUsers || 0,
        totalStores: dashboardStats.data.totalStores || 0,
        totalRatings: dashboardStats.data.totalRatings || 0,
        averageRating: dashboardStats.data.averageRating || 4.2,
        ratingDistribution: ratingDist.data.length > 0 ? ratingDist.data : prev.ratingDistribution,
        topStores: topStores.data || [],
        ratingTrends: trends.data || [],
        recentActivity: activity.data || [],
        categoryDistribution: categories.data || []
      }));
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#667eea', fontSize: '18px' }}>Loading dashboard...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px', 
        background: 'white', 
        borderRadius: '16px', 
        margin: '20px' 
      }}>
        <p style={{ color: '#dc3545', marginBottom: '20px', fontSize: '18px' }}>{error}</p>
        <button className="btn btn-primary" onClick={fetchAllStats}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '32px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '5px'
          }}>
            Analytics Dashboard
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>Real-time insights and statistics</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-primary" 
            onClick={fetchAllStats}
            style={{ padding: '8px 20px' }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '20px', 
          borderRadius: '16px', 
          color: 'white',
          transition: 'transform 0.3s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '36px' }}>👥</div>
            <div>
              <h3 style={{ fontSize: '13px', opacity: 0.9, marginBottom: '5px', fontWeight: 500 }}>Total Users</h3>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>{stats.totalUsers}</div>
              {stats.newUsersWeek > 0 && (
                <small style={{ opacity: 0.9, fontSize: '12px' }}>+{stats.newUsersWeek} this week</small>
              )}
            </div>
          </div>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          padding: '20px', 
          borderRadius: '16px', 
          color: 'white',
          transition: 'transform 0.3s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '36px' }}>🏪</div>
            <div>
              <h3 style={{ fontSize: '13px', opacity: 0.9, marginBottom: '5px', fontWeight: 500 }}>Total Stores</h3>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>{stats.totalStores}</div>
              <small style={{ opacity: 0.9, fontSize: '12px' }}>{stats.totalOwners || 0} store owners</small>
            </div>
          </div>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
          padding: '20px', 
          borderRadius: '16px', 
          color: 'white',
          transition: 'transform 0.3s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '36px' }}>⭐</div>
            <div>
              <h3 style={{ fontSize: '13px', opacity: 0.9, marginBottom: '5px', fontWeight: 500 }}>Total Ratings</h3>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>{stats.totalRatings}</div>
              {stats.newRatingsWeek > 0 && (
                <small style={{ opacity: 0.9, fontSize: '12px' }}>+{stats.newRatingsWeek} this week</small>
              )}
            </div>
          </div>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
          padding: '20px', 
          borderRadius: '16px', 
          color: 'white',
          transition: 'transform 0.3s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '36px' }}>📊</div>
            <div>
              <h3 style={{ fontSize: '13px', opacity: 0.9, marginBottom: '5px', fontWeight: 500 }}>Average Rating</h3>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>{stats.averageRating.toFixed(1)} ★</div>
              <small style={{ opacity: 0.9, fontSize: '12px' }}>Across all stores</small>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
        gap: '24px', 
        marginBottom: '30px' 
      }}>
        {/* Rating Distribution */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '18px' }}>Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#667eea" name="Number of Ratings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Rated Stores */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '18px' }}>Top Rated Stores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topStores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="rating" fill="#764ba2" name="Average Rating" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
        gap: '24px', 
        marginBottom: '30px' 
      }}>
        {/* Rating Trends */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '18px' }}>Rating Trends (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.ratingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="count" stroke="#667eea" fill="#667eea" name="Total Ratings" />
              <Area yAxisId="right" type="monotone" dataKey="avg_rating" stroke="#764ba2" fill="#764ba2" name="Average Rating" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '18px' }}>Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={entry => `${entry.category || entry.name}: ${entry.count}`}
                outerRadius={100}
                dataKey="count"
                nameKey="category"
              >
                {stats.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#333', fontSize: '18px' }}>Recent Activity</h3>
          <span style={{ color: '#666', fontSize: '14px' }}>Latest updates from users</span>
        </div>
        
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {stats.recentActivity.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
              <p>No recent activity to display</p>
            </div>
          ) : (
            stats.recentActivity.map((activity, index) => (
              <div 
                key={activity.id || index} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '12px 15px',
                  borderBottom: index < stats.recentActivity.length - 1 ? '1px solid #e1e5e9' : 'none',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ 
                  fontSize: '28px', 
                  flexShrink: 0,
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f0f0f0',
                  borderRadius: '50%'
                }}>
                  {activity.action === 'RATE' ? '⭐' : 
                   activity.action === 'LOGIN' ? '🔐' : 
                   activity.action === 'REGISTER' ? '👤' : '📌'}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div>
                    <strong style={{ color: '#333' }}>{activity.userName || 'Unknown User'}</strong>
                    <span style={{ color: '#666' }}>
                      {activity.action === 'RATE' ? ' rated ' : 
                       activity.action === 'LOGIN' ? ' logged in' : 
                       activity.action === 'REGISTER' ? ' registered' : ' performed action'}
                    </span>
                    {activity.storeName && (
                      <strong style={{ color: '#667eea' }}> {activity.storeName}</strong>
                    )}
                    {activity.rating && (
                      <span style={{ color: '#ffc107' }}> {activity.rating} ★</span>
                    )}
                  </div>
                  {activity.review && (
                    <div style={{ color: '#666', fontSize: '13px', marginTop: '3px' }}>
                      "{activity.review.substring(0, 60)}{activity.review.length > 60 ? '...' : ''}"
                    </div>
                  )}
                  <small style={{ color: '#999', fontSize: '11px', marginTop: '3px' }}>
                    {formatDate(activity.createdAt)}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
          .charts-row {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedDashboard;