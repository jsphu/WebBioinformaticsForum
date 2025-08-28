import axios from "axios";
import axiosService from "../helpers/axios";

function usePipelineActions() {
    const baseURL = "http://localhost:8000/api";

    function getPipeline(data) {
        return axios
            .post(`${baseURL}/pipelines/${data.id}`, data)
            .then((res) => {
                setPipelineData(res);
            });
    }
    function removePipeline() {
        localStorage.removeItem("pipeline");
    }

    function edit(data, id) {
        return axiosService
            .put(`${baseURL}/pipelines/${id}/`, data)
            .then((res) => {
                localStorage.setItem(
                    "pipeline",
                    JSON.stringify({
                        id: res.data.id,
                        owner: res.data.owner.username,
                        title: res.data.pipeline_title,
                        created_at: res.data.created_at,
                        updated_at: res.data.updated_at,
                        description: res.data.description,
                        is_edited: res.data.is_edited,
                        version: res.data.version,
                        flow_data: res.data.flow_data,
                        processes: res.data.processes,
                    }),
                );
            });
    }

    return {
        getPipeline,
        removePipeline,
        edit,
    };
}
function setPipelineData(res) {
    localStorage.setItem(
        "pipeline",
        JSON.stringify({
            id: res.data.id,
            owner: res.data.owner.username,
            title: res.data.pipeline_title,
            created_at: res.data.created_at,
            updated_at: res.data.updated_at,
            description: res.data.description,
            is_edited: res.data.is_edited,
            version: res.data.version,
            flow_data: res.data.flow_data,
            processes: res.data.processes,
        }),
    );
}

export { usePipelineActions };
