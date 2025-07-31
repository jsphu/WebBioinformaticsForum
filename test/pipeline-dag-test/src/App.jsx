import React from "react";
import Flow from "./customs/flow";
import Layout from "./components/Layout";
import index from "./index";

export default function App() {
    return (
        <div>
            <Layout>
                <Flow />
            </Layout>
        </div>
    );
}
