import React from 'react';
import api from '../../services/api';

const ExportButton = ({ type, label = 'Export' }) => {
    const handleExport = async () => {
        try {
            const response = await api.get(`/export/${type}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            alert('Export successful!');
        } catch (error) {
            alert('Export failed. Please try again.');
        }
    };

    return (
        <button className="btn btn-secondary" onClick={handleExport}>
            📥 {label}
        </button>
    );
};

export default ExportButton;