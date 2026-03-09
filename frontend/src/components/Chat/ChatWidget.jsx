import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store';

const FAQS = [
  { q: '📦 Order status', a: 'Apna order track karne ke liye "My Orders" page pe jaao. Wahan har order ka status dikh jayega!' },
  { q: '🚚 Delivery time', a: 'Delivery usually 3-7 business days mein hoti hai. Metro cities mein 2-3 din aur small cities mein 5-7 din lagte hain.' },
  { q: '↩️ Return policy', a: 'Hum 7 days return policy offer karte hain. Product original condition mein hona chahiye. Return ke liye Orders page pe jaao aur "Return" option select karo.' },
  { q: '💳 Payment options', a: 'Hum COD (Cash on Delivery), UPI (GPay, PhonePe, Paytm) aur Credit/Debit Card accept karte hain.' },
  { q: '🔒 Is my data safe?', a: 'Haan bilkul! Tumhara data 100% secure hai. Hum SSL encryption use karte hain aur kabhi bhi tumhara data third party ko nahi dete.' },
  { q: '❌ Cancel order', a: 'Order cancel karne ke liye "My Orders" page pe jaao. Sirf "Placed", "Confirmed" ya "Processing" status wale orders cancel ho sakte hain.' },
  { q: '💰 Refund kab milega?', a: 'Refund 5-7 business days mein tumhare original payment method pe wapas aa jaata hai. UPI/Card pe 3-5 din aur COD pe 7 din lagte hain.' },
  { q: '🎁 Offers & Coupons', a: 'Latest offers ke liye homepage pe Deal of the Day section dekho! Hum regularly discounts aur flash sales offer karte hain.' },
  { q: '📱 App available hai?', a: 'Abhi hum web version par hain. Mobile app jaldi aa raha hai! Tab tak mobile browser pe website use kar sakte ho.' },
  { q: '🏪 Seller kaise banein?', a: 'FlipMart pe seller banne ke liye support@flipmart.com pe email karo. Hum tumse 2-3 din mein contact karenge.' },
];

const BOT_NAME = 'FlipMart AI Assistant';

const getAutoReply = (message) => {
  const msg = message.toLowerCase();
  if (msg.includes('order') && (msg.includes('status') || msg.includes('track') || msg.includes('kahan'))) {
    return 'Apna order track karne ke liye "My Orders" page pe jaao. Wahan har order ka real-time status dikh jayega! 📦';
  }
  if (msg.includes('cancel')) {
    return 'Order cancel karne ke liye "My Orders" page pe jaao aur apna order select karo. Sirf "Placed", "Confirmed" ya "Processing" status wale orders cancel ho sakte hain. ❌';
  }
  if (msg.includes('return') || msg.includes('wapas')) {
    return 'Hum 7 days return policy offer karte hain! Product original condition mein hona chahiye. Return ke liye Orders page pe jaao. ↩️';
  }
  if (msg.includes('refund') || msg.includes('paisa')) {
    return 'Refund 5-7 business days mein tumhare original payment method pe wapas aa jaata hai. UPI/Card pe 3-5 din aur COD pe 7 din lagte hain. 💰';
  }
  if (msg.includes('delivery') || msg.includes('deliver') || msg.includes('kitne din')) {
    return 'Delivery usually 3-7 business days mein hoti hai. Metro cities mein 2-3 din aur small cities mein 5-7 din lagte hain. 🚚';
  }
  if (msg.includes('payment') || msg.includes('pay') || msg.includes('upi') || msg.includes('cod')) {
    return 'Hum COD, UPI (GPay, PhonePe, Paytm) aur Credit/Debit Card accept karte hain! 💳';
  }
  if (msg.includes('offer') || msg.includes('discount') || msg.includes('coupon') || msg.includes('sale')) {
    return 'Latest offers ke liye homepage pe "Deal of the Day" section dekho! Hum regularly discounts aur flash sales offer karte hain. 🎁';
  }
  if (msg.includes('safe') || msg.includes('secure') || msg.includes('data')) {
    return 'Haan bilkul! Tumhara data 100% secure hai. Hum SSL encryption use karte hain. 🔒';
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('namaste') || msg.includes('hii')) {
    return 'Hello! 👋 Main FlipMart ka AI Assistant hoon. Aapki kaise madad kar sakta hoon? Neeche diye quick options select kar sakte ho ya seedha apna sawaal puch sakte ho!';
  }
  if (msg.includes('thanks') || msg.includes('thank') || msg.includes('shukriya') || msg.includes('dhanyawad')) {
    return 'Bahut shukriya! 😊 Koi aur sawaal ho toh zaroor puchna. FlipMart pe shopping ka maza lo! 🛍️';
  }
  if (msg.includes('help') || msg.includes('madad') || msg.includes('support')) {
    return 'Main aapki madad ke liye hoon! 😊 Neeche diye quick options mein se select karo ya apna sawaal type karo.';
  }
  return 'Mujhe samajh nahi aaya! 😅 Kripya apna sawaal aur clearly puchein, ya neeche diye quick options mein se select karein. Aap support@flipmart.com pe bhi email kar sakte hain.';
};

