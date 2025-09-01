import {
    BaseEdge,
    EdgeLabelRenderer,
    getSmoothStepPath,
    useReactFlow,
    Position,
} from "@xyflow/react";
import { useState, useEffect, useMemo } from "react";
import { unixRegexToJSRegex } from "../utils";

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    data,
}) {
    const { setEdges, getNodes } = useReactFlow();
    const [isHovered, setIsHovered] = useState(false);
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    useEffect(() => {
        if (!data?.color) {
            const color = getRandomColor();
            setEdges((edges) =>
                edges.map((e) =>
                    e.id === id
                        ? {
                              ...e,
                              style: { ...e.style, stroke: color },
                              data: { ...e.data, color },
                          }
                        : e,
                ),
            );
        } else {
            setEdges((edges) =>
                edges.map((e) => (e.id === id ? { ...e, data } : e)),
            );
        }
    }, [data?.color, id, setEdges, data]);

    const matchFields = (inputField, outputField) => {
      try {
        const inputRegex = new RegExp(unixRegexToJSRegex(inputField));
        const outputRegex = new RegExp(unixRegexToJSRegex(outputField));

        return inputRegex.test(outputField) || outputRegex.test(inputField);
      } catch (err) {
        return false;
      }
    };

    const liveData = useMemo(() => {
      if (!isHovered) return data;

      const nodes = getNodes();
      const sourceNode = nodes.find((n) => n.id === data.source?.id);
      const targetNode = nodes.find((n) => n.id === data.target?.id);

      if (sourceNode.type === "parametersNode") {
        return {
          ...data,
          source: {
            ...data.source,
            label: sourceNode?.data?.label ?? data.source?.label,
            outputField: "param",
          },
          target: {
            ...data.target,
            label: targetNode?.data?.label ?? data.target?.label,
            inputField: "param",
          },
          inputIndex: -1,
          outputIndex: -1,
        };
      }

      const outputIndex = data.outputIndex;
      const inputIndex = data.inputIndex;
      const outputField = sourceNode?.data?.outputs?.[outputIndex] ?? null;
      const inputField = targetNode?.data?.inputs?.[inputIndex] ?? null;

      const isFieldsMatch = matchFields(inputField, outputField);

      return {
        ...data,
        source: {
          ...data.source,
          label: sourceNode?.data?.label ?? data.source?.label,
          outputField
        },
        target: {
          ...data.target,
          label: targetNode?.data?.label ?? data.target?.label,
          inputField
        },
        isFieldsMatch,
        outputIndex,
        inputIndex
      };
    }, [isHovered, data, getNodes]);

    const edgeStyle = {
        stroke: data?.color || "",
        strokeWidth: isHovered || data?.isHighlighted ? 16 : data?.width || 2,
        transition: "stroke-width 0.1s ease-in-out",
    };

    const handleColor = (event) => {
        const newColor = event.target.value;
        setEdges((edges) =>
            edges.map((e) =>
                e.id === id
                    ? {
                          ...e,
                          style: { ...e.style, stroke: newColor },
                          data: { ...e.data, color: newColor },
                      }
                    : e,
            ),
        );
    };

    return (
        <g
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <BaseEdge id={id} path={edgePath} style={edgeStyle} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        visibility: isHovered ? "visible" : "hidden",
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: "all",
                        zIndex: 9999,
                    }}
                    className="edge-label-renderer__custom-edge nodrag nopan"
                >
                    <input
                        type="color"
                        onChange={handleColor}
                        value={data?.color || ""}
                        style={{
                            height: "20px",
                            width: isHovered ? "30px" : 0,
                            transition: "width 0.1s ease-in-out",
                        }}
                    />
                    {isHovered && (
                      <div
                        style={{
                          position: "fixed",
                          left: 25,
                          top: 25,
                          display: "inline-block",     // shrink to fit content
                          whiteSpace: "nowrap",        // prevent text from wrapping
                          backgroundColor: "black",
                          color: "#fff",
                          borderRadius: 6,
                          padding: "5px 15px",
                          fontSize: 8,
                          zIndex: 9999,
                          pointerEvents: "none",
                          opacity: 0.7,
                        }}
                      >
                        <h5 style={{ margin: 0 }}>
                          {liveData.source?.label} {"=>"} {liveData.target?.label}
                        </h5>
                        <p style={{ margin: 0 }}>
                          {liveData.source.outputField &&
                            `OUT${liveData.outputIndex + 1}: ${liveData.source.outputField}`}{" "}
                          {"=>"}{" "}
                          {liveData.target.inputField &&
                            `IN${liveData.inputIndex + 1}: ${liveData.target.inputField}`}
                        </p>
                        {liveData.isFieldsMatch
                          ? <p style={{margin: 1, color: "greenyellow"}}>Match Success</p>
                          : <p style={{margin: 1, color: "orangered"}}>Match Error</p>
                        }
                      </div>
                          )}
                </div>
            </EdgeLabelRenderer>
        </g>
    );
}
