import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Common/Footer';
import CartPanel from '../components/Cart/CartPanel';
import { productAPI } from '../services/api';
import { useCartStore, useAuthStore, useRecentlyViewedStore } from '../store';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const { addProduct } = useRecentlyViewedStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', photos: [] });
  const [photoUrls, setPhotoUrls] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => { fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await productAPI.getOne(id);
      setProduct(res.data.product);
      addProduct(res.data.product);
    } catch (err) {
      toast.error('Product not found!');
      navigate('/');
    }
    setLoading(false);
  };

  const handleAddToCart = async () => { await addToCart(product._id, quantity); };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first!'); return; }
    setSubmitting(true);
    try {
      const photos = photoUrls.split('\n').map(u => u.trim()).filter(u => u !== '');
      await productAPI.addReview(id, { ...reviewForm, photos });
      toast.success('Review added! ⭐');
      fetchProduct();
      setReviewForm({ rating: 5, comment: '', photos: [] });
      setPhotoUrls('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add review');
    }
    setSubmitting(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${searchQuery.trim()}`);
  };

  const starColor = (r) => r >= 4 ? '#388e3c' : r >= 3 ? '#ff9f00' : '#ff4d4d';

  if (loading) return (
    <>
      <Navbar />
      <CartPanel />
      <div className="main"><div className="spinner"></div></div>
    </>
  );

  if (!product) return null;

  const imgUrl = product.images?.[selectedImg]?.url || 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=400';

  // Rating breakdown
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: product.reviews?.filter(r => r.rating === star).length || 0,
  }));

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

        {/* BREADCRUMB */}
        <div style={{ fontSize: 13, color: '#878787', marginBottom: 10 }}>
          <span style={{ cursor: 'pointer', color: '#2874f0' }} onClick={() => navigate('/')}>🏠 Home</span>
          {' › '}
          <span style={{ cursor: 'pointer', color: '#2874f0', textTransform: 'capitalize' }} onClick={() => navigate(`/category/${product.category}`)}>{product.category}</span>
          {' › '}
          <span>{product.name}</span>
        </div>

        {/* PRODUCT MAIN */}
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 16, alignItems: 'start' }}>

          {/* LEFT - IMAGES */}
          <div className="section" style={{ position: 'sticky', top: 70 }}>
            <img src={imgUrl} alt={product.name} style={{ width: '100%', height: 350, objectFit: 'contain', borderRadius: 4, cursor: 'zoom-in' }}
              onClick={() => setLightboxImg(imgUrl)}
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=400'} />
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
                {product.images.map((img, i) => (
                  <img key={i} src={img.url} alt="" onClick={() => setSelectedImg(i)}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: `2px solid ${selectedImg === i ? '#2874f0' : '#e0e0e0'}`, cursor: 'pointer' }} />
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={handleAddToCart} style={{ flex: 1, background: '#ff9f00', color: '#fff', border: 'none', padding: '14px', borderRadius: 2, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Hind,sans-serif' }}>
                🛒 Add to Cart
              </button>
              <button onClick={async () => { await addToCart(product._id, quantity); navigate('/checkout'); }}
                style={{ flex: 1, background: '#2874f0', color: '#fff', border: 'none', padding: '14px', borderRadius: 2, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Hind,sans-serif' }}>
                ⚡ Buy Now
              </button>
            </div>
          </div>

          {/* RIGHT - DETAILS */}
          <div>
            <div className="section">
              <div style={{ fontSize: 13, color: '#878787', marginBottom: 4, textTransform: 'capitalize' }}>{product.brand}</div>
              <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 10, lineHeight: 1.4 }}>{product.name}</h1>

              {/* RATING SUMMARY */}
              {product.ratings > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ background: '#388e3c', color: '#fff', padding: '3px 8px', borderRadius: 2, fontSize: 13, fontWeight: 700 }}>★ {product.ratings}</span>
                  <span style={{ fontSize: 13, color: '#878787' }}>{product.numReviews?.toLocaleString()} ratings</span>
                </div>
              )}

              {/* PRICE */}
              <div style={{ borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '14px 0', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 28, fontWeight: 700 }}>₹{product.price?.toLocaleString()}</span>
                  {product.oldPrice > 0 && <span style={{ fontSize: 16, color: '#878787', textDecoration: 'line-through' }}>₹{product.oldPrice?.toLocaleString()}</span>}
                  {product.discount > 0 && <span style={{ fontSize: 16, color: '#388e3c', fontWeight: 700 }}>{product.discount}% off</span>}
                </div>
                {product.oldPrice > 0 && <div style={{ color: '#388e3c', fontSize: 13, marginTop: 4 }}>You save ₹{(product.oldPrice - product.price).toLocaleString()}</div>}
              </div>

              {/* QUANTITY */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #e0e0e0', borderRadius: 2, padding: '4px 8px' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', fontWeight: 700, color: '#2874f0' }}>−</button>
                  <span style={{ fontWeight: 700, fontSize: 16, minWidth: 24, textAlign: 'center' }}>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', fontWeight: 700, color: '#2874f0' }}>+</button>
                </div>
                <span style={{ fontSize: 13, color: product.stock > 0 ? '#388e3c' : '#ff4d4d', fontWeight: 600 }}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>

              {/* DELIVERY */}
              <div style={{ background: '#f9f9f9', borderRadius: 4, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 14, marginBottom: 6 }}>🚚 <strong>Free Delivery</strong> on orders above ₹499</div>
                <div style={{ fontSize: 14, marginBottom: 6 }}>↩️ <strong>7 Days</strong> Return Policy</div>
                <div style={{ fontSize: 14 }}>✅ <strong>Genuine Product</strong> Guaranteed</div>
              </div>

              {/* DESCRIPTION */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Description</div>
                <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{product.description}</p>
              </div>
            </div>

            {/* REVIEWS SECTION */}
            <div className="section">
              <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>⭐ Ratings & Reviews</div>

              {/* RATING BREAKDOWN */}
              {product.reviews?.length > 0 && (
                <div style={{ display: 'flex', gap: 24, alignItems: 'center', background: '#f9f9f9', borderRadius: 4, padding: 16, marginBottom: 20 }}>
                  <div style={{ textAlign: 'center', minWidth: 80 }}>
                    <div style={{ fontSize: 48, fontWeight: 800, color: '#212121', lineHeight: 1 }}>{product.ratings}</div>
                    <div style={{ color: '#ff9f00', fontSize: 18 }}>{'★'.repeat(Math.round(product.ratings))}</div>
                    <div style={{ fontSize: 12, color: '#878787', marginTop: 4 }}>{product.numReviews} reviews</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    {ratingCounts.map(({ star, count }) => (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: '#878787', minWidth: 30 }}>{star} ★</span>
                        <div style={{ flex: 1, background: '#e0e0e0', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                          <div style={{ width: product.reviews.length ? `${(count / product.reviews.length) * 100}%` : '0%', background: starColor(star), height: '100%', borderRadius: 4, transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ fontSize: 12, color: '#878787', minWidth: 20 }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ADD REVIEW FORM */}
              {user && (
                <form onSubmit={handleReview} style={{ background: '#f9f9f9', borderRadius: 4, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>✍️ Write a Review</div>

                  {/* STAR RATING */}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 13, color: '#878787', display: 'block', marginBottom: 6 }}>Your Rating</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          style={{ fontSize: 28, cursor: 'pointer', color: star <= reviewForm.rating ? '#ff9f00' : '#e0e0e0', transition: 'color 0.1s' }}>★</span>
                      ))}
                      <span style={{ fontSize: 13, color: '#878787', alignSelf: 'center', marginLeft: 6 }}>{reviewForm.rating} Star</span>
                    </div>
                  </div>

                  {/* COMMENT */}
                  <div className="form-group">
                    <label>Your Review</label>
                    <input value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Share your experience with this product..." required />
                  </div>

                  {/* 📸 PHOTO URLS */}
                  <div className="form-group" style={{ marginTop: 10 }}>
                    <label style={{ fontSize: 13, color: '#878787', display: 'block', marginBottom: 4 }}>
                      📸 Add Photos (optional) — Ek line mein ek image URL daalo
                    </label>
                    <textarea
                      value={photoUrls}
                      onChange={(e) => setPhotoUrls(e.target.value)}
                      placeholder={`https://images.unsplash.com/photo-xxx?w=400\nhttps://images.unsplash.com/photo-yyy?w=400`}
                      rows={3}
                      style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: 2, padding: '8px 12px', fontSize: 13, fontFamily: 'Hind,sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                    {/* PHOTO PREVIEW */}
                    {photoUrls && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                        {photoUrls.split('\n').map(u => u.trim()).filter(u => u).map((url, i) => (
                          <img key={i} src={url} alt="preview"
                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '2px solid #2874f0' }}
                            onError={(e) => e.target.style.display = 'none'} />
                        ))}
                      </div>
                    )}
                  </div>

                  <button type="submit" className="btn-primary" disabled={submitting} style={{ width: 'auto', padding: '8px 24px', marginTop: 4 }}>
                    {submitting ? 'Submitting...' : '⭐ Submit Review'}
                  </button>
                </form>
              )}

              {/* REVIEWS LIST */}
              {product.reviews?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#878787' }}>
                  <div style={{ fontSize: 40 }}>💬</div>
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                product.reviews?.map((review, i) => (
                  <div key={i} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2874f0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                        {review.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{review.name}</div>
                        <div style={{ fontSize: 11, color: '#878787' }}>{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                      </div>
                      <span style={{ background: starColor(review.rating), color: '#fff', padding: '2px 8px', borderRadius: 2, fontSize: 12, fontWeight: 700, marginLeft: 'auto' }}>★ {review.rating}</span>
                    </div>

                    <p style={{ fontSize: 14, color: '#555', marginBottom: review.photos?.length > 0 ? 10 : 0, lineHeight: 1.6 }}>{review.comment}</p>

                    {/* 📸 REVIEW PHOTOS */}
                    {review.photos?.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                        {review.photos.map((photo, pi) => (
                          <img key={pi} src={photo} alt="review"
                            onClick={() => setLightboxImg(photo)}
                            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, border: '1px solid #e0e0e0', cursor: 'zoom-in' }}
                            onError={(e) => e.target.style.display = 'none'} />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 LIGHTBOX */}
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <img src={lightboxImg} alt="lightbox" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }} />
          <button onClick={() => setLightboxImg(null)}
            style={{ position: 'absolute', top: 20, right: 30, background: 'none', border: 'none', color: '#fff', fontSize: 36, cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}

      <Footer />
    </>
  );
}