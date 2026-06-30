const PromoCode = require('../models/PromoCode');

// Create Promo Code (Admin Only)
exports.createPromoCode = async (req, res) => {
    try {
        const { code, discountType, discountValue, expiryDate } = req.body;

        if (!code || !discountType || !discountValue || !expiryDate) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingPromo = await PromoCode.findOne({ code: code.toUpperCase() });
        if (existingPromo) {
            return res.status(400).json({ message: 'Promo code already exists.' });
        }

        const newPromo = await PromoCode.create({
            code: code.toUpperCase(),
            discountType,
            discountValue: Number(discountValue),
            expiryDate: new Date(expiryDate)
        });

        res.status(201).json(newPromo);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get All Promo Codes (Admin Only)
exports.getPromoCodes = async (req, res) => {
    try {
        const promos = await PromoCode.find().sort({ createdAt: -1 });
        res.json(promos);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Delete Promo Code (Admin Only)
exports.deletePromoCode = async (req, res) => {
    try {
        const promo = await PromoCode.findByIdAndDelete(req.params.id);
        if (!promo) return res.status(404).json({ message: 'Promo code not found' });
        res.json({ message: 'Promo code deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Validate Promo Code (User checkout validation)
exports.validatePromoCode = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ message: 'Promo code is required.' });
        }

        const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });
        if (!promo) {
            return res.status(404).json({ message: 'Invalid promo code.' });
        }

        // Check expiry date
        if (new Date(promo.expiryDate) < new Date()) {
            return res.status(400).json({ message: 'Promo code has expired.' });
        }

        res.json({
            valid: true,
            code: promo.code,
            discountType: promo.discountType,
            discountValue: promo.discountValue
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
