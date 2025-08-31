import React, { useCallback, useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  reconnectEdge,
  Controls,
  Panel,
  Position,
  useReactFlow,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";
import CustomNode from "./nodes/CustomNode";
import OutputNode from "./nodes/OutputNode";
import InputNode from "./nodes/InputNode";
import ResultNode from "./nodes/ResultNode";
import CreateNewNode from "./nodes/CreateNewNode";
import CustomEdge from "./edges";
import ParametersNode from "./nodes/ParametersNode";
import SavePipeline from "./SavePipeline.jsx"
import axiosService from "../helpers/axios";
import { useUser } from "../hooks/UserContext";
import { useDnD, DnDProvider } from "../hooks/DnDContext.jsx";
import Sidebar from "./Sidebar.jsx";
import { useNodeCreator } from "../hooks/useNodeCreator.js";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeTypes = {
  customNode: CustomNode,
  creator: CreateNewNode,
  resultNode: ResultNode,
  inputNode: InputNode,
  outputNode: OutputNode,
  parametersNode: ParametersNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

function FlowProvider() {
  const { id } = useParams();

  const { user } = useUser();

  // nodes & edges state managed by React Flow
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { screenToFlowPosition, getNodes } = useReactFlow();
  const [type, setType] = useDnD();
  const [isOpen, setIsOpen] = useState(false);

  const [pipelineData, setPipelineData] = useState({
    flowData: { nodes: [], edges: [] },
    owner: 0,
    pipelineTitle: "",
    description: "",
    processes: [],
    version: "",
  });

  const [versionHistory, setVersionHistory] = useState({
      0: {
        flow_data: { nodes: [], edges: [] },
        pipeline_title: "",
        description: "",
        processes: [1],
        version: "0.0.1"
      }
  });

  const { createNode } = useNodeCreator(getNodes, setNodes)

  const setAndLoadFlowDataFromVersionHistoryId = (versionId) => {
    try {
      const version = versionHistory[versionId];

      setPipelineData({
        flowData: version.flow_data,
        pipelineTitle: version.pipeline_title,
        description: version.description,
        processes: version.processes,
        version: version.version,
      })
      loadFlowData(version.flow_data);
    } catch (err) {
      console.error(versionId, ": version doesnt exists.", err);
    }
  };

  useEffect(() => {
      if (!user?.created_at) {
        const saved = localStorage.getItem("pipelineData");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.flowData) {
            setNodes(parsed.flowData.nodes || []);
            setEdges(parsed.flowData.edges || []);
          }
          setPipelineData((prev) => ({ ...prev, ...parsed }));
        }
      }
    }, [user]);

    // Save flowData to pipelineData and localStorage
    useEffect(() => {
      const newFlowData = { nodes: [...nodes], edges: [...edges] };
      setPipelineData((prev) => {
        const updated = { ...prev, flowData: newFlowData };
        if (!user?.created_at) {
          localStorage.setItem("pipelineData", JSON.stringify(updated));
        }
        return updated;
      });
    }, [nodes, edges, user]);

  const loadFlowData = useCallback((flowData) => {
    if (!flowData) return;

    const { nodes = [], edges = [] } = flowData;

    // directly update React Flow state
    setNodes(nodes);
    setEdges(edges);
  }, [setNodes, setEdges]);

  // fetch from API on mount
  useEffect(() => {
    if (!id) {
      setPipelineData({
        flowData: { nodes: [], edges: [] },
        owner: user,
        pipelineTitle: "",
        description: "",
        processes: [1],
        version: "0.0.1",
      });
      setVersionHistory({ 0: { flow_data: { nodes: [], edges: [] }, pipeline_title: "", description: "", processes: [1], version: "0.0.1" } });
      return
    };

    axiosService
      .get(`/api/pipelines/${id}/`)
      .then((res) => {
        const flowData = res.data?.flow_data;
        const owner = res.data?.owner;
        const processes = res.data?.processes;
        const pipelineTitle = res.data?.pipeline_title;
        const description = res.data?.description;
        const version = res.data?.version;
        const versionHistory = res.data?.version_history;
        loadFlowData(flowData);
        setPipelineData({
          flowData,
          owner,
          pipelineTitle,
          description,
          processes,
          version,
        })
        setVersionHistory(versionHistory);
      })
      .catch((err) => console.error(err));
  }, [id, loadFlowData, user]);

  const flowWidth = 2000;
  const flowHeight = 780;
  const nodeWidth = 350;
  const nodeHeight = 200;
  const edgeReconnectSuccessful = useRef(true);

  const onDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      createNode(type, position.x, position.y);
    },
    [screenToFlowPosition, type, createNode]
  );

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.setData('text/plain', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onConnect = useCallback(
    (params) => {
      // Check if the source or target node is of type "customNode"
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      const isCustomEdge =
        sourceNode?.type === "customNode" || targetNode?.type === "customNode";

      // Count existing input connections for this target
      const existingInputEdges = edges.filter(
        (e) => e.target === targetNode?.id,
      );
      const existingOutputEdges = edges.filter(
        (e) => e.source === sourceNode?.id,
      );
      const inputIndex = existingInputEdges.length;
      const outputIndex = existingOutputEdges.length;

      const sourcePosition =
        sourceNode?.type === "customNode" ? Position.Right : Position.Bottom;
      const targetPosition =
        targetNode?.type === "customNode" ? Position.Left : Position.Top;
      // Add the edge with the appropriate type
      setEdges((els) =>
        addEdge(
          {
            ...params,
            type: isCustomEdge ? "customEdge" : "default",
            data: {
              source: sourceNode,
              target: targetNode,
              isHighlighted: false,
              inputIndex,
              outputIndex,
              color: "",
            },
            sourcePosition,
            targetPosition,
          },
          els,
        ),
      );
    },
    [nodes, edges, setEdges],
  );

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges],
  );

  const onReconnectEnd = useCallback(
    (_, edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeReconnectSuccessful.current = true;
    },
    [setEdges],
  );

  const getLayoutedElements = (nodes, edges, direction = "TB") => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, {
        width: nodeWidth,
        height: nodeHeight,
      });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const newNode = {
        ...node,
        targetPosition: isHorizontal ? "left" : "top",
        sourcePosition: isHorizontal ? "right" : "bottom",
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };

      return newNode;
    });

    return { nodes: newNodes, edges };
  };

  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, setNodes, setEdges],
  );

  const handleSidebar = (e) => {
    setIsOpen(!isOpen);
  };

  return (
    <>
        <div style={{ height: flowHeight, width: flowWidth }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onReconnect={onReconnect}
            onReconnectStart={onReconnectStart}
            onReconnectEnd={onReconnectEnd}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
            <Panel position="bottom-left" style={{ padding: "1px 40px" }}>
              <button
                className="xy-theme__button"
                onClick={() => onLayout("TB")}
              >
                vertical layout
              </button>
              <button
                className="xy-theme__button"
                onClick={() => onLayout("LR")}
              >
                horizontal layout
              </button>
            </Panel>
            <Panel position="top-right">
              <SavePipeline id={id} data={pipelineData} />
            </Panel>
            <Panel position="top-left">
              <button
                className={`xy-theme__button x-turning-to-plus ${isOpen ? "open" : "closed"}`}
                onClick={handleSidebar}
              >
                <span className="line horizontal" />
                <span className="line vertical" />
              </button>
            </Panel>
            <Panel position="bottom-center">
              <p>{pipelineData.pipelineTitle || "New"} by: { pipelineData?.owner?.username || user?.username || "unkown" }</p>
            </Panel>
            <Panel position="bottom-right">
              {Object.keys(versionHistory)
                .slice(-9)  // last
                .map((versionId) => (
                  <button
                    key={`history-${versionId}`}
                    className="xy-theme__button"
                    onClick={() => setAndLoadFlowDataFromVersionHistoryId(versionId)}
                  >
                    {versionId}
                  </button>
              ))}
            </Panel>
            <Background />
          </ReactFlow>
        </div>
        <Sidebar nodeTypes={nodeTypes} isOpen={isOpen} />
    </>
  );
};

export default function Flow() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <FlowProvider />
      </DnDProvider>
    </ReactFlowProvider>
  )
}
