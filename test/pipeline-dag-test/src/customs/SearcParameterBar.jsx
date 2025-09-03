import React, { useEffect, useState } from "react";
import { createNodeObject } from "../hooks/useNodeCreator";
import { useDnD } from "../hooks/DnDContext";
import ParameterInfo from "./ParameterInfo";

export default function SearchParameterBar(props) {
  const { parameters } = props;

  const cachedParameters = parameters || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredParameters, setFilteredParameters] = useState([]);
  const [data, setData] = useDnD();

  const onDragStart = (event, data) => {
    setData(data);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData('text/plain', JSON.stringify(data));
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Remove everything except letters, digits, and spaces
    const cleaned = term.replace(/[^a-z0-9\s]/gi, "").trim().toLowerCase();

    // If nothing legit left, stop
    if (cleaned.length === 0) {
      setFilteredParameters([]);
      return;
    }

    // Split into words
    const words = cleaned.split(/\s+/);

    if (words.length === 0) {
      setFilteredParameters([]);
      return;
    }

    const scoredParameters = cachedParameters
      .map((parameter) => {
        let score = 0;
        const key = parameter.key.toLowerCase();
        const value = String(parameter.value).toLowerCase();

        words.forEach((word) => {
          // exact match in key or value
          if (key === word || value === word) score += 3;

          // word appears at start of any word in key or value
          const regex = new RegExp(`\\b${word}`, "i");
          if (regex.test(key) || regex.test(value)) score += 2;

          // word appears anywhere
          if (key.includes(word) || value.includes(word)) score += 1;
        });

        return { ...parameter, _score: score };
      })
      .filter((param) => param._score > 0)
      .sort((a, b) => b._score - a._score) // highest score first
      .slice(0, 5); // top 5 results

    setFilteredParameters(scoredParameters);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && filteredParameters.length > 0) {
      handleParameterSelect(filteredParameters[0].id);
    }
  };

  const handleParameterSelect = (id) => {
    setSearchTerm('');
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search a parameter"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyPress}
        style={{
          fontSize: '1rem',
          marginTop: '25px',
          marginLeft: '15px',
          padding: '3px 8px',
          fontFamily: 'Times New Roman, serif',
          border: '1px solid #ccc',
          borderRadius: '15px'
        }}
      />
      <div style={{position: "absolute", maxWidth: "250px"}}>
        {filteredParameters.length > 0 && (
          filteredParameters.map((parameter, index) => (
            <div
              key={index}
              onDragStart={(e) => onDragStart(e, parameter)}
              draggable
              style={{margin: ""}}
            >
              <ParameterInfo parameter={parameter} />
            </div>
          ))
        )}
      </div>
    </>
  );
}
