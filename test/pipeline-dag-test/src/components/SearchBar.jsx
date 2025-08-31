import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axiosService from "../helpers/axios";

export default function SearchBar() {

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length === 0) {
      setShowDropdown(false);
      setFilteredTopics([]);
      return;
    }

    // split into words, allow repeated words
    const words = term.trim().toLowerCase().split(/\s+/);

    const scoredTopics = cachedTopics
      .map((topic) => {
        let score = 0;
        const title = topic.title.toLowerCase();
        const summary = topic.summary.toLowerCase();

        words.forEach((word) => {
          // exact match in title or summary
          if (title === word || summary === word) score += 3;

          // word appears at start of any word in title or summary
          const regex = new RegExp(`\\b${word}`, "i");
          if (regex.test(title) || regex.test(summary)) score += 2;

          // word appears anywhere
          if (title.includes(word) || summary.includes(word)) score += 1;
        });

        return { ...topic, _score: score };
      })
      .filter((topic) => topic._score > 0)
      .sort((a, b) => b._score - a._score) // highest score first
      .slice(0, 5); // top 5 results

    setFilteredTopics(scoredTopics);
    setShowDropdown(true);
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

  const [cachedTopics, setCachedTopics] = useState([]);

  useEffect(() => {
    axiosService
      .get(`/api/posts/?limit=100000`)
      .then((res) => {
        const items = res.data.results.map((item) => ({
          id: item.id,
          title:
            item?.title ||
            (item?.content ? item.content.slice(0, 100) : ""),
          summary: item?.content
            ? item.content.slice(100, item.content.length)
            : "",
          time: new Date(item.created_at),
        }));
        setCachedTopics(items);
      })
      .catch((err) => console.error(`Error fetching posts:`, err));
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
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
    </>
  )
}
