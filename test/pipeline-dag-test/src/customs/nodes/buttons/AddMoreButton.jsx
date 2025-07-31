import React from "react";

export default function AddMoreButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                padding: "4px",
                backgroundColor: "aqua",
                border: "1px solid aqua",
                clipPath: "circle()",
                cursor: "pointer",
                transition: "background-color 0.3s",
                color: "white",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "lightblue")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "aqua")}
        >
            +
        </button>
    );
}
