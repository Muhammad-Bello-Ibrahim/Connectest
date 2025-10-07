import React from "react";

const NotFoundPage: React.FC = () => (
    <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f8f9fa"
    }}>
        <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
        <p style={{ fontSize: "1.5rem", color: "#555" }}>
            Sorry, the page you are looking for does not exist.
        </p>
        <a href="/" style={{
            marginTop: "2rem",
            padding: "0.75rem 1.5rem",
            background: "#0070f3",
            color: "#fff",
            borderRadius: "4px",
            textDecoration: "none"
        }}>
            Go Home
        </a>
    </div>
);

export default NotFoundPage;