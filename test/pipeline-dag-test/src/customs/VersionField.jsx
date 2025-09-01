import { Form } from "react-bootstrap";
import { useState } from "react";

export default function VersionField({ value, onChange }) {
  const [internal, setInternal] = useState(value || "0.0.1");
  const [segmentIndex, setSegmentIndex] = useState(0);

  const handleKeyDown = (e) => {
      const key = e.key;
      let parts = internal.split(".");

      if (key === "ArrowLeft") {
        setSegmentIndex(Math.max(segmentIndex - 1, 0));
        return;
      }
      if (key === "ArrowRight") {
        setSegmentIndex(Math.min(segmentIndex + 1, 2));
        return;
      }

      e.preventDefault(); // fully control typing

      if (key === "Backspace") {
        parts[segmentIndex] = parts[segmentIndex].slice(0, -1) || "0";
      } else if (/[0-9]/.test(key)) {
        // replace 0 or append digit
        parts[segmentIndex] =
          parts[segmentIndex] === "0" ? key : parts[segmentIndex] + key;
      } else if (key === ".") {
        setSegmentIndex(Math.min(segmentIndex + 1, 2));
      } else {
        return; // ignore other keys
      }

      const newVal = parts.join(".");
      setInternal(newVal);
      onChange?.(newVal);
    };

  return (
    <Form.Control
      type="text"
      value={internal}
      onKeyDown={handleKeyDown}
      readOnly // we handle typing
      style={{ width: "120px", textAlign: "center", fontFamily: "monospace" }}
    />
  );
}
