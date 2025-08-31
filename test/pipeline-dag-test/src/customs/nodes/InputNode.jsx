import { Handle, useReactFlow, useStore, Position } from "@xyflow/react";
import React, { useState, memo } from "react";
import SettingsButton from "./buttons/settings";
import Config from "./config/Config";
import { unixRegexToJSRegex } from "../../utils";

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
            {showContent ? <InputNode data={data} id={id} /> : <Placeholder />}
            <Handle
                type="source"
                position="bottom"
                style={{
                    borderRadius: 5,
                    width: 76,
                    height: 6,
                    background: "lightgray",
                }}
            />
        </>
    );
});

function InputNode({ data, id }) {
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [edgeData, setEdgeData] = useState([]);

    const { setNodes, getNodes, getEdges, setEdges } = useReactFlow();

    const [file, setFile] = useState(null);
    const [error, setError] = useState("");

    const getConnectionInfo = () => {
        const nodes = getNodes();
        const edges = getEdges();

        const outgoingEdges = edges.filter((e) => e.source === id);

        const connectedTargets = {
            source: [],
            target: outgoingEdges.map((edge) => {
                const targetNode = nodes.find((n) => n.id === edge.target);
                return {
                    edge,
                    node: targetNode,
                };
            }),
        };

        return connectedTargets;
    };

    const handleFileChange = (evt) => {
        const selectedFile = evt.target.files[0];
        if (!selectedFile) return;

        const connectedTargets = getConnectionInfo().target; // includes edge + node

        let valid = true;

        for (const { edge, node } of connectedTargets) {
            const inputIndex = edge?.data?.inputIndex ?? 0;
            const pattern = node?.data?.inputs?.[inputIndex];

            if (pattern) {
                try {
                    const jsRegex = unixRegexToJSRegex(pattern);
                    const regex = new RegExp(jsRegex);
                    if (!regex.test(selectedFile.name)) {
                        valid = false;
                        setError(
                            `"${selectedFile.name}" does not match with "${pattern}".`,
                        );
                        break;
                    }
                } catch (e) {
                    setError(`Invalid regex: "${pattern}"`);
                    valid = false;
                    break;
                }
            }
        }

        if (valid) {
            setFile(selectedFile);
            setError("");
        } else {
            setFile(null);
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
                              inputs: [file?.name],
                              outputs: [file?.name],
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
        <div className="input-node">
            <div className="central-container">
                <input
                    type="file"
                    className="xy-theme__input"
                    onChange={handleFileChange}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
            <label style={{ fontSize: "30px" }}>{data.label}</label>
            <SettingsButton onClick={handleOpen} buttonStyle="settings-button-config" />
            <Config
                isOpen={isConfigOpen}
                onClose={handleClose}
                onSave={handleSave}
                onDelete={handleDelete}
                data={data}
                edgeData={edgeData}
                nodeType="input"
                nodeId={id}
            />
        </div>
    );
}
