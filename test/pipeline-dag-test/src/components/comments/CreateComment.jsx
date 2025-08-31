import React, { useState } from "react";
import { Button, Form, Image } from "react-bootstrap";
import axiosService from "../../helpers/axios";
import Toaster from "../Toaster";

function CreateComment(props) {
  const { contentType, contentId } = props;

  // const [avatar /*setAvatar*/] = useState(user.avatar);
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  const handleSubmit = (event) => {
      //logic to handle form submission
      event.preventDefault();
      const createCommentForm = event.currentTarget;

      if (createCommentForm.checkValidity() === false) {
          event.stopPropagation();
      }
      setValidated(true);

      const data = {
          content: form.body,
      };

      axiosService
          .post(`/api/${contentType}/${contentId}/comments/`, data)
          .then(() => {
              setForm({ ...form, body: "" });
              setToastType("success");
              setToastMessage("Comment posted successfully");
              setShowToast(true);
          })
          .catch(() => {
              setToastType("danger");
              setToastMessage("");
              setShowToast(true);
          });
  };
  return (
      <Form
          className="d-flex flex-row justify-content-between"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
      >
          {/* <Image
              src={avatar}
              roundedCircle
              width={48}
              height={48}
              className="my-2"
          />*/}
          <Form.Group className="m-3 w-75">
              <Form.Control
                  className="py-2 rounded-pill border-primary"
                  type="text"
                  placeholder="Write a comment"
                  value={form.body}
                  name="body"
                  onChange={(e) =>
                      setForm({
                          ...form,
                          body: e.target.value,
                      })
                  }
              />
          </Form.Group>
          <div className="m-auto">
              <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={form.body === undefined}
                  size="small"
              >
                  Comment
              </Button>
          </div>
          <Toaster
              title="Post!"
              message={toastMessage}
              showToast={showToast}
              type={toastType}
              onClose={() => setShowToast(false)}
          />
      </Form>
  );
}
export default CreateComment;
