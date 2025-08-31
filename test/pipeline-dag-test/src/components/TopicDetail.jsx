import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axiosService from "../helpers/axios";
import LikeButton from "./buttons/LikeButton";
import CreateComment from "./comments/CreateComment";
import Comment from "./comments/Comment";
import { dateFormat } from "../utils";
import { UserContext } from "../hooks/UserContext";
import { Button } from "react-bootstrap";

export default function TopicDetail() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState(null);
  const { user } = useContext(UserContext);
  const username = user?.username;
  const authorname = topic?.author?.username;
  const isUser = username === authorname && username !== "anonymous";

  useEffect(() => {
    axiosService.get(`/api/posts/${id}/`)
      .then(res => setTopic(res.data))
      .catch(err => console.error(err));
    axiosService.get(`/api/posts/${id}/comments/`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!topic) return <div>Loading...</div>;

  const handleDelete = () => {
    axiosService.delete(`/api/posts/${id}/`)
      .then(() => {
        setTopic({ title: "[REDACTED]", content: "deleted :(", created_at: null, likes_count: 0, comments_count: 0, is_edited: false });
        setComments(null);
      })
      .catch(err => console.error(err));
  }

  return (
    <div className="topic-detail" style={{ maxWidth: '800px', margin: '20px auto', textAlign: 'left' }}>
      <h1>{topic.title || topic.content.slice(0, (topic.content.indexOf('\n') > 0 ? topic.content.indexOf('\n') : 100 ))}</h1>
      <p style={{overflow: "auto", wordWrap: "break-word"}}>{topic.content.slice(topic.content.indexOf('\n'), topic.content.length)}</p>
      <small>{authorname ? `by ${authorname}` : "Deleted User"} - </small>
      <small>{dateFormat(topic.created_at)}{topic.is_edited && ` |edited: ${dateFormat(topic.updated_at)}|`} - Interaction: {topic.likes_count + topic.comments_count}</small>
      <LikeButton contentType="posts" contentId={id} likesCount={topic.likes_count} />
      {isUser && <Button onClick={handleDelete} style={{marginTop: "2px",backgroundColor: "red", border: "red"}}>Delete</Button>}
      {username !== "anonymous" && <CreateComment contentType="posts" contentId={id} />}
      {comments?.results.map((comment, index) => (
          <Comment
              key={index}
              contentType="posts"
              contentId={id}
              comment={comment}
          />
      ))}
    </div>
  );
}
