import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChangePassword from './components/Auth/ChangePassword';
import AdminDashboard from './components/Admin/EnhancedDashboard';
import UserList from './components/Admin/UserList';
import StoreList from './components/Admin/StoreList';
import AddUser from './components/Admin/AddUser';
import AddStore from './components/Admin/AddStore';
import StoreListing from './components/User/EnhancedStoreListing';
import StoreDetails from './components/User/StoreDetails';
import OwnerDashboard from './components/StoreOwner/OwnerDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Protected Routes - All Users */}
          <Route path="/user/change-password" element={
            <ProtectedRoute allowedRoles={['user', 'owner', 'admin']}>
              <ChangePassword />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserList />
            </ProtectedRoute>
          } />
          <Route path="/admin/stores" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StoreList />
            </ProtectedRoute>
          } />
          <Route path="/admin/add-user" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddUser />
            </ProtectedRoute>
          } />
          <Route path="/admin/add-store" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddStore />
            </ProtectedRoute>
          } />
          
          {/* User Routes */}
          <Route path="/user/stores" element={
            <ProtectedRoute allowedRoles={['user']}>
              <StoreListing />
            </ProtectedRoute>
          } />
          <Route path="/store/:id" element={
            <ProtectedRoute allowedRoles={['user']}>
              <StoreDetails />
            </ProtectedRoute>
          } />
          
          {/* Store Owner Routes */}
          <Route path="/owner/dashboard" element={
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;