import React, { useState, useEffect } from "react";
import AddMoreButton from "../buttons/AddMoreButton";

export default function ParametersConfig({
    isOpen,
    onClose,
    onSave,
    data,
    nodeId,
    nodeType,
    onDelete,
}) {
    const [paramList, setParamList] = useState([{ key: "", value: "" }]);
    const [config, setConfig] = useState({ ...data });
    const [deleteConsent, setDeleteConsent] = useState(false);

    // Update the local state when the `data` prop changes
    useEffect(() => {
        setConfig(data);

        if (data?.params) {
            const entries = Object.entries(data.params).map(([key, value]) => ({
                key,
                value,
            }));
            setParamList(entries.length ? entries : [{ key: "", value: "" }]);
        } else {
            setParamList([{ key: "", value: "" }]);
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig((prevConfig) => ({
            ...prevConfig,
            [name]: value,
        }));
    };

    const handleParamChange = (index, field, newValue) => {
        setParamList((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: newValue } : item,
            ),
        );
    };

    const handleSave = () => {
        const paramObj = {};
        paramList.forEach(({ key, value }) => {
            if (key) paramObj[key] = value;
        });

        const updatedConfig = {
            ...config,
            params: paramObj,
        };

        setConfig(updatedConfig);
        onSave(updatedConfig); // Pass the updated configuration back to the parent
    };

    const handleDelete = (deleteNow) => {
        if (deleteNow) {
            onDelete(true);
        } else {
            setDeleteConsent(true);
        }
    };
    if (!isOpen) return null; // Don't render the popup if it's not open

    const addParameterInput = () => {
        setParamList((prev) => [...prev, { key: "", value: "" }]);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <h2>Configure Parameters</h2>
                <div className="popup-form">
                    {nodeType === "parameter" ? (
                        <input
                            type="text"
                            name="label"
                            value={config.label}
                            onChange={handleChange}
                            placeholder="Node Label"
                        />
                    ) : (
                        <label>{data.label}</label>
                    )}
                </div>
                {paramList.map((param, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            gap: "1rem",
                            paddingTop: "2px",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Key"
                            value={param.key}
                            onChange={(e) =>
                                handleParamChange(index, "key", e.target.value)
                            }
                            style={{ width: "100px", padding: "5px" }}
                        />
                        <input
                            type="text"
                            placeholder="Value"
                            value={param.value}
                            onChange={(e) =>
                                handleParamChange(
                                    index,
                                    "value",
                                    e.target.value,
                                )
                            }
                            style={{ width: "250px" }}
                        />
                        <button
                            onClick={() => {
                                setParamList((prev) =>
                                    prev.filter((_, i) => i !== index),
                                );
                            }}
                            className="delete-button"
                        >
                            X
                        </button>
                    </div>
                ))}
                <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                    <AddMoreButton onClick={addParameterInput} />
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
