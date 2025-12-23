import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { designAPI, quoteAPI } from '../../services/api';

function DesignerDashboard() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDesigns: 0,
    activeDesigns: 0,
    totalQuotes: 0,
    acceptedQuotes: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const designsResponse = await designAPI.getByDesigner(user.userId);
      const designsData = designsResponse.data;
      setDesigns(designsData);

      // Fetch quotes for all designs
      const allQuotes = [];
      for (const design of designsData) {
        try {
          const quotesResponse = await quoteAPI.getByDesign(design.id);
          allQuotes.push(...quotesResponse.data);
        } catch (err) {
          console.error('Error fetching quotes:', err);
        }
      }
      setQuotes(allQuotes);

      // Calculate stats
      setStats({
        totalDesigns: designsData.length,
        activeDesigns: designsData.filter(d => 
          ['Published', 'QuotingOpen'].includes(d.status)
        ).length,
        totalQuotes: allQuotes.length,
        acceptedQuotes: allQuotes.filter(q => q.status === 'Accepted').length,
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
        <h1>Designer Dashboard</h1>
        <p>Welcome back, {user.firstName}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📐</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalDesigns}</div>
            <div className="stat-label">Total Designs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎨</div>
          <div className="stat-info">
            <div className="stat-value">{stats.activeDesigns}</div>
            <div className="stat-label">Active Designs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalQuotes}</div>
            <div className="stat-label">Quotes Received</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.acceptedQuotes}</div>
            <div className="stat-label">Accepted Quotes</div>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/designer/new-design" className="btn-primary">
          + New Design
        </Link>
        <Link to="/designer/designs" className="btn-outline">
          View All Designs
        </Link>
      </div>

      <div className="dashboard-sections">
        <section className="dashboard-section">
          <h2>Recent Designs</h2>
          {designs.length === 0 ? (
            <div className="empty-state">
              <p>No designs yet. Create your first design to get started!</p>
              <Link to="/designer/new-design" className="btn-primary">
                Create Design
              </Link>
            </div>
          ) : (
            <div className="designs-list">
              {designs.slice(0, 3).map((design) => (
                <div key={design.id} className="design-card-mini">
                  <div className="design-info">
                    <h3>{design.title}</h3>
                    <p className="design-category">{design.category}</p>
                    <span className={`status-badge status-${design.status.toLowerCase()}`}>
                      {design.status}
                    </span>
                  </div>
                  <div className="design-stats-mini">
                    <span>{design.quoteCount} quotes</span>
                    <Link to={`/designer/designs/${design.id}`} className="btn-small">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h2>Recent Quotes</h2>
          {quotes.length === 0 ? (
            <div className="empty-state">
              <p>No quotes received yet.</p>
            </div>
          ) : (
            <div className="quotes-list">
              {quotes.slice(0, 5).map((quote) => (
                <div key={quote.id} className="quote-card-mini">
                  <div className="quote-info">
                    <strong>{quote.supplierName}</strong>
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

export default DesignerDashboard;
