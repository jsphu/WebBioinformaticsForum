import { useState } from "react";
import ScriptEditModal from "./ScriptEditModal";
import { Button, Form, Table } from "react-bootstrap";
import { useToaster } from "../../../hooks/ToasterContext";
import ParameterInfo from "../../ParameterInfo";

export default function Parameters({ parameters, handleChange, onRemove, onAdd }) {
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [currentScriptIndex, setCurrentScriptIndex] = useState(null);
  const [currentScriptField, setCurrentScriptField] = useState(null);
  const { setToaster } = useToaster();

  const handleScriptEdit = (index, fieldType, currentValue) => {
    setCurrentScriptIndex(index);
    setCurrentScriptField(fieldType);
    setShowScriptModal(true);
  };

  const handleScriptSave = (newValue) => {
    if (currentScriptIndex !== null && currentScriptField) {
      // Create a synthetic event to match the expected format
      const syntheticEvent = {
        target: { value: newValue }
      };
      handleChange(syntheticEvent, currentScriptIndex, currentScriptField);
    }
    setCurrentScriptIndex(null);
    setCurrentScriptField(null);
  };

  const renderValueField = (param, index, fieldType, placeholder) => {
    const value = param[fieldType] || "";
    const hasNewlines = String(value).includes('\n');

    if (hasNewlines) {
      return (
        <Button
          size="sm"
          variant="outline-primary"
          onClick={() => handleScriptEdit(index, fieldType, value)}
        >
          Edit Script
        </Button>
      );
    }

    return (
      <Form.Control
        value={value}
        onChange={(e) => handleChange(e, index, fieldType)}
        placeholder={placeholder}
        size="sm"
      />
    );
  };

  const getCurrentScriptValue = () => {
    if (currentScriptIndex === null || !currentScriptField) return "";
    return parameters[currentScriptIndex]?.[currentScriptField] || "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const droppedData = e.dataTransfer.getData("text/plain");
      const newParameter = JSON.parse(droppedData);

      if (!newParameter.key) {
        setToaster({
          title: "Invalid Drop",
          message: "Failed to drop",
          type: "warning",
          show: true
        });
        return;
      }

      if (onAdd) {
        onAdd(newParameter);
      }
    } catch (error) {
      console.error("Failed to process dropped data:", error);
    }
  };

  const handleParamKeyChange = (e, index) => {
    handleChange(e, index, "key");
    console.log("Parameters - ", index);
  }

  return (
    <>
      <div>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Index</th>
              <th>Key</th>
              <th>Value</th>
              <th>Value Type</th>
              <th>Default Value</th>
              <th>Required</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody onDragOver={handleDragOver} onDrop={handleDrop}>
            {parameters.length > 0 ? (
              parameters.map((param, index) => (
                <tr key={index}>
                  <td>{index}</td>
                  <td>
                    <Form.Control
                      value={param.key}
                      onChange={(e) => handleParamKeyChange(e, index)}
                      placeholder="parameter key"
                      size="sm"
                    />
                  </td>
                  <td>
                    {renderValueField(param, index, "value", "parameter value")}
                  </td>
                  <td>
                    <Form.Control
                      value={param.value_type}
                      onChange={(e) => handleChange(e, index, "value_type")}
                      size="sm"
                      placeholder="value type"
                    >
                    </Form.Control>
                  </td>
                  <td>
                    {renderValueField(param, index, "default_value", "default value")}
                  </td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={param.is_required || false}
                      onChange={(e) => {
                        const syntheticEvent = {
                          target: { value: e.target.checked }
                        };
                        handleChange(syntheticEvent, index, "is_required");
                      }}
                    />
                  </td>
                  <td>
                    {param.id ? <ParameterInfo parameter={param} updateMode /> : <ParameterInfo parameter={param} createMode />}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onRemove(index)}
                      type="button"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">
                  No parameters yet
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <ScriptEditModal
        show={showScriptModal}
        onHide={() => setShowScriptModal(false)}
        value={getCurrentScriptValue()}
        onSave={handleScriptSave}
        title={`Edit ${currentScriptField === 'value' ? 'Parameter Value' : 'Default Value'}`}
      />
    </>
  );
}
