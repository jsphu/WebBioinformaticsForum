import React, { useState, useEffect } from "react";
import { useDnD } from "../hooks/DnDContext";
import CreateNewNode from "./nodes/CreateNewNode";
import { useFadeTransition } from "../hooks/animations"
import BlankNode from "./nodes/BlankNode";
import { createNodeObject } from "../hooks/useNodeCreator";
import axiosService from "../helpers/axios";

export default function Sidebar({ isOpen }) {
  const [_, setType] = useDnD();

  const { shouldRender, isVisible } = useFadeTransition(isOpen, 400);

  const onDragStart = (event) => {
    setType("customNode");
    event.dataTransfer.effectAllowed = "move";
  };

  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    axiosService
      .get(`/api/processes/`)
      .then((res) => setProcesses(res.data?.results))
      .catch((err) => console.error(err));
  }, [])

  const blankNode = createNodeObject("customNode", 0, 0, 0, "Process");

  if (!shouldRender) return;

  return (
    <aside className={`sidebar ${isVisible ? "open" : "closed"}`}>
      <div style={{marginBottom: "30px"}}>
        <CreateNewNode isPanel={true} />
      </div>
      <div className="description">
        Drag nodes.
      </div>
      {processes.map((process, index) => (
        <div
          key={index}
          onDragStart={onDragStart}
          draggable
        >
          <BlankNode data={{ ...blankNode, data: { ...blankNode.data, label: process.process_name } }} process={process} />
        </div>
      ))}
    </aside>
  );
}
