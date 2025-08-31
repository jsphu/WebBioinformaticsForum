import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosService from '../helpers/axios';

function Footer() {
  const [version, setVersion] = useState("");
  useEffect(() => {
    axiosService
      .get(`/api/version/`)
      .then((res) => setVersion(res.data));
  }, [])

  return (
    <footer style={{
      flexShrink: 0,
      backgroundColor: '#f5f5f5',
      padding: '2px 20px',
      fontSize: '0.9rem',
      textAlign: 'center',
      fontFamily: 'Times New Roman, serif',
      borderTop: '1px solid #ccc',
      width: '100%'
    }}>
      <p>© 2025. All rights reserved. Version: { version }</p>
      <div style={{ marginTop: '1px' }}>
        <Link to="/forums" style={{ margin: '0 8px', textDecoration: 'none', color: '#333' }}>Forums</Link>
        <Link to="/tool" style={{ margin: '0 8px', textDecoration: 'none', color: '#333' }}>Tool</Link>
        <Link to="/articles" style={{ margin: '0 8px', textDecoration: 'none', color: '#333' }}>Articles</Link>
        <a href="mailto:support@gmail.com" style={{ margin: '0 8px', textDecoration: 'none', color: '#333' }}>Contact Us</a>
        <a href="https://github.com/jsphu/WebBioinformaticsForum/" target="_blank" rel="noopener noreferrer" style={{ margin: '0 8px', textDecoration: 'none', color: '#333' }}>Github</a>
      </div>
    </footer>
  );
}

export default Footer;
