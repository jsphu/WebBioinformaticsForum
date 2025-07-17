import React, { useCallback } from "react";
import {
    Background,
    ReactFlow,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    addEdge,
    Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CustomNode, TextUpdaterNode } from "./customs/nodes";
import CustomEdge from "./customs/edges";

const nodeTypes = {
    textUpdater: TextUpdaterNode,
    customNode: CustomNode,
};

const edgeTypes = {
    customEdge: CustomEdge,
};

const initialNodes = [
    {
        id: "input",
        type: "input",
        position: { x: 0, y: 0 },
        data: { label: ".fastq" },
    },
    {
        id: "custom",
        type: "customNode",
        position: { x: 200, y: 100 },
        data: { buttonText: "click me" },
    },
    {
        id: "fq",
        type: "textUpdater",
        position: { x: -200, y: 100 },
        data: { label: "FASTQC" },
    },
    {
        id: "output",
        type: "output",
        position: { x: 0, y: 200 },
        data: { label: ".html" },
    },
];
const initialEdges = [];

const ProviderFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback(
        (params) => {
            // Check if the source or target node is of type "customNode"
            const sourceNode = nodes.find((node) => node.id === params.source);
            const targetNode = nodes.find((node) => node.id === params.target);

            const isCustomEdge =
                sourceNode?.type === "customNode" ||
                targetNode?.type === "customNode";

            // Add the edge with the appropriate type
            setEdges((els) =>
                addEdge(
                    {
                        ...params,
                        type: isCustomEdge ? "customEdge" : "default", // Use "customEdge" if applicable
                    },
                    els,
                ),
            );
        },
        [nodes],
    );

    return (
        <div className="providerflow">
            <ReactFlowProvider>
                <div className="reactflow-wrapper" style={{ height: 600 }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                    >
                        <Controls />
                        <Background />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </div>
    );
};

export default function App() {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <ProviderFlow />
        </div>
    );
}
