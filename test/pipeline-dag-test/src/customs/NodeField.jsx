import React, { useState } from "react";
// import ProcessInfo from "./ProcessInfo";
import { Button } from "react-bootstrap";
import axiosService from "../helpers/axios";
import { useUser } from "../hooks/UserContext";

export default function NodeField({ nodeData }) {

  const isSynced = nodeData?.synced || false;

  const [synced, setSynced] = useState(isSynced);

  const { user } = useUser();

  const handleSubmit = (e) => {
    setSynced(true);
    axiosService
      .post(`/api/processes/`, process)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  if (nodeData.type !== "processNode") return;

  console.log(nodeData);
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
