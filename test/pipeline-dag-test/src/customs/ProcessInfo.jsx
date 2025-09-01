import React, { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
// import axiosService from "../helpers/axios";
// import Toaster from "../components/Toaster";
import InfoButton from "./nodes/buttons/InfoButton";
import ScriptField from "./ScriptField";

export default function ProcessInfo(props) {

  const { process } = props;

  const [show, setShow] = useState(false);
  // const [showToast, setShowToast] = useState(false);
  // const [toastMessage, setToastMessage] = useState("");
  // const [toastType, setToastType] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  console.log(process);
  return (
    <>
      <InfoButton onClick={handleShow} />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>{ process?.process_name }</Modal.Title>
        </Modal.Header>
        <Modal.Body className="border-0">
          <p>Owner:   { process?.owner?.username }</p>
          <p>Description: { process?.description }</p>
          <Table striped bordered hover size="sm" responsive>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(process?.parameters || {}).map(([key, value], index) => {
                    const strValue = String(value);
                    const isMultiline = strValue.includes("\n");
                    return (
                      <tr key={index}>
                        <td>{key}</td>
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
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
      {/* <Toaster
        title="Submitted!"
        message={toastMessage}
        showToast={showToast}
        type={toastType}
        onClose={() => setShowToast(false)}
      />*/}
    </>
  );
}
