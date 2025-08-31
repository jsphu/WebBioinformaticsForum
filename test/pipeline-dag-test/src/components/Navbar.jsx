import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';
import { useUserActions } from '../hooks/user.actions';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { user } = useContext(UserContext);

  const username = user?.username;
  const userActions = useUserActions();

  return (
    <header style={{ backgroundColor: '#f5f5f5', padding: '10px 20px', fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontFamily: 'Times New Roman, serif', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/">
          <img src="/logo.png" alt="Logo" width="30" height="30" style={{ marginRight: '15px' }} />
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/forums" style={{ marginRight: '15px', textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '1.2rem' }}>Forums</Link>
          <Link to="/tool" style={{ marginRight: '15px', textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '1.2rem' }}>Tool</Link>
          <Link to="/news" style={{ marginRight: '15px', textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '1.2rem' }}>News</Link>
          <Link to="/pipeline-editor" style={{ textDecoration: "none", color: "#333", fontWeight: "bold", fontSize: '1.2rem' }}>Editor</Link>
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <p style={{ fontSize: '1.2rem', marginTop: '15px', marginRight: '20px', padding: '3px 8px', fontFamily: 'Times New Roman, serif'}}>{username}</p>
        <SearchBar />
        <span role="img" aria-label="Notifications" style={{ fontSize: '1.2rem', marginRight: '15px' }}>🔔</span>
        {username !== "anonymous"
          ? <button onClick={userActions.logout} style={{ fontSize: '1rem', padding: '3px 8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Times New Roman, serif' }}>Sign Out</button>
          : <Link to="/sign-in" style={{ fontSize: '1rem', padding: '3px 8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Times New Roman, serif' }}>Sign In</Link>
        }
      </div>
    </header>
  );
}
