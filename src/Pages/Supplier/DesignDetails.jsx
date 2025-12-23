import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { designAPI, quoteAPI } from '../../services/api';

function DesignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [existingQuotes, setExistingQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteData, setQuoteData] = useState({
    price: '',
    currency: 'USD',
    deliveryTimeInDays: '',
    quoteText: '',
    termsAndConditions: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDesignData();
  }, [id]);

  const fetchDesignData = async () => {
    try {
      setLoading(true);
      const [designResponse, quotesResponse] = await Promise.all([
        designAPI.getById(id),
        quoteAPI.getByDesign(id),
      ]);
      setDesign(designResponse.data);
      setExistingQuotes(quotesResponse.data);
    } catch (error) {
      console.error('Error fetching design:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteChange = (e) => {
    setQuoteData({
      ...quoteData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await quoteAPI.create({
        designId: parseInt(id),
        price: parseFloat(quoteData.price),
        currency: quoteData.currency,
        deliveryTimeInDays: parseInt(quoteData.deliveryTimeInDays),
        quoteText: quoteData.quoteText,
        termsAndConditions: quoteData.termsAndConditions,
      });

      alert('Quote submitted successfully!');
      navigate('/supplier/quotes');
    } catch (error) {
      alert('Failed to submit quote: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading design details...</div>;
  }

  if (!design) {
    return <div className="error-message">Design not found</div>;
  }

  return (
    <div className="page-container">
      <Link to="/supplier/designs" className="back-link">
        ← Back to Browse Designs
      </Link>

      <div className="design-details-container">
        <div className="design-details-card">
          <div className="design-details-header">
            <h1>{design.title}</h1>
            <span className={`status-badge status-${design.status.toLowerCase()}`}>
              {design.status}
            </span>
          </div>

          <div className="design-details-body">
            <section className="detail-section">
              <h3>Description</h3>
              <p>{design.description}</p>
            </section>

            <section className="detail-section">
              <h3>Specifications</h3>
              <p className="specifications-text">{design.specifications}</p>
            </section>

            <section className="detail-section">
              <h3>Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <strong>Category:</strong>
                  <span>{design.category}</span>
                </div>
                <div className="detail-item">
                  <strong>Quantity:</strong>
                  <span>{design.quantity}</span>
                </div>
                <div className="detail-item">
                  <strong>Designer:</strong>
                  <span>{design.designerName}</span>
                </div>
                {design.deadline && (
                  <div className="detail-item">
                    <strong>Deadline:</strong>
                    <span>{new Date(design.deadline).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="detail-item">
                  <strong>Posted:</strong>
                  <span>{new Date(design.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <strong>Existing Quotes:</strong>
                  <span>{existingQuotes.length}</span>
                </div>
              </div>
            </section>

            <section className="detail-section">
              <h3>Design Files</h3>
              <div className="files-list">
                {design.fileUrls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-link-large"
                  >
                    📎 File {index + 1}
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="quote-section">
          {!showQuoteForm ? (
            <div className="quote-prompt">
              <h3>Interested in this project?</h3>
              <p>Submit your quotation to the designer</p>
              <button
                onClick={() => setShowQuoteForm(true)}
                className="btn-primary btn-large"
              >
                Submit Quote
              </button>

              {existingQuotes.length > 0 && (
                <div className="existing-quotes-info">
                  <h4>Competition Analysis</h4>
                  <div className="competition-stats">
                    <div className="stat-item">
                      <span className="stat-label">Lowest Quote:</span>
                      <span className="stat-value">
                        ${Math.min(...existingQuotes.map(q => q.price)).toFixed(2)}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Average Quote:</span>
                      <span className="stat-value">
                        ${(existingQuotes.reduce((sum, q) => sum + q.price, 0) / existingQuotes.length).toFixed(2)}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Fastest Delivery:</span>
                      <span className="stat-value">
                        {Math.min(...existingQuotes.map(q => q.deliveryTimeInDays))} days
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="quote-form-container">
              <h3>Submit Your Quote</h3>
              <form onSubmit={handleSubmitQuote} className="quote-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price *</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={quoteData.price}
                      onChange={handleQuoteChange}
                      required
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="currency">Currency</label>
                    <select
                      id="currency"
                      name="currency"
                      value={quoteData.currency}
                      onChange={handleQuoteChange}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="LKR">LKR</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="deliveryTimeInDays">Delivery Time (Days) *</label>
                  <input
                    type="number"
                    id="deliveryTimeInDays"
                    name="deliveryTimeInDays"
                    value={quoteData.deliveryTimeInDays}
                    onChange={handleQuoteChange}
                    required
                    min="1"
                    placeholder="e.g., 30"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quoteText">Quote Details *</label>
                  <textarea
                    id="quoteText"
                    name="quoteText"
                    value={quoteData.quoteText}
                    onChange={handleQuoteChange}
                    required
                    rows="4"
                    placeholder="Describe your offer, capabilities, quality assurance, etc."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="termsAndConditions">Terms & Conditions *</label>
                  <textarea
                    id="termsAndConditions"
                    name="termsAndConditions"
                    value={quoteData.termsAndConditions}
                    onChange={handleQuoteChange}
                    required
                    rows="3"
                    placeholder="Payment terms, warranty, shipping terms, etc."
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowQuoteForm(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Quote'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DesignDetails;
