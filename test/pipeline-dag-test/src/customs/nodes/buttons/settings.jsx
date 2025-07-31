import React from "react";

export default function SettingsButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="delete-button"
            style={{
                display: "flex",
                alignItems: "center",
                clipPath: "circle()",
                cursor: "pointer",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#e0e0e0")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
        >
            <span
                style={{
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    clipPath: "circle()",
                    backgroundImage:
                        "url('https://cdn-icons-png.flaticon.com/512/3524/3524659.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                }}
            ></span>
        </button>
    );
}
