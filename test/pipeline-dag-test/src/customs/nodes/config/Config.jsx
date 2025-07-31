import React, { useState, useEffect } from "react";

export default function Config({
    isOpen,
    onClose,
    onSave,
    data,
    edgeData,
    nodeId,
    nodeType,
    onDelete,
    onHighlighted,
    onInputChange,
}) {
    const [config, setConfig] = useState(() => ({
        ...data,
        inputs: data.inputs || [],
        outputs: data.outputs || [],
        params: data.params || {},
    }));
    const [deleteConsent, setDeleteConsent] = useState(false);
    const [error, setError] = useState("");

    const [textareaRows, setTextareaRows] = useState(1);

    const handleParams = () => {
        const keyMap = new Map(); // Track keys and which node they came from
        let hasDuplicate = false;

        for (const [k, v] of Object.entries(data?.params || {})) {
            if (keyMap.has(k)) {
                setError(`Error: "${k}"! Parameter names should be unique!`);
                hasDuplicate = true;
                break;
            } else {
                keyMap.set(k, "current");
            }
        }
        if (edgeData.source) {
            for (const node of edgeData.source) {
                if (node.type === "parametersNode" || node.data?.params) {
                    for (const [k, v] of Object.entries(node.data.params)) {
                        if (keyMap.has(k)) {
                            setError(
                                `Error: "${k}"! Parameter names should be unique!`,
                            );
                            hasDuplicate = true;
                            break;
                        } else {
                            keyMap.set(k, node.id);
                        }
                    }
                }

                if (hasDuplicate) break;
            }
        }
        if (!hasDuplicate) {
            setError("");
        }
    };

    const handleFocus = (index, isSource) => {
        const id = isSource
            ? edgeData.source[index]?.id
            : edgeData.target[index]?.id;
        if (id) {
            onHighlighted(id);
        }
    };

    // Update the local state when the `data` prop changes
    useEffect(() => {
        setConfig(data);
    }, [data]);

    const handleChange = (e, index, type) => {
        const { value } = e.target;

        if (type === "inputs") {
            const newInputs = [...config.inputs];
            newInputs[index] = value;
            setConfig((prevConfig) => ({
                ...prevConfig,
                inputs: newInputs,
            }));
            onInputChange(value); // update regex logic if needed
        } else if (type === "outputs") {
            const newOutputs = [...config.outputs];
            newOutputs[index] = value;
            setConfig((prevConfig) => ({
                ...prevConfig,
                outputs: newOutputs,
            }));
        } else {
            setConfig((prevConfig) => ({
                ...prevConfig,
                [e.target.name]: value,
            }));
        }
    };

    const handleSave = () => {
        onSave(config); // Pass the updated configuration back to the parent
    };

    const handleDelete = (deleteNow) => {
        if (deleteNow) {
            onDelete(true);
        } else {
            setDeleteConsent(true);
        }
    };
    if (!isOpen) return null; // Don't render the popup if it's not open

    const handleMouseDown = (e) => {
        e.stopPropagation(); // stop panning
    };

    return (
        <div className="popup-overlay">
            <div
                className="popup-container"
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                <h2>Configure Node</h2>
                <div className="popup-form">
                    <input
                        type="text"
                        name="label"
                        value={config.label}
                        onChange={handleChange}
                        placeholder="Node Label"
                    />
                    {() => {
                        handleParams();
                    }}
                    {nodeType !== "output" && (
                        <>
                            {/* Render combined parameters */}
                            <div
                                style={{
                                    border: "1px solid gray",
                                    borderRadius: "5px",
                                    padding: "0px 6px ",
                                    paddingTop: "10px",
                                }}
                            >
                                {[...edgeData.source, { data }].flatMap(
                                    (input, index) => {
                                        const entries = Object.entries(
                                            input.data?.params || {},
                                        );
                                        return entries.map(([k, v]) => (
                                            <p
                                                key={`param-${index}-${k}`}
                                                onMouseOver={() => {
                                                    handleParams();
                                                    handleFocus(index, true);
                                                }}
                                                onMouseLeave={() =>
                                                    onHighlighted("")
                                                }
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                }}
                                            >
                                                {error && (
                                                    <strong
                                                        style={{ color: "red" }}
                                                    >
                                                        {error}
                                                    </strong>
                                                )}
                                                {!error && (
                                                    <>
                                                        <strong>{k}=</strong>
                                                        <span>{v}</span>
                                                    </>
                                                )}
                                            </p>
                                        ));
                                    },
                                )}
                            </div>

                            {/* Render input fields, but skip parametersNodes */}
                            {edgeData.source.map((input, index) =>
                                input.type !== "parametersNode" ? (
                                    <label key={`input-${input.id || index}`}>
                                        Input{index + 1} Filename
                                        <input
                                            type="text"
                                            name={`input-${index + 1}`}
                                            value={config.inputs[index] ?? ""}
                                            onChange={(e) =>
                                                handleChange(e, index, "inputs")
                                            }
                                            placeholder={`Input${index + 1}`}
                                            onMouseOver={() =>
                                                handleFocus(index, true)
                                            }
                                            onFocus={() =>
                                                handleFocus(index, true)
                                            }
                                            onMouseLeave={() =>
                                                onHighlighted("")
                                            }
                                            onBlur={() => onHighlighted("")}
                                        />
                                    </label>
                                ) : null,
                            )}
                        </>
                    )}
                    {nodeType !== "input" && nodeType !== "output" && (
                        <>
                            {edgeData.target.map((output, index) => {
                                return (
                                    <label key={`output-${output.id || index}`}>
                                        Output{index + 1} Filename
                                        <input
                                            type="text"
                                            name={output + (index + 1)}
                                            value={config.outputs[index] ?? ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    e,
                                                    index,
                                                    "outputs",
                                                )
                                            }
                                            placeholder={`Output${index + 1}`}
                                            onMouseOver={() =>
                                                handleFocus(index, false)
                                            }
                                            onFocus={() =>
                                                handleFocus(index, false)
                                            }
                                            onMouseLeave={() => {
                                                onHighlighted("");
                                            }}
                                            onBlur={() => {
                                                onHighlighted("");
                                            }}
                                        />
                                    </label>
                                );
                            })}
                            <label>
                                Script:
                                <textarea
                                    name="script"
                                    value={config.script}
                                    onChange={handleChange}
                                    rows={textareaRows}
                                    onKeyDown={(e) => {
                                        if (e.key === "Tab") {
                                            e.preventDefault();

                                            const textarea = e.target;
                                            const start =
                                                textarea.selectionStart;
                                            const end = textarea.selectionEnd;

                                            // Insert tab character
                                            const newValue =
                                                config.script.substring(
                                                    0,
                                                    start,
                                                ) +
                                                "\t" +
                                                config.script.substring(end);
                                            setConfig((prevConfig) => ({
                                                ...prevConfig,
                                                [e.target.name]: newValue,
                                            }));

                                            // Move cursor after tab
                                            setTimeout(() => {
                                                textarea.selectionStart =
                                                    textarea.selectionEnd =
                                                        start + 1;
                                            }, 0);
                                        }
                                    }}
                                    onFocus={() => setTextareaRows(20)}
                                    onBlur={() => setTextareaRows(1)}
                                    style={{
                                        resize: "none",
                                        fontSize: 10,
                                        fontFamily: "monospace",
                                    }}
                                />
                            </label>{" "}
                        </>
                    )}
                </div>
                <p>Node ID: {nodeId}</p>
                {deleteConsent === true ? (
                    <div className="popup-actions">
                        <label>are you sure?</label>
                        <button
                            onClick={() => setDeleteConsent(false)}
                            className="save-button"
                        >
                            No
                        </button>
                        <button
                            onClick={() => handleDelete(true)}
                            className="delete-button"
                        >
                            Yes
                        </button>
                    </div>
                ) : (
                    <div className="popup-actions">
                        <button onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="save-button">
                            Save
                        </button>
                        <button
                            onClick={() => handleDelete(false)}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
