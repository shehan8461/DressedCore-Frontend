import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { designAPI } from '../../services/api';

function MyDesigns() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDesigns();
  }, [user]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const response = await designAPI.getByDesigner(user.userId);
      setDesigns(response.data);
    } catch (error) {
      console.error('Error fetching designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDesigns = designs.filter(design => {
    if (filter === 'all') return true;
    return design.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return <div className="loading">Loading designs...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>My Designs</h1>
          <p>Manage your design submissions</p>
        </div>
        <Link to="/designer/new-design" className="btn-primary">
          + New Design
        </Link>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({designs.length})
        </button>
        <button
          className={`filter-btn ${filter === 'published' ? 'active' : ''}`}
          onClick={() => setFilter('published')}
        >
          Published
        </button>
        <button
          className={`filter-btn ${filter === 'quotingopen' ? 'active' : ''}`}
          onClick={() => setFilter('quotingopen')}
        >
          Quoting Open
        </button>
        <button
          className={`filter-btn ${filter === 'ordered' ? 'active' : ''}`}
          onClick={() => setFilter('ordered')}
        >
          Ordered
        </button>
      </div>

      {filteredDesigns.length === 0 ? (
        <div className="empty-state">
          <h3>No designs found</h3>
          <p>Create your first design to get started!</p>
          <Link to="/designer/new-design" className="btn-primary">
            Create Design
          </Link>
        </div>
      ) : (
        <div className="designs-grid">
          {filteredDesigns.map((design) => (
            <div key={design.id} className="design-card">
              <div className="design-card-header">
                <h3>{design.title}</h3>
                <span className={`status-badge status-${design.status.toLowerCase()}`}>
                  {design.status}
                </span>
              </div>

              <div className="design-card-body">
                <p className="design-description">{design.description}</p>
                
                <div className="design-meta">
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">{design.category}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Quantity:</span>
                    <span className="meta-value">{design.quantity}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Quotes:</span>
                    <span className="meta-value">{design.quoteCount}</span>
                  </div>
                  {design.deadline && (
                    <div className="meta-item">
                      <span className="meta-label">Deadline:</span>
                      <span className="meta-value">
                        {new Date(design.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="design-files">
                  <strong>Files:</strong>
                  {design.fileUrls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      File {index + 1}
                    </a>
                  ))}
                </div>
              </div>

              <div className="design-card-footer">
                {/* <Link
                  to={`/designer/designs/${design.id}`}
                  className="btn-outline btn-small"
                >
                  View Details
                </Link> */}
                <Link
                  to={`/designer/designs/${design.id}/quotes`}
                  className="btn-primary btn-small"
                >
                  View Quotes ({design.quoteCount})
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyDesigns;
