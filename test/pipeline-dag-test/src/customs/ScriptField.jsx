import React, { useState } from "react";

export default function ScriptField({ value, onChange, rows = 10, fontSize }) {
  const [textAreaRows, setTextAreaRows] = useState(rows);

  const isViewOnly = !onChange;

  const handleKeyDown = (e) => {
    if (isViewOnly) return;

    if (e.key === "Tab") {
      e.preventDefault();

      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue =
        value.substring(0, start) + "\t" + value.substring(end);

      // Notify parent of change
      onChange({
        ...e,
        target: {
          ...e.target,
          value: newValue,
        },
      });

      // Move cursor after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    }
  };

  return (
    <textarea
      name="script"
      value={value}
      onChange={onChange}
      rows={textAreaRows}
      onKeyDown={handleKeyDown}
      onFocus={() => setTextAreaRows(20)}
      onBlur={() => setTextAreaRows(rows)}
      style={{
        resize: "none",
        fontSize: fontSize || 16,
        width: "100%",
        fontFamily: "monospace",
      }}
    />
  );
}
