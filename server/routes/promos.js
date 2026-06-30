const express = require('express');
const router = express.Router();
const { createPromoCode, getPromoCodes, deletePromoCode, validatePromoCode } = require('../controllers/promoController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, createPromoCode);
router.get('/', protect, admin, getPromoCodes);
router.delete('/:id', protect, admin, deletePromoCode);
router.post('/validate', protect, validatePromoCode);

module.exports = router;
