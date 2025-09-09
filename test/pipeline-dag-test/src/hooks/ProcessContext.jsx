import { useMemo, useContext, createContext, useState, useEffect } from "react";
import axiosService from "../helpers/axios";
import { useToaster } from "./ToasterContext";

const ProcessContext = createContext("unknown");

export const ProcessProvider = ({ children }) => {
  const [processes, setProcesses] = useState([]);

  const { setToaster } = useToaster();

  useEffect(() => {
    axiosService
      .get(`/api/processes/`)
      .then((res) => setProcesses(res.data.results))
      .catch(() => setToaster({
        title: "Process",
        message: "An error occured while fetching processes.",
        type: "danger",
        show: true
      }));
  }, []);

  const value = useMemo(() => ({ processes, setProcesses }), [processes]);

  return (
    <ProcessContext.Provider value={value}>
      {children}
    </ProcessContext.Provider>
  );
}

export default ProcessContext;

export const useProcess = () => {
  return useContext(ProcessContext);
}
