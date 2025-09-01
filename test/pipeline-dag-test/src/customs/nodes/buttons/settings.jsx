import React from "react";

export default function SettingsButton({ onClick, buttonStyle }) {
  return (
    <button
      onClick={onClick}
      className={`settings-button ${buttonStyle}`}
    />
  );
}
