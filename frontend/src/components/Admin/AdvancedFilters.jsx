import React, { useState } from 'react';

const AdvancedFilters = ({ onApplyFilters }) => {
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        address: '',
        role: 'all',
        sortBy: 'name',
        sortOrder: 'asc'
    });

    const handleChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    const handleApply = () => {
        onApplyFilters(filters);
    };

    const handleReset = () => {
        const resetFilters = {
            name: '',
            email: '',
            address: '',
            role: 'all',
            sortBy: 'name',
            sortOrder: 'asc'
        };
        setFilters(resetFilters);
        onApplyFilters(resetFilters);
    };

    return (
        <div className="advanced-filters card">
            <h4>Advanced Filters</h4>
            <div className="filter-grid">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        value={filters.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Filter by name..."
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="text"
                        value={filters.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="Filter by email..."
                    />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input
                        type="text"
                        value={filters.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="Filter by address..."
                    />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select
                        value={filters.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="owner">Store Owner</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Sort By</label>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleChange('sortBy', e.target.value)}
                    >
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="role">Role</option>
                        <option value="created_at">Registered Date</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Sort Order</label>
                    <select
                        value={filters.sortOrder}
                        onChange={(e) => handleChange('sortOrder', e.target.value)}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>
            <div className="filter-actions">
                <button className="btn btn-primary" onClick={handleApply}>
                    Apply Filters
                </button>
                <button className="btn btn-secondary" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default AdvancedFilters;