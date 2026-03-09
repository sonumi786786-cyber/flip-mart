import { useNavigate } from 'react-router-dom';
import { useRecentlyViewedStore } from '../../store';
import ProductCard from './ProductCard';

export default function RecentlyViewed() {
  const { items, clearAll } = useRecentlyViewedStore();
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <div className="section">
      <div className="section-head">
        <div className="section-title">🕐 Recently Viewed</div>
        <button onClick={clearAll} style={{ background: 'none', border: 'none', color: '#878787', fontSize: 13, cursor: 'pointer', fontFamily: 'Hind,sans-serif' }}>Clear All</button>
      </div>
      <div className="products-grid">
        {items.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}