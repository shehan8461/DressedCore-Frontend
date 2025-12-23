import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { designAPI } from '../../services/api';

function NewDesign() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Women',
    fileUrls: '',
    quantity: 100,
    specifications: '',
    deadline: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Parse file URLs (comma-separated)
      const fileUrlsArray = formData.fileUrls
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const designData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        fileUrls: fileUrlsArray,
        quantity: parseInt(formData.quantity),
        specifications: formData.specifications,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      };

      console.log('Submitting design data:', designData);
      await designAPI.create(designData);
      navigate('/designer/designs');
    } catch (err) {
      console.error('Design submission error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to create design';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Submit New Design</h1>
        <p>Share your design with suppliers and receive quotes</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label htmlFor="title">Design Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Summer Collection - Floral Dress"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describe your design, materials, style, etc."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Boy">Boy</option>
              <option value="Girl">Girl</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              placeholder="100"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="fileUrls">Design Files (URLs) *</label>
          <input
            type="text"
            id="fileUrls"
            name="fileUrls"
            value={formData.fileUrls}
            onChange={handleChange}
            required
            placeholder="https://example.com/design1.pdf, https://example.com/design2.jpg"
          />
          <small>Enter comma-separated URLs for your design files (images, PDFs)</small>
        </div>

        <div className="form-group">
          <label htmlFor="specifications">Specifications *</label>
          <textarea
            id="specifications"
            name="specifications"
            value={formData.specifications}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Material, sizes, colors, packaging requirements, etc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Deadline (Optional)</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/designer/designs')}
            className="btn-outline"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Design'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewDesign;
