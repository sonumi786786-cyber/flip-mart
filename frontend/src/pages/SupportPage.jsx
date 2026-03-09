import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Common/Footer';
import CartPanel from '../components/Cart/CartPanel';
import ChatWidget from '../components/Chat/ChatWidget';
import { useState } from 'react';

export default function SupportPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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

        {/* HEADER */}
        <div style={{ background: 'linear-gradient(135deg, #2874f0, #1a5fd1)', borderRadius: 4, padding: '24px 32px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Baloo 2,cursive', fontSize: 28, fontWeight: 800, color: '#fff' }}>🤖 Customer Support</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 }}>AI Assistant — 24/7 available, instant replies!</div>
          </div>
          <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.5)', color: '#fff', padding: '8px 20px', borderRadius: 2, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Hind,sans-serif' }}>🏠 Back to Home</button>
        </div>

        {/* CHAT */}
        <ChatWidget />

      </div>
      <Footer />
    </>
  );
}