import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/stores/admin/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="number">{stats.totalUsers}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Stores</h3>
          <div className="number">{stats.totalStores}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Ratings</h3>
          <div className="number">{stats.totalRatings}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;