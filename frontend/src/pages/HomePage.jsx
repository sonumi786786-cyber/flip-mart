import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import CartPanel from '../components/Cart/CartPanel';
import ProductCard from '../components/Product/ProductCard';
import Footer from '../components/Common/Footer';
import RecentlyViewed from '../components/Product/RecentlyViewed';
import { productAPI } from '../services/api';

const BANNERS = [
  { title: 'Smartphones', sub: 'Up to 60% OFF', tag: ' Big Sale Live', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', cat: 'electronics', bg: 'linear-gradient(120deg,#0d2137 0%,#1a3a5c 60%,#0d2137 100%)' },
  { title: 'Trending Fashion', sub: 'New arrivals every day', tag: '✨ Fashion Week', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80', cat: 'fashion', bg: 'linear-gradient(120deg,#b71c6b 0%,#e91e8c 60%,#b71c6b 100%)' },
  { title: 'Home & Kitchen', sub: 'Transform your space', tag: '⚡ Flash Sale', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', cat: 'home', bg: 'linear-gradient(120deg,#e65100 0%,#ff8f00 60%,#e65100 100%)' },
  { title: 'Sports & Fitness', sub: 'Get fit, stay healthy', tag: '🌿 Health First', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', cat: 'sports', bg: 'linear-gradient(120deg,#1b5e20 0%,#388e3c 60%,#1b5e20 100%)' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [timer, setTimer] = useState({ h: 5, m: 42, s: 18 });
  const slideInterval = useRef(null);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    try {
      const cleanParams = {};
      if (params.search && params.search.trim() !== '') cleanParams.search = params.search.trim();
      if (params.category && params.category !== 'all') cleanParams.category = params.category;
      if (params.sort) cleanParams.sort = params.sort;
      const res = await productAPI.getAll(cleanParams);
      setProducts(res.data.products);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const fetchDeals = async () => {
    try {
      const res = await productAPI.getAll({ dealOfDay: true, limit: 5 });
      setDealProducts(res.data.products);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    fetchProducts({ category: activeCategory, sort: sortBy });
  }, [activeCategory, sortBy]);

  useEffect(() => { fetchDeals(); }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTimer((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(slideInterval.current);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${searchQuery.trim()}`);
  };

  const handleCategoryChange = (cat) => {
    if (cat === 'all') {
      setActiveCategory('all');
    } else {
      navigate(`/category/${cat}`);
    }
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <>
      <Navbar
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      <CartPanel />
      <div className="main">

        {/* BANNER SLIDER */}
        <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {BANNERS.map((b, i) => (
            <div key={i} style={{ display: i === currentSlide ? 'flex' : 'none', background: b.bg, height: 240, alignItems: 'center', justifyContent: 'space-between', padding: '30px 60px', overflow: 'hidden' }}>
              <div style={{ zIndex: 2 }}>
                <div style={{ background: '#ffe500', color: '#333', padding: '4px 14px', borderRadius: 2, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'inline-block', marginBottom: 10 }}>{b.tag}</div>
                <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{b.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginTop: 6 }}>{b.sub}</div>
                <button onClick={() => navigate(`/category/${b.cat}`)} style={{ marginTop: 18, background: '#fff', color: '#2874f0', border: 'none', padding: '10px 28px', borderRadius: 2, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Hind,sans-serif' }}>Shop Now →</button>
              </div>
              <img src={b.img} alt={b.title} style={{ height: 200, width: 200, objectFit: 'cover', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.4)', zIndex: 2 }} />
            </div>
          ))}
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 3 }}>
            {BANNERS.map((_, i) => (
              <div key={i} onClick={() => setCurrentSlide(i)} style={{ width: 8, height: 8, borderRadius: '50%', background: i === currentSlide ? '#fff' : 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.2s' }} />
            ))}
          </div>
          <button onClick={() => setCurrentSlide((currentSlide - 1 + 4) % 4)} style={{ position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: 38, height: 38, borderRadius: '50%', cursor: 'pointer', fontSize: 22, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <button onClick={() => setCurrentSlide((currentSlide + 1) % 4)} style={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: 38, height: 38, borderRadius: '50%', cursor: 'pointer', fontSize: 22, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
        </div>

        {/* DEAL OF THE DAY */}
        {dealProducts.length > 0 && (
          <div className="section">
            <div className="section-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="section-title">⚡ Deal of the Day</div>
                <div className="timer-box">
                  <span style={{ fontSize: 13, color: '#878787' }}>Ends in:</span>
                  <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
                    <div className="t-unit">{pad(timer.h)}</div>
                    <span style={{ fontWeight: 700, fontSize: 18 }}>:</span>
                    <div className="t-unit">{pad(timer.m)}</div>
                    <span style={{ fontWeight: 700, fontSize: 18 }}>:</span>
                    <div className="t-unit">{pad(timer.s)}</div>
                  </div>
                </div>
              </div>
              <button className="view-all-btn">View All →</button>
            </div>
            <div className="products-grid">
              {dealProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}

        {/* SHOP BY CATEGORY */}
        <div className="section">
          <div className="section-head">
            <div className="section-title">🛍️ Shop by Category</div>
          </div>
          <div className="cat-grid">
            {[
              { id: 'electronics', name: 'Electronics', sub: 'Phones, Laptops, TVs', offer: 'Up to 60% off', img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80' },
              { id: 'fashion', name: 'Fashion', sub: 'Clothes, Shoes, Bags', offer: 'Min 40% off', img: 'https://images.pexels.com/photos/349494/pexels-photo-349494.jpeg' },
              { id: 'home', name: 'Home & Furniture', sub: 'Decor, Beds, Sofas', offer: 'Up to 55% off', img: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80' },
              { id: 'appliances', name: 'Appliances', sub: 'AC, Fridge, Washer', offer: 'Upto ₹5000 off', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
            ].map((cat) => (
              <div key={cat.id} className="cat-card" onClick={() => navigate(`/category/${cat.id}`)}>
                <img src={cat.img} alt={cat.name} />
                <div className="cat-card-body">
                  <div className="cat-card-name">{cat.name}</div>
                  <div className="cat-card-sub">{cat.sub}</div>
                  <div className="cat-card-offer">{cat.offer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MINI BANNERS */}
        <div className="banner-row">
          <div className="mini-banner mini-banner-1" onClick={() => navigate('/category/beauty')}>
            <div>
              <h3>Beauty & Care</h3>
              <p>Skincare, Makeup & More</p>
              <button>Shop Now</button>
            </div>
            <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80" alt="Beauty" />
          </div>
          <div className="mini-banner mini-banner-2" onClick={() => navigate('/category/books')}>
            <div>
              <h3>Books & Stationery</h3>
              <p>Read, Learn & Grow</p>
              <button>Explore</button>
            </div>
            <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&q=80" alt="Books" />
          </div>
        </div>

        {/* RECENTLY VIEWED */}
        <RecentlyViewed />

        {/* ALL PRODUCTS */}
        <div className="section">
          <div className="section-head">
            <div className="section-title">🌟 Recommended for You</div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              style={{ border: '1px solid #e0e0e0', borderRadius: 2, padding: '6px 12px', fontSize: 13, fontFamily: 'Hind,sans-serif', cursor: 'pointer', outline: 'none' }}>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
          {loading ? (
            <div className="spinner"></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="icon">😕</div>
              <p>No products found</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>

      </div>
      <Footer />
    </>
  );
}