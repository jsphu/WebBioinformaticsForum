import { useState, useEffect } from "react";
import axiosService from "../../helpers/axios";
import ProcessInfo from "../editor/panels/ProcessInfo";

export default function ProcessList() {

  const [processes, setProcesses] = useState({
    processList: [],
    totalPages: 0,
    currentPage: 1,
  });

  const [sortBy, setSortBy] = useState("en-gunel");

  useEffect(() => {
    const itemName = "processes"
    const page = processes.currentPage;
    const pageLimit = 100000;
    const offset = (page - 1) * pageLimit;

    axiosService
      .get(`/api/${itemName}/?limit=${pageLimit}&offset=${offset}`)
      .then((res) => {
        const items = res.data.results.map((item) => ({
          id: item.id,
          title:
            item?.process_name ||
            (item?.content ? item.content.slice(0, 100) : ""),
          summary: item?.content
            ? item.content.slice(100, item.content.length)
            : "",
          description: item?.description,
          time: new Date(item.created_at),
          interaction: item.likes_count + item.comments_count,
        }));

        const newState = {
          processList: items,
          totalPages: Math.ceil(res.data.count / pageLimit),
          currentPage: page,
        };

        // Only update state if it's different from current
        setProcesses((prev) => {
          if (
            prev.currentPage === newState.currentPage &&
            prev.totalPages === newState.totalPages &&
            JSON.stringify(prev.processList) === JSON.stringify(newState.processList)
          ) {
            return prev; // No change, prevent re-render
          }
          return newState;
        });
      })
      .catch((err) => console.error(`Error fetching ${itemName}:`, err));
  });

  // Sorting (only affects currently fetched page)
  const sortedProcesses = [...processes.processList].sort((a, b) => {
    if (sortBy === "en-gunel") return b.time - a.time;
    if (sortBy === "en-eski") return a.time - b.time;
    if (sortBy === "en-cok-etkilesim") return b.interaction - a.interaction;
    return 0;
  });

  return (
    <div className="pipelines-list">
      <div className="pipelines-frame">
        <div className="pipelines-header">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ fontSize: "0.9rem", marginRight: "10px" }}
          >
            <option value="en-gunel">En Güncel</option>
            <option value="en-eski">En Eski</option>
            <option value="en-cok-etkilesim">En Çok Etkileşim</option>
          </select>
          Recent Processes
        </div>

        {sortedProcesses.map((process) => (
          <div className="topic-item">
              <ProcessInfo process={process} />
            <div className="topic-content" key={process.id}>
              <h3 style={{ margin: "2px 0" }}>{process.title.slice(0, 200)}{process.title.length > 200 && "..."}</h3>
              <p style={{
                margin: "2px 0",
                fontSize: "0.9rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                wordBreak: "break-word"
              }}>
                {process.description}
              </p>
              <small style={{ margin: "2px 0", color: "#666" }}>
                {process.time.toLocaleString()}
              </small>
            </div>
          </div>
        ))}
        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: processes.totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setProcesses({...processes, currentPage: i + 1 })}
              style={{
                marginRight: "5px",
                padding: "4px 8px",
                fontSize: "0.9rem",
              }}
              className={processes.currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
