import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import RatingModal from './RatingModal';

const StoreListing = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await api.get('/stores');
      const storesWithRatings = await Promise.all(
        response.data.map(async (store) => {
          try {
            const detailsResponse = await api.get(`/stores/${store.id}`);
            return { ...store, user_rating: detailsResponse.data.user_rating || null };
          } catch {
            return { ...store, user_rating: null };
          }
        })
      );
      setStores(storesWithRatings);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRateStore = (store) => {
    setSelectedStore(store);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (rating) => {
    try {
      await api.post('/ratings', {
        storeId: selectedStore.id,
        rating: rating
      });
      await fetchStores();
      setShowRatingModal(false);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      alert('Failed to submit rating');
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading stores...</div>;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <h1>Browse Stores</h1>
        <p style={{ color: '#666' }}>Rate and review your favorite stores</p>
      </div>
      
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by store name or address..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ gridColumn: 'span 2', padding: '12px', fontSize: '16px' }}
        />
      </div>
      
      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Address</th>
              <th>Overall Rating</th>
              <th>Your Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map(store => (
              <tr key={store.id}>
                <td><strong>{store.name}</strong></td>
                <td>{store.address}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ color: '#ffc107', fontSize: '18px' }}>★</span>
                    <strong>{parseFloat(store.overall_rating).toFixed(1)}</strong>
                    <span style={{ color: '#666', fontSize: '12px' }}>({store.total_ratings})</span>
                  </div>
                </td>
                <td>
                  {store.user_rating ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ color: '#ffc107', fontSize: '16px' }}>★</span>
                      <span>{store.user_rating}</span>
                    </div>
                  ) : (
                    <span style={{ color: '#999' }}>Not rated</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleRateStore(store)}
                    style={{ padding: '6px 16px', fontSize: '13px' }}
                  >
                    {store.user_rating ? 'Update Rating' : 'Rate Store'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showRatingModal && selectedStore && (
        <RatingModal
          store={selectedStore}
          currentRating={selectedStore.user_rating}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
};

export default StoreListing;