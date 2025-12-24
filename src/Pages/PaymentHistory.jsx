import { useState, useEffect } from 'react';
import paymentAPI from '../services/paymentAPI';
import '../styles/payments.css';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentAPI.getUserPayments();
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (paymentId) => {
    try {
      const data = await paymentAPI.getPaymentTransactions(paymentId);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleViewDetails = async (payment) => {
    setSelectedPayment(payment);
    await loadTransactions(payment.paymentId);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'failed': return '#dc3545';
      case 'refunded': return '#6c757d';
      default: return '#666';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="payment-history-page">
      <h1>💳 Payment History</h1>

      {loading ? (
        <div className="loading">Loading payment history...</div>
      ) : payments.length === 0 ? (
        <div className="no-payments">
          <p>No payments yet.</p>
        </div>
      ) : (
        <div className="payments-grid">
          {payments.map((payment) => (
            <div key={payment.paymentId} className="payment-card">
              <div className="payment-header">
                <h3>Order #{payment.orderId}</h3>
                <span
                  className="payment-status"
                  style={{ background: getStatusColor(payment.status) }}
                >
                  {payment.status}
                </span>
              </div>
              
              <div className="payment-details">
                <div className="payment-row">
                  <span>Amount:</span>
                  <strong>${payment.amount.toFixed(2)}</strong>
                </div>
                <div className="payment-row">
                  <span>Platform Fee:</span>
                  <span>${payment.platformFee.toFixed(2)}</span>
                </div>
                <div className="payment-row">
                  <span>Payment Method:</span>
                  <span>{payment.paymentMethod}</span>
                </div>
                <div className="payment-row">
                  <span>Date:</span>
                  <span>{formatDate(payment.createdAt)}</span>
                </div>
                {payment.transactionId && (
                  <div className="payment-row">
                    <span>Transaction ID:</span>
                    <small>{payment.transactionId}</small>
                  </div>
                )}
              </div>

              <button
                className="view-details-btn"
                onClick={() => handleViewDetails(payment)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPayment && (
        <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payment Details</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedPayment(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <h3>Payment Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Payment ID:</label>
                  <span>{selectedPayment.paymentId}</span>
                </div>
                <div className="info-item">
                  <label>Order ID:</label>
                  <span>{selectedPayment.orderId}</span>
                </div>
                <div className="info-item">
                  <label>Amount:</label>
                  <span>${selectedPayment.amount.toFixed(2)}</span>
                </div>
                <div className="info-item">
                  <label>Platform Fee:</label>
                  <span>${selectedPayment.platformFee.toFixed(2)}</span>
                </div>
                <div className="info-item">
                  <label>Status:</label>
                  <span
                    style={{ color: getStatusColor(selectedPayment.status) }}
                  >
                    {selectedPayment.status}
                  </span>
                </div>
                <div className="info-item">
                  <label>Payment Method:</label>
                  <span>{selectedPayment.paymentMethod}</span>
                </div>
                <div className="info-item">
                  <label>Transaction ID:</label>
                  <span>{selectedPayment.transactionId}</span>
                </div>
                <div className="info-item">
                  <label>Date:</label>
                  <span>{formatDate(selectedPayment.createdAt)}</span>
                </div>
              </div>

              {transactions.length > 0 && (
                <>
                  <h3>Transaction History</h3>
                  <div className="transactions-list">
                    {transactions.map((txn) => (
                      <div key={txn.transactionId} className="transaction-item">
                        <div className="transaction-info">
                          <span className="transaction-type">{txn.type}</span>
                          <span className="transaction-amount">
                            ${txn.amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="transaction-meta">
                          <span
                            className="transaction-status"
                            style={{ color: getStatusColor(txn.status) }}
                          >
                            {txn.status}
                          </span>
                          <span className="transaction-date">
                            {formatDate(txn.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
