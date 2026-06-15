import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const getNavItems = () => {
    switch(user.role) {
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/admin/users', label: 'Users', icon: '👥' },
          { path: '/admin/stores', label: 'Stores', icon: '🏪' },
          { path: '/admin/add-user', label: 'Add User', icon: '➕' },
          { path: '/admin/add-store', label: 'Add Store', icon: '🏬' }
        ];
      case 'user':
        return [
          { path: '/user/stores', label: 'Browse Stores', icon: '🔍' },
          { path: '/user/change-password', label: 'Change Password', icon: '🔒' }
        ];
      case 'owner':
        return [
          { path: '/owner/dashboard', label: 'Dashboard', icon: '📈' },
          { path: '/user/change-password', label: 'Change Password', icon: '🔒' }
        ];
      default:
        return [];
    }
  };

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>⭐</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              StoreRating
            </span>
          </div>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            {getNavItems().map(item => (
              <Link key={item.path} to={item.path} style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', borderRadius: '8px', transition: 'background 0.3s' }} onMouseEnter={(e) => e.target.style.background = '#f0f0f0'} onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{user.name}</div>
              <div style={{ fontSize: '12px', color: '#667eea' }}>{user.role}</div>
            </div>
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 16px' }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;