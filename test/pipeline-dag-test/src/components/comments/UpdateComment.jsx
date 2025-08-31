import React, { useState, useContext } from "react";
import { Button, Modal, Form, Dropdown } from "react-bootstrap";
import axiosService from "../../helpers/axios";

import { ToasterContext } from "../Layout";

function UpdateComment(props) {
    const { contentType, contentId, comment } = props;
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [form, setForm] = useState({
        content: comment.content,
    });
    const { setToaster } = useContext(ToasterContext);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (event) => {
        /* handle the modification of a comment */
        event.preventDefault();
        const updateCommentForm = event.currentTarget;

        if (updateCommentForm.checkValidity() === false) {
            event.stopPropagation();
        }

        setValidated(true);

        const data = {
            content: form.content,
        };

        axiosService
            .put(`/api/${contentType}/${contentId}/comments/${comment.id}/`, data)
            .then(() => {
                handleClose();
                setToaster({
                    type: "success",
                    message: "Comment updated",
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
        <>
            <Dropdown.Item onClick={handleShow}>Edit</Dropdown.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>Edit Comment</Modal.Title>
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
                                defaultValue={comment.content}
                                value={form.content}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        content: e.target.value,
                                    })
                                }
                                as="textarea"
                                rows={3}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default UpdateComment;
