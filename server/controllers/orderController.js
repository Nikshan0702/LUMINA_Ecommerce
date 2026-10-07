const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { generatePayHereHash } = require('../utils/payhere');

const createOrder = async (req, res) => {
  try {
    const { items, customerName, phone, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!customerName || !phone || !shippingAddress) {
      return res.status(400).json({ message: 'Customer name, phone, and shipping address are required' });
    }

    if (!['PayHere', 'WhatsApp'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    let subtotal = 0;
    const verifiedItems = [];

    // Verify stock availability and compute subtotal using stored database prices
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name || item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      subtotal += product.price * item.quantity;
      verifiedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
    }

    const deliveryFee = 500;
    const total = subtotal + deliveryFee;

    // Deduct stock for each confirmed product item
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: verifiedItems,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      customerName,
      phone,
      shippingAddress
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error creating order' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching user orders' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching order' });
  }
};

const getPayHereParams = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized for this order payment' });
    }

    const { merchantId, hash, formattedAmount, currency } = generatePayHereHash(
      order._id.toString(),
      order.total
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const payhereData = {
      sandbox: true,
      merchant_id: merchantId,
      return_url: `${frontendUrl}/my-orders`,
      cancel_url: `${frontendUrl}/checkout`,
      notify_url: `${frontendUrl}/api/orders/payhere-notify`,
      order_id: order._id.toString(),
      items: order.items.map((i) => `${i.name} x${i.quantity}`).join(', '),
      amount: formattedAmount,
      currency: currency,
      hash: hash,
      first_name: order.customerName,
      last_name: 'Customer',
      email: req.user.email,
      phone: order.phone,
      address: order.shippingAddress,
      city: 'Colombo',
      country: 'Sri Lanka'
    };

    res.json(payhereData);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to generate PayHere parameters' });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.paymentStatus = 'Paid';
    order.orderStatus = 'Confirmed';
    const updatedOrder = await order.save();

    res.json({
      message: 'Payment completed successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating payment status' });
  }
};

const payhereNotify = async (req, res) => {
  try {
    const { order_id, status_code } = req.body;

    if (order_id && mongoose.Types.ObjectId.isValid(order_id)) {
      const order = await Order.findById(order_id);
      if (order) {
        if (status_code == '2') {
          order.paymentStatus = 'Paid';
          order.orderStatus = 'Confirmed';
        } else if (status_code == '-1' || status_code == '-2') {
          order.paymentStatus = 'Failed';
        }
        await order.save();
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    res.status(500).send('Webhook processing error');
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status value' });
    }

    const previousStatus = order.orderStatus;

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    // Automatically restore stock once if an order transitions to cancelled
    if (orderStatus === 'Cancelled' && previousStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error updating order status' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

    const paidOrders = await Order.find({ paymentStatus: 'Paid' });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    res.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching dashboard stats' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getPayHereParams,
  markOrderAsPaid,
  payhereNotify,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats
};
