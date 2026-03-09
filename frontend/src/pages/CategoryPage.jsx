import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Common/Footer';
import CartPanel from '../components/Cart/CartPanel';
import ProductCard from '../components/Product/ProductCard';
import { productAPI } from '../services/api';

const CATEGORY_INFO = {
  electronics: { name: 'Electronics', icon: '📱', bg: 'linear-gradient(120deg,#0d2137,#1a3a5c)', img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80', desc: 'Phones, Laptops, TVs & More' },
  fashion: { name: 'Fashion', icon: '👗', bg: 'linear-gradient(120deg,#b71c6b,#e91e8c)', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80', desc: 'Clothes, Shoes, Bags & More' },
  home: { name: 'Home & Furniture', icon: '🏡', bg: 'linear-gradient(120deg,#e65100,#ff8f00)', img: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80', desc: 'Decor, Beds, Sofas & More' },
  appliances: { name: 'Appliances', icon: '🧊', bg: 'linear-gradient(120deg,#1565c0,#1976d2)', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', desc: 'AC, Fridge, Washer & More' },
  beauty: { name: 'Beauty & Care', icon: '💄', bg: 'linear-gradient(120deg,#880e4f,#c2185b)', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', desc: 'Skincare, Makeup & More' },
  sports: { name: 'Sports & Fitness', icon: '⚽', bg: 'linear-gradient(120deg,#1b5e20,#388e3c)', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', desc: 'Equipment, Clothing & More' },
  grocery: { name: 'Grocery', icon: '🛒', bg: 'linear-gradient(120deg,#33691e,#558b2f)', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', desc: 'Fresh & Packaged Foods' },
  toys: { name: 'Toys & Games', icon: '🧸', bg: 'linear-gradient(120deg,#e65100,#f57c00)', img: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80', desc: 'Kids Toys, Board Games & More' },
  books: { name: 'Books', icon: '📚', bg: 'linear-gradient(120deg,#4a148c,#7b1fa2)', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80', desc: 'Fiction, Non-fiction & More' },
};

const BRANDS_BY_CAT = {
  electronics: ['Samsung', 'Apple', 'Sony', 'LG', 'JBL', 'OnePlus'],
  fashion: ['Nike', 'Adidas', 'Biba', 'Raymond', 'Craftsvilla'],
  home: ['HomeTown', 'Prestige', 'Milton', 'Pigeon'],
  appliances: ['Whirlpool', 'LG', 'Samsung', 'Prestige'],
  beauty: ['Lakme', 'Nivea', 'Loreal', 'Himalaya'],
  sports: ['Cosco', 'Boldfit', 'Nike', 'Adidas'],
  grocery: ['Cadbury', 'Nestle', 'Britannia'],
  toys: ['LEGO', 'Hasbro', 'Mattel'],
  books: ['Penguin', 'Harper Collins', 'Scholastic'],
};

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const info = CATEGORY_INFO[category] || { name: category, icon: '', bg: 'linear-gradient(120deg,#2874f0,#1a5fd1)', img: '', desc: '' };
  const brands = BRANDS_BY_CAT[category] || [];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category, sortBy]);

  const fetchProducts = async (extraParams = {}) => {
    setLoading(true);
    try {
      const params = { category, sort: sortBy, ...extraParams };
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedRating) params.rating = selectedRating;
      const res = await productAPI.getAll(params);
      let prods = res.data.products;
      if (selectedBrands.length > 0) {
        prods = prods.filter(p => selectedBrands.includes(p.brand));
      }
      setProducts(prods);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const applyFilters = () => fetchProducts();

  const clearFilters = () => {
    setMinPrice(''); setMaxPrice('');
    setSelectedBrands([]); setSelectedRating('');
    fetchProducts({});
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${searchQuery.trim()}`);
  };

  return (
    <>
      <Navbar
        activeCategory={category}
        onCategoryChange={(cat) => navigate(`/category/${cat}`)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      <CartPanel />
      <div className="main">

        {/* BREADCRUMB */}
        <div style={{ fontSize: 13, color: '#878787', marginBottom: 10 }}>
          <span style={{ cursor: 'pointer', color: '#2874f0' }} onClick={() => navigate('/')}>🏠 Home</span>
          {' › '}
          <span style={{ color: '#212121', fontWeight: 600 }}>{info.name}</span>
        </div>

        {/* CATEGORY BANNER */}
        <div style={{ background: info.bg, borderRadius: 4, padding: '30px 40px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 2 }}>Category</div>
            <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{info.icon} {info.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 6 }}>{info.desc}</div>
            <div style={{ marginTop: 12, color: '#ffe500', fontSize: 13, fontWeight: 600 }}>{products.length} Products Available</div>
            <button onClick={() => navigate('/')} style={{ marginTop: 12, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.5)', color: '#fff', padding: '7px 20px', borderRadius: 2, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Hind,sans-serif' }}>🏠 Back to Home</button>
          </div>
          {info.img && <img src={info.img} alt={info.name} style={{ height: 140, width: 200, objectFit: 'cover', borderRadius: 8, opacity: 0.85 }} onError={(e) => e.target.style.display = 'none'} />}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 12, alignItems: 'start' }}>

          {/* LEFT FILTERS */}
          <div className="section" style={{ position: 'sticky', top: 70 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 16, fontWeight: 700 }}>🔧 Filters</div>
              <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#2874f0', fontSize: 12, cursor: 'pointer', fontFamily: 'Hind,sans-serif', fontWeight: 600 }}>Clear All</button>
            </div>

            {/* PRICE FILTER */}
            <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>💰 Price Range</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input type="number" placeholder="Min ₹" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                  style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: 2, padding: '6px 8px', fontSize: 13, fontFamily: 'Hind,sans-serif', outline: 'none' }} />
                <input type="number" placeholder="Max ₹" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: 2, padding: '6px 8px', fontSize: 13, fontFamily: 'Hind,sans-serif', outline: 'none' }} />
              </div>
              {[
                { label: 'Under ₹500', min: '', max: '500' },
                { label: '₹500 - ₹2000', min: '500', max: '2000' },
                { label: '₹2000 - ₹10000', min: '2000', max: '10000' },
                { label: 'Above ₹10000', min: '10000', max: '' },
              ].map((r) => (
                <div key={r.label} onClick={() => { setMinPrice(r.min); setMaxPrice(r.max); }}
                  style={{ fontSize: 13, padding: '5px 0', cursor: 'pointer', color: minPrice === r.min && maxPrice === r.max ? '#2874f0' : '#555', fontWeight: minPrice === r.min && maxPrice === r.max ? 700 : 400 }}>
                  {minPrice === r.min && maxPrice === r.max ? '✓ ' : ''}{r.label}
                </div>
              ))}
            </div>

            {/* RATING FILTER */}
            <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>⭐ Customer Rating</div>
              {['4', '3', '2'].map((r) => (
                <div key={r} onClick={() => setSelectedRating(selectedRating === r ? '' : r)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', cursor: 'pointer' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, border: `2px solid ${selectedRating === r ? '#2874f0' : '#ccc'}`, background: selectedRating === r ? '#2874f0' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedRating === r && <span style={{ color: '#fff', fontSize: 10 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 13, color: '#555' }}>{r}★ & above</span>
                </div>
              ))}
            </div>

            {/* BRAND FILTER */}
            {brands.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>🏷️ Brand</div>
                {brands.map((brand) => (
                  <div key={brand} onClick={() => toggleBrand(brand)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', cursor: 'pointer' }}>
                    <div style={{ width: 16, height: 16, borderRadius: 3, border: `2px solid ${selectedBrands.includes(brand) ? '#2874f0' : '#ccc'}`, background: selectedBrands.includes(brand) ? '#2874f0' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {selectedBrands.includes(brand) && <span style={{ color: '#fff', fontSize: 10 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 13, color: '#555' }}>{brand}</span>
                  </div>
                ))}
              </div>
            )}

            <button onClick={applyFilters} className="btn-primary" style={{ marginTop: 8 }}>Apply Filters</button>
          </div>

          {/* RIGHT PRODUCTS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, background: '#fff', padding: '10px 16px', borderRadius: 4, border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: 14, color: '#878787' }}><strong style={{ color: '#212121' }}>{products.length}</strong> products found</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#878787' }}>Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  style={{ border: '1px solid #e0e0e0', borderRadius: 2, padding: '6px 12px', fontSize: 13, fontFamily: 'Hind,sans-serif', cursor: 'pointer', outline: 'none' }}>
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {loading ? <div className="spinner"></div> :
              products.length === 0 ? (
                <div className="empty-state">
                  <div className="icon">😕</div>
                  <p>No products found in this category</p>
                  <button onClick={clearFilters} className="btn-primary" style={{ width: 'auto', padding: '10px 30px' }}>Clear Filters</button>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
              )
            }
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}