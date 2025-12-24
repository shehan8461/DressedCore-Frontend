import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import messageAPI from '../services/messageAPI';

function Navbar() {
  const { user, logout, isDesigner, isSupplier } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUnreadCount = async () => {
    try {
      const data = await messageAPI.getUnreadCount();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-logo">👗</span> Dressed™
        </Link>
        
        <div className="navbar-menu">
          {user ? (
            <>
              {isDesigner() && (
                <>
                  <Link to="/designer/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/designer/designs" className="nav-link">My Designs</Link>
                  <Link to="/designer/new-design" className="nav-link">New Design</Link>
                  <Link to="/messages" className="nav-link">
                    💬 Messages
                    {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                  </Link>
                  <Link to="/payments" className="nav-link">💳 Payments</Link>
                </>
              )}
              
              {isSupplier() && (
                <>
                  <Link to="/supplier/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/supplier/designs" className="nav-link">Browse Designs</Link>
                  <Link to="/supplier/quotes" className="nav-link">My Quotes</Link>
                  <Link to="/messages" className="nav-link">
                    💬 Messages
                    {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                  </Link>
                  <Link to="/payments" className="nav-link">💳 Payments</Link>
                </>
              )}
              
              <div className="user-menu">
                <span className="user-name">
                  {user.firstName} {user.lastName}
                </span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
