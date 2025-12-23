import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { quoteAPI, designAPI } from '../../services/api';

function SupplierDashboard() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuotes: 0,
    acceptedQuotes: 0,
    pendingQuotes: 0,
    availableDesigns: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [quotesResponse, designsResponse] = await Promise.all([
        quoteAPI.getBySupplier(user.userId),
        designAPI.getAll(),
      ]);
      
      const quotesData = quotesResponse.data;
      const designsData = designsResponse.data;
      
      setQuotes(quotesData);
      setDesigns(designsData);

      // Calculate stats
      setStats({
        totalQuotes: quotesData.length,
        acceptedQuotes: quotesData.filter(q => q.status === 'Accepted').length,
        pendingQuotes: quotesData.filter(q => q.status === 'Submitted').length,
        availableDesigns: designsData.filter(d => 
          ['Published', 'QuotingOpen'].includes(d.status)
        ).length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Supplier Dashboard</h1>
        <p>Welcome back, {user.firstName}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalQuotes}</div>
            <div className="stat-label">Total Quotes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.acceptedQuotes}</div>
            <div className="stat-label">Accepted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pendingQuotes}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎨</div>
          <div className="stat-info">
            <div className="stat-value">{stats.availableDesigns}</div>
            <div className="stat-label">Available Designs</div>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/supplier/designs" className="btn-primary">
          Browse Designs
        </Link>
        <Link to="/supplier/quotes" className="btn-outline">
          View My Quotes
        </Link>
      </div>

      <div className="dashboard-sections">
        <section className="dashboard-section">
          <h2>Recent Designs</h2>
          {designs.length === 0 ? (
            <div className="empty-state">
              <p>No designs available at the moment.</p>
            </div>
          ) : (
            <div className="designs-list">
              {designs.slice(0, 3).map((design) => (
                <div key={design.id} className="design-card-mini">
                  <div className="design-info">
                    <h3>{design.title}</h3>
                    <p className="design-category">{design.category}</p>
                    <p className="design-quantity">Qty: {design.quantity}</p>
                  </div>
                  <div className="design-stats-mini">
                    <span>{design.quoteCount} quotes</span>
                    <Link to={`/supplier/designs/${design.id}`} className="btn-small">
                      View & Quote
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h2>My Recent Quotes</h2>
          {quotes.length === 0 ? (
            <div className="empty-state">
              <p>No quotes submitted yet. Start by browsing designs!</p>
              <Link to="/supplier/designs" className="btn-primary">
                Browse Designs
              </Link>
            </div>
          ) : (
            <div className="quotes-list">
              {quotes.slice(0, 5).map((quote) => (
                <div key={quote.id} className="quote-card-mini">
                  <div className="quote-info">
                    <strong>{quote.designTitle}</strong>
                    <p className="quote-price">${quote.price.toFixed(2)}</p>
                    <p className="quote-delivery">{quote.deliveryTimeInDays} days</p>
                  </div>
                  <span className={`status-badge status-${quote.status.toLowerCase()}`}>
                    {quote.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default SupplierDashboard;
