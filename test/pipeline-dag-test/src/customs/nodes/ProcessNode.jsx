import { Handle, Position, useStore } from "@xyflow/react";
import React, { memo, useReducer, useCallback } from "react";
import ConfigPanel from "./config/ConfigPanel";
import SettingsButton from "./buttons/settings";
import { useReactFlow } from "@xyflow/react";

const zoomSelector = (s) => s.transform[2] >= 0.9;

const reducer = (state, action) => {
  switch (action.type) {
    case "OPEN":
      return true;
    case "CLOSE":
      return false;
    default:
      return state;
  }
};

export default memo(({ data, id }) => {

  const showContent = useStore(zoomSelector);
  const [isConfigOpen, dispatch] = useReducer(reducer, false);
  const { setNodes } = useReactFlow();

  const handleDraggable = useCallback((state) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              draggable: state,
            }
          : node,
      ),
    );
  }, [id, setNodes]);

  const handleOpen = (e) => {
    e?.preventDefault();
    dispatch({ type: "OPEN" });
    handleDraggable(false);
  }
  const handleClose = (e) => {
    e?.preventDefault();
    dispatch({ type: "CLOSE" });
    handleDraggable(true);
  }

  if (!showContent && !isConfigOpen) return (
    <div className="placeholder">
      <div style={{ width: "100px" }} />
      <div style={{ width: "100px" }} />
      <div style={{ width: "100px" }} />
    </div>
  );
  return (
    <div style={{ display: "unset" }}>
        <ProcessNode processData={data}/>
        {!isConfigOpen && <SettingsButton onClick={handleOpen} buttonStyle="config" />}
        {isConfigOpen && <ConfigPanel
          configData={data}
          isOpen={isConfigOpen}
          configView={dispatch}
          nodeId={id}
          onDraggable={handleDraggable}
          onClose={handleClose}
        />}
    </div>
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
