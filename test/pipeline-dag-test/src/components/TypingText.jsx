import React, { useState, useEffect } from "react";

export const TypingText = ({ phrases }) => {
    const [text, setText] = useState("");
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isTyping, setIsTyping] = useState(true);

    const typingSpeed = 120; // milliseconds per character
    const deletingSpeed = 50; // milliseconds per character
    const pauseBeforeDelete = 4500; // milliseconds
    const pauseBeforeType = 500; // milliseconds

    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[phraseIndex];

            // Typing logic
            if (!isDeleting && charIndex <= currentPhrase.length) {
                setIsTyping(true);
                setText(currentPhrase.substring(0, charIndex));
                setCharIndex(charIndex + 1);
            }
            // Deleting logic
            else if (isDeleting && charIndex >= 0) {
                setIsTyping(true);
                setText(currentPhrase.substring(0, charIndex));
                setCharIndex(charIndex - 1);
            }
            // End of phrase, start deleting
            if (!isDeleting && charIndex === currentPhrase.length + 1) {
                setIsTyping(false);
                setIsDeleting(true);
            }
            // End of deletion, move to next phrase
            else if (isDeleting && charIndex === -1) {
                setIsTyping(false);
                setIsDeleting(false);
                setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
            }
        };

        let timeoutId;
        // Set speed based on whether we're typing or deleting
        if (!isDeleting && charIndex < phrases[phraseIndex].length + 1) {
            timeoutId = setTimeout(handleTyping, typingSpeed);
        } else if (isDeleting && charIndex >= 0) {
            timeoutId = setTimeout(handleTyping, deletingSpeed);
        }
        // Pause before deleting
        else if (!isDeleting && charIndex === phrases[phraseIndex].length + 1) {
            setIsTyping(false);
            timeoutId = setTimeout(handleTyping, pauseBeforeDelete);
        }
        // Pause before typing next phrase
        else if (isDeleting && charIndex === -1) {
            setIsTyping(false);
            timeoutId = setTimeout(handleTyping, pauseBeforeType);
        }

        // Clean up the timeout when the component unmounts or state changes
        return () => clearTimeout(timeoutId);
    }, [text, isDeleting, charIndex, phraseIndex, phrases]);

    return (
        <div style={{ font: "icon" }}>
            <h1
                className={`text-xl md:text-3xl font-light mb-8 text-center typing-text ${isTyping ? "" : "blinking"}`}
                // Display a cursor effect
            >
                {text}
            </h1>
        </div>
    );
};
