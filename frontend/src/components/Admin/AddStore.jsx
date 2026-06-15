import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AddStore = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: ''
  });
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const owners = response.data.filter(user => user.role === 'owner');
      setUsers(owners);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/stores', formData);
      setSuccess('Store created successfully!');
      setFormData({
        name: '',
        email: '',
        address: '',
        owner_id: ''
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '20px' }}>Add New Store</h1>
      
      <div className="card">
        {success && <div className="success" style={{ textAlign: 'center', marginBottom: '15px', padding: '10px', background: '#efe', borderRadius: '8px' }}>{success}</div>}
        {error && <div className="error" style={{ textAlign: 'center', marginBottom: '15px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Store Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Store Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Store Owner (Optional)</label>
            <select name="owner_id" value={formData.owner_id} onChange={handleChange}>
              <option value="">No Owner Assigned</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Store'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStore;