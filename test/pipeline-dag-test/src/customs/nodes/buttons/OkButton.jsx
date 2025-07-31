import React from "react";

export default function OkButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                padding: "1px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
                clipPath: "circle()",
                cursor: "pointer",
                transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#e0e0e0")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
        >
            <span
                style={{
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    backgroundImage:
                        "url('https://cdn-icons-png.flaticon.com/512/3524/3524690.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                }}
            ></span>
        </button>
    );
}
