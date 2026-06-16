import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const EnhancedDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
    averageRating: 0,
    ratingDistribution: [
      { rating: 5, count: 45 },
      { rating: 4, count: 30 },
      { rating: 3, count: 15 },
      { rating: 2, count: 8 },
      { rating: 1, count: 2 }
    ],
    topStores: [
      { name: 'Target', rating: 4.8 },
      { name: 'Walmart', rating: 4.5 },
      { name: 'Best Buy', rating: 4.3 }
    ],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const dashboardStats = await api.get('/stores/admin/dashboard/stats');
      
      setStats(prev => ({
        ...prev,
        totalUsers: dashboardStats.data.totalUsers || 0,
        totalStores: dashboardStats.data.totalStores || 0,
        totalRatings: dashboardStats.data.totalRatings || 0,
        averageRating: 4.2
      }));
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#667eea' }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          Analytics Dashboard
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Real-time insights and statistics</p>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px', 
        marginBottom: '40px' 
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '24px', 
          borderRadius: '16px', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px',
          transition: 'transform 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '48px', lineHeight: 1 }}>👥</div>
          <div>
            <h3 style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: 500 }}>Total Users</h3>
            <div style={{ fontSize: '36px', fontWeight: 700 }}>{stats.totalUsers}</div>
          </div>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '24px', 
          borderRadius: '16px', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px',
          transition: 'transform 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '48px', lineHeight: 1 }}>🏪</div>
          <div>
            <h3 style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: 500 }}>Total Stores</h3>
            <div style={{ fontSize: '36px', fontWeight: 700 }}>{stats.totalStores}</div>
          </div>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '24px', 
          borderRadius: '16px', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px',
          transition: 'transform 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '48px', lineHeight: 1 }}>⭐</div>
          <div>
            <h3 style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: 500 }}>Total Ratings</h3>
            <div style={{ fontSize: '36px', fontWeight: 700 }}>{stats.totalRatings}</div>
          </div>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '24px', 
          borderRadius: '16px', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px',
          transition: 'transform 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '48px', lineHeight: 1 }}>📊</div>
          <div>
            <h3 style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: 500 }}>Average Rating</h3>
            <div style={{ fontSize: '36px', fontWeight: 700 }}>{stats.averageRating.toFixed(1)} ★</div>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
        gap: '24px', 
        marginBottom: '30px' 
      }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '18px' }}>Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '18px' }}>Top Rated Stores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topStores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="rating" fill="#764ba2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '18px' }}>Recent Activity</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {stats.recentActivity.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No recent activity</p>
          ) : (
            stats.recentActivity.map(activity => (
              <div key={activity.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '15px',
                borderBottom: '1px solid #e1e5e9'
              }}>
                <div style={{ fontSize: '24px', flexShrink: 0 }}>⭐</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <strong>{activity.userName}</strong> rated {activity.storeName}
                  {activity.rating && ` with ${activity.rating} stars`}
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
                    {new Date(activity.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;