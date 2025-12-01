const crypto = require('crypto');

module.exports = function createPaymentController({ razorpay, User, razorpaySecret }) {
  const createOrder = async (req, res, next) => {
    try {
      const { amount, homeId } = req.body;
      if (!amount || !homeId) {
        return res.status(400).json({ error: 'Missing amount or homeId' });
      }

      const options = {
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`
      };

      const order = await razorpay.orders.create(options);
      req.session.razorpayOrder = { id: order.id, homeId, amount };
      return res.json({ order });
    } catch (err) {
      console.error('createOrder error', err);
      return res.status(500).json({ error: 'Unable to create order' });
    }
  };

  const verifyPayment = async (req, res, next) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, homeId } = req.body;
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Missing payment information' });
      }

      const generatedSignature = crypto
        .createHmac('sha256', razorpaySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ error: 'Invalid signature' });
      }

      const userId = req.session && req.session.user && req.session.user._id ? req.session.user._id : null;
      const targetHomeId = homeId || (req.session.razorpayOrder && req.session.razorpayOrder.homeId);

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      if (!targetHomeId) {
        return res.status(400).json({ error: 'homeId not provided' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!Array.isArray(user.bookings)) {
        user.bookings = [];
      }
      const already = user.bookings.map(id => id.toString()).includes(targetHomeId.toString());
      if (!already) {
        user.bookings.push(targetHomeId);
        await user.save();
        if (req.session.user) {
          req.session.user.bookings = user.bookings;
        }
      }

      return res.json({ success: true, redirect: '/bookings' });
    } catch (err) {
      console.error('verifyPayment error', err);
      return res.status(500).json({ error: 'Payment verification failed' });
    }
  };

  const postPayment = async (req, res, next) => {
    try {
      const homeId = req.body.homeId || (req.session.razorpayOrder && req.session.razorpayOrder.homeId);
      const userId = req.session && req.session.user && req.session.user._id ? req.session.user._id : null;
      if (!userId || !homeId) {
        return res.status(400).send('Missing user or home information');
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }

      if (!Array.isArray(user.bookings)) {
        user.bookings = [];
      }
      const already = user.bookings.map(id => id.toString()).includes(homeId.toString());
      if (!already) {
        user.bookings.push(homeId);
        await user.save();
        if (req.session.user) {
          req.session.user.bookings = user.bookings;
        }
      }

      return res.redirect('/bookings');
    } catch (err) {
      console.error('postPayment error', err);
      return res.status(500).send('Internal Server Error');
    }
  };

  return { createOrder, verifyPayment, postPayment };
};