import React, { createContext, useState, useMemo } from "react";
import Navbar from "./Navbar";
import Toaster from "./Toaster";
import Footer from "./Footer";

export const ToasterContext = createContext("unknown");

export default function Layout(props) {
  const [toaster, setToaster] = useState({
    title: "",
    show: false,
    message: "",
    type: "",
  });
  const value = useMemo(() => ({ toaster, setToaster }), [toaster]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <ToasterContext.Provider value={value}>
        <Navbar />
        <main style={{ flex: "1 0 auto" }}>
          <div style={{ display: "flex" }}>{props.children}</div>
        </main>
        <Toaster
          title={toaster.title}
          message={toaster.message}
          type={toaster.type}
          showToast={toaster.show}
          onClose={() =>
            setToaster({
              ...toaster,
              show: false,
            })
          }
        />
        <Footer />
      </ToasterContext.Provider>
    </div>
  );
}
