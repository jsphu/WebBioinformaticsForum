import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{ 
      backgroundColor: '#f5f5f5', 
      padding: '2px 20px', 
      fontSize: '0.9rem', 
      textAlign: 'center', 
      fontFamily: 'Times New Roman, serif', 
      borderTop: '1px solid #ccc',
      width: '100%'
    }}>
      <p>© 2025. All rights reserved.</p>
      <div style={{ marginTop: '1px' }}>
        <Link to="/forums" style={{ margin: '0 8px', textDecoration: 'none', color: '#333' }}>Forums</Link>
        <Link to="/tool" style={{ margin: '0 8px', textDecoration: 'none', color: '#333' }}>Tool</Link>
        <Link to="/articles" style={{ margin: '0 8px', textDecoration: 'none', color: '#333' }}>Articles</Link>
        <a href="mailto:support@gmail.com" style={{ margin: '0 8px', textDecoration: 'none', color: '#333' }}>Contact Us</a>
      </div>
    </footer>
  );
}

export default Footer;