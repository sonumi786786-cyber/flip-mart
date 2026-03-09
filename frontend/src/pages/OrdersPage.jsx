import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Common/Footer';
import CartPanel from '../components/Cart/CartPanel';
import { orderAPI } from '../services/api';
import { useAuthStore } from '../store';

const STATUS_COLORS = {
  placed: '#2874f0', confirmed: '#2874f0', processing: '#ff8f00',
  shipped: '#ff8f00', out_for_delivery: '#ff8f00', delivered: '#26a541',
  cancelled: '#ff4d4d', returned: '#878787'
};

const STATUS_ICONS = {
  placed: '📋', confirmed: '✅', processing: '📦',
  shipped: '🚚', out_for_delivery: '🛵', delivered: '🎉',
  cancelled: '❌', returned: '↩️'
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getMine();
      setOrders(res.data.orders);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this order?')) return;
    try {
      await orderAPI.cancel(id, 'Cancelled by user');
      fetchOrders();
    } catch (err) { alert('Cannot cancel this order'); }
  };

  return (
    <>
      <Navbar />
      <CartPanel />
      <div className="main">
        <div className="section">
          <div className="section-head">
            <div className="section-title">📦 My Orders</div>
          </div>
          {loading ? <div className="spinner"></div> :
            orders.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📦</div>
                <p>No orders yet!</p>
                <button className="btn-primary" onClick={() => navigate('/')} style={{ width: 'auto', padding: '10px 30px' }}>Start Shopping</button>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#878787' }}>Order ID: {order._id.slice(-8).toUpperCase()}</div>
                      <div style={{ fontSize: 12, color: '#878787' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 18 }}>{STATUS_ICONS[order.orderStatus]}</span>
                      <span style={{ color: STATUS_COLORS[order.orderStatus], fontWeight: 700, fontSize: 14, textTransform: 'capitalize' }}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, alignItems: 'center' }}>
                      <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #e0e0e0' }} onError={(e) => e.target.src = 'https://via.placeholder.com/60'} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
                        <div style={{ fontSize: 13, color: '#878787' }}>Qty: {item.quantity} × ₹{item.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 10, marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <span style={{ fontWeight: 700 }}>Total: ₹{order.totalPrice.toLocaleString()}</span>
                      <span style={{ fontSize: 12, color: '#878787', marginLeft: 8 }}>{order.payment.method}</span>
                    </div>
                    {['placed', 'confirmed', 'processing'].includes(order.orderStatus) && (
                      <button onClick={() => handleCancel(order._id)} style={{ background: 'none', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '6px 16px', borderRadius: 2, cursor: 'pointer', fontSize: 13, fontFamily: 'Hind,sans-serif', fontWeight: 600 }}>Cancel Order</button>
                    )}
                  </div>
                </div>
              ))
            )
          }
        </div>
      </div>
      <Footer />
    </>
  );
}