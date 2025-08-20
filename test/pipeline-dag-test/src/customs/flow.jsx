import React, { useCallback, useRef } from "react";
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

const initialNodes = [];
const initialEdges = [];

const ProviderFlow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const flowWidth = 1200;
    const flowHeight = 900;
    const nodeWidth = 350;
    const nodeHeight = 200;
    const edgeReconnectSuccessful = useRef(true);

    const onConnect = useCallback(
        (params) => {
            // Check if the source or target node is of type "customNode"
            const sourceNode = nodes.find((node) => node.id === params.source);
            const targetNode = nodes.find((node) => node.id === params.target);

            const isCustomEdge =
                sourceNode?.type === "customNode" ||
                targetNode?.type === "customNode";

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
                sourceNode?.type === "customNode"
                    ? Position.Right
                    : Position.Bottom;
            const targetPosition =
                targetNode?.type === "customNode"
                    ? Position.Left
                    : Position.Top;
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

    return (
        <div className="providerflow">
            <ReactFlowProvider>
                <div
                    className="reactflow-wrapper"
                    style={{ height: flowHeight, width: flowWidth }}
                >
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
                        fitView
                    >
                        <Controls />
                        <Panel
                            position="bottom-left"
                            style={{ padding: "1px 40px" }}
                        >
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
                        <Panel position="top-left">
                            <CreateNewNode isPanel={true} />
                        </Panel>
                        <Background />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
        </div>
    );
};

export default function Flow() {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <ProviderFlow />
        </div>
    );
}
