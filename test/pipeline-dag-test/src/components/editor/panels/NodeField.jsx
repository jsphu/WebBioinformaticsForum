import React, { useState, useEffect } from "react";
// import ProcessInfo from "./ProcessInfo";
import { Button } from "react-bootstrap";
import axiosService from "../../../helpers/axios";
import { useUser } from "../../../hooks/UserContext";
import { useReactFlow } from "@xyflow/react";

export default function NodeField({ nodeId }) {

  const { getNodes } = useReactFlow();
  const [nodeData, setNodeData] = useState({});
  useEffect(() => {
    setNodeData(getNodes().filter((node) => node.id === nodeId));
  }, [nodeId, getNodes])

  const isSynced = nodeData?.synced || false;

  const [synced, setSynced] = useState(isSynced);

  const { user } = useUser();

  const handleSubmit = (e) => {
    const process = nodeData.data;
    setSynced(true);
    axiosService
      .post(`/api/processes/`, process)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  if (nodeData.type !== "processNode") return;

  return (
    <div className="node-field">
      <div style={{marginTop: "auto"}}>
      </div>
      <div>
        {!synced && <small style={{paddingLeft: "1px",color: "orangered"}}>*</small>}
        <label>{nodeData.data.process_name}</label>
      </div>
      <div style={{marginLeft: "auto"}}>
        <small
            style={{
                display: "inline-block",
                margin: "1px",
                fontSize: 12,
                color: "green",
                paddingRight: "4px",
            }}
        >
          {synced && "saved"}
        </small>
        <Button variant="primary" onClick={handleSubmit} style={{backgroundColor: synced ? "red" : ""}}>{ synced ? "Delete" : "Save"}</Button>
      </div>
    </div>
  );
}
