import React from "react";
import Flow from "./customs/flow";
import Layout from "./components/Layout";
import index from "./index";
import Base64Decoder from "./customs/hooks";

export default function App() {
    return (
        <div>
            <Layout>
                <Flow />
            </Layout>
            <Base64Decoder />
        </div>
    );
}
