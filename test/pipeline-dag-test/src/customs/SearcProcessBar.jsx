import React, { useEffect, useState } from "react";
import BlankNode from "./nodes/BlankNode";
import { createNodeObject, translateProcessToNodeObject } from "../hooks/useNodeCreator";
import { useDnD } from "../hooks/DnDContext";

export default function SearchProcessBar(props) {

  const { processes } = props;

  const cachedProcesses = processes || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProcesses, setFilteredProcesses] = useState([]);
  const [data, setData] = useDnD();

  const blankNode = createNodeObject("customNode", 0, 0, 0, "Process");

  const onDragStart = (event, data) => {
    // const node = translateProcessToNodeObject(data);
    setData(data);
    event.dataTransfer.effectAllowed = "move";
  };


  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Remove everything except letters, digits, and spaces
    const cleaned = term.replace(/[^a-z0-9\s]/gi, "").trim().toLowerCase();

    // If nothing legit left, stop
    if (cleaned.length === 0) {
      setFilteredProcesses([]);
      return;
    }

    // Split into words
    const words = cleaned.split(/\s+/);

    if (words.length === 0) {
      setFilteredProcesses([]);
      return;
    }
    const scoredProcesses = cachedProcesses
      .map((process) => {
        let score = 0;
        const title = process.process_name.toLowerCase();
        const summary = process.description.toLowerCase();

        words.forEach((word) => {
          // exact match in title or summary
          if (title === word || summary === word) score += 3;

          // word appears at start of any word in title or summary
          const regex = new RegExp(`\\b${word}`, "i");
          if (regex.test(title) || regex.test(summary)) score += 2;

          // word appears anywhere
          if (title.includes(word) || summary.includes(word)) score += 1;
        });

        return { ...process, _score: score };
      })
      .filter((topic) => topic._score > 0)
      .sort((a, b) => b._score - a._score) // highest score first
      .slice(0, 5); // top 5 results

    setFilteredProcesses(scoredProcesses);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && filteredProcesses.length > 0) {
      handleProcessSelect(filteredProcesses[0].id);
    }
  };

  const handleProcessSelect = (id) => {
    setSearchTerm('');
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search a process"
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
      <div style={{position: "absolute", width: "250px"}}>
      {filteredProcesses.length > 0 && (
        filteredProcesses.map((process, index) => (
          <div
            key={index}
            onDragStart={(e) => onDragStart(e, process)}
            draggable
            style={{margin: "2px"}}
          >
            <BlankNode data={{ ...blankNode, data: { ...blankNode.data, label: process.process_name } }} process={process} />
          </div>
        ))
      )}
      </div>
    </>
  )
}
