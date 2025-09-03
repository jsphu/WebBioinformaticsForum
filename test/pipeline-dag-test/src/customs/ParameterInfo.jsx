import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import Toaster from "../components/Toaster";
import InfoButton from "./nodes/buttons/InfoButton";
import ScriptField from "./ScriptField";
import Comment from "../components/comments/Comment";
import CreateComment from "../components/comments/CreateComment";
import { dateFormat } from "../utils";
import LikeButton from "../components/buttons/LikeButton";
import { useUser } from "../hooks/UserContext";
import axiosService from "../helpers/axios";
import { useToaster } from "../hooks/ToasterContext";

export default function ParameterInfo(props) {
  const { parameter, createMode, updateMode } = props;
  const { user } = useUser();

  const [show, setShow] = useState(false);
  const { setToaster } = useToaster();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [comments, setComments] = useState([]);

  const handleDelete = (e) => {
    setShow(false);

    axiosService
      .delete(`/api/parameters/${parameter.id}/`)
      .then(res => console.log(res))
      .catch(err => console.error(err));

    setToaster({
      title: "Parameter",
      message: "Parameter deleted successfully.",
      show: true,
      type: "success",
      });
  }

  const handleSubmit = (e) => {
    setShow(false);

    if (createMode) {
      axiosService
        .post(`/api/parameters/`, parameter)
        .then(res => setToaster({
          title: "Parameter",
          message: "Parameter created successfully.",
          show: true,
          type: "success",
        }))
        .catch(err => setToaster({
          title: "Parameter",
          message: "Parameter post failure",
          show: true,
          type: "danger",
        }))
    }
    else if (updateMode) {
      axiosService
        .put(`/api/parameters/${parameter.id}/`, parameter)
        .then(res => setToaster({
          title: "Parameter",
          message: "Parameter updated successfully.",
          show: true,
          type: "success",
        }))
        .catch(err => setToaster({
          title: "Parameter",
          message: "Parameter put failure",
          show: true,
          type: "danger",
        }))
    };
  };

  useEffect(() => {
    if (show && !createMode) {
      axiosService.get(`/api/parameters/${parameter.id}/comments/`)
        .then(res => setComments(res.data.results))
        .catch(err => console.error(err));
    }
  }, [show, parameter, createMode]);

  return (
    <div>
      <InfoButton onClick={handleShow} label={parameter?.key} />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>{parameter?.key}</Modal.Title>
          <p style={{margin: "auto"}}>
            by: {parameter?.owner?.username} - {parameter?.is_edited ? dateFormat(parameter?.updated_at) : dateFormat(parameter?.created_at)}
          </p>
        </Modal.Header>
        <Modal.Body className="border-0">
          <Table striped bordered hover size="sm" responsive>
            <tbody>
              <tr>
                <td><strong>Key</strong></td>
                <td>{parameter?.key}</td>
              </tr>
              <tr>
                <td><strong>Value</strong></td>
                <td>
                  {String(parameter?.value).includes('\n') ? (
                    <ScriptField value={parameter?.value} rows={5} />
                  ) : (
                    parameter?.value
                  )}
                </td>
              </tr>
              <tr>
                <td><strong>Value Type</strong></td>
                <td>{parameter?.value_type}</td>
              </tr>
              <tr>
                <td><strong>Default Value</strong></td>
                <td>{parameter?.default_value}</td>
              </tr>
              <tr>
                <td><strong>Is Required</strong></td>
                <td>{parameter?.is_required ? 'Yes' : 'No'}</td>
              </tr>
            </tbody>
          </Table>

          <Modal.Title style={{textAlign: "center"}}>Comments</Modal.Title>
          {comments.map((comment, index) => {
            return (
              <Comment key={index} contentType="parameters" contentId={parameter?.id} comment={comment} />
            )
          })}
          <CreateComment contentType="parameters" contentId={parameter?.id} />
        </Modal.Body>
        <Modal.Footer>
          {user?.username === parameter?.owner?.username && (
            <Button onClick={handleDelete} style={{backgroundColor: "orangered"}}>
              Delete
            </Button>
          )}
          {!createMode && <LikeButton contentType="parameters" contentId={parameter.id}/>}
          <Button onClick={handleClose}>Close</Button>
          {createMode && <Button onClick={handleSubmit}>Create</Button>}
          {updateMode && <Button onClick={handleSubmit}>Update</Button>}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
