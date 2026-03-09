export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">Flip<span>Mart</span></div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 1.6, marginTop: 8 }}>India ka #1 shopping destination.</p>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <a>Contact Us</a><a>About Us</a><a>Careers</a><a>Press</a>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <a>Payments</a><a>Shipping</a><a>Returns</a><a>FAQ</a>
          </div>
          <div className="footer-col">
            <h4>Policy</h4>
            <a>Return Policy</a><a>Terms Of Use</a><a>Privacy</a><a>Security</a>
          </div>
        </div>
        <div className="footer-bottom"><p>© 2024 FlipMart.com</p></div>
      </div>
    </footer>
  );
}