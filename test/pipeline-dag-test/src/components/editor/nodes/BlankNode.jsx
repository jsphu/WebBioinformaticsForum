import React from "react";
import ProcessInfo from "../panels/ProcessInfo";

export default function BlankNode({ data, process }) {

  return (
      <ProcessInfo process={process} label={ data.data.label } />
  );
}
