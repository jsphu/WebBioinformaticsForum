import React, { useState, useEffect } from "react";
import CreateNewNode from "./nodes/CreateNewNode";
import { useFadeTransition } from "../hooks/animations"
import axiosService from "../helpers/axios";
import NodeField from "./NodeField";
import SearchProcessBar from "./SearcProcessBar";
import SearchParameterBar from "./SearcParameterBar";
import { useDnD } from "../hooks/DnDContext";
import { useParameter } from "../hooks/ParameterContext";

export default function Sidebar({ nodesData ,isOpen }) {

  const { shouldRender, isVisible } = useFadeTransition(isOpen, 400);

  const [processes, setProcesses] = useState([]);
  const [data, setData] = useDnD();
  const { parameters } = useParameter();

  useEffect(() => {
    axiosService
      .get(`/api/processes/`)
      .then((res) => setProcesses(res.data?.results))
      .catch((err) => console.error(err));
  }, [])

  const onDragStart = (event, node) => {
    setData(node);
    event.dataTransfer.effectAllowed = "move";
  };

  if (!shouldRender) return;

  return (
    <aside className={`sidebar ${isVisible ? "open" : "closed"}`}>
      <div style={{marginBottom: "30px"}}>
        <CreateNewNode isPanel={true} />
      </div>
      <div className="description">
        Current Processes
      </div>
      { nodesData.map((node, index) => (
        <div
          key={index}
          onDragStart={(e) => onDragStart(e, node)}
          draggable
        >
          <NodeField nodeData={node} />
        </div>
      )) }
      <SearchProcessBar processes={processes} />
      <SearchParameterBar parameters={parameters} />
    </aside>
  );
}
