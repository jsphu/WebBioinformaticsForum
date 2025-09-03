import { Handle, Position, useStore, useReactFlow } from "@xyflow/react";
import React, { memo, useState, useCallback, useEffect } from "react";
import ConfigPanel from "./config/ConfigPanel";

const zoomSelector = (s) => s.transform[2] >= 0.9;

export default memo(({ data, id }) => {
  const showContent = useStore(zoomSelector);

  const [processData, setProcessData] = useState(data);
  const [configData, setConfigData] = useState(processData);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const { setNodes, getNodes, getEdges, setEdges } = useReactFlow();

  const handleDraggable = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              draggable: !isConfigOpen, // Fixed logic: draggable when config is NOT open
            }
          : node,
      ),
    );
  }, [id, setNodes, isConfigOpen]);

  const handleAddInput = useCallback(() => {
    setNodes(nds =>
      nds.map(node =>
        node.id === id
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
    setProcessData(prev => ({
      ...prev,
      inputs: [...(prev.inputs || []), { filename: "", type: "" }]
    }));
  }, [id, setNodes]);

  const handleAddOutput = useCallback(() => {
    setNodes(nds =>
      nds.map(node =>
        node.id === id
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
    setProcessData(prev => ({
      ...prev,
      outputs: [...(prev.outputs || []), { filename: "", type: "" }]
    }));
  }, [id, setNodes]);

  const handleAddParameter = useCallback((e, parameter) => {
    let newParameter;

    console.log(e, parameter);
    if (!parameter) {
      newParameter = {
          id: "",
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
    else {
      newParameter = parameter;
    }

    setNodes(nds =>
      nds.map(node =>
        node.id === id
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
    setProcessData(prev => ({
      ...prev,
      parameters: [...(prev.parameters || []), newParameter]
    }));
  }, [id, setNodes]);

  const handleRemoveInput = useCallback((index) => {
    setNodes(nds =>
      nds.map(node =>
        node.id === id
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
    setProcessData(prev => ({
      ...prev,
      inputs: prev.inputs.filter((_, i) => i !== index)
    }));
  }, [id, setNodes]);

  const handleRemoveOutput = useCallback((index) => {
    setNodes(nds =>
      nds.map(node =>
        node.id === id
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
    setProcessData(prev => ({
      ...prev,
      outputs: prev.outputs.filter((_, i) => i !== index)
    }));
  }, [id, setNodes]);

  const handleRemoveParameter = useCallback((index) => {
    setNodes(nds =>
      nds.map(node =>
        node.id === id
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
    setProcessData(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }));
  }, [id, setNodes]);

  const handleSave = useCallback((config) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                process_name: config.process_name,
                description: config.description,
                inputs: config.inputs,
                outputs: config.outputs,
                paramaters: config.parameters,
              },
            }
          : node,
      ),
    );
    setProcessData(config);
    setIsConfigOpen(false);
  }, [id, setNodes]);

  const handleOpen = useCallback((e) => {
    e?.preventDefault();
    setIsConfigOpen(true);
  }, []);

  const handleCancel = useCallback((e) => {
    e?.preventDefault();
    setIsConfigOpen(false);
  }, []);

  const handleDelete = useCallback(() => {
    setIsConfigOpen(false);
    setNodes((nds) => nds.filter((node) => node.id !== id));
  }, [id, setNodes]);

  // Update draggable state when config opens/closes
  useEffect(() => {
    handleDraggable();
  }, [handleDraggable]);

  function ConfigProvider() {
    return (
      <ConfigPanel
        configData={processData}
        onSave={handleSave}
        onOpen={handleOpen}
        onClose={handleCancel}
        onDelete={handleDelete}
        isOpen={isConfigOpen}
        nodeId={id}
        onAddInput={handleAddInput}
        onAddOutput={handleAddOutput}
        onRemoveInput={handleRemoveInput}
        onRemoveOutput={handleRemoveOutput}
        onAddParameter={handleAddParameter}
        onRemoveParameter={handleRemoveParameter}
      />
    )
  }

  if (!showContent && !isConfigOpen) return (
    <div className="placeholder">
      <div style={{ width: "100px" }} />
      <div style={{ width: "100px" }} />
      <div style={{ width: "100px" }} />
    </div>
  );
  else if (isConfigOpen) return (
    <ConfigProvider/>
  )
  else return (
    <>
        <ProcessNode processData={processData}/>
        <ConfigProvider />
    </>
  );
});

/**
 * ProcessNode a ReactFlow Instance
 *  @param {object} processData -> {
 *          id -> _process-id_,
 *          owner -> {_owner_},
 *          process_name,
 *          description,
 *          version,
 *          originated_from -> _process-id or null_,
 *          parameters ->  [
 *              { key, value, value_type, default_value, is_required, owner, version_history, created_at, updated_at }
 *          ],
 *          inputs -> [
 *              { filename: _filename_, type: _type_ }
 *          ],
 *          outputs -> [
 *              { filename: _filename_, type: _type_ }
 *          ],
 *          version_history -> {_version_history_},
 *          created_at,
 *          updated_at,
 *        }
 * @returns {ReactFlowInstance} ProcessNode -> (
 *      ┌─────────────────────┐
 *    ──│o input1             │
 *    ──│o input2             │
 *      │ O A PROCESS NODE  O │
 *      │            output1 o│──...
 *      │            output2 o│──...
 *      │            output3 o│──...
 *      └─────────────────────┘
 * )
 */
function ProcessNode({ processData }) {
  return (
    <div className="process-node">
      <InputHandles inputsData={processData.inputs} />

      <div>
        <label style={{border: "2px solid #ddd", borderRadius: "16px", padding: "4px 8px"}}>
          {processData.process_name || "Unnamed Process"}
        </label>
      </div>

      <OutputHandles outputsData={processData.outputs} />
    </div>
  )
}

function InputHandles({ inputsData }) {
  if (!inputsData || inputsData.length === 0) return null;

  return (
    <>
      {inputsData.map((input, index) => (
        <div
          key={`input-row-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            marginBottom: "6px",
          }}
        >
          <Handle
            type="target"
            position={Position.Left}
            id={`t${index}`}
            style={{
              background: "darkgray",
              width: 10,
              height: 10,
              left: -8,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <span style={{
            fontSize: 12,
            marginLeft: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "2px 6px",
            backgroundColor: "#f8f9fa"
          }}>
            {input?.filename || "any"}
          </span>
        </div>
      ))}
    </>
  );
}

function OutputHandles({ outputsData }) {
  if (!outputsData || outputsData.length === 0) return null;

  return (
    <>
      {outputsData.map((output, index) => (
        <div
          key={`output-row-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            marginTop: "6px",
            justifyContent: "flex-end",
          }}
        >
          <span
            key={`output-p-${index}`}
            style={{
              fontSize: 12,
              marginRight: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "2px 6px",
              backgroundColor: "#f8f9fa"
            }}
          >
            {output?.filename || "any"}
          </span>
          <Handle
            key={`output-${index}`}
            type="source"
            position={Position.Right}
            id={`s${index}`}
            style={{
              background: "lightgray",
              width: 10,
              height: 10,
              right: -8,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </div>
      ))}
    </>
  );
}
