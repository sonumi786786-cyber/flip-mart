const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');

// Apply coupon
router.post('/apply', protect, async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid or expired coupon code!' });

    if (coupon.expiresAt && new Date() > coupon.expiresAt)
      return res.status(400).json({ message: 'Coupon has expired!' });

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      return res.status(400).json({ message: 'Coupon usage limit reached!' });

    if (orderAmount < coupon.minOrderAmount)
      return res.status(400).json({ message: `Minimum order amount ₹${coupon.minOrderAmount} required!` });

    let discount = 0;
    if (coupon.discountType === 'percent') {
      discount = Math.floor((orderAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, orderAmount);

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount,
        finalAmount: orderAmount - discount,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: create coupon
router.post('/create', protect, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: list all coupons
router.get('/all', protect, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;