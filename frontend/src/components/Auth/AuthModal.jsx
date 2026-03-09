import { useState } from 'react';
import { useAuthStore } from '../../store';

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuthStore();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', emailOrPhone: '', password: '', confirmPassword: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login({ emailOrPhone: form.emailOrPhone, password: form.password });
    setLoading(false);
    if (res.success) onClose();
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setLoading(true);
    const res = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    setLoading(false);
    if (res.success) onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-left">
          <div>
            <h2>{mode === 'login' ? 'Login for the Best Experience' : 'Join FlipMart Today!'}</h2>
            <p>{mode === 'login' ? 'Get exclusive deals, track orders and more.' : 'Millions of products at best prices.'}</p>
          </div>
          <div style={{ fontSize: 80, textAlign: 'center' }}>🛍️</div>
        </div>

        <div className="modal-right">
          <button className="modal-close" onClick={onClose}>✕</button>

          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              <h3 style={{ fontSize: 18, marginBottom: 20, color: '#878787', fontWeight: 400 }}>Welcome back!</h3>
              <div className="form-group">
                <label>Mobile Number / Email</label>
                <input name="emailOrPhone" value={form.emailOrPhone} onChange={handleChange} placeholder="Enter mobile or email" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter password" required />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Logging in...' : 'Login Securely →'}
              </button>
              <div className="divider">OR</div>
              <div style={{ textAlign: 'center', fontSize: 13 }}>
                <span style={{ color: '#878787' }}>New to FlipMart? </span>
                <a style={{ color: '#2874f0', fontWeight: 600, cursor: 'pointer' }} onClick={() => setMode('signup')}>Create Account</a>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignup}>
              <h3 style={{ fontSize: 18, marginBottom: 20, color: '#878787', fontWeight: 400 }}>Create your account</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+919876543210" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required minLength={6} />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account →'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13 }}>
                <span style={{ color: '#878787' }}>Already have an account? </span>
                <a style={{ color: '#2874f0', fontWeight: 600, cursor: 'pointer' }} onClick={() => setMode('login')}>Login</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}