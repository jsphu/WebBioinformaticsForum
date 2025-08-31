import { useCallback } from "react";
import { getId } from "../utils"; // utility to get the next ID


function createNodeObject(nodeType, id, x, y, labelValue = "") {
  const baseNode = {
    id,
    position: { x, y },
    type: nodeType,
  };

  if (nodeType === "parametersNode") {
    return {
      ...baseNode,
      data: {
        label: labelValue,
        params: {},
        source: "",
        target: "",
      },
    };
  }

  return {
    ...baseNode,
    data: {
      label: labelValue,
      inputs: [],
      outputs: [],
      script: null,
      source: "",
      target: "",
    },
  };
}


export function useNodeCreator(getNodes, setNodes, labelValue = "") {
  /**
   * createNode: creates a node at x,y of type nodeType
   */
  const createNode = useCallback(
    (nodeType, x, y) => {
      const newId = nodeType === "resultNode" ? "result" : getId(getNodes());
      const newNode = createNodeObject(nodeType, newId, x, y, labelValue);
      setNodes((nds) => [...nds, newNode]);
    },
    [getNodes, labelValue, setNodes]
  );

  /**
   * addNodeNear: creates a node near an existing node (with offset)
   */
  const addNodeNear = useCallback(
    (selectedNodeId, nodeType, isPanel = false, offsetX = 300, offsetY = 35) => {
      if (!selectedNodeId && !isPanel) return;

      const sourceNode = getNodes().find((n) => n.id === selectedNodeId);
      if (!sourceNode && !isPanel) return;

      const x = isPanel ? 0 : sourceNode.position.x + offsetX;
      const y = isPanel ? 0 : sourceNode.position.y + offsetY;

      createNode(nodeType, x, y);
    },
    [getNodes, createNode]
  );

  return { createNode, addNodeNear };
}
