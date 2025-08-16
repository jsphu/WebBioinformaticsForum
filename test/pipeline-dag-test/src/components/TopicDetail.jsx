import React from 'react';
import { useParams } from 'react-router-dom';

function TopicDetail() {
  const { id } = useParams();
  // Şimdilik sahte veri, sonradan veritabanından çekilecek
  const details = {
    1: { title: 'Yeni Proje Fikirleri', content: 'Tam içerik burada. Detaylı açıklama, yorumlar ve tartışmalar. Kullanıcılar yorum yapabilir.' },
    2: { title: 'Veri Analizi Sorunu', content: 'Tam içerik burada. Detaylı açıklama, yorumlar ve tartışmalar.' },
    // Diğer id'ler için ekleyin
  };

  const detail = details[id] || { title: 'Bulunamadı', content: 'İçerik yok.' };

  return (
    <div className="topic-detail" style={{ maxWidth: '800px', margin: '20px auto', textAlign: 'left' }}>
      <h1>{detail.title}</h1>
      <p>{detail.content}</p>
      {/* Yorumlar bölümü sonradan eklenebilir */}
    </div>
  );
}

export default TopicDetail;