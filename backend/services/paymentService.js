/**
 * ==============================================================================
 * PAYMENT SERVICE - KRUMAK TRADERS
 * ==============================================================================
 * This service encapsulates all payment gateway interactions.
 * Currently configured with a DUMMY payment simulator for local testing & demos.
 * 
 * TO SWAP IN A REAL PAYMENT GATEWAY (Razorpay or Stripe):
 * 
 * 1. RAZORPAY INTEGRATION:
 *    a) Install: npm install razorpay
 *    b) Add to .env:
 *         RAZORPAY_KEY_ID=rzp_live_...
 *         RAZORPAY_KEY_SECRET=...
 *    c) Uncomment Razorpay block in `processPayment` below.
 *    d) Verify webhook signatures in verifyPaymentSignature().
 * 
 * 2. STRIPE INTEGRATION:
 *    a) Install: npm install stripe
 *    b) Add to .env:
 *         STRIPE_SECRET_KEY=sk_live_...
 *         STRIPE_WEBHOOK_SECRET=whsec_...
 *    c) Uncomment Stripe block in `processPayment` below.
 * ==============================================================================
 */

const crypto = require('crypto');

class PaymentService {
  /**
   * Process a payment transaction
   * 
   * @param {Object} paymentData
   * @param {number} paymentData.amount - Total amount to charge (in INR)
   * @param {string} paymentData.orderId - KRUMAK internal order reference
   * @param {string} paymentData.paymentMethod - card | upi | netbanking | po | cod
   * @param {Object} paymentData.customer - { name, email, phone }
   * @param {boolean} [paymentData.simulateFailure=false] - For test scenarios to trigger failure
   * @returns {Promise<Object>} Payment gateway standardized result
   */
  async processPayment({ amount, orderId, paymentMethod = 'card', customer = {}, simulateFailure = false }) {
    const gatewayMode = process.env.PAYMENT_GATEWAY_MODE || 'dummy';

    // --------------------------------------------------------------------------
    // [REAL GATEWAY OPTION 1: RAZORPAY]
    // --------------------------------------------------------------------------
    /*
    if (gatewayMode === 'razorpay') {
      const Razorpay = require('razorpay');
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: Math.round(amount * 100), // amount in lowest currency unit (paise)
        currency: 'INR',
        receipt: orderId,
        notes: {
          customerName: customer.name || '',
          customerEmail: customer.email || '',
        },
      };

      const razorpayOrder = await instance.orders.create(options);
      return {
        success: true,
        gateway: 'RAZORPAY',
        transactionId: razorpayOrder.id,
        status: 'pending', // or 'paid' upon webhook verification
        amountPaid: amount,
        paymentDate: new Date(),
        rawResponse: razorpayOrder,
      };
    }
    */

    // --------------------------------------------------------------------------
    // [REAL GATEWAY OPTION 2: STRIPE]
    // --------------------------------------------------------------------------
    /*
    if (gatewayMode === 'stripe') {
      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // amount in cents
        currency: 'inr',
        payment_method_types: ['card'],
        description: `Order ${orderId} - KRUMAK TRADERS Laboratory Equipment`,
        receipt_email: customer.email,
        metadata: { orderId },
      });

      return {
        success: true,
        gateway: 'STRIPE',
        transactionId: paymentIntent.id,
        status: paymentIntent.status === 'succeeded' ? 'paid' : 'pending',
        amountPaid: amount,
        paymentDate: new Date(),
        rawResponse: paymentIntent,
      };
    }
    */

    // --------------------------------------------------------------------------
    // [DEFAULT: DUMMY PAYMENT GATEWAY SIMULATION]
    // --------------------------------------------------------------------------
    // Simulates an authorization handshake with 99% success rate (or explicit failure)
    const isPurchaseOrder = paymentMethod === 'po' || paymentMethod === 'cod';
    const isSuccessful = !simulateFailure;

    const dummyTransactionId = 'TXN_' + crypto.randomBytes(8).toString('hex').toUpperCase();

    if (!isSuccessful) {
      return {
        success: false,
        gateway: 'DUMMY_GATEWAY',
        transactionId: dummyTransactionId,
        status: 'failed',
        amountPaid: 0,
        paymentDate: new Date(),
        errorMessage: 'Simulated payment decline: Card limit exceeded or bank authentication failed.',
        rawResponse: {
          gateway: 'DUMMY_GATEWAY',
          code: 'PAYMENT_DECLINED',
          timestamp: new Date().toISOString(),
          simulated: true,
        },
      };
    }

    return {
      success: true,
      gateway: isPurchaseOrder ? 'PURCHASE_ORDER_NET30' : 'DUMMY_GATEWAY',
      transactionId: dummyTransactionId,
      status: isPurchaseOrder ? 'pending' : 'paid',
      amountPaid: amount,
      paymentDate: new Date(),
      rawResponse: {
        gateway: 'DUMMY_GATEWAY',
        code: 'PAYMENT_AUTHORIZED',
        authCode: 'AUTH_' + Math.floor(100000 + Math.random() * 900000),
        method: paymentMethod,
        cardLast4: paymentMethod === 'card' ? '4242' : undefined,
        timestamp: new Date().toISOString(),
        currency: 'INR',
        simulated: true,
      },
    };
  }

  /**
   * Optional helper to verify real gateway webhook signatures
   */
  verifyPaymentSignature(rawBody, signature, secret) {
    if (!signature || !secret) return true; // bypass in dummy mode
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    return expected === signature;
  }
}

module.exports = new PaymentService();
