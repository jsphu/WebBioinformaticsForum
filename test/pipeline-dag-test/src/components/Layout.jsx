import React from "react";
import Navigationbar from "./Navbar";

export default function Layout(props) {
    return (
        <div>
            <Navigationbar />
            <div style={{ display: "flex" }}>{props.children}</div>
        </div>
    );
}
