import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { designAPI } from '../../services/api';

function BrowseDesigns() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['All', 'Men', 'Women', 'Boy', 'Girl', 'Unisex'];

  useEffect(() => {
    fetchDesigns();
  }, [selectedCategory]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const category = selectedCategory === 'All' || !selectedCategory ? '' : selectedCategory;
      const response = await designAPI.getAll(category);
      
      // Filter to show only published or quoting open designs
      const availableDesigns = response.data.filter(d => 
        ['Published', 'QuotingOpen'].includes(d.status)
      );
      
      setDesigns(availableDesigns);
    } catch (error) {
      console.error('Error fetching designs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading designs...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Browse Designs</h1>
          <p>Find designs to quote on</p>
        </div>
      </div>

      <div className="filter-bar">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${
              (category === 'All' && !selectedCategory) || selectedCategory === category
                ? 'active'
                : ''
            }`}
            onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
          >
            {category}
          </button>
        ))}
      </div>

      {designs.length === 0 ? (
        <div className="empty-state">
          <h3>No designs available</h3>
          <p>Check back later for new design submissions.</p>
        </div>
      ) : (
        <div className="designs-grid">
          {designs.map((design) => (
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
                    <span className="meta-label">Designer:</span>
                    <span className="meta-value">{design.designerName}</span>
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

                <div className="design-stats">
                  <span className="stat-item">
                    <strong>{design.quoteCount}</strong> quotes received
                  </span>
                </div>
              </div>

              <div className="design-card-footer">
                <Link
                  to={`/supplier/designs/${design.id}`}
                  className="btn-primary btn-small"
                >
                  View Details & Quote
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseDesigns;
