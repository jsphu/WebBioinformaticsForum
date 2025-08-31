import {
    BaseEdge,
    EdgeLabelRenderer,
    getSmoothStepPath,
    useReactFlow,
    Position,
} from "@xyflow/react";
import { useState, useEffect } from "react";

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
    const { setEdges } = useReactFlow();
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
                        zIndex: 0,
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
                    <div
                        style={{
                            backgroundColor: "black",
                            color: "#fff",
                            borderRadius: "6px",
                            padding: "0 5px",
                            /* Position the tooltip */
                            position: "absolute",
                            fontSize: 6,
                            zIndex: 1,
                            opacity: isHovered ? 0.8 : 0,
                            transition: "opacity 250ms",
                            left: 25,
                            top: 25,
                        }}
                    >
                        <h5>Source</h5>
                        {Object.entries(data.source)
                          .filter(([k]) => k === "id" || k === "data")
                          .map(([k, v]) =>
                            k === "data" ? (
                              <p key={k}>Label: {v.label}</p>
                            ) : (
                              <p key={k}>
                                {k}: {v}
                              </p>
                            )
                          )}
                        <h5>Target</h5>
                        {Object.entries(data.target)
                          .filter(([k]) => k === "id" || k === "data")
                          .map(([k, v]) =>
                            k === "data" ? (
                              <p key={k}>Label: {v.label}</p>
                            ) : (
                              <p key={k}>
                                {k}: {v}
                              </p>
                            )
                          )}
                    </div>
                </div>
            </EdgeLabelRenderer>
        </g>
    );
}
