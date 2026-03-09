import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Common/Footer';
import CartPanel from '../components/Cart/CartPanel';
import ProductCard from '../components/Product/ProductCard';
import { productAPI } from '../services/api';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    setSearchQuery(query);
    if (query) fetchProducts();
  }, [query, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productAPI.getAll({ search: query, sort: sortBy });
      setProducts(res.data.products);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${searchQuery.trim()}`);
  };

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onCategoryChange={(cat) => navigate(`/category/${cat}`)}
      />
      <CartPanel />
      <div className="main">

        {/* BREADCRUMB + BACK BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#2874f0', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Hind,sans-serif', padding: 0 }}>
            🏠 Home
          </button>
          <span style={{ color: '#878787' }}>›</span>
          <span style={{ fontSize: 14, color: '#878787' }}>Search results for <strong style={{ color: '#212121' }}>"{query}"</strong></span>
        </div>

        {/* RESULTS COUNT + SORT */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px 16px', borderRadius: 4, border: '1px solid #e0e0e0', marginBottom: 12 }}>
          <div style={{ fontSize: 14, color: '#878787' }}>
            <strong style={{ color: '#212121' }}>{products.length}</strong> results found for "<strong>{query}</strong>"
          </div>
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

        {/* PRODUCTS */}
        {loading ? <div className="spinner"></div> :
          products.length === 0 ? (
            <div className="empty-state">
              <div className="icon">😕</div>
              <p>No results found for "{query}"</p>
              <button className="btn-primary" onClick={() => navigate('/')} style={{ width: 'auto', padding: '10px 30px' }}>🏠 Back to Home</button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )
        }
      </div>
      <Footer />
    </>
  );
}