import React from "react";
import { Link } from "react-router-dom";

function NewsSection() {
    const news = [
        {
            id: 1,
            title: "Hoş Geldiniz! Forumumuz aktif!",
            summary: "Yeni üyeler için hoş geldin mesajı...",
            time: "15 Ağustos 2025, 13:00",
            content: "Tam haber içeriği burada.",
        },
        {
            id: 2,
            title: "Yeni özellikler yakında gelecek.",
            summary: "Gelecek güncellemeler hakkında bilgi...",
            time: "14 Ağustos 2025, 12:00",
            content: "Tam haber içeriği burada.",
        },
    ];

    return (
        <div className="news-section">
            <Link
                to={`/news`}
                style={{ textDecoration: "none", color: "inherit" }}
            >
                <h2 className="news-header">Haberler</h2>
            </Link>
            {news.map((item) => (
                <Link
                    to={`/topic/${item.id}`}
                    key={item.id}
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                    <div className="news-item">
                        <h3>{item.title}</h3>
                        <p>{item.summary}</p>
                        <small>{item.time}</small>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default NewsSection;
