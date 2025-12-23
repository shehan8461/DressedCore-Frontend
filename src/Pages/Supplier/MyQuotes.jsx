import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { quoteAPI } from '../../services/api';

function MyQuotes() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchQuotes();
  }, [user]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await quoteAPI.getBySupplier(user.userId);
      setQuotes(response.data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    if (filter === 'all') return true;
    return quote.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return <div className="loading">Loading quotes...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>My Quotes</h1>
          <p>Manage your submitted quotations</p>
        </div>
        <Link to="/supplier/designs" className="btn-primary">
          Browse Designs
        </Link>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({quotes.length})
        </button>
        <button
          className={`filter-btn ${filter === 'submitted' ? 'active' : ''}`}
          onClick={() => setFilter('submitted')}
        >
          Submitted
        </button>
        <button
          className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilter('accepted')}
        >
          Accepted
        </button>
        <button
          className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>

      {filteredQuotes.length === 0 ? (
        <div className="empty-state">
          <h3>No quotes found</h3>
          <p>Start browsing designs and submit your first quote!</p>
          <Link to="/supplier/designs" className="btn-primary">
            Browse Designs
          </Link>
        </div>
      ) : (
        <div className="quotes-grid">
          {filteredQuotes.map((quote) => (
            <div key={quote.id} className="quote-card">
              <div className="quote-card-header">
                <div>
                  <h3>{quote.designTitle}</h3>
                  <p className="quote-designer">by {quote.designerName}</p>
                </div>
                <span className={`status-badge status-${quote.status.toLowerCase()}`}>
                  {quote.status}
                </span>
              </div>

              <div className="quote-card-body">
                <div className="quote-price-section">
                  <div className="price-display">
                    <span className="price-label">Your Quote:</span>
                    <span className="price-value">
                      ${quote.price.toFixed(2)} {quote.currency}
                    </span>
                  </div>
                  <div className="delivery-display">
                    <span className="delivery-icon">🚚</span>
                    <span className="delivery-text">
                      {quote.deliveryTimeInDays} days
                    </span>
                  </div>
                </div>

                <div className="quote-details">
                  <h4>Quote Details:</h4>
                  <p>{quote.quoteText}</p>
                </div>

                <div className="quote-terms">
                  <h4>Terms:</h4>
                  <p>{quote.termsAndConditions}</p>
                </div>

                <div className="quote-meta">
                  <span className="meta-item">
                    Submitted: {new Date(quote.createdAt).toLocaleDateString()}
                  </span>
                  {quote.updatedAt !== quote.createdAt && (
                    <span className="meta-item">
                      Updated: {new Date(quote.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="quote-card-footer">
                {quote.status === 'Accepted' && (
                  <div className="success-message">
                    ✅ Congratulations! Your quote was accepted.
                  </div>
                )}
                {quote.status === 'Rejected' && (
                  <div className="info-message">
                    ℹ️ This quote was not accepted.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {quotes.length > 0 && (
        <div className="quotes-summary">
          <h3>Summary</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <strong>Total Quotes:</strong> {quotes.length}
            </div>
            <div className="summary-item">
              <strong>Acceptance Rate:</strong>{' '}
              {((quotes.filter(q => q.status === 'Accepted').length / quotes.length) * 100).toFixed(1)}%
            </div>
            <div className="summary-item">
              <strong>Total Value:</strong> $
              {quotes.reduce((sum, q) => sum + q.price, 0).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyQuotes;
