import { useMemo, useContext, createContext, useState, useEffect } from "react";
import axiosService from "../helpers/axios";
import { useToaster } from "./ToasterContext";

const ParameterContext = createContext("unknown");

export const ParameterProvider = ({ children }) => {
  const [parameters, setParameters] = useState([]);

  const { setToaster } = useToaster();

  useEffect(() => {
    axiosService
      .get(`/api/parameters/`)
      .then((res) => setParameters(res.data.results))
      .catch(() => setToaster({
        title: "Parameters",
        message: "An error occured while fetching parameters.",
        type: "danger",
        show: true
      }));
  }, []);

  const value = useMemo(() => ({ parameters, setParameters }), [parameters]);

  return (
    <ParameterContext.Provider value={value}>
      {children}
    </ParameterContext.Provider>
  );
}

export default ParameterContext;

export const useParameter = () => {
  return useContext(ParameterContext);
}
