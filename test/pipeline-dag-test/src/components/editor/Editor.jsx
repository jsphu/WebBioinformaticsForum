import { ReactFlowProvider } from "@xyflow/react";
import { DnDProvider } from "../../hooks/DnDContext.jsx";
import { ParameterProvider } from "../../hooks/ParameterContext.jsx";
import { ProcessProvider } from "../../hooks/ProcessContext.jsx";
import FlowProvider from "./flow.jsx";
import { useParams } from "react-router-dom";
import {useEffect, useState } from "react";
import axiosService from "../../helpers/axios";

export default function Flow() {
  const { id } = useParams();

  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!id) return;

    axiosService
      .get(`/api/pipelines/${id}/comments/`)
      .then((res) => setComments(res.data.results))
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <>
      <ReactFlowProvider>
        <DnDProvider>
          <ProcessProvider>
            <ParameterProvider>
              <FlowProvider id={id} comments={comments} />
            </ParameterProvider>
          </ProcessProvider>
        </DnDProvider>
      </ReactFlowProvider>
    </>
  )
}
