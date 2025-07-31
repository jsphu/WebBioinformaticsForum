import { useReactFlow } from "@xyflow/react";
import React from "react";

export default function ResultNode() {
    const { getNodes, getEdges } = useReactFlow();

    const generateNodeInfo = () => {
        const nodes = getNodes();
        const edges = getEdges();

        const outputLines = [];
        const nodeSequence = [];

        for (const node of nodes) {
            if (node.id === "creator" || node.id === "result") {
                continue;
            }
            const incomingEdges = edges.filter((e) => e.target === node.id);
            const outgoingEdges = edges.filter((e) => e.source === node.id);

            const nodeInfo = {
                label: node.data?.label || "",
                inputs: node.data?.inputs || null,
                outputs: node.data?.outputs || null,
                script: node.data?.script || null,
                source: incomingEdges.map((e) => e.source),
                target: outgoingEdges.map((e) => e.target),
            };

            nodeSequence.push(nodeInfo.label);

            outputLines.push(`[${node.id}]`);
            outputLines.push(`Label: ${nodeInfo.label ? nodeInfo.label : ""}`);
            if (node.type !== "inputNode" && node.type !== "outputNode") {
                outputLines.push(
                    `Inputs: ${nodeInfo.inputs ? nodeInfo.inputs.join(", ") : ""}`,
                );
                outputLines.push(
                    `Outputs: ${nodeInfo.outputs ? nodeInfo.outputs.join(", ") : ""}`,
                );
                outputLines.push(
                    `Script: ${nodeInfo.script ? nodeInfo.script : ""}`,
                );
            }
            if (node.type !== "inputNode") {
                outputLines.push(`Source: ${nodeInfo.source}`);
            }
            if (node.type !== "outputNode") {
                outputLines.push(`Target: ${nodeInfo.target}`);
            }
            outputLines.push("");
        }

        console.log(outputLines.join("\n"));
        console.log(nodeSequence.join(" > "));
    };

    return <button onClick={generateNodeInfo}>Print Node Data</button>;
}
