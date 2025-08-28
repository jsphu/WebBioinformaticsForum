import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <header
            style={{
                backgroundColor: "#e8ecef",
                padding: "10px 20px",
                fontSize: "1.2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <Link to="/">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        width="30"
                        height="30"
                        style={{ marginRight: "15px" }}
                    />
                </Link>
                <nav style={{ display: "flex", alignItems: "center" }}>
                    <Link
                        to="/forums"
                        style={{
                            marginRight: "15px",
                            textDecoration: "none",
                            color: "#000",
                            fontWeight: "bold",
                        }}
                    >
                        Forums
                    </Link>
                    <Link
                        to="/tool"
                        style={{
                            marginRight: "15px",
                            textDecoration: "none",
                            color: "#000",
                            fontWeight: "bold",
                        }}
                    >
                        Tool
                    </Link>
                    <Link
                        to="/articles"
                        style={{
                            marginRight: "15px",
                            textDecoration: "none",
                            color: "#000",
                            fontWeight: "bold",
                        }}
                    >
                        Articles
                    </Link>
                    <Link
                        to="/news"
                        style={{
                            marginRight: "15px",
                            textDecoration: "none",
                            color: "#000",
                            fontWeight: "bold",
                        }}
                    >
                        News
                    </Link>
                    <Link
                        to="/pipeline-editor"
                        style={{
                            textDecoration: "none",
                            color: "#000",
                            fontWeight: "bold",
                        }}
                    >
                        Editor
                    </Link>
                </nav>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    type="text"
                    placeholder="Search"
                    style={{
                        fontSize: "1rem",
                        width: "120px",
                        marginRight: "15px",
                        padding: "4px",
                    }}
                />
                <button
                    style={{
                        fontSize: "1.2rem",
                        padding: "4px 12px",
                        marginRight: "40px",
                    }}
                >
                    Search
                </button>
                <span
                    role="img"
                    aria-label="Notifications"
                    style={{ fontSize: "1.2rem", marginRight: "15px" }}
                >
                    🔔
                </span>
                <Link
                    to="/login"
                    style={{
                        textDecoration: "none",
                        color: "#000",
                        fontWeight: "bold",
                    }}
                >
                    Login
                </Link>
            </div>
        </header>
    );
}

export default Navbar;
