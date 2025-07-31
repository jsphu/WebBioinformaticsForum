import { Handle, useReactFlow, useStore, Position } from "@xyflow/react";
import React, { useState, memo } from "react";
import SettingsButton from "./buttons/settings";
import ParametersConfig from "./config/ParametersConfig";

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
            {showContent ? (
                <ParametersNode data={data} id={id} />
            ) : (
                <Placeholder />
            )}
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

function ParametersNode({ data, id }) {
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [edgeData, setEdgeData] = useState([]);

    const { setNodes, getNodes, getEdges, setEdges } = useReactFlow();

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

    const handleOpen = () => {
        const connectedNodes = getConnectionInfo();
        setEdgeData(connectedNodes);
        setDivStyle({ width: "250px" });
        setIsConfigOpen(true);
    };
    const handleClose = () => {
        setDivStyle({ width: "50px" });
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
                              params: config.params,
                          },
                      }
                    : node,
            ),
        );
        setDivStyle({ width: "50px" });
        setIsConfigOpen(false);
    };
    const handleDelete = () => {
        setIsConfigOpen(false);
        setNodes((nds) => nds.filter((node) => node.id !== id));
    };
    const [divStyle, setDivStyle] = useState({ width: "50px" });

    return (
        <div className="parameter-node" style={divStyle}>
            <label style={{ fontSize: "30px" }}>{data.label}</label>
            <SettingsButton onClick={handleOpen} />
            <ParametersConfig
                isOpen={isConfigOpen}
                onClose={handleClose}
                onSave={handleSave}
                onDelete={handleDelete}
                data={data}
                nodeType="parameter"
                nodeId={id}
            />
        </div>
    );
}
