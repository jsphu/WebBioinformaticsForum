import { useCallback } from "react";
import { getId } from "../utils"; // utility to get the next ID

/**
 * (DEPRECATED)
 * @param {object} process
 * @param {any} id
 * @param {number} x
 * @param {number} y
 * @returns
 */
export function translateProcessToNodeObject(process, id, x, y) {
  return {
    id,
    position: { x, y },
    type: "customNode",
    data: {
      label: process.process_name,
      description: process.description,
      params: process.parameters,
      script: process.parameters?.script || null,
      inputs: [],
      outputs: [],
      source: "",
      target: "",
    }
  }
}
/**
 * (DEPRECATED)
 * @param {object} node
 * @param {string} user
 * @param {Array} params
 * @returns
 */
export function translateNodeObjectToProcess(node, user, params) {
  return {
    process_name: node.data.label,
    description: node.data?.description || "",
    owner: user.id,
    parameters: params,
  }
}

/**
 * (DEPRECATED)
 * @param {string} nodeType
 * @param {any} id
 * @param {number} x
 * @param {number} y
 * @param {string} labelValue
 * @returns
 */
export function createNodeObject(nodeType, id, x, y, labelValue) {
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

/**
 * A custom React hook for creating and managing nodes in a React Flow graph.
 * Provides helper functions to create, load, and position nodes.
 * @param {ReactFlowActions} getNodes
 * @param {ReactFlowActions} setNodes
 * @param {string} labelValue
 * @returns
 */
export function useNodeCreator(getNodes, setNodes, labelValue = "") {
  /**
   * createNode: creates a node at x,y of type nodeType ((DEPRECATED))
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
   * addNodeNear: creates a node near an existing node (with offset) ((DEPRECATED))
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

  /**
   * loadNode: creates a node with loaded data at x,y (DEPRECATED)
   */
  const loadNode = useCallback(
    (nodeData, x, y) => {
      const newId = nodeData.type === "resultNode" ? "result" : getId(getNodes());
      const blankNode = createNodeObject(nodeData.type, newId, x, y, nodeData.data.label);
      const loadedNode = {
        ...blankNode,
        data: {
          ...blankNode.data,
          inputs: nodeData.data?.inputs || [],
          outputs: nodeData.data?.outputs || [],
          params: nodeData.data?.params || {},
          script: nodeData.data?.script || null,
          source: nodeData.data?.source || "",
          target: nodeData.data?.target || "",
        }
      };
      setNodes((nds) => [...nds, loadedNode]);
    },
    [getNodes, setNodes]
  );

  /**
   * loadProcessNode: creates a node with loaded process data at x,y
   */
  const loadProcessNode = useCallback(
    (processData, x, y) => {
      const newId = getId(getNodes());
      const newNode = {
        type: "processNode",
        id: newId,
        position: { x, y },
        data: processData,
      };
      setNodes((nds) => [...nds, newNode])
    },
    [getNodes, setNodes]
  )

  return { createNode, loadNode, addNodeNear, loadProcessNode };
}
