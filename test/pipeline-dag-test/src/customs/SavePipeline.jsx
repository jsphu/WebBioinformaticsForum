import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axiosService from "../helpers/axios";
import Toaster from "../components/Toaster";
import { useUser } from "../hooks/UserContext";

export default function SavePipeline(props) {

  const { id, data } = props;

  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [charCounter, setCharCounter] = useState(0);
  const [titleCharCounter, setTitleCharCounter] = useState(0);
  const { user } = useUser();

  const [form, setForm] = useState({ description: "", pipelineTitle: "" });

  useEffect(() => {
    let savedData = null;

    if (!user?.created_at) {
      savedData = localStorage.getItem("pipelineData");
      if (savedData) savedData = JSON.parse(savedData);
    } else {
      savedData = data;
    }

    if (savedData) {
      setForm({
        description: savedData.description || "",
        pipelineTitle: savedData.pipelineTitle || "",
        flowData: savedData.flowData || { nodes: [], edges: [] },
      });
      setCharCounter(savedData.description?.length || 0);
      setTitleCharCounter(savedData.pipelineTitle?.length || 0);
    }
  }, [data, user]);

  const handleCharLimit = (e) => {
    const description = e.target.value;
    setForm((prev) => ({ ...prev, description }));
    setCharCounter(description.length);

    // Save to localStorage if user not signed in
    if (!user?.created_at) {
      localStorage.setItem(
        "pipelineData",
        JSON.stringify({ ...form, description })
      );
    }
  };

  const handleTitleCharLimit = (e) => {
    const pipelineTitle = e.target.value;
    setForm((prev) => ({ ...prev, pipelineTitle }));
    setTitleCharCounter(pipelineTitle.length);

    // Save to localStorage if user not signed in
    if (!user?.created_at) {
      localStorage.setItem(
        "pipelineData",
        JSON.stringify({ ...form, pipelineTitle })
      );
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const createPostForm = event.currentTarget;

    if (createPostForm.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const payload = {
      pipeline_title: form.pipelineTitle,
      description: form.description,
      flow_data: data.flowData,
      owner: data?.owner?.id || user?.id,
      processes: data.processes,
    };

    try {
      if (!id) {
        await axiosService.post("api/pipelines/", payload);
        setToastMessage("Pipeline created.");
      } else {
        await axiosService.put(`api/pipelines/${id}/`, payload);
        setToastMessage("Pipeline updated.");
      }

      setToastType("success");
      setShowToast(true);
      setForm({});
      setCharCounter(0);
      setTitleCharCounter(0);
      handleClose();

      // Clear localStorage after successful save
      localStorage.removeItem("pipelineData");
    } catch (err) {
      console.error(err);
      setToastMessage("Error saving pipeline.");
      setToastType("danger");
      setShowToast(true);
    }
  };

  return (
    <>
      <button
        className="xy-theme__button"
        onClick={handleShow}
      >
        save pipeline
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>{ data?.pipelineTitle ? `Update ${data?.pipelineTitle}` : "Create Pipeline" }</Modal.Title>
        </Modal.Header>
        <Modal.Body className="border-0">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                name="body"
                value={form.pipelineTitle}
                onChange={handleTitleCharLimit}
                as="input"
                placeholder={data?.pipelineTitle || "Title"}
              />
              <p
                style={{
                  color: titleCharCounter <= 128 ? "grey" : "mediumvioletred",
                }}
              >
                {titleCharCounter}/128
                {titleCharCounter > 128 &&
                  " Titles must be lower than 128 characters."}
              </p>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Owner: { data?.owner?.username || user?.username }
              </Form.Label>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                name="body"
                value={form.description}
                onChange={handleCharLimit}
                as="textarea"
                rows={20}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <p style={{ color: charCounter <= 16000 && user?.created_at ? "grey" : "red" }}>
            {!user?.created_at
                ? "Please sign in to save pipelines."
                : `${charCounter > 16000
                  ? "Please do not exceed character limit. "
                  : ""}
                ${charCounter}/16000`
              }
          </p>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={form.description === undefined || charCounter > 16000 || titleCharCounter > 128 || user.created_at === undefined}
          >
            {" "}
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <Toaster
        title="Submitted!"
        message={toastMessage}
        showToast={showToast}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
