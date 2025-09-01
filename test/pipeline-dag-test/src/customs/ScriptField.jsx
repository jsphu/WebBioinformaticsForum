import React, { useState } from "react";

export default function ScriptField(props) {
  const { value, onChange, rows, setValue } = props;

  const [textAreaRows, setTextAreaRows] = useState(rows);

  const isViewOnly = !setValue || !onChange;

  const handleKeyDown = (e) => {
    if (isViewOnly) return;

    if (e.key === "Tab") {
        e.preventDefault();

        const textarea = e.target;
        const start =
            textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Insert tab character
        const newValue =
            value.substring(
                0,
                start,
            ) +
            "\t" +
            value.substring(end);
        setValue((prev) => ({
            ...prev,
            [e.target.name]: newValue,
        }));

        // Move cursor after tab
        setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
    }
  }

  return (
    <>
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
              fontSize: 16,
              width: "100%",
              fontFamily: "monospace",
          }}
      />
    </>
  )

}
