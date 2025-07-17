import { Handle } from "@xyflow/react";
import React, { useCallback } from "react";

function CustomNode({ data }) {
    const onClick = useCallback((evt) => {
        console.log("you clik me");
    });
    return (
        <div className="custom-node">
            <div>
                <button onClick={onClick}>{data.buttonText}</button>
            </div>
            <TargetHandleWithValidation position="top" source="input" />
            <SourceHandleWithValidation position="bottom" target="output" />
        </div>
    );
}

function TextUpdaterNode(props) {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);

    return (
        <div className="text-updater-node">
            <div>
                <input
                    id="text"
                    name="text"
                    onChange={onChange}
                    defaultValue="fastqc"
                />
            </div>
            <TargetHandleWithValidation position="top" source="input" />
            <SourceHandleWithValidation position="bottom" target="output" />
        </div>
    );
}

function TargetHandleWithValidation({ position, source }) {
    return (
        <Handle
            type="target"
            position={position}
            isValidConnection={(conn) => conn.source === source}
            onConnect={(params) => console.log("handle onConnect", params)}
            style={{ background: "blue" }}
        />
    );
}

function SourceHandleWithValidation({ position, target }) {
    return (
        <Handle
            type="source"
            position={position}
            isValidConnection={(conn) => conn.target === target}
            onConnect={(params) => console.log("handle onConnect", params)}
            style={{ background: "red" }}
        />
    );
}

export { TextUpdaterNode, CustomNode };
