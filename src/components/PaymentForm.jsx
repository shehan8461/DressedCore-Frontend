import { useState, useEffect } from 'react';
import paymentAPI from '../services/paymentAPI';
import orderAPI from '../services/orderAPI';
import messageAPI from '../services/messageAPI';
import '../styles/payment-form.css';

const PaymentForm = ({ quote, design, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [calculatingFee, setCalculatingFee] = useState(true);
  const [platformFee, setPlatformFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('CreditCard');
  const [error, setError] = useState('');

  useEffect(() => {
    calculateFee();
  }, [quote.price]);

  const calculateFee = async () => {
    try {
      setCalculatingFee(true);
      const result = await paymentAPI.calculateFee(quote.price);
      setPlatformFee(result.platformFee);
      setTotalAmount(result.totalAmount);
    } catch (err) {
      setError('Failed to calculate platform fee');
      console.error('Fee calculation error:', err);
    } finally {
      setCalculatingFee(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Step 1: Create order
      const orderResult = await orderAPI.createOrder(
        design.id,
        design.designerId,
        quote.supplierId,
        quote.id,
        quote.price
      );

      if (!orderResult.success) {
        throw new Error(orderResult.message || 'Failed to create order');
      }

      // Step 2: Process payment
      const paymentResult = await paymentAPI.processPayment(
        orderResult.orderId,
        quote.price,
        paymentMethod
      );

      if (!paymentResult.success) {
        throw new Error('Payment processing failed');
      }

      // Step 3: Update order payment status
      await orderAPI.updatePaymentStatus(orderResult.orderId, 'Completed');

      // Step 4: Send email notifications (designer and supplier)
      try {
        // Email to designer
        await messageAPI.sendEmail(
          design.designerEmail || 'designer@example.com',
          'Designer',
          'Order Confirmed - Payment Received',
          `Your order ${orderResult.orderNumber} has been confirmed. Payment of $${totalAmount.toFixed(2)} has been processed successfully. The supplier will begin manufacturing your design.`
        );

        // Email to supplier
        await messageAPI.sendEmail(
          quote.supplierEmail || 'supplier@example.com',
          'Supplier',
          'New Order Received',
          `You have received a new order ${orderResult.orderNumber} for $${quote.price.toFixed(2)}. Please begin manufacturing. Platform fee: $${platformFee.toFixed(2)}`
        );
      } catch (emailErr) {
        console.error('Email notification error:', emailErr);
        // Don't fail the payment if email fails
      }

      onSuccess(orderResult);
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (calculatingFee) {
    return (
      <div className="payment-form-modal">
        <div className="payment-form-content">
          <div className="loading">Calculating fees...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-form-modal">
      <div className="payment-form-content">
        <div className="payment-form-header">
          <h2>💳 Complete Payment</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <div className="payment-form-body">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Design:</span>
              <strong>{design.title}</strong>
            </div>
            <div className="summary-row">
              <span>Supplier:</span>
              <strong>{quote.supplierName}</strong>
            </div>
            <div className="summary-row">
              <span>Quantity:</span>
              <strong>{design.quantity} units</strong>
            </div>
            <div className="summary-row">
              <span>Delivery Time:</span>
              <strong>{quote.deliveryTimeInDays} days</strong>
            </div>
          </div>

          <div className="payment-breakdown">
            <h3>Payment Breakdown</h3>
            <div className="breakdown-row">
              <span>Quote Amount:</span>
              <span>${quote.price.toFixed(2)}</span>
            </div>
            <div className="breakdown-row">
              <span>Platform Fee (10%):</span>
              <span>${platformFee.toFixed(2)}</span>
            </div>
            <div className="breakdown-row total">
              <strong>Total Amount:</strong>
              <strong>${totalAmount.toFixed(2)}</strong>
            </div>
          </div>

          <div className="payment-method">
            <h3>Payment Method</h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-method-select"
            >
              <option value="CreditCard">Credit Card</option>
              <option value="DebitCard">Debit Card</option>
              <option value="BankTransfer">Bank Transfer</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          {error && (
            <div className="payment-error">
              ⚠️ {error}
            </div>
          )}

          <div className="payment-actions">
            <button
              onClick={onCancel}
              className="btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
            </button>
          </div>

          <div className="payment-note">
            <small>
              ℹ️ This is a secure payment processed through our platform. 
              Both parties will receive email confirmation upon successful payment.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
