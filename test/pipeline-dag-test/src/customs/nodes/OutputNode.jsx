import { Handle, useReactFlow, useStore } from "@xyflow/react";
import React, { useState, memo } from "react";
import SettingsButton from "./buttons/settings";
import OkButton from "./buttons/OkButton";
import Config from "./config/Config";

const Placeholder = (data) => (
    <div className="placeholder">
        <div style={{ width: "100px" }} />
        <div style={{ width: "100px" }} />
        <div style={{ width: "100px" }} />
    </div>
);

const zoomSelector = (s) => s.transform[2] >= 0.9;

export default memo(({ data, id }) => {
    const showContent = useStore(zoomSelector);

    return (
        <>
            <Handle
                type="target"
                position="top"
                style={{
                    borderRadius: 5,
                    width: 76,
                    height: 6,
                    background: "darkgray",
                }}
            />
            {showContent ? <OutputNode data={data} id={id} /> : <Placeholder />}
        </>
    );
});

function OutputNode({ data, id }) {
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [edgeData, setEdgeData] = useState([]);
    const [outputTypes, setOutputTypes] = useState([]);

    const { setNodes, getNodes, getEdges } = useReactFlow();

    const getConnectionInfo = () => {
        const nodes = getNodes();
        const edges = getEdges();

        const incomingEdges = edges.filter((e) => e.target === id);

        const connectedSources = {
            target: [],
            source: incomingEdges.map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source);
                return {
                    edge,
                    node: sourceNode,
                };
            }),
        };

        return connectedSources;
    };

    const handleOk = (evt) => {
        const connectedSources = getConnectionInfo().source; // includes edge + node

        if (connectedSources.length === 0) {
            setOutputTypes([]);
            return;
        }

        for (const { edge, node } of connectedSources) {
            const outputIndex = edge?.data?.outputIndex ?? 0;
            const pattern = node?.data?.outputs?.[outputIndex];

            if (pattern) {
                if (!outputTypes.includes(pattern)) {
                    setOutputTypes([...outputTypes, pattern]);
                }
            }
        }
    };

    const handleOpen = () => {
        const connectedNodes = getConnectionInfo();
        setEdgeData(connectedNodes);
        setIsConfigOpen(true);
    };
    const handleClose = () => {
        setIsConfigOpen(false);
    };
    const handleSave = (config) => {
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === id
                    ? {
                          ...node,
                          data: {
                              ...node.data,
                              label: config.label,
                              inputs: config.inputs,
                              outputs: config.outputs,
                              script: config.script,
                          },
                      }
                    : node,
            ),
        );
        setIsConfigOpen(false);
    };
    const handleDelete = () => {
        setIsConfigOpen(false);
        setNodes((nds) => nds.filter((node) => node.id !== id));
    };
    return (
        <div className="output-node">
            <label style={{ fontSize: "30px" }}>{data.label}</label>
            <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
                <SettingsButton onClick={handleOpen} />
                <OkButton onClick={handleOk} />
            </div>
            <Config
                isOpen={isConfigOpen}
                onClose={handleClose}
                onSave={handleSave}
                onDelete={handleDelete}
                data={data}
                edgeData={edgeData}
                nodeType="output"
                nodeId={id}
            />
            {outputTypes.length !== 0 && (
                <p className="output-text">{outputTypes.join(", ")}</p>
            )}
        </div>
    );
}
