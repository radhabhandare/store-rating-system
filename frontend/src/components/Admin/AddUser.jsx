import React, { useState } from 'react';
import api from '../../services/api';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be between 20 and 60 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be 8-16 characters, include one uppercase and one special character';
    }
    
    if (formData.address && formData.address.length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await api.post('/users', formData);
      setSuccess('User created successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'user'
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || 'Failed to create user' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '20px' }}>Add New User</h1>
      
      <div className="card">
        {success && <div className="success" style={{ textAlign: 'center', marginBottom: '15px', padding: '10px', background: '#efe', borderRadius: '8px' }}>{success}</div>}
        {errors.submit && <div className="error" style={{ textAlign: 'center', marginBottom: '15px' }}>{errors.submit}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name (20-60 characters)</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label>Address (Max 400 characters)</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
            {errors.address && <div className="error">{errors.address}</div>}
          </div>
          
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Normal User</option>
              <option value="admin">System Administrator</option>
              <option value="owner">Store Owner</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;