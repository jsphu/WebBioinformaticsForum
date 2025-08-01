import { Handle, Position, useReactFlow, useStore } from "@xyflow/react";
import React, { useState, memo } from "react";
import SettingsButton from "./buttons/settings";
import Config from "./config/Config";
import ParametersConfig from "./config/ParametersConfig";
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
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    borderRadius: 5,
                    width: 8,
                    height: 64,
                    background: "darkgray",
                }}
            />
            {showContent ? (
                <CustomNode data={data} id={id} />
            ) : (
                <Placeholder data={data} />
            )}

            <Handle
                type="source"
                position={Position.Right}
                style={{
                    borderRadius: 5,
                    width: 8,
                    height: 64,
                    background: "lightgray",
                }}
            />
        </>
    );
});

function CustomNode({ data, id }) {
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [isParametersConfigOpen, setIsParametersConfigOpen] = useState(false);

    const [edgeData, setEdgeData] = useState([]);

    const { setNodes, getNodes, getEdges, setEdges } = useReactFlow();

    /* HANDLE REGULAR EXPRESSIONS  */
    const [userRegex, setUserRegex] = useState("");
    const [isValidRegex, setIsValidRegex] = useState(true);
    const [error, setError] = useState("");

    const getConnectionInfo = () => {
        const nodes = getNodes();
        const edges = getEdges();

        const incomingEdges = edges.filter((e) => e.target === id);
        const outgoingEdges = edges.filter((e) => e.source === id);

        const connectedNodes = {
            source: incomingEdges.map((e) =>
                nodes.find((n) => n.id === e.source),
            ),
            target: outgoingEdges.map((e) =>
                nodes.find((n) => n.id === e.target),
            ),
        };
        return connectedNodes;
    };

    const handleRegexChange = (regex) => {
        try {
            const processedRegex = unixRegexToJSRegex(regex);
            new RegExp(processedRegex);
            setUserRegex(processedRegex);
            setIsValidRegex(true);
            const validation = validateConnectedNodes();
        } catch (error) {
            setIsValidRegex(false);
            setError("Invalid file type.");
        }
    };

    const validateConnectedNodes = () => {
        const connectedNodes = getConnectionInfo();
        const regex = new RegExp(userRegex);

        const validationResults = {
            source: connectedNodes.source.map((n) => {
                const isValid = regex.test(n?.data?.output || "");
                return {
                    nodeId: n.id,
                    file: n?.data?.output || "",
                    isValid,
                };
            }),
            target: connectedNodes.target.map((n) => {
                const isValid = regex.test(n?.data?.input || "");
                return {
                    nodeId: n.id,
                    file: n?.data?.input || "",
                    isValid,
                };
            }),
        };
        return validationResults;
    };

    const handleDraggable = () => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === id
                    ? {
                          ...node,
                          draggable: isConfigOpen || isParametersConfigOpen,
                      }
                    : node,
            ),
        );
    };

    const handleOpen = (configType) => {
        const connectedNodes = getConnectionInfo();
        setEdgeData(connectedNodes);
        if (configType === "p") {
            setIsParametersConfigOpen(true);
        } else {
            setIsConfigOpen(true);
        }
        handleDraggable();
    };
    const handleClose = () => {
        setIsConfigOpen(false);
        setIsParametersConfigOpen(false);
        handleDraggable();
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
                              params: config.params,
                          },
                      }
                    : node,
            ),
        );
        setIsConfigOpen(false);
        setIsParametersConfigOpen(false);
        handleDraggable();
    };
    const handleDelete = () => {
        setIsConfigOpen(false);
        setIsParametersConfigOpen(false);
        setNodes((nds) => nds.filter((node) => node.id !== id));
    };
    const handleHighlight = (otherId) => {
        if (!otherId) {
            // Clear all highlights
            setEdges((eds) =>
                eds.map((edge) => ({
                    ...edge,
                    data: {
                        ...edge.data,
                        isHighlighted: false,
                    },
                })),
            );
            return;
        }
        const relatedEdgeId1 = `xy-edge__${id}-${otherId}`; // or however you name your edges
        const relatedEdgeId2 = `xy-edge__${otherId}-${id}`;

        setEdges((eds) =>
            eds.map((edge) =>
                edge.id === relatedEdgeId1 || edge.id === relatedEdgeId2
                    ? {
                          ...edge,
                          data: {
                              ...edge.data,
                              isHighlighted: true,
                          },
                      }
                    : {
                          ...edge,
                          data: {
                              ...edge.data,
                              isHighlighted: false,
                          },
                      },
            ),
        );
    };

    return (
        <div className="custom-node">
            {data.inputs.map((input, index) => {
                return (
                    input !== "" && (
                        <p key={`input-${index}`} className="input-text">
                            IN{index + 1}: {input}
                        </p>
                    )
                );
            })}
            <label style={{ fontSize: "30px" }}>{data.label}</label>
            <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
                <SettingsButton onClick={() => handleOpen()} />
                <SettingsButton onClick={() => handleOpen("p")} />
            </div>
            <ParametersConfig
                isOpen={isParametersConfigOpen}
                onClose={handleClose}
                onSave={handleSave}
                onDelete={handleDelete}
                data={data}
                nodeType=""
                nodeId={id}
            />
            <Config
                isOpen={isConfigOpen}
                onClose={handleClose}
                onSave={handleSave}
                onDelete={handleDelete}
                data={data}
                edgeData={edgeData}
                nodeId={id}
                nodeType=""
                onInputChange={handleRegexChange}
                onHighlighted={handleHighlight}
            />
            {data.outputs.map((output, index) => {
                return (
                    output !== "" && (
                        <p key={`output-${index}`} className="output-text">
                            OUT{index + 1}: {output}
                        </p>
                    )
                );
            })}
        </div>
    );
}
