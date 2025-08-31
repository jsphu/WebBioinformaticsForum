import React, { useState, useContext, useEffect } from "react";
import axiosService from "../../helpers/axios";
import { UserContext } from "../../hooks/UserContext";
import { Button } from "react-bootstrap";

export default function LikeButton({ contentType, contentId, likesCount, commentId }) {
  const { user } = useContext(UserContext);
  const username = user?.username;

  const contentURL = commentId ? `/api/${contentType}/${contentId}/comments/${commentId}` : `/api/${contentType}/${contentId}`;

  const [liked, setLiked] = useState(false);
  const [currentLikesCount, setCurrentLikesCount] = useState(likesCount || 0);

  // Check if user already liked
  useEffect(() => {
    axiosService.get(`${contentURL}/likes/`)
    .then((res) => {
      if (res.status === 200) {
        const userLiked = res.data.some(like => like.user.username === username);
        setLiked(userLiked);
      }
    })
    .catch(err => console.error(err));
  }, [contentURL, username]);

  const handleClick = () => {
    axiosService.post(`${contentURL}/like/`)
    .then(() => {
      if (liked) {
        setLiked(false);
        setCurrentLikesCount(prev => prev - 1);
      } else {
        setLiked(true);
        setCurrentLikesCount(prev => prev + 1);
      }
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="m-auto">
      <Button
          variant="primary"
          onClick={username !== "anonymous" ? handleClick : null}
        style={{ marginTop: "2px", backgroundColor: liked ? "slateblue" : "steelblue", }}
      >
        <small>{currentLikesCount} </small>Like
      </Button>
    </div>
  );
}
