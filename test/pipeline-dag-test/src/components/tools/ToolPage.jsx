import PipelineList from "./PipelineList";
import ProcessList from "./ProcessList";
import ParameterList from "./ParameterList";

export default function ToolPage() {

  return (
    <div style={{ display: "flex", gap: "2em" }}>
      <PipelineList />
      <ProcessList />
      <ParameterList />
    </div>
  )
}