export default function ChatWidget() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([
    {
      id: 1, from: 'bot',
      text: `Namaste ${user?.name?.split(' ')[0] || 'ji'}! 👋 Main FlipMart AI Assistant hoon. Aapki kaise madad kar sakta hoon?`,
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text) => {
    const userMsg = { id: Date.now(), from: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const reply = getAutoReply(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: reply, time: new Date() }]);
      setIsTyping(false);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) sendMessage(input.trim());
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', height: 'calc(100vh - 130px)', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 4, border: '1px solid #e0e0e0', overflow: 'hidden' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #2874f0, #1a5fd1)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🤖</div>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{BOT_NAME}</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf50' }}></div>
            Online • Replies instantly
          </div>
        </div>
      </div>

      {/* QUICK FAQ BUTTONS */}
      <div style={{ padding: '12px 16px', background: '#f9f9f9', borderBottom: '1px solid #e0e0e0', overflowX: 'auto' }}>
        <div style={{ fontSize: 12, color: '#878787', marginBottom: 8, fontWeight: 600 }}>QUICK QUESTIONS:</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FAQS.map((faq, i) => (
            <button key={i} onClick={() => sendMessage(faq.q)}
              style={{ background: '#fff', border: '1px solid #2874f0', color: '#2874f0', padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', fontFamily: 'Hind,sans-serif', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {faq.q}
            </button>
          ))}
        </div>
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, background: '#f0f4ff' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
            {msg.from === 'bot' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2874f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
            )}
            <div style={{ maxWidth: '70%' }}>
              <div style={{
                padding: '10px 14px', borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.from === 'user' ? '#2874f0' : '#fff',
                color: msg.from === 'user' ? '#fff' : '#212121',
                fontSize: 14, lineHeight: 1.5,
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
              }}>
                {msg.text}
              </div>
              <div style={{ fontSize: 11, color: '#878787', marginTop: 3, textAlign: msg.from === 'user' ? 'right' : 'left' }}>
                {formatTime(msg.time)}
              </div>
            </div>
            {msg.from === 'user' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ff8f00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                {user?.name?.charAt(0).toUpperCase() || '👤'}
              </div>
            )}
          </div>
        ))}

        {/* TYPING INDICATOR */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2874f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
            <div style={{ background: '#fff', padding: '10px 16px', borderRadius: '18px 18px 18px 4px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#2874f0', animation: `bounce 1s infinite ${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #e0e0e0', background: '#fff' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Apna sawaal yahan type karein..."
            style={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 24, padding: '10px 16px', fontSize: 14, fontFamily: 'Hind,sans-serif', outline: 'none' }}
          />
          <button type="submit" disabled={!input.trim()}
            style={{ background: input.trim() ? '#2874f0' : '#e0e0e0', color: '#fff', border: 'none', width: 44, height: 44, borderRadius: '50%', cursor: input.trim() ? 'pointer' : 'default', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ➤
          </button>
        </form>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#878787', marginTop: 6 }}>
          Powered by FlipMart AI • support@flipmart.com
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}