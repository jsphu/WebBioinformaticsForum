import React from "react";
import { Image, Card, Dropdown } from "react-bootstrap";
import { dateFormat } from "../../utils";
import axiosService from "../../helpers/axios";
import { useUser } from "../../hooks/UserContext";
import { Link } from "react-router-dom";
import LikeButton from "../buttons/LikeButton";
import UpdateComment from "./UpdateComment";
import { useToaster } from "../../hooks/ToasterContext";

const MoreToggleIcon = React.forwardRef(({ onClick }, ref) => (
  <Link
    to="#"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    ...
  </Link>
));

function Comment(props) {
  const { contentType, contentId, comment } = props;
  const { setToaster } = useToaster();

  const { user } = useUser();
  const isUser = user.username === comment.author.username;

  const commentURL = `/api/${contentType}/${contentId}/comments`

  const handleLikeClick = (action) => {
    if (action === "like") {
      axiosService
        .post(`${commentURL}/${comment.id}/like/`)
        .then(() => {
          setToaster({
            type: "success",
            message: "Comment liked",
            show: true,
            title: "Comment",
          });
        })
        .catch((err) => {
          setToaster({
            type: "danger",
            message: "",
            show: true,
            title: "error",
          });
        });
    } else {
      axiosService
        .post(
          `${commentURL}/${comment.id}/like/`,
        )
        .then(() => {
          setToaster({
            type: "danger",
            message: "Like removed",
            show: true,
            title: "Comment",
          });
        })
        .catch((err) => {
          setToaster({
            type: "danger",
            message: "",
            show: true,
            title: "error",
          });
        });
    }
  };
  const handleDelete = () => {
    axiosService
      .delete(`${commentURL}/${comment.id}/`)
      .then(() => {
        setToaster({
          type: "danger",
          message: "Comment deleted",
          show: true,
          title: "Comment",
        });
      })
      .catch(() => {
        setToaster({
          type: "danger",
          message: "",
          show: true,
          title: "error",
        });
      });
  };
  return (
    <Card className="rounded-3 my-2">
      <Card.Body>
        <Card.Title className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row">
            {/* <Link
              to={`/profile/${comment.author.id}`}
              className="text-decoration-none"
            >
              <Image
                src={user.avatar}
                roundedCircle
                width={48}
                height={48}
                className="me-2 border border-primary border-2"
              />
            </Link>*/}
            <div className="d-flex flex-column justify-content-start align-self-center mt-2">
              <p className="fs-6 m-0">
                {comment.author.username}
              </p>
              <p className="fs-6 fw-lighter">
                <small>
                  {dateFormat(comment.created_at)}
                  {comment.is_edited && (
                  ` |edited: ${dateFormat(comment.last_edited_at)}|`)}
                </small>
              </p>
            </div>
          </div>
          {(isUser || user.is_superuser) && (
            <div>
              <Dropdown>
                <Dropdown.Toggle as={MoreToggleIcon} />
                <Dropdown.Menu>
                  {isUser && (
                    <UpdateComment
                      comment={comment}
                      contentType={contentType}
                      contentId={contentId}
                    />
                  )}
                  <Dropdown.Item onClick={handleDelete} className="text-danger">
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </Card.Title>
        <Card.Text>{comment.content}</Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex bg-white w-50 justify-content-between border-0">
        <div className="d-flex flex-row">
          <LikeButton contentType={contentType} contentId={contentId} likesCount={comment.likes_count} commentId={comment.id} />
        </div>
      </Card.Footer>
    </Card>
  );
}
export default Comment;
