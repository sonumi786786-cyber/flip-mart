import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Common/Footer';
import CartPanel from '../components/Cart/CartPanel';
import { useCartStore, useAuthStore } from '../store';
import { orderAPI, couponAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [searchQuery, setSearchQuery] = useState('');
  const [address, setAddress] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: '', city: '', state: '', pincode: '', landmark: ''
  });

  // 🎟️ COUPON STATE
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const baseTotal = (cart?.totalPrice || 0) + (cart?.totalPrice > 499 ? 0 : 40);
  const discount = appliedCoupon?.discount || 0;
  const finalTotal = baseTotal - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { toast.error('Coupon code daalo!'); return; }
    setCouponLoading(true);
    try {
      const res = await couponAPI.apply(couponCode, cart?.totalPrice || 0);
      setAppliedCoupon(res.data.coupon);
      toast.success(`🎉 Coupon applied! ₹${res.data.coupon.discount} off!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon!');
      setAppliedCoupon(null);
    }
    setCouponLoading(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed!');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cart?.items?.length) { toast.error('Cart is empty!'); return; }
    setLoading(true);
    try {
      await orderAPI.place({
        shippingAddress: address,
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
        discount: discount,
      });
      toast.success('Order placed successfully! 🎉');
      await clearCart();
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${searchQuery.trim()}`);
  };

  if (!user) { navigate('/'); return null; }

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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 12, alignItems: 'start' }}>

          <div>
            <div className="section">
              <div className="section-title" style={{ marginBottom: 16 }}>🏠 Delivery Address</div>
              <form onSubmit={handlePlaceOrder}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input name="name" value={address.name} onChange={handleChange} placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input name="phone" value={address.phone} onChange={handleChange} placeholder="+91 9876543210" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Street Address</label>
                  <input name="street" value={address.street} onChange={handleChange} placeholder="House no, Street, Area" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>City</label>
                    <input name="city" value={address.city} onChange={handleChange} placeholder="City" required />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input name="state" value={address.state} onChange={handleChange} placeholder="State" required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input name="pincode" value={address.pincode} onChange={handleChange} placeholder="110001" required />
                  </div>
                  <div className="form-group">
                    <label>Landmark (Optional)</label>
                    <input name="landmark" value={address.landmark} onChange={handleChange} placeholder="Near Metro Station" />
                  </div>
                </div>

                <div style={{ marginTop: 8 }}>
                  <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>💳 Payment Method</div>
                  {[
                    { id: 'COD', label: '💵 Cash on Delivery', sub: 'Pay when delivered' },
                    { id: 'UPI', label: '📱 UPI Payment', sub: 'GPay, PhonePe, Paytm' },
                    { id: 'Razorpay', label: '💳 Credit/Debit Card', sub: 'Visa, Mastercard, RuPay' },
                  ].map((pm) => (
                    <label key={pm.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: `2px solid ${paymentMethod === pm.id ? '#2874f0' : '#e0e0e0'}`, borderRadius: 4, marginBottom: 8, cursor: 'pointer', background: paymentMethod === pm.id ? '#f0f4ff' : '#fff' }}>
                      <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} style={{ accentColor: '#2874f0' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{pm.label}</div>
                        <div style={{ fontSize: 12, color: '#878787' }}>{pm.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 16 }}>
                  {loading ? 'Placing Order...' : '🎉 Place Order'}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div style={{ position: 'sticky', top: 70 }}>

            {/* 🎟️ COUPON BOX */}
            <div className="section" style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🎟️ Apply Coupon</div>

              {/* Available Coupons hint */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {['WELCOME50', 'FLAT100', 'SAVE200', 'FLIPMART20', 'FREESHIP'].map((c) => (
                  <span key={c} onClick={() => setCouponCode(c)}
                    style={{ background: '#f0f4ff', border: '1px dashed #2874f0', color: '#2874f0', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    {c}
                  </span>
                ))}
              </div>

              {appliedCoupon ? (
                <div style={{ background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: 4, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#2e7d32', fontSize: 14 }}>✅ {appliedCoupon.code}</div>
                    <div style={{ fontSize: 12, color: '#388e3c' }}>₹{appliedCoupon.discount} discount applied!</div>
                  </div>
                  <button onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>✕</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    style={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 2, padding: '8px 12px', fontSize: 13, fontFamily: 'Hind,sans-serif', outline: 'none', textTransform: 'uppercase', letterSpacing: 1 }}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button onClick={handleApplyCoupon} disabled={couponLoading}
                    style={{ background: '#2874f0', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 2, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Hind,sans-serif', whiteSpace: 'nowrap' }}>
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* ORDER SUMMARY */}
            <div className="section">
              <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🧾 Order Summary</div>
              {cart?.items?.map((item) => (
                <div key={item.product} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, border: '1px solid #e0e0e0' }} onError={(e) => e.target.src = 'https://via.placeholder.com/50'} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#878787' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 12, marginTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                  <span>Subtotal</span><span>₹{cart?.totalPrice?.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                  <span>Shipping</span>
                  <span style={{ color: '#26a541' }}>{cart?.totalPrice > 499 ? 'FREE' : '₹40'}</span>
                </div>
                {cart?.savedAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#26a541', marginBottom: 6 }}>
                    <span>Product Savings</span><span>-₹{cart?.savedAmount?.toLocaleString()}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#26a541', marginBottom: 6 }}>
                    <span>🎟️ Coupon ({appliedCoupon.code})</span>
                    <span>-₹{appliedCoupon.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, borderTop: '1px solid #e0e0e0', paddingTop: 10, marginTop: 6, color: '#212121' }}>
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div style={{ textAlign: 'right', fontSize: 12, color: '#26a541', marginTop: 4, fontWeight: 600 }}>
                    🎉 Total ₹{discount} ki savings!
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}