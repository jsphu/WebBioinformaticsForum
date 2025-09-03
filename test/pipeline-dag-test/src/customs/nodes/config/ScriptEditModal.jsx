import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import ScriptField from "../../ScriptField";

export default function ScriptEditModal({ show, onHide, value, onSave, title = "Edit Script" }) {
  const [scriptValue, setScriptValue] = useState(value || "");

  const handleSave = () => {
    onSave(scriptValue);
    onHide();
  };

  const handleCancel = () => {
    setScriptValue(value || ""); // Reset to original value
    onHide();
  };

  return (
    <Modal show={show} onHide={handleCancel} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Script Content</Form.Label>
          <ScriptField value={scriptValue} onChange={(e) => setScriptValue(e.target.value)} rows={20} fontSize={18} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
