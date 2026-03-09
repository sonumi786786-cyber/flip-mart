import { useCartStore, useAuthStore } from '../../store';
import { useNavigate } from 'react-router-dom';

export default function CartPanel() {
  const { cart, isOpen, closeCart, updateQty, removeItem } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="cart-overlay" onClick={(e) => e.target === e.currentTarget && closeCart()}>
      <div className="cart-panel">
        <div className="cart-head">
          <h3>🛒 My Cart</h3>
          <button className="cart-close" onClick={closeCart}>✕</button>
        </div>

        <div className="cart-body">
          {!cart?.items?.length ? (
            <div className="empty-state">
              <div className="icon">🛒</div>
              <p>Your cart is empty!</p>
              <button className="btn-primary" onClick={closeCart} style={{ width: 'auto', padding: '10px 30px' }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div className="cart-item" key={item.product}>
                <img src={item.image} alt={item.name} onError={(e) => e.target.src = 'https://via.placeholder.com/65'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>₹{item.price.toLocaleString()}</span>
                    {item.oldPrice > 0 && <span style={{ fontSize: 12, color: '#878787', textDecoration: 'line-through' }}>₹{item.oldPrice.toLocaleString()}</span>}
                    {item.discount > 0 && <span style={{ fontSize: 12, color: '#26a541', fontWeight: 600 }}>{item.discount}% off</span>}
                  </div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQty(item.product, item.quantity - 1)}>−</button>
                    <span style={{ fontWeight: 700, fontSize: 15, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.product, item.quantity + 1)}>+</button>
                    <button className="remove-btn" onClick={() => removeItem(item.product)}>✕ Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart?.items?.length > 0 && (
          <div className="cart-footer">
            {cart.savedAmount > 0 && (
              <div className="cart-savings">🎉 You save ₹{cart.savedAmount.toLocaleString()} on this order!</div>
            )}
            <div className="cart-total">
              <span>Total Amount</span>
              <span>₹{cart.totalPrice?.toLocaleString()}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Place Order →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}