import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../../store';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const [wished, setWished] = useState(false);
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) { toast.error('Please login first!'); return; }
    try {
      const res = await authAPI.toggleWishlist(product._id);
      setWished(res.data.inWishlist);
      toast.success(res.data.message);
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart(product._id);
  };

  const img = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=300';

  return (
    <div className="prod-card" onClick={() => navigate(`/product/${product._id}`)}>
      {product.discount > 0 && <div className="prod-badge">{product.discount}% OFF</div>}
      <button className={`wish-btn ${wished ? 'on' : ''}`} onClick={handleWishlist}>
        {wished ? '♥' : '♡'}
      </button>
      <div className="prod-img-wrap">
        <img
          className="prod-img"
          src={img}
          alt={product.name}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=300'; }}
        />
      </div>
      <div className="prod-name">{product.name}</div>
      {product.ratings > 0 && (
        <div style={{ marginBottom: 6 }}>
          <span className="prod-rating">★ {product.ratings}</span>
          <span style={{ fontSize: 11, color: '#878787', marginLeft: 4 }}>({product.numReviews?.toLocaleString()})</span>
        </div>
      )}
      <div className="prod-price">
        <span className="price-main">₹{product.price?.toLocaleString()}</span>
        {product.oldPrice > 0 && <span className="price-old">₹{product.oldPrice?.toLocaleString()}</span>}
        {product.discount > 0 && <span className="price-off">{product.discount}% off</span>}
      </div>
      <button className="add-cart-btn" onClick={handleAddToCart}>+ Add to Cart</button>
    </div>
  );
}