import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { designAPI, quoteAPI } from '../../services/api';

function DesignQuotes() {
  const { id } = useParams();
  const [design, setDesign] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [designResponse, quotesResponse] = await Promise.all([
        designAPI.getById(id),
        quoteAPI.getByDesign(id),
      ]);
      setDesign(designResponse.data);
      setQuotes(quotesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (quoteId) => {
    try {
      await quoteAPI.updateStatus(quoteId, 'Accepted');
      fetchData(); // Refresh data
      alert('Quote accepted successfully!');
    } catch (error) {
      alert('Failed to accept quote');
    }
  };

  const handleRejectQuote = async (quoteId) => {
    try {
      await quoteAPI.updateStatus(quoteId, 'Rejected');
      fetchData(); // Refresh data
    } catch (error) {
      alert('Failed to reject quote');
    }
  };

  if (loading) {
    return <div className="loading">Loading quotes...</div>;
  }

  if (!design) {
    return <div className="error-message">Design not found</div>;
  }

  return (
    <div className="page-container">
      <Link to="/designer/designs" className="back-link">
        ← Back to My Designs
      </Link>

      <div className="page-header">
        <div>
          <h1>Quotes for: {design.title}</h1>
          <p>{quotes.length} quotes received</p>
        </div>
      </div>

      <div className="design-summary-card">
        <h3>Design Details</h3>
        <div className="design-summary-grid">
          <div>
            <strong>Category:</strong> {design.category}
          </div>
          <div>
            <strong>Quantity:</strong> {design.quantity}
          </div>
          <div>
            <strong>Status:</strong>{' '}
            <span className={`status-badge status-${design.status.toLowerCase()}`}>
              {design.status}
            </span>
          </div>
          {design.deadline && (
            <div>
              <strong>Deadline:</strong>{' '}
              {new Date(design.deadline).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="empty-state">
          <h3>No quotes yet</h3>
          <p>Suppliers will submit quotes for your design soon.</p>
        </div>
      ) : (
        <div className="quotes-list-detailed">
          {quotes.map((quote) => (
            <div key={quote.id} className="quote-card-detailed">
              <div className="quote-header">
                <div>
                  <h3>{quote.supplierName}</h3>
                  <span className={`status-badge status-${quote.status.toLowerCase()}`}>
                    {quote.status}
                  </span>
                </div>
                <div className="quote-price-large">
                  ${quote.price.toFixed(2)} {quote.currency}
                </div>
              </div>

              <div className="quote-body">
                <div className="quote-detail">
                  <strong>Delivery Time:</strong>
                  <span>{quote.deliveryTimeInDays} days</span>
                </div>

                <div className="quote-detail">
                  <strong>Quote Details:</strong>
                  <p>{quote.quoteText}</p>
                </div>

                <div className="quote-detail">
                  <strong>Terms & Conditions:</strong>
                  <p>{quote.termsAndConditions}</p>
                </div>

                <div className="quote-detail">
                  <strong>Submitted:</strong>
                  <span>{new Date(quote.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {quote.status === 'Submitted' && (
                <div className="quote-actions">
                  <button
                    onClick={() => handleRejectQuote(quote.id)}
                    className="btn-outline btn-small"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAcceptQuote(quote.id)}
                    className="btn-primary btn-small"
                  >
                    Accept Quote
                  </button>
                </div>
              )}

              {quote.status === 'Accepted' && (
                <div className="quote-accepted-notice">
                  ✅ Quote accepted - Ready to place order
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {quotes.length > 0 && (
        <div className="quotes-comparison">
          <h3>Quick Comparison</h3>
          <div className="comparison-grid">
            <div className="comparison-card">
              <div className="comparison-label">Lowest Price</div>
              <div className="comparison-value">
                ${Math.min(...quotes.map(q => q.price)).toFixed(2)}
              </div>
            </div>
            <div className="comparison-card">
              <div className="comparison-label">Average Price</div>
              <div className="comparison-value">
                ${(quotes.reduce((sum, q) => sum + q.price, 0) / quotes.length).toFixed(2)}
              </div>
            </div>
            <div className="comparison-card">
              <div className="comparison-label">Fastest Delivery</div>
              <div className="comparison-value">
                {Math.min(...quotes.map(q => q.deliveryTimeInDays))} days
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DesignQuotes;
