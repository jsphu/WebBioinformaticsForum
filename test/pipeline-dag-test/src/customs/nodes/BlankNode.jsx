import React from "react";
import ProcessInfo from "../ProcessInfo";

export default function BlankNode({ data, process }) {

  return (
    <div className="custom-node">
      {/* {data.inputs.map((input, index) => {
        return (
          input !== "" && (
            <p key={`input-${index}`} className="input-text">
              IN{index + 1}: {input}
            </p>
          )
        );
      })}*/}
      <label>{data.data.label}</label>
      <ProcessInfo process={process} />
      {/* {data.outputs.map((output, index) => {
        return (
          output !== "" && (
            <p key={`output-${index}`} className="output-text">
              OUT{index + 1}: {output}
            </p>
          )
        );
      })}*/}
    </div>
  );
}
