import { useState } from "react";
import ScriptEditModal from "../ScriptEditModal";
import { Button, Form, Table, Modal } from "react-bootstrap";
import { useToaster } from "../../../../hooks/ToasterContext";
import ParameterInfo from "../ParameterInfo";
import SearchParameterBar from "../../SearchParameterBar";
import { useParameter } from "../../../../hooks/ParameterContext";
import { v4 as uuidv4 } from "uuid";

export default function Parameters(props) {
  const { parameters, handleChange, onRemove, onAdd, isOpen } = props;
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [currentScriptIndex, setCurrentScriptIndex] = useState(null);
  const [currentScriptField, setCurrentScriptField] = useState(null);
  const { setToaster } = useToaster();
  const [showModal, setShowModal] = useState(false);
  const { parameters: ParametersDB } = useParameter();

  // Open modal to edit multiline value
  const handleScriptEdit = (index, fieldType, currentValue) => {
    setCurrentScriptIndex(index);
    setCurrentScriptField(fieldType);
    setShowScriptModal(true);
  };

  // Save edited multiline value
  const handleScriptSave = (newValue) => {
    if (currentScriptIndex !== null && currentScriptField) {
      handleChange({ target: { value: newValue } }, currentScriptIndex, currentScriptField);
    }
    setCurrentScriptIndex(null);
    setCurrentScriptField(null);
    setShowScriptModal(false);
  };

  // Render a value field (inline input or "Edit Script" button)
  const renderValueField = (param, index, fieldType, placeholder) => {
    const value = param[fieldType] ?? "";
    const hasNewlines = String(value).includes("\n") || param.value_type.includes('multi') || param.value_type.includes('script');

    if (hasNewlines) {
      return (
        <Button
          size="sm"
          variant="outline-primary"
          onClick={() => handleScriptEdit(index, fieldType, value)}
        >
          Edit Value
        </Button>
      );
    }

    return (
      <Form.Control
        value={value}
        onChange={(e) => handleChange(e, index, fieldType)}
        placeholder={placeholder}
        size="sm"
        autoComplete="off"
      />
    );
  };

  // Current value for ScriptEditModal
  const getCurrentScriptValue = () => {
    if (currentScriptIndex === null || !currentScriptField) return "";
    return parameters[currentScriptIndex]?.[currentScriptField] ?? "";
  };

  // Drag & drop handlers
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

      // Require a key for dropped parameter
      if (!newParameter.key) {
        setToaster({
          title: "Invalid Drop",
          message: "Dropped parameter must have a key",
          type: "warning",
          show: true,
        });
        return;
      }

      onAdd?.(newParameter);
    } catch (error) {
      console.error("Failed to process dropped data:", error);
    }
  };


  const handleAddParamLocal = (parameter) => {
    onAdd(parameter);
  }


  return (
    <>
      <Button onClick={() => setShowModal(true)}>Parameters</Button>
      <Modal show={showModal} size="xl" >
        <Modal.Header>
          <Modal.Title>Parameters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                  <tr key={param.id || uuidv4()}>
                    <td>{index}</td>
                    <td>
                      <Form.Control
                        value={param.key ?? ""}
                        onChange={(e) => handleChange(e, index, "key")}
                        placeholder="parameter key"
                        size="sm"
                        autoComplete="off"
                      />
                    </td>
                    <td>{renderValueField(param, index, "value", "parameter value")}</td>
                    <td>
                      <Form.Control
                        value={param.value_type ?? ""}
                        onChange={(e) => handleChange(e, index, "value_type")}
                        placeholder="value type"
                        size="sm"
                      />
                    </td>
                    <td>{renderValueField(param, index, "default_value", "default value")}</td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={param.is_required || false}
                        onChange={(e) =>
                          handleChange({ target: { value: e.target.checked } }, index, "is_required")
                        }
                      />
                    </td>
                    <td className="d-flex gap-1">
                      <ParameterInfo
                        parameter={param}
                        createMode={!param.id}
                        updateMode={!!param.id}
                      />
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

          <Button
            size="sm"
            variant="primary"
            onClick={() => handleAddParamLocal()}
            type="button"
          >
            + Add Parameter
          </Button>

          <SearchParameterBar parameters={ParametersDB} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <ScriptEditModal
        show={showScriptModal}
        onHide={() => setShowScriptModal(false)}
        value={getCurrentScriptValue()}
        onSave={handleScriptSave}
        title={`Edit ${
          currentScriptField === "value" ? "Parameter Value" : "Default Value"
        }`}
      />
    </>
  );
}
