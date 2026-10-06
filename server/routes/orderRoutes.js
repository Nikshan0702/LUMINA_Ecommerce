const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getPayHereParams,
  markOrderAsPaid,
  payhereNotify
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id/payhere-params', protect, getPayHereParams);
router.post('/:id/pay', protect, markOrderAsPaid);
router.post('/payhere-notify', payhereNotify); // Public webhook for PayHere
router.get('/:id', protect, getOrderById);

module.exports = router;
