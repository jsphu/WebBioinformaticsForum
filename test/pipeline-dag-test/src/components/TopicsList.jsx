import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreateTopic from "./CreateTopic";
import { useUser } from "../hooks/UserContext";
import axiosService from "../helpers/axios";

function TopicsList() {
  const [topics, setTopics] = useState({
    itemsList: [],
    totalPages: 0,
    currentPage: 1,
  });
  const [sortBy, setSortBy] = useState("en-gunel");
  const { user } = useUser();
  const username = user?.username;
  const totalPages = topics.totalPages;
  const currentPage = topics.currentPage;
  const topicsList = topics.itemsList;

  const mapItems = (itemName, itemSetter, page = 1, pageLimit = 100000) => {
    const offset = (page - 1) * pageLimit;

    axiosService
      .get(`/api/${itemName}/?limit=${pageLimit}&offset=${offset}`)
      .then((res) => {
        const items = res.data.results.map((item) => ({
          id: item.id,
          title:
            item?.title ||
            (item?.content ? item.content.slice(0, 100) : ""),
          summary: item?.content
            ? item.content.slice(100, item.content.length)
            : "",
          time: new Date(item.created_at),
          interaction: item.likes_count + item.comments_count,
        }));

        const newState = {
          itemsList: items,
          totalPages: Math.ceil(res.data.count / pageLimit),
          currentPage: page,
        };

        // Only update state if it's different from current
        itemSetter((prev) => {
          if (
            prev.currentPage === newState.currentPage &&
            prev.totalPages === newState.totalPages &&
            JSON.stringify(prev.itemsList) === JSON.stringify(newState.itemsList)
          ) {
            return prev; // No change, prevent re-render
          }
          return newState;
        });
      })
      .catch((err) => console.error(`Error fetching ${itemName}:`, err));
  };

  // Load first page
  useEffect(() => {
    mapItems("posts", setTopics, topics.currentPage, 6);
  }, [topics.currentPage]);


  // Sorting (only affects currently fetched page)
  const sortedTopics = [...topicsList].sort((a, b) => {
    if (sortBy === "en-gunel") return b.time - a.time;
    if (sortBy === "en-eski") return a.time - b.time;
    if (sortBy === "en-cok-etkilesim") return b.interaction - a.interaction;
    return 0;
  });

  return (
    <div className="topics-list">
      <div className="topics-frame">
        <div className="topics-header">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ fontSize: "0.9rem", marginRight: "10px" }}
          >
            <option value="en-gunel">En Güncel</option>
            <option value="en-eski">En Eski</option>
            <option value="en-cok-etkilesim">En Çok Etkileşim</option>
          </select>
          Recent Topics
        </div>

        {sortedTopics.map((topic) => (
          <Link to={`/topic/${topic.id}`} key={topic.id} className="topic-item">
            <div className="topic-content">
              <h3 style={{ margin: "2px 0" }}>{topic.title.slice(0, 200)}{topic.title.length > 200 && "..."}</h3>
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
                {topic.summary}
              </p>
              <small style={{ margin: "2px 0", color: "#666" }}>
                {topic.time.toLocaleString()}
              </small>
            </div>
          </Link>
        ))}
        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setTopics(i + 1)}
              style={{
                marginRight: "5px",
                padding: "4px 8px",
                fontSize: "0.9rem",
              }}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      {username !== "anonymous" && <CreateTopic />}
    </div>
  );
}

export default TopicsList;
