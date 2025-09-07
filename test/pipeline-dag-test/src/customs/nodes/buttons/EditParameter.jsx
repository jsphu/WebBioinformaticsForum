import React, {memo} from "react";
import { Button } from "react-bootstrap";

export default memo(({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      style={{
        display: "flex",
        width: "100%",
        color: "black",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#e0e0e0")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#ffffff")}
    >
      Show
    </Button>
  );
});
