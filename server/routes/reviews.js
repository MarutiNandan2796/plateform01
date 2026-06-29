const express = require('express');
const router = express.Router();
const { createReview, getEventReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/:eventId', protect, createReview);
router.get('/:eventId', getEventReviews);

module.exports = router;
