import CreateNewNode from "./nodes/CreateNewNode";
import { useFadeTransition } from "../../hooks/animations"
import NodeField from "./panels/NodeField";
import SearchProcessBar from "./SearchProcessBar";
import { useDnD } from "../../hooks/DnDContext";
import { useProcess } from "../../hooks/ProcessContext";

export default function Sidebar({ nodesData ,isOpen }) {

  const { shouldRender, isVisible } = useFadeTransition(isOpen, 400);

  const { processes } = useProcess();

  const [_, setData] = useDnD();


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
          <NodeField nodeId={node.id} />
        </div>
      )) }
      <SearchProcessBar processes={processes} />
    </aside>
  );
}
