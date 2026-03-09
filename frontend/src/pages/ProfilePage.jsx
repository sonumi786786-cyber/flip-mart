import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Common/Footer';
import CartPanel from '../components/Cart/CartPanel';
import { useAuthStore } from '../store';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false,
  });

  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/'); return; }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(profileForm);
      updateUser(res.data.user);
      toast.success('Profile updated! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      await authAPI.changePassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword });
      toast.success('Password changed! 🔐');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setLoading(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.addAddress(addressForm);
      setAddresses(res.data.addresses);
      toast.success('Address added! 🏠');
      setShowAddressForm(false);
      setAddressForm({ label: 'Home', name: user?.name || '', phone: user?.phone || '', street: '', city: '', state: '', pincode: '', landmark: '', isDefault: false });
    } catch (err) {
      toast.error('Failed to add address');
    }
    setLoading(false);
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Delete this address?')) return;
    try {
      const res = await authAPI.deleteAddress(id);
      setAddresses(res.data.addresses);
      toast.success('Address deleted!');
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const TABS = [
    { id: 'profile', label: '👤 Profile', },
    { id: 'password', label: '🔐 Password', },
    { id: 'addresses', label: '🏠 Addresses', },
  ];

  return (
    <>
      <Navbar />
      <CartPanel />
      <div className="main">
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 12, alignItems: 'start' }}>

          {/* LEFT SIDEBAR */}
          <div className="section" style={{ padding: 0, overflow: 'hidden' }}>
            {/* USER INFO */}
            <div style={{ background: 'linear-gradient(135deg, #2874f0, #1a5fd1)', padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 10px' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 3 }}>{user?.email}</div>
              {user?.isPhoneVerified && <div style={{ color: '#ffe500', fontSize: 11, marginTop: 4 }}>✅ Phone Verified</div>}
            </div>

            {/* TABS */}
            {TABS.map((tab) => (
              <div key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ padding: '14px 20px', cursor: 'pointer', fontSize: 14, fontWeight: activeTab === tab.id ? 700 : 400, color: activeTab === tab.id ? '#2874f0' : '#212121', background: activeTab === tab.id ? '#f0f4ff' : '#fff', borderLeft: activeTab === tab.id ? '3px solid #2874f0' : '3px solid transparent', transition: 'all 0.2s' }}>
                {tab.label}
              </div>
            ))}

            <div style={{ padding: '14px 20px', borderTop: '1px solid #f0f0f0' }}>
              <button onClick={() => { logout(); navigate('/'); }}
                style={{ background: 'none', border: 'none', color: '#ff4d4d', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Hind,sans-serif' }}>
                🚪 Logout
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div>

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="section">
                <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>👤 My Profile</div>
                <form onSubmit={handleProfileUpdate}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="Your name" required />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} placeholder="your@email.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input value={user?.phone || ''} disabled style={{ background: '#f5f5f5', cursor: 'not-allowed' }} />
                    <div style={{ fontSize: 11, color: '#878787', marginTop: 3 }}>Phone number cannot be changed</div>
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: 'auto', padding: '10px 30px' }}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* PASSWORD TAB */}
            {activeTab === 'password' && (
              <div className="section">
                <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>🔐 Change Password</div>
                <form onSubmit={handlePasswordChange} style={{ maxWidth: 400 }}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} placeholder="Enter current password" required />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="Min 6 characters" required minLength={6} />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} placeholder="Re-enter new password" required />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: 'auto', padding: '10px 30px' }}>
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 20, fontWeight: 700 }}>🏠 My Addresses</div>
                  <button onClick={() => setShowAddressForm(!showAddressForm)} className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: 13 }}>
                    + Add Address
                  </button>
                </div>

                {/* ADD ADDRESS FORM */}
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} style={{ background: '#f9f9f9', borderRadius: 4, padding: 16, marginBottom: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input value={addressForm.name} onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} placeholder="Full name" required />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} placeholder="Phone number" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Street Address</label>
                      <input value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} placeholder="House no, Street, Area" required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="form-group">
                        <label>City</label>
                        <input value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} placeholder="City" required />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} placeholder="State" required />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="form-group">
                        <label>Pincode</label>
                        <input value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} placeholder="110001" required />
                      </div>
                      <div className="form-group">
                        <label>Landmark (Optional)</label>
                        <input value={addressForm.landmark} onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })} placeholder="Near Metro" />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" className="btn-primary" disabled={loading} style={{ width: 'auto', padding: '8px 24px' }}>
                        {loading ? 'Saving...' : 'Save Address'}
                      </button>
                      <button type="button" onClick={() => setShowAddressForm(false)} style={{ background: 'none', border: '1px solid #e0e0e0', padding: '8px 24px', borderRadius: 2, cursor: 'pointer', fontFamily: 'Hind,sans-serif' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* ADDRESSES LIST */}
                {addresses.length === 0 ? (
                  <div className="empty-state">
                    <div className="icon">🏠</div>
                    <p>No addresses saved yet!</p>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr._id} style={{ border: `2px solid ${addr.isDefault ? '#2874f0' : '#e0e0e0'}`, borderRadius: 4, padding: 16, marginBottom: 12, position: 'relative' }}>
                      {addr.isDefault && <span style={{ position: 'absolute', top: 10, right: 10, background: '#2874f0', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 2 }}>DEFAULT</span>}
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{addr.label} — {addr.name}</div>
                      <div style={{ fontSize: 13, color: '#555' }}>{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</div>
                      {addr.landmark && <div style={{ fontSize: 13, color: '#878787' }}>Near: {addr.landmark}</div>}
                      <div style={{ fontSize: 13, color: '#878787', marginTop: 3 }}>📱 {addr.phone}</div>
                      <button onClick={() => handleDeleteAddress(addr._id)} style={{ marginTop: 10, background: 'none', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '4px 14px', borderRadius: 2, cursor: 'pointer', fontSize: 12, fontFamily: 'Hind,sans-serif' }}>
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}