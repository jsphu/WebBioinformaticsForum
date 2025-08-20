import React from "react";
import TopicsList from "./TopicsList";
import NewsSection from "./NewsSection";
import { TypingText } from "./TypingText";

export default function MainPage() {
    const phrases = [
        "A Science Community.",
        "An Online Pipeline Editor.",
        "A Bioinformatics Forum.",
        "Web Bioinformatics Forum",
        ";)",
    ];
    return (
        <>
            <div className="main-content">
                <TopicsList />
                <NewsSection />
            </div>
            <TypingText phrases={phrases} />
        </>
    );
}
