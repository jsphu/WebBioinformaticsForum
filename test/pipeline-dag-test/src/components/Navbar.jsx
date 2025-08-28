<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ topics }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      const filtered = topics
        .filter(topic =>
          topic.title.toLowerCase().includes(term.toLowerCase()) ||
          topic.summary.toLowerCase().includes(term.toLowerCase())
        )
        .slice(0, 5); // Maksimum 5 sonuç
      setFilteredTopics(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && filteredTopics.length > 0) {
      handleTopicSelect(filteredTopics[0].id);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) && inputRef.current && !inputRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const handleTopicSelect = (id) => {
    setShowDropdown(false);
    setSearchTerm('');
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{ backgroundColor: '#f5f5f5', padding: '10px 20px', fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontFamily: 'Times New Roman, serif', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/">
          <img src="/logo.png" alt="Logo" width="30" height="30" style={{ marginRight: '15px' }} />
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/forums" style={{ marginRight: '15px', textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '1.2rem' }}>Forums</Link>
          <Link to="/tool" style={{ marginRight: '15px', textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '1.2rem' }}>Tool</Link>
          <Link to="/articles" style={{ marginRight: '15px', textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '1.2rem' }}>Articles</Link>
          <Link to="/news" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '1.2rem' }}>News</Link>
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress} // Enter tuşu için olay
          style={{ fontSize: '1rem', width: '150px', marginRight: '20px', padding: '3px 8px', fontFamily: 'Times New Roman, serif', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        {showDropdown && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: '40px',
              right: 0,
              width: '275px',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              zIndex: 1000,
              maxHeight: '200px',
              overflowY: 'auto',
              animation: 'fadeIn 0.2s ease-in',
            }}
          >
            {filteredTopics.length > 0 ? (
              filteredTopics.map(topic => (
                <Link
                  key={topic.id}
                  to={`/topic/${topic.id}`}
                  style={{ display: 'block', padding: '8px', textDecoration: 'none', color: '#333', borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}
                  onClick={() => handleTopicSelect(topic.id)}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#fff')}
                >
                  <h4 style={{ margin: '0', fontSize: '1rem' }}>{topic.title}</h4>
                  <p style={{ margin: '0', fontSize: '0.8rem', color: '#666' }}>{topic.summary.substring(0, 30)}...</p>
                </Link>
              ))
            ) : (
              <div style={{ padding: '8px', color: '#666', fontSize: '0.9rem' }}>No results found</div>
            )}
          </div>
        )}
        <span role="img" aria-label="Notifications" style={{ fontSize: '1.2rem', marginRight: '15px' }}>🔔</span>
        <Link to="/sign-in" style={{ fontSize: '1rem', padding: '3px 8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Times New Roman, serif' }}>Sign In</Link>
      </div>
    </header>
  );
=======
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <header
            style={{
                backgroundColor: "#e8ecef",
                padding: "10px 20px",
                fontSize: "1.2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <Link to="/">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        width="30"
                        height="30"
                        style={{ marginRight: "15px" }}
                    />
                </Link>
                <nav style={{ display: "flex", alignItems: "center" }}>
                    <Link
                        to="/forums"
                        style={{
                            marginRight: "15px",
                            textDecoration: "none",
                            color: "#000",
                            fontWeight: "bold",
                        }}
                    >
                        Forums
                    </Link>
                    <Link
                        to="/tool"
                        style={{
                            marginRight: "15px",
                            textDecoration: "none",
                            color: "#000",
                            fontWeight: "bold",
                        }}
                    >
                        Tool
                    </Link>
                    <Link
                        to="/articles"
                        style={{
                            marginRight: "15px",
                            textDecoration: "none",
                            color: "#000",
                            fontWeight: "bold",
                        }}
                    >
                        Articles
                    </Link>
                    <Link
                        to="/news"
                        style={{
                            marginRight: "15px",
                            textDecoration: "none",
                            color: "#000",
                            fontWeight: "bold",
                        }}
                    >
                        News
                    </Link>
                    <Link
                        to="/pipeline-editor"
                        style={{
                            textDecoration: "none",
                            color: "#000",
                            fontWeight: "bold",
                        }}
                    >
                        Editor
                    </Link>
                </nav>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    type="text"
                    placeholder="Search"
                    style={{
                        fontSize: "1rem",
                        width: "120px",
                        marginRight: "15px",
                        padding: "4px",
                    }}
                />
                <button
                    style={{
                        fontSize: "1.2rem",
                        padding: "4px 12px",
                        marginRight: "40px",
                    }}
                >
                    Search
                </button>
                <span
                    role="img"
                    aria-label="Notifications"
                    style={{ fontSize: "1.2rem", marginRight: "15px" }}
                >
                    🔔
                </span>
                <Link
                    to="/login"
                    style={{
                        textDecoration: "none",
                        color: "#000",
                        fontWeight: "bold",
                    }}
                >
                    Login
                </Link>
            </div>
        </header>
    );
>>>>>>> 11ea236a0f01ac02caabc7d500db9f79925ca89f
}

export default Navbar;
