const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  placeOrder, getMyOrders,
  getOrderById, cancelOrder,
} = require('../controllers/orderController');

router.post('/place', protect, placeOrder);
router.get('/mine', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;