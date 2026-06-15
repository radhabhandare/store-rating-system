import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: 'all'
  });
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });
      const response = await api.get(`/users?${params}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
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

  const sortedUsers = [...users].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    
    if (sortField === 'rating') {
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
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '20px' }}>User Management</h1>
      
      <div className="filter-section">
        <input
          type="text"
          placeholder="Filter by name..."
          value={filters.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by email..."
          value={filters.email}
          onChange={(e) => handleFilterChange('email', e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by address..."
          value={filters.address}
          onChange={(e) => handleFilterChange('address', e.target.value)}
        />
        <select
          value={filters.role}
          onChange={(e) => handleFilterChange('role', e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="owner">Store Owner</option>
        </select>
      </div>
      
      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('email')}>Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('address')}>Address {sortField === 'address' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('role')}>Role {sortField === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              {users.some(u => u.role === 'owner') && <th onClick={() => handleSort('rating')}>Rating {sortField === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}</th>}
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map(user => (
              <tr key={user.id}>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>{user.address || '-'}</td>
                <td><span style={{ padding: '4px 8px', background: user.role === 'admin' ? '#667eea' : user.role === 'owner' ? '#28a745' : '#17a2b8', color: 'white', borderRadius: '4px', fontSize: '12px' }}>{user.role}</span></td>
                {user.role === 'owner' && <td>{user.rating ? `${user.rating} ★` : 'N/A'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;