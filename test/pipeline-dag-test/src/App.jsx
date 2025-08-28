import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopicsList from './components/TopicsList';
import NewsSection from './components/NewsSection';
import TopicDetail from './components/TopicDetail';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Footer from './components/Footer';
import Flow from './customs/flow';
import './App.css';

function App() {
  // Statik topics dizisi
  const topics = [
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
  ];

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar topics={topics} />
        <main style={{ flex: '1 0 auto' }}>
          <div className="main-content-frame">
            <div className="main-content">
              <Routes>
                <Route path="/forums" element={<TopicsList topics={topics} />} />
                <Route path="/tool" element={<div style={{ padding: '20px', textAlign: 'left', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif' }}>This page will contain information about tools.</div>} />
                <Route path="/articles" element={<div style={{ padding: '20px', textAlign: 'left', fontSize: '1.2rem', fontFamily: 'Times New Roman, serif' }}>Articles will be listed here.</div>} />
                <Route path="/news" element={<NewsSection />} />
                <Route path="/topic/:id" element={<TopicDetail />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/pipeline-editor" element={<Flow />} />
                <Route path="/" element={<><TopicsList topics={topics} /><NewsSection /></>} />
              </Routes>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
