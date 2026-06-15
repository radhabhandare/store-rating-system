import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const OwnerDashboard = () => {
  const [data, setData] = useState({
    store: null,
    ratings: [],
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await api.get('/ratings/owner/ratings');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>Store Owner Dashboard</h1>
      
      {data.store && (
        <>
          <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '14px', opacity: 0.9 }}>Store Name</h3>
                <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{data.store.name}</p>
              </div>
              <div>
                <h3 style={{ fontSize: '14px', opacity: 0.9 }}>Average Rating</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{parseFloat(data.averageRating).toFixed(1)} ★</p>
              </div>
              <div>
                <h3 style={{ fontSize: '14px', opacity: 0.9 }}>Total Ratings</h3>
                <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{data.ratings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>User Ratings</h3>
            
            {data.ratings.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>No ratings yet. Share your store with customers!</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Rating</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ratings.map(rating => (
                      <tr key={rating.id}>
                        <td><strong>{rating.name}</strong></td>
                        <td>{rating.email}</td>
                        <td>
                          <span style={{ color: '#ffc107', fontSize: '18px' }}>★</span>
                          <strong> {rating.rating}</strong>
                        </td>
                        <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;