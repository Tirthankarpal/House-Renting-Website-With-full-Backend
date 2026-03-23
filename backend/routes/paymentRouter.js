const express = require('express');

module.exports = function createPaymentRouter(paymentController) {
  const router = express.Router();

  // Create a Razorpay order (client calls before opening checkout)
  router.post('/create-order', paymentController.createOrder);

  // Verify payment signature and add booking
  router.post('/verify-payment', paymentController.verifyPayment);

  // Optional legacy/server-side completion endpoint
  router.post('/complete', paymentController.postPayment);

  return router;
};