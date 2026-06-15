import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    address: ''
  });
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.address) params.append('address', filters.address);
      
      const response = await api.get(`/stores?${params}`);
      setStores(response.data);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedStores = [...stores].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    
    if (sortField === 'overall_rating') {
      aVal = parseFloat(aVal) || 0;
      bVal = parseFloat(bVal) || 0;
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  if (loading) {
    return <div className="loading">Loading stores...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '20px' }}>Store Management</h1>
      
      <div className="filter-section">
        <input
          type="text"
          placeholder="Filter by store name..."
          value={filters.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by address..."
          value={filters.address}
          onChange={(e) => handleFilterChange('address', e.target.value)}
        />
      </div>
      
      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Store Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('email')}>Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('address')}>Address {sortField === 'address' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('overall_rating')}>Rating {sortField === 'overall_rating' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedStores.map(store => (
              <tr key={store.id}>
                <td><strong>{store.name}</strong></td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>
                  <span style={{ color: '#ffc107', fontSize: '18px' }}>★</span>
                  <strong> {parseFloat(store.overall_rating).toFixed(1)}</strong>
                  <span style={{ color: '#666', fontSize: '12px' }}> ({store.total_ratings} ratings)</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreList;