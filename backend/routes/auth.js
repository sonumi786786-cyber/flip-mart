const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register, login, sendOTP, verifyOTP, getMe,
  updateProfile, changePassword, addAddress,
  deleteAddress, toggleWishlist,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/address', protect, addAddress);
router.delete('/address/:id', protect, deleteAddress);
router.post('/wishlist/:productId', protect, toggleWishlist);

module.exports = router;