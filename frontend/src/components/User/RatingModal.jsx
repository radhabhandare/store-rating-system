import React, { useState } from 'react';

const RatingModal = ({ store, currentRating, onClose, onSubmit }) => {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (rating >= 1 && rating <= 5) {
      onSubmit(rating);
    } else {
      alert('Please select a rating between 1 and 5');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div className="card" style={{ maxWidth: '450px', width: '90%', animation: 'slideUp 0.3s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '48px' }}>⭐</span>
          <h3 style={{ marginTop: '10px' }}>Rate {store.name}</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>How was your experience?</p>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="rating-stars" style={{ justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hoverRating || rating) ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{ fontSize: '48px', cursor: 'pointer', margin: '0 5px' }}
              >
                ★
              </span>
            ))}
          </div>
          <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
            {rating > 0 ? `You selected ${rating} star${rating > 1 ? 's' : ''}` : 'Click a star to rate'}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit Rating
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default RatingModal;