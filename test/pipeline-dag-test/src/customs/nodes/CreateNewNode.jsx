import { useReactFlow } from "@xyflow/react";
import React, { useCallback, useState } from "react";
import ResultNode from "./ResultNode";

export default function CreateNewNode({ data, isPanel }) {
    const { getNodes, setNodes } = useReactFlow();
    const [idValue, setIdValue] = useState("");
    const [typeValue, setTypeValue] = useState("customNode");
    const [labelValue, setLabelValue] = useState("");
    const selectedNodeId = "creator";

    const addNodeNear = useCallback(() => {
        if (!selectedNodeId && !isPanel) return;

        const sourceNode = getNodes().find((n) => n.id === selectedNodeId);
        if (!sourceNode && !isPanel) return;

        const newType = `${typeValue}`;
        const newId = `${
            newType !== "resultNode"
                ? idValue
                    ? idValue
                    : getNodes().length + 1
                : "result"
        }`;
        const newLabel = `${labelValue}`;
        const offsetX = 300;
        const offsetY = 35;
        let newNode;

        if (newType === "parametersNode") {
            newNode = {
                id: newId,
                position: {
                    x: isPanel ? 0 : sourceNode.position.x + offsetX,
                    y: isPanel ? 0 : sourceNode.position.y + offsetY,
                },
                type: newType,
                data: {
                    label: newLabel,
                    params: {},
                    source: "",
                    target: "",
                },
            };
        } else {
            newNode = {
                id: newId,
                data: {
                    label: newLabel,
                    inputs: [],
                    outputs: [],
                    script: null,
                    source: "",
                    target: "",
                },
                position: {
                    x: isPanel ? 0 : sourceNode.position.x + offsetX,
                    y: isPanel ? 0 : sourceNode.position.y + offsetY,
                },
                type: newType,
            };
        }
        setNodes((nds) => [...nds, newNode]);
    }, [
        getNodes,
        setNodes,
        selectedNodeId,
        idValue,
        labelValue,
        typeValue,
        isPanel,
    ]);

    const idHandleChange = (evt) => {
        setIdValue(evt.target.value);
    };
    const labelHandleChange = (evt) => {
        setLabelValue(evt.target.value);
    };
    const typeHandleChange = (evt) => {
        setTypeValue(evt.target.value);
    };

    const handleDynamicIdValueForInput = () => {
        setIdValue("input" + (getNodes().length + 1));
    };
    const handleDynamicIdValueForOutput = () => {
        setIdValue("output" + (getNodes().length + 1));
    };

    const handleDelete = () => {
        setNodes((nds) => nds.filter((node) => node.id !== "creator"));
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                {typeValue === "resultNode" && isPanel ? (
                    <ResultNode />
                ) : (
                    <button className="xy-theme__button" onClick={addNodeNear}>
                        Create
                    </button>
                )}
                {!isPanel && (
                    <button className="xy-theme__button" onClick={handleDelete}>
                        Delete
                    </button>
                )}
                <select
                    className="xy-theme__button"
                    id="options"
                    value={typeValue}
                    onChange={typeHandleChange}
                    name="options"
                >
                    <option value="customNode">Custom</option>
                    <option
                        value="inputNode"
                        onMouseDown={handleDynamicIdValueForInput}
                    >
                        Input
                    </option>
                    <option
                        value="outputNode"
                        onMouseDown={handleDynamicIdValueForOutput}
                    >
                        Output
                    </option>
                    <option value="parametersNode">Parameters</option>
                    <option value="resultNode">Results</option>
                </select>
            </div>
            {typeValue !== "resultNode" && (
                <div>
                    <input
                        className="xy-theme__input"
                        type="text"
                        value={typeValue !== "resultNode" ? idValue : "result"}
                        onChange={idHandleChange}
                        placeholder="node id"
                    />
                </div>
            )}
            {typeValue !== "resultNode" && (
                <div>
                    <input
                        className="xy-theme__input"
                        type="text"
                        value={labelValue}
                        onChange={labelHandleChange}
                        placeholder="node label"
                    />
                </div>
            )}
        </div>
    );
}
