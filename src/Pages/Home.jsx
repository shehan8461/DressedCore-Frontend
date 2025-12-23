import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">🌟 #1 Fashion Design Platform</div>
          <h1 className="hero-title">
            Transform Your Fashion Ideas
            <span className="gradient-text"> Into Reality</span>
          </h1>
          <p className="hero-subtitle">
            Connect with world-class manufacturers and bring your designs to life.
            <br />The most trusted platform for fashion designers and suppliers worldwide.
          </p>
          
          {!user ? (
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary btn-large hero-btn-primary">
                <span>Get Started Free</span>
                <span className="btn-arrow">→</span>
              </Link>
              <Link to="/login" className="btn-secondary btn-large hero-btn-secondary">
                <span>Sign In</span>
              </Link>
            </div>
          ) : (
            <div className="hero-buttons">
              <Link 
                to={user.userType === 1 ? '/designer/dashboard' : '/supplier/dashboard'} 
                className="btn-primary btn-large hero-btn-primary"
              >
                <span>Go to Dashboard</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          )}
          
          <div className="hero-trust">
            <div className="trust-item">
              <span className="trust-check">✓</span>
              <span>No Credit Card Required</span>
            </div>
            <div className="trust-item">
              <span className="trust-check">✓</span>
              <span>Free 30-Day Trial</span>
            </div>
            <div className="trust-item">
              <span className="trust-check">✓</span>
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">2,500+</div>
            <div className="stat-label">Active Designers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">850+</div>
            <div className="stat-label">Verified Suppliers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Designs Created</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">$15M+</div>
            <div className="stat-label">Orders Processed</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="section-header">
            <span className="section-badge">Why Choose Us</span>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-description">
              Powerful tools and features designed to streamline your fashion business
            </p>
          </div>
          
          <div className="feature-grid">
            <div className="feature-card designer-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🎨</div>
              </div>
              <h3>For Fashion Designers</h3>
              <p className="feature-description">
                Upload your designs and connect with top manufacturers ready to bring your vision to life.
              </p>
              <ul className="feature-list">
                <li><span className="list-icon">✓</span>Upload unlimited design concepts</li>
                <li><span className="list-icon">✓</span>Receive competitive quotes within 24h</li>
                <li><span className="list-icon">✓</span>Compare suppliers and prices easily</li>
                <li><span className="list-icon">✓</span>Secure payment & order tracking</li>
                <li><span className="list-icon">✓</span>Quality assurance guarantee</li>
              </ul>
              {!user && (
                <Link to="/register" className="btn-outline feature-btn">
                  Start as Designer →
                </Link>
              )}
            </div>

            <div className="feature-card supplier-card featured">
              <div className="featured-badge">Most Popular</div>
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🏭</div>
              </div>
              <h3>For Manufacturers</h3>
              <p className="feature-description">
                Access thousands of design projects and grow your manufacturing business.
              </p>
              <ul className="feature-list">
                <li><span className="list-icon">✓</span>Browse verified design projects</li>
                <li><span className="list-icon">✓</span>Submit competitive quotations</li>
                <li><span className="list-icon">✓</span>Direct designer communication</li>
                <li><span className="list-icon">✓</span>Automated order management</li>
                <li><span className="list-icon">✓</span>Build reputation & reviews</li>
              </ul>
              {!user && (
                <Link to="/register" className="btn-primary feature-btn">
                  Start as Supplier →
                </Link>
              )}
            </div>

            <div className="feature-card platform-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">⚡</div>
              </div>
              <h3>Platform Benefits</h3>
              <p className="feature-description">
                Enterprise-grade security and features to protect your business.
              </p>
              <ul className="feature-list">
                <li><span className="list-icon">✓</span>Bank-level security encryption</li>
                <li><span className="list-icon">✓</span>Automated invoice generation</li>
                <li><span className="list-icon">✓</span>24/7 customer support</li>
                <li><span className="list-icon">✓</span>Dispute resolution service</li>
                <li><span className="list-icon">✓</span>Performance analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="features-container">
          <div className="section-header">
            <span className="section-badge">Simple Process</span>
            <h2 className="section-title">How Dressed™ Works</h2>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Create Account</h3>
              <p>Sign up as a designer or supplier in less than 2 minutes. No credit card required.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Submit or Browse</h3>
              <p>Designers upload designs, suppliers browse and submit competitive quotes.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Connect & Order</h3>
              <p>Review proposals, negotiate terms, and place orders with confidence.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">04</div>
              <h3>Track & Deliver</h3>
              <p>Monitor production progress and receive your products on time, every time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="features-container">
          <div className="section-header">
            <span className="section-badge">Success Stories</span>
            <h2 className="section-title">Loved by Designers & Suppliers</h2>
          </div>
          
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Dressed™ transformed my fashion business. I found reliable manufacturers and scaled from 100 to 10,000 units in just 6 months!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SK</div>
                <div>
                  <div className="author-name">Sarah Kim</div>
                  <div className="author-role">Fashion Designer, NYC</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "As a supplier, this platform connected us with amazing designers worldwide. Our revenue increased by 300% in the first year."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">JL</div>
                <div>
                  <div className="author-name">James Liu</div>
                  <div className="author-role">Manufacturer, California</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "The quality of suppliers and the ease of communication is outstanding. I've launched 3 successful collections using Dressed™!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">MP</div>
                <div>
                  <div className="author-name">Maria Perez</div>
                  <div className="author-role">Independent Designer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Fashion Business?</h2>
          <p className="cta-description">
            Join 2,500+ designers and 850+ suppliers already succeeding with Dressed™
          </p>
          {!user && (
            <div className="cta-buttons">
              <Link to="/register" className="btn-primary btn-large cta-btn">
                Start Free Trial →
              </Link>
              <Link to="/login" className="btn-outline btn-large cta-btn-outline">
                Sign In
              </Link>
            </div>
          )}
          <p className="cta-note">No credit card required • Cancel anytime • 30-day money-back guarantee</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
