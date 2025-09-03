import { useMemo, useContext, createContext, useState } from "react";
import Toaster from "../components/Toaster";

const ToasterContext = createContext("unknown");

export const ToasterProvider = ({ children }) => {
  const [toaster, setToaster] = useState({
    title: "",
    show: false,
    message: "",
    type: "",
  });
  const value = useMemo(() => ({ toaster, setToaster }), [toaster]);

  return (
    <ToasterContext.Provider value={value}>
      {children}
      <Toaster
        title={toaster.title}
        message={toaster.message}
        type={toaster.type}
        showToast={toaster.show}
        onClose={() => setToaster({...toaster, show: false,})}
      />
    </ToasterContext.Provider>
  );
}

export default ToasterContext;

export const useToaster = () => {
  return useContext(ToasterContext);
}
