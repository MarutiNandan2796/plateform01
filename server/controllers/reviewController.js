const Review = require('../models/Review');
const Booking = require('../models/Booking');

// Create a new review for an event
exports.createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const eventId = req.params.eventId;
        const userId = req.user.id;

        if (!rating || !comment) {
            return res.status(400).json({ message: 'Rating and comment are required' });
        }

        // Verify the user has a confirmed booking for this event
        const hasBooking = await Booking.findOne({
            userId,
            eventId,
            status: 'confirmed'
        });

        if (!hasBooking) {
            return res.status(403).json({ message: 'You can only review events you have booked and attended.' });
        }

        // Check if the user already reviewed this event
        const alreadyReviewed = await Review.findOne({ userId, eventId });
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this event.' });
        }

        const review = await Review.create({
            eventId,
            userId,
            rating: Number(rating),
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get all reviews for an event
exports.getEventReviews = async (req, res) => {
    try {
        const { eventId } = req.params;
        const reviews = await Review.find({ eventId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
