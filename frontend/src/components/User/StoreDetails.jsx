import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StoreDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [userRating, setUserRating] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);
    const [review, setReview] = useState('');
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchStoreDetails();
    }, [id]);

    const fetchStoreDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/stores/${id}`);
            setStore(response.data);
            if (response.data.user_rating) {
                setUserRating(response.data.user_rating);
                setSelectedRating(response.data.user_rating);
            }
            
            // Fetch ratings for this store
            const ratingsResponse = await api.get(`/ratings/store/${id}`);
            setRatings(ratingsResponse.data);
        } catch (error) {
            console.error('Failed to fetch store details:', error);
            setError('Failed to load store details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        if (selectedRating < 1 || selectedRating > 5) {
            alert('Please select a rating between 1 and 5');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/ratings', {
                storeId: id,
                rating: selectedRating,
                review: review
            });
            alert('Rating submitted successfully!');
            setShowRatingModal(false);
            fetchStoreDetails();
        } catch (error) {
            console.error('Failed to submit rating:', error);
            alert('Failed to submit rating. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating, interactive = false) => {
        return (
            <div style={{ display: 'inline-flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        style={{
                            fontSize: interactive ? '40px' : '20px',
                            cursor: interactive ? 'pointer' : 'default',
                            color: star <= rating ? '#ffc107' : '#ddd',
                            transition: 'color 0.2s'
                        }}
                        onClick={() => interactive && setSelectedRating(star)}
                        onMouseEnter={() => interactive && setSelectedRating(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return '#28a745';
        if (rating >= 3.5) return '#ffc107';
        if (rating >= 2.5) return '#fd7e14';
        return '#dc3545';
    };

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '60px' }}>
                <div className="loading-spinner"></div>
                <p style={{ color: '#667eea', marginTop: '20px' }}>Loading store details...</p>
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>😕</div>
                <h2>Store Not Found</h2>
                <p style={{ color: '#666' }}>{error || 'The store you are looking for does not exist.'}</p>
                <button className="btn btn-primary" onClick={() => navigate('/user/stores')} style={{ marginTop: '20px' }}>
                    ← Back to Stores
                </button>
            </div>
        );
    }

    const avgRating = parseFloat(store.overall_rating) || 0;
    const totalRatings = parseInt(store.total_ratings) || 0;

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            {/* Back Button */}
            <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/user/stores')}
                style={{ marginBottom: '20px' }}
            >
                ← Back to Stores
            </button>

            {/* Store Header */}
            <div className="card" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <div style={{ 
                            width: '100%', 
                            height: '250px', 
                            background: 'linear-gradient(135deg, #e0e5ec 0%, #f5f6fa 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '80px'
                        }}>
                            🏪
                        </div>
                    </div>
                    <div style={{ flex: 2 }}>
                        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{store.name}</h1>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '15px' }}>
                            <span style={{ 
                                background: store.category ? '#667eea' : '#6c757d',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '14px'
                            }}>
                                {store.category || 'Uncategorized'}
                            </span>
                            {store.is_verified && (
                                <span style={{ 
                                    background: '#28a745',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '14px'
                                }}>
                                    ✅ Verified
                                </span>
                            )}
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ fontSize: '28px', color: getRatingColor(avgRating) }}>
                                    {avgRating > 0 ? avgRating.toFixed(1) : 'New'} ★
                                </span>
                                <span style={{ color: '#666' }}>
                                    ({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})
                                </span>
                            </div>
                            {renderStars(Math.round(avgRating))}
                        </div>
                        <div style={{ color: '#666', lineHeight: '1.8' }}>
                            <div>📧 {store.email}</div>
                            <div>📍 {store.address}</div>
                            {store.phone && <div>📞 {store.phone}</div>}
                            {store.website && <div>🌐 <a href={store.website} target="_blank" rel="noopener noreferrer">{store.website}</a></div>}
                        </div>
                        {store.description && (
                            <div style={{ marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                                <p style={{ color: '#333', margin: 0 }}>{store.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Rating Action */}
            <div className="card" style={{ marginBottom: '30px', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '15px' }}>
                    {userRating ? 'Update Your Rating' : 'Rate This Store'}
                </h3>
                {userRating ? (
                    <div>
                        <p style={{ color: '#666', marginBottom: '10px' }}>
                            You rated this store {userRating} ★
                        </p>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => setShowRatingModal(true)}
                        >
                            Update Rating
                        </button>
                    </div>
                ) : (
                    <button 
                        className="btn btn-primary" 
                        onClick={() => setShowRatingModal(true)}
                    >
                        Submit Rating
                    </button>
                )}
            </div>

            {/* All Ratings */}
            <div className="card">
                <h3 style={{ marginBottom: '20px' }}>All Reviews</h3>
                {ratings.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                        No reviews yet. Be the first to rate this store!
                    </p>
                ) : (
                    <div>
                        {ratings.map((rating, index) => (
                            <div 
                                key={rating.id || index}
                                style={{
                                    padding: '15px',
                                    borderBottom: index < ratings.length - 1 ? '1px solid #e1e5e9' : 'none'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div>
                                        <strong>{rating.name}</strong>
                                        <span style={{ marginLeft: '10px', color: '#ffc107' }}>
                                            {renderStars(rating.rating)}
                                        </span>
                                    </div>
                                    <small style={{ color: '#999' }}>
                                        {new Date(rating.created_at).toLocaleDateString()}
                                    </small>
                                </div>
                                {rating.review && (
                                    <p style={{ color: '#555', margin: '5px 0 0 0', fontSize: '14px' }}>
                                        "{rating.review}"
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rating Modal */}
            {showRatingModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>Rate {store.name}</h3>
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setShowRatingModal(false)}
                                style={{ padding: '5px 15px' }}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <form onSubmit={handleRatingSubmit}>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <div style={{ fontSize: '48px' }}>
                                    {renderStars(selectedRating, true)}
                                </div>
                                <p style={{ marginTop: '10px', color: '#666' }}>
                                    {selectedRating > 0 ? `${selectedRating} star${selectedRating > 1 ? 's' : ''}` : 'Tap a star to rate'}
                                </p>
                            </div>
                            
                            <div className="form-group">
                                <label>Review (Optional)</label>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    rows="4"
                                    placeholder="Share your experience with this store..."
                                    style={{ width: '100%', padding: '10px', border: '2px solid #e1e5e9', borderRadius: '8px' }}
                                />
                            </div>
                            
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowRatingModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Rating'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .loading-spinner {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #667eea;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default StoreDetails;