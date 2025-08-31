import React from "react";
import { useDnD } from "../hooks/DnDContext";
import CreateNewNode from "./nodes/CreateNewNode";
import { useFadeTransition } from "../hooks/animations"

export default function Sidebar({ nodeTypes, isOpen }) {
  const [_, setType] = useDnD();

  const { shouldRender, isVisible } = useFadeTransition(isOpen, 400);

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  if (!shouldRender) return;

  return (
    <aside className={`sidebar ${isVisible ? "open" : "closed"}`}>
      <div className="description">
        Drag nodes.
      </div>
      {Object.keys(nodeTypes).map((type) => (
        <div
          key={type}
          className={`custom-node`}
          style={{display: "flex", width: "125px"}}
          onDragStart={(event) => onDragStart(event, type)}
          draggable
        >
          {type}
        </div>
      ))}
      <div style={{marginTop: "100px"}}>
        <CreateNewNode isPanel={true} />
      </div>
    </aside>
  );
}
