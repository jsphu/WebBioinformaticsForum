import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function TopicsList() {
  const [topics] = useState([
    { id: 1, title: 'Yeni Genom Analizi', summary: 'Son gelişmeler ve yöntemler...', time: new Date('2025-08-15T20:00:00'), interaction: 50 },
    { id: 2, title: 'Protein Yapısı Modelleme', summary: 'Temel yaklaşımlar...', time: new Date('2025-08-15T19:30:00'), interaction: 120 },
    { id: 3, title: 'RNA Sekanslama Teknikleri', summary: 'Yeni bir protokol...', time: new Date('2025-08-15T18:45:00'), interaction: 80 },
    { id: 4, title: 'Biyoinformatik Veri Temizliği', summary: 'Veri ön işleme ipuçları...', time: new Date('2025-08-15T17:15:00'), interaction: 200 },
    { id: 5, title: 'Kanser Genomu Araştırmaları', summary: 'Güncel bulgular...', time: new Date('2025-08-14T14:00:00'), interaction: 150 },
    { id: 6, title: 'Makine Öğrenimi Biyolojide', summary: 'Uygulamalar ve sınırlamalar...', time: new Date('2025-08-14T12:30:00'), interaction: 90 },
    { id: 7, title: 'Metagenomik Analiz', summary: 'Mikrobiyom verileri...', time: new Date('2025-08-13T16:00:00'), interaction: 110 },
    { id: 8, title: 'Filojeetik Ağaç Çizimi', summary: 'Yöntem karşılaştırması...', time: new Date('2025-08-13T10:45:00'), interaction: 70 },
    { id: 9, title: 'Veri Görselleştirme Araçları', summary: 'Popüler araçlar...', time: new Date('2025-08-12T15:30:00'), interaction: 180 },
    { id: 10, title: 'DNA Onarımı Mekanizmaları', summary: 'Moleküler detaylar...', time: new Date('2025-08-12T09:00:00'), interaction: 130 },
  ]);
  const [sortBy, setSortBy] = useState('en-gunel');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sıralama
  const sortedTopics = [...topics].sort((a, b) => {
    if (sortBy === 'en-gunel') return b.time - a.time;
    if (sortBy === 'en-eski') return a.time - b.time;
    if (sortBy === 'en-cok-etkilesim') return b.interaction - a.interaction;
    return 0;
  });

  // Sayfalama
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTopics = sortedTopics.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTopics.length / itemsPerPage);

  return (
    <div className="topics-list">
      <div className="topics-frame">
        <div className="topics-header">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ fontSize: '0.9rem', marginRight: '10px' }}
          >
            <option value="en-gunel">En Güncel</option>
            <option value="en-eski">En Eski</option>
            <option value="en-cok-etkilesim">En Çok Etkileşim</option>
          </select>
          Recent Topics
        </div>
        {currentTopics.map(topic => (
          <Link to={`/topic/${topic.id}`} key={topic.id} className="topic-item">
            <div className="topic-content">
              <h3 style={{ margin: '2px 0' }}>{topic.title}</h3>
              <p style={{ margin: '2px 0', fontSize: '0.9rem' }}>{topic.summary}</p>
              <small style={{ margin: '2px 0', color: '#666' }}>{topic.time.toLocaleString()}</small>
            </div>
          </Link>
        ))}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              style={{ marginRight: '5px', padding: '4px 8px', fontSize: '0.9rem' }}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopicsList;