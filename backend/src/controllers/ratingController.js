const Rating = require('../models/Rating');
const Store = require('../models/Store');

class RatingController {
    async submitRating(req, res) {
        try {
            const { storeId, rating } = req.body;
            const userId = req.user.id;
            
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ error: 'Rating must be between 1 and 5' });
            }
            
            await Rating.submit(userId, storeId, rating);
            res.json({ message: 'Rating submitted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    async getStoreRatings(req, res) {
        try {
            const storeId = req.params.storeId;
            const ratings = await Rating.getStoreRatings(storeId);
            res.json(ratings);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
    async getOwnerStoreRatings(req, res) {
        try {
            const ownerId = req.user.id;
            const stores = await Store.findAll();
            const ownerStore = stores.find(store => store.owner_id === ownerId);
            
            if (!ownerStore) {
                return res.status(404).json({ error: 'No store found for this owner' });
            }
            
            const ratings = await Rating.getStoreRatings(ownerStore.id);
            res.json({
                store: ownerStore,
                ratings,
                averageRating: ownerStore.overall_rating
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = new RatingController();