import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToasterProvider } from "../hooks/ToasterContext";

export default function Layout(props) {

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <ToasterProvider>
        <Navbar />
        <main style={{ flex: "1 0 auto" }}>
          <div style={{ display: "flex" }}>{props.children}</div>
        </main>
      </ToasterProvider>
      <Footer />
    </div>
  );
}
