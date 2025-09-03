import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import axiosService from "../helpers/axios";
import Toaster from "../components/Toaster";
import InfoButton from "./nodes/buttons/InfoButton";
import ScriptField from "./ScriptField";
import Comment from "../components/comments/Comment";
import CreateComment from "../components/comments/CreateComment";
import { dateFormat } from "../utils";
import LikeButton from "../components/buttons/LikeButton";
import { useUser } from "../hooks/UserContext";
import ParameterInfo from "./ParameterInfo";

export default function ProcessInfo(props) {

  const { process } = props;
  const { user } = useUser();

  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [comments, setComments] = useState([]);

  const handleDelete = (e) => {
    setShow(false);

    axiosService
      .delete(`/api/processes/${process.id}/`)
      .then(res => console.log(res))
      .catch(err => console.error(err));

    setShowToast(true);
    setToastMessage("Process deleted successfully");
    setToastType("success");
  }

  useEffect(() => {
    if (show) {
      axiosService.get(`/api/processes/${process.id}/comments/`)
        .then(res => setComments(res.data.results))
        .catch(err => console.error(err));
    }
  }, [show, process]);

  return (
    <>
      <InfoButton onClick={handleShow} label={process?.process_name} />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>{ process?.process_name }</Modal.Title>
          <p style={{margin: "auto"}}>by: { process?.owner?.username } - { process?.is_edited ? dateFormat(process?.updated_at) : dateFormat(process?.created_at) }</p>
        </Modal.Header>
        <Modal.Body className="border-0">
          <Modal.Title style={{textAlign: "center"}}>Description</Modal.Title>
          <textarea style={{width: "100%", resize: "none"}} value={ process?.description } />
          <Table striped bordered hover size="sm" responsive>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {process?.parameters && process.parameters.map((param, index) => {
                if (param.key === "script") return null;
                const strValue = String(param.value);
                const isMultiline = strValue.includes("\n");
                return (
                  <tr key={index}>
                    <td><ParameterInfo parameter={param}/></td>
                    <td>
                      {isMultiline ? (
                        <ScriptField value={strValue} rows={3} />
                      ) : (
                        strValue
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Modal.Title style={{textAlign: "center"}}>Script</Modal.Title>
          <ScriptField value={process?.script || "this process has no script."} rows={process?.script ? 5 : 1} />
          <Modal.Title style={{textAlign: "center"}}>Comments</Modal.Title>
          {comments.map((comment, index) => {
            return (
              <Comment contentType="processes" contentId={process.id} comment={comment} />
            )
          })}
          <CreateComment contentType="processes" contentId={process.id} />
        </Modal.Body>
        <Modal.Footer>
          {user?.username === process.owner.username && <Button onClick={handleDelete} style={{backgroundColor: "orangered"}}>Delete</Button>}
          <LikeButton contentType="processes" contentId={process.id}/>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
      <Toaster
        title="Process"
        message={toastMessage}
        showToast={showToast}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
