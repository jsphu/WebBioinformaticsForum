import React, { useState, useEffect, useCallback } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { useFadeTransition } from "../../../hooks/animations";
import VersionField from "../../VersionField";
import { useUser } from "../../../hooks/UserContext";
import { useToaster } from "../../../hooks/ToasterContext";
import Parameters from "./Parameters";
import { useReactFlow } from "@xyflow/react";

export default function ConfigPanel({
    configData,
    nodeId,
    configView,
    isOpen,
    onClose,
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
  const { setNodes } = useReactFlow();

  useEffect(() => {
    if (config && (!config || !config.parameters?.length)) {
      setConfig({
        ...config,
        inputs: config?.inputs || [],
        outputs: config?.outputs || [],
        parameters: config?.parameters || [],
      });
    }
  }, [config]);


  const handleAddInput = useCallback(() => {
    setNodes(nds =>
      nds.map(node =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              inputs: [...(node.data.inputs || []), { filename: "", type: "" }]
            }
          }
          : node
      ))

    // Update local processData state to trigger ConfigPanel re-render
    setConfig(prev => ({
      ...prev,
      inputs: [...(prev.inputs || []), { filename: "", type: "" }]
    }));
  }, [nodeId, setNodes]);

  const handleAddOutput = useCallback(() => {
    setNodes(nds =>
      nds.map(node =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              outputs: [...(node.data.outputs || []), { filename: "", type: "" }]
            }
          }
          : node
      ))

    // Update local processData state to trigger ConfigPanel re-render
    setConfig(prev => ({
      ...prev,
      outputs: [...(prev.outputs || []), { filename: "", type: "" }]
    }));
  }, [nodeId, setNodes]);

  const handleAddParameter = useCallback((parameter) => {
    let newParameter;

    if (!parameter) {
      newParameter = {
        id: null,
        key: "",
        value: "",
        value_type: "string",
        default_value: "",
        is_required: false,
        owner: null,
        version_history: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    else newParameter = { ...parameter, owner: parameter.owner.id };

    setNodes(nds =>
      nds.map(node =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              parameters: [...(node.data.parameters || []), newParameter]
            }
          }
          : node
      ))

    // Update local processData state to trigger ConfigPanel re-render
    setConfig(prev => ({
      ...prev,
      parameters: [...(prev.parameters || []), newParameter]
    }));
  }, [nodeId, setNodes]);

  const handleRemoveInput = useCallback((index) => {
    setNodes(nds =>
      nds.map(node =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              inputs: node.data.inputs.filter((_, i) => i !== index)
            }
          }
          : node
      ))

    // Update local processData state
    setConfig(prev => ({
      ...prev,
      inputs: prev.inputs.filter((_, i) => i !== index)
    }));
  }, [nodeId, setNodes]);

  const handleRemoveOutput = useCallback((index) => {
    setNodes(nds =>
      nds.map(node =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              outputs: node.data.outputs.filter((_, i) => i !== index)
            }
          }
          : node
      ))

    // Update local processData state
    setConfig(prev => ({
      ...prev,
      outputs: prev.outputs.filter((_, i) => i !== index)
    }));
  }, [nodeId, setNodes]);

  const handleRemoveParameter = useCallback((index) => {
    setNodes(nds =>
      nds.map(node =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              parameters: node.data.parameters.filter((_, i) => i !== index)
            }
          }
          : node
      ))

    // Update local processData state
    setConfig(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }));
  }, [nodeId, setNodes]);

  const handleSave = useCallback((config) => {
    const newParams = config.parameters.map(p => ({
        ...p,              // keep all other fields
        owner: p.owner?.id || user?.id   // replace owner object with just the id
      }));
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                owner: config?.owner?.id || user?.id,
                process_name: config.process_name,
                description: config.description,
                inputs: config.inputs,
                outputs: config.outputs,
                paramaters: newParams,
              },
            }
          : node,
      ),
    );
    setConfig(config);
  }, [nodeId, setNodes, user?.id]);

  const handleDelete = useCallback(() => {
    configView({ type: "CLOSE"});
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
  }, [nodeId, setNodes, configView]);

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
    handleSave(config);
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

    setConfig((prev) => ({
      ...prev,
      parameters: (prev.parameters || []).map((parameter, i) =>
        i === index ? { ...parameter, [fieldType]: field } : parameter
      ),
    }));
  };

  if (!shouldRender) return null;

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
                onRemove={handleRemoveInput}
              />
              <Button
                size="sm"
                variant="primary"
                onClick={handleAddInput}
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
                onRemove={handleRemoveOutput}
              />
              <Button
                size="sm"
                variant="primary"
                onClick={handleAddOutput}
                type="button"
              >
                + Add Output
              </Button>
            </Form.Group>
            <Form.Group className="mb-3">
              <Parameters
                parameters={config.parameters}
                handleChange={handleParamChange}
                onRemove={handleRemoveParameter}
                onAdd={handleAddParameter}
              />
            </Form.Group>
          </Form>


          <div className="d-flex gap-2 mt-3">
            <Button variant="danger" onClick={handleDelete} type="button">Delete</Button>
            <Button variant="secondary" onClick={onClose} type="button">Close</Button>
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
