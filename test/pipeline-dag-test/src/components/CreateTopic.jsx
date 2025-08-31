import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axiosService from "../helpers/axios";
import Toaster from "./Toaster";

export default function CreateTopic() {
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [charCounter, setCharCounter] = useState(0);
    const [titleCharCounter, setTitleCharCounter] = useState(0);

    const [form, setForm] = useState({ body: "", title: ""});

    const handleCharLimit = (e) => {
      const content = e.target.value;
      setForm({ ...form, body: content });
      setCharCounter(content.length + form.title.length);
    };

    const handleTitleCharLimit = (e) => {
      const title = e.target.value;
      setForm({ ...form, title: title });
      setTitleCharCounter(title.length);
      setCharCounter((form?.body.length || 0) + title.length);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const createPostForm = event.currentTarget;

        if (createPostForm.checkValidity() === false) {
            event.stopPropagation();
        }

        setValidated(true);

        const data = {
            content: form.title + "\n" + form.body,
        };

        axiosService
            .post("api/posts/", data)
            .then(() => {
                handleClose();
                setToastMessage("Post created.");
                setToastType("success");
                setForm({});
                setShowToast(true);
            })
            .catch((error) => {
                handleClose();
                setToastMessage(error.response.data.content);
                setToastType("danger");
                setShowToast(true);
            });
    };
    return (
        <>
            <Form.Group className="my-3 w-85">
                <Form.Control
                    className="py-2 rounded-pill border primary text-primary"
                    type="text"
                    placeholder="Write a post"
                    onClick={handleShow}
                />
            </Form.Group>
            {/* Modal Code Here */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>Create Post</Modal.Title>
                </Modal.Header>
                <Modal.Body className="border-0">
                    <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                    >
                        <Form.Group className="mb-3">
                            <Form.Control
                                name="body"
                                value={form.title}
                                onChange={handleTitleCharLimit}
                                as="input"
                                placeholder="Title"
                            />
                            <p style={{ color: titleCharCounter <= 100 ? "grey" : "mediumvioletred" }}>
                              {titleCharCounter}/100
                              {
                                titleCharCounter > 100 && " Titles are best at length of 100 characters."
                              }
                            </p>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                name="body"
                                value={form.body}
                                onChange={handleCharLimit}
                                as="textarea"
                                rows={20}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <p style={{color: charCounter <= 8000 ? "grey" : "red" }}>
                      {
                        charCounter > 8000 && "Please do not exceed character limit. "
                      }{charCounter}/8000
                    </p>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={form.body === undefined || charCounter > 8000}
                    >
                        {" "}
                        Post
                    </Button>
                </Modal.Footer>
            </Modal>
            <Toaster
                title="Post!"
                message={toastMessage}
                showToast={showToast}
                type={toastType}
                onClose={() => setShowToast(false)}
            />
        </>
    );
}
