import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EnhancedStoreListing = () => {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minRating: 0,
    sortBy: 'rating'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStores();
    fetchCategories();
  }, [filters]);

  const fetchStores = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      
      const response = await api.get(`/stores?${params}`);
      
      const processedStores = (response.data || []).map(store => ({
        ...store,
        overall_rating: parseFloat(store.overall_rating) || 0,
        total_ratings: parseInt(store.total_ratings) || 0
      }));
      
      setStores(processedStores);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      setError('Failed to load stores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/stores/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([
        { id: 1, name: 'Grocery', icon: '🛒' },
        { id: 2, name: 'Electronics', icon: '📱' },
        { id: 3, name: 'Fashion', icon: '👕' },
        { id: 4, name: 'Restaurant', icon: '🍔' },
        { id: 5, name: 'Coffee Shop', icon: '☕' },
        { id: 6, name: 'Bookstore', icon: '📚' },
        { id: 7, name: 'Pharmacy', icon: '💊' },
        { id: 8, name: 'Fitness', icon: '💪' }
      ]);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const getRatingValue = (rating) => {
    if (rating === null || rating === undefined) return 0;
    const num = parseFloat(rating);
    return isNaN(num) ? 0 : num;
  };

  const StoreCard = ({ store }) => {
    const avgRating = getRatingValue(store.overall_rating);
    const totalRatings = store.total_ratings || 0;
    
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
      }}>
        <div style={{
          position: 'relative',
          height: '200px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #e0e5ec 0%, #f5f6fa 100%)'
        }}>
          <img 
            src="/default-store.jpg" 
            alt={store.name || 'Store'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23e0e5ec"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-size="40"%3E🏪%3C/text%3E%3C/svg%3E';
            }}
          />
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.75)',
            color: '#ffc107',
            padding: '6px 12px',
            borderRadius: '20px',
            fontWeight: '700',
            fontSize: '14px',
            backdropFilter: 'blur(4px)'
          }}>
            {avgRating > 0 ? avgRating.toFixed(1) : 'New'} ★
          </div>
          {store.category && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'rgba(102, 126, 234, 0.9)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              backdropFilter: 'blur(4px)'
            }}>
              {store.category}
            </div>
          )}
        </div>
        <div style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>{store.name || 'Unnamed Store'}</h3>
          <div style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
            📍 {store.address || 'Address not available'}
          </div>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '14px', color: '#666', flexWrap: 'wrap' }}>
            <span>⭐ {avgRating > 0 ? avgRating.toFixed(1) : 'No ratings'}</span>
            <span>📊 {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}</span>
          </div>
          {store.description && (
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', marginBottom: '15px' }}>
              {store.description.substring(0, 100)}
              {store.description.length > 100 ? '...' : ''}
            </p>
          )}
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = `/store/${store.id}`}
            style={{ width: '100%' }}
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  const StoreListItem = ({ store }) => {
    const avgRating = getRatingValue(store.overall_rating);
    const totalRatings = store.total_ratings || 0;
    
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        background: 'white',
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(5px)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
      }}>
        <img 
          src="/default-store.jpg" 
          alt={store.name || 'Store'}
          width="80" 
          height="80"
          style={{ borderRadius: '8px', objectFit: 'cover', background: '#f0f0f0', flexShrink: 0 }}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23e0e5ec"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-size="40"%3E🏪%3C/text%3E%3C/svg%3E';
          }}
        />
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '18px', marginBottom: '5px', color: '#333' }}>{store.name || 'Unnamed Store'}</h4>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{store.address || 'Address not available'}</p>
          <div style={{ display: 'flex', gap: '10px', color: '#ffc107' }}>
            <span>⭐ {avgRating > 0 ? avgRating.toFixed(1) : 'No ratings'}</span>
            <span>({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})</span>
          </div>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = `/store/${store.id}`}
        >
          Rate Store
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', margin: '20px' }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p>Loading stores...</p>
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
      <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', margin: '20px' }}>
        <p style={{ color: '#dc3545', marginBottom: '20px', fontSize: '18px' }}>{error}</p>
        <button className="btn btn-primary" onClick={fetchStores}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '24px',
        color: 'white',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '15px', fontWeight: 700 }}>Discover Great Stores</h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>Find the best places to shop in your area</p>
      </div>

      {/* Filters Section */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        marginBottom: '30px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by store name or address..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <select 
            value={filters.category} 
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              minWidth: '150px',
              background: 'white',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.icon || '📌'} {cat.name}
              </option>
            ))}
          </select>

          <select 
            value={filters.minRating} 
            onChange={(e) => handleFilterChange('minRating', e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              minWidth: '150px',
              background: 'white',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="0">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>

          <select 
            value={filters.sortBy} 
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '14px',
              minWidth: '150px',
              background: 'white',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviews</option>
            <option value="name">Name A-Z</option>
          </select>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className={viewMode === 'grid' ? 'btn btn-primary' : 'btn btn-outline'} 
              onClick={() => setViewMode('grid')}
            >
              📱 Grid
            </button>
            <button 
              className={viewMode === 'list' ? 'btn btn-primary' : 'btn btn-outline'} 
              onClick={() => setViewMode('list')}
            >
              📋 List
            </button>
          </div>
        </div>
      </div>

      {/* Stores Display */}
      {stores.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', color: '#666', fontSize: '18px' }}>
          <p>No stores found matching your criteria</p>
        </div>
      ) : (
        <div style={viewMode === 'grid' 
          ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }
          : { display: 'flex', flexDirection: 'column', gap: '15px' }
        }>
          {stores.map(store => (
            viewMode === 'grid' 
              ? <StoreCard key={store.id} store={store} />
              : <StoreListItem key={store.id} store={store} />
          ))}
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .filter-controls {
            flex-direction: column;
          }
          .filter-controls select {
            width: 100%;
          }
          .view-toggle {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedStoreListing;