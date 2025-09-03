import React, { useState, useEffect } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { useFadeTransition } from "../../../hooks/animations";
import ScriptField from "../../ScriptField";
import VersionField from "../../VersionField";
import { useUser } from "../../../hooks/UserContext";
import { useParameter } from "../../../hooks/ParameterContext";
import SettingsButton from "../buttons/settings";
import { useToaster } from "../../../hooks/ToasterContext";
import Parameters from "./Parameters";
import SearchParameterBar from "../../SearcParameterBar";
import ParameterInfo from "../../ParameterInfo";

export default function ConfigPanel({
    configData,
    nodeId,
    isOpen,
    onSave,
    onOpen,
    onClose,
    onDelete,
    onAddInput,
    onAddOutput,
    onRemoveInput,
    onRemoveOutput,
    onAddParameter,
    onRemoveParameter,
}) {

  const [config, setConfig] = useState({
    ...configData,
    inputs: configData?.inputs || [],
    outputs: configData?.outputs || [],
    parameters: configData?.parameters || [],
  });
  const [validated, setValidated] = useState(false);
  const [charCounter, setCharCounter] = useState(configData?.description?.length || 0);
  const [titleCharCounter, setTitleCharCounter] = useState(configData?.process_name?.length || 0);

  const { setToaster } = useToaster();
  const { user } = useUser();
  const { shouldRender, isVisible } = useFadeTransition(isOpen, 300);
  const { parameters } = useParameter();

  useEffect(() => {
    if (!config || !Object.keys(config).length) {
      setConfig({
        ...configData,
        inputs: configData?.inputs || [],
        outputs: configData?.outputs || [],
        parameters: configData?.parameters || [],
      });
    }
  }, [config, configData]);

  const isUserOwner = user?.username === config?.owner?.username || false;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const createProcessForm = event.currentTarget;

    if (createProcessForm.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setToaster({
      title: "Process",
      message: "Process Saved!",
      type: "success",
      show: true,
    })
    onSave(config);
  }

  const handleTitleCharLimit = (e) => {
    const processName = e.target.value;
    setConfig((prev) => ({ ...prev, process_name: processName }));
    setTitleCharCounter(processName.length);
  };

  const handleCharLimit = (e) => {
    const description = e.target.value;
    setConfig((prev) => ({ ...prev, description }));
    setCharCounter(description.length);
  };

  const handleInputChange = (e, index, fieldType) => {
    const field = e.target.value;

    setConfig((prev) => ({
      ...prev,
      inputs: prev.inputs.map((input, i) =>
        i === index
          ? { ...input, [fieldType]: field }
          : input
      ),
    }));
  };

  const handleOutputChange = (e, index, fieldType) => {
    const field = e.target.value;

    setConfig((prev) => ({
      ...prev,
      outputs: prev.outputs.map((output, i) =>
        i === index
          ? { ...output, [fieldType]: field }
          : output
      ),
    }));
  };

  const handleParamChange = (e, index, fieldType) => {
    const field = e.target.value;

    console.log(field, index, fieldType);
    setConfig((prev) => ({
      ...prev,
      parameters: prev.parameters.map((parameter, i) =>
        i === index
          ? { ...parameter, [fieldType]: field }
          : parameter
      ),
    }));
  };

  const handleAddInputLocal = () => {
    // Just call the parent handler - it will update the node data
    // and trigger a re-render via configData prop change
    onAddInput();
  };

  const handleAddOutputLocal = () => {
    // Just call the parent handler - it will update the node data
    // and trigger a re-render via configData prop change
    onAddOutput();
  };

  const handleRemoveInputLocal = (index) => {
    // Just call the parent handler
    onRemoveInput?.(index);
  };

  const handleRemoveOutputLocal = (index) => {
    // Just call the parent handler
    onRemoveOutput?.(index);
  };

  const handleAddParamLocal = (parameter) => {
    onAddParameter(parameter);
  }

  const handleRemoveParamLocal = (index) => {
    onRemoveParameter(index);
  }

  if (!shouldRender) return <SettingsButton onClick={onOpen} buttonStyle="config" />;

  const handleMouseDown = (e) => {
    e.stopPropagation(); // stop panning
  };

  return (
      <div className={`config-overlay ${isVisible ? "open" : "closed"}`}>
        <div
          className={`config-container ${isVisible ? "open" : "closed"}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-1">
              <Form.Label>
                {isUserOwner ? `Owner: ${user?.username}` : `Forked from: ${config?.owner?.username}` }
              </Form.Label>
              <Form.Control
                name="process_name"
                value={config.process_name || ""}
                onChange={handleTitleCharLimit}
                as="input"
                placeholder="Process Name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-1">
              <VersionField value={config.version} onChange={(val) => setConfig({...config, version: val})} />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Control
                name="description"
                value={config.description || ""}
                onChange={handleCharLimit}
                as="textarea"
                rows={3}
                placeholder="Description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Inputs</Form.Label>
              <Fields
                name="input"
                fields={config.inputs}
                handleChange={handleInputChange}
                onRemove={handleRemoveInputLocal}
              />
              <Button
                size="sm"
                variant="primary"
                onClick={handleAddInputLocal}
                type="button"
              >
                + Add Input
              </Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Outputs</Form.Label>
              <Fields
                name="output"
                fields={config.outputs}
                handleChange={handleOutputChange}
                onRemove={handleRemoveOutputLocal}
              />
              <Button
                size="sm"
                variant="primary"
                onClick={handleAddOutputLocal}
                type="button"
              >
                + Add Output
              </Button>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parameters</Form.Label>
              <SearchParameterBar parameters={parameters} />
              <Parameters
                parameters={config.parameters}
                handleChange={handleParamChange}
                onRemove={handleRemoveParamLocal}
                onAdd={handleAddParamLocal}
              />
              <Button
                size="sm"
                variant="primary"
                onClick={handleAddParamLocal}
                type="button"
              >
                + Add Parameter
              </Button>
            </Form.Group>
          </Form>


          <div className="d-flex gap-2 mt-3">
            <Button variant="danger" onClick={onDelete} type="button">Delete</Button>
            <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} type="button">Save</Button>
          </div>

          <small className="text-muted mt-2 d-block">Node ID: {nodeId}</small>
        </div>
      </div>
  )
}

function Fields({ fields, handleChange, onRemove, name }) {
  return (
    <div>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Index</th>
            <th>{name.charAt(0).toUpperCase() + name.slice(1)} Filename</th>
            <th>Filetype</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fields.length > 0 ? (
            fields.map((field, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>
                  <Form.Control
                    name={name}
                    value={field.filename || ""}
                    onChange={(e) => handleChange(e, index, "filename")}
                    placeholder={`${name} filename`}
                    size="sm"
                  />
                </td>
                <td>
                  <Form.Control
                    name={`${name}-type`}
                    value={field.type || ""}
                    onChange={(e) => handleChange(e, index, "type")}
                    placeholder={`${name} filetype`}
                    style={{ maxWidth: "120px" }}
                    size="sm"
                  />
                </td>
                <td>
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
              <td colSpan={4} className="text-center">
                No {name}s yet
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

// DEPRECATED
// function Parameters({ parameters, handleChange, onRemove }) {
//   return (
//     <div>
//       <Table striped bordered hover size="sm">
//         <thead>
//           <tr>
//             <th>Index</th>
//             <th>Parameter</th>
//             <th>Value</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {parameters.length > 0 ? (
//             parameters.map((param, index) => (
//               <tr key={index}>
//                 <td>{index}</td>
//                 <td>
//                   <Form.Control
//                     name="parameter-key"
//                     value={param.key || ""}
//                     onChange={(e) => handleChange(e, index, "key")}
//                     placeholder="parameter key"
//                     size="sm"
//                   />
//                 </td>
//                 <td>
//                   <Form.Control
//                     name="parameter-value"
//                     value={param.value || ""}
//                     onChange={(e) => handleChange(e, index, "value")}
//                     placeholder="parameter value"
//                     style={{ maxWidth: "120px" }}
//                     size="sm"
//                   />
//                 </td>
//                 <td>
//                   <Button
//                     variant="danger"
//                     size="sm"
//                     onClick={() => onRemove(index)}
//                     type="button"
//                   >
//                     Remove
//                   </Button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={4} className="text-center">
//                 No parameters yet
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>
//     </div>
//   );
// }
