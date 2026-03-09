import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore, useDarkModeStore } from '../../store';
import AuthModal from '../Auth/AuthModal';

const CATEGORIES = [
  { id: 'all', label: 'All', image: 'https://your-domain.com/images/all.png' },
  { id: 'electronics', label: 'Electronics', image: 'https://your-domain.com/images/electronics.png' },
  { id: 'fashion', label: 'Fashion', image: 'https://your-domain.com/images/fashion.png' },
  { id: 'home', label: 'Home', image: 'https://your-domain.com/images/home.png' },
  { id: 'appliances', label: 'Appliances', image: 'https://your-domain.com/images/appliances.png' },
  { id: 'beauty', label: 'Beauty', image: 'https://your-domain.com/images/beauty.png' },
  { id: 'sports', label: 'Sports', image: 'https://your-domain.com/images/sports.png' },
  { id: 'grocery', label: 'Grocery', image: 'https://your-domain.com/images/grocery.png' },
  { id: 'toys', label: 'Toys', image: 'https://your-domain.com/images/toys.png' },
  { id: 'books', label: 'Books', image: 'https://your-domain.com/images/books.png' },
];

export default function Navbar({ activeCategory, onCategoryChange, searchQuery, setSearchQuery, onSearch }) {
  const [showAuth, setShowAuth] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuthStore();
  const { cart, openCart, fetchCart } = useCartStore();
  const { isDark, toggle } = useDarkModeStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(e);
  };

  const handleCategoryClick = (catId) => {
    if (onCategoryChange) {
      onCategoryChange(catId);
    } else {
      navigate(`/category/${catId}`);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-inner">
          <Link to="/" className="logo">
            <div className="logo-name">Flip<span>Mart</span></div>
            <div className="logo-tag">✦ Explore Plus</div>
          </Link>

          <form className="searchbox" onSubmit={handleSubmit}>
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more"
            />
            <button type="submit" className="search-btn">🔍</button>
          </form>

          <div className="nav-right">
            {user ? (
              <div style={{ position: 'relative' }}>
                <button className="btn-login" onClick={() => setShowUserMenu(!showUserMenu)}>
                  👤 {user.name.split(' ')[0]}
                </button>
                {showUserMenu && (
                  <div style={{ position: 'absolute', top: '110%', right: 0, background: isDark ? '#1e1e1e' : '#fff', border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`, borderRadius: 4, minWidth: 160, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', zIndex: 100 }}>
                    <Link to="/profile" style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: isDark ? '#e0e0e0' : '#212121', textDecoration: 'none' }} onClick={() => setShowUserMenu(false)}>👤 My Profile</Link>
                    <Link to="/orders" style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: isDark ? '#e0e0e0' : '#212121', textDecoration: 'none' }} onClick={() => setShowUserMenu(false)}>📦 My Orders</Link>
                    <Link to="/wishlist" style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: isDark ? '#e0e0e0' : '#212121', textDecoration: 'none' }} onClick={() => setShowUserMenu(false)}>❤️ Wishlist</Link>
                    <Link to="/support" style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: isDark ? '#e0e0e0' : '#212121', textDecoration: 'none' }} onClick={() => setShowUserMenu(false)}>🤖 Support</Link>
                    <div style={{ borderTop: `1px solid ${isDark ? '#333' : '#e0e0e0'}` }}></div>
                    <button onClick={() => { logout(); setShowUserMenu(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 14, color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Hind, sans-serif' }}>🚪 Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn-login" onClick={() => setShowAuth(true)}>Login</button>
            )}

            <a className="nav-link" onClick={() => !user ? setShowAuth(true) : navigate('/orders')} style={{ cursor: 'pointer' }}>
              📦 Orders
            </a>

            <a className="nav-link" onClick={() => navigate('/support')} style={{ cursor: 'pointer' }}>
              🤖 Support
            </a>

            <a className="nav-link cart-wrap" onClick={openCart} style={{ cursor: 'pointer' }}>
              🛒 Cart
              {cart?.totalItems > 0 && (
                <span className="cart-badge">{cart.totalItems}</span>
              )}
            </a>

            {/* 🌙 DARK MODE TOGGLE */}
            <button onClick={toggle} title={isDark ? 'Light Mode' : 'Dark Mode'}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', padding: '6px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      <div className="catbar">
        <div className="catbar-inner">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`cat-item ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}