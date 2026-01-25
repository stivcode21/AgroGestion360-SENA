// LoaderProvider.jsx
import { createContext, useContext, useState } from "react";
import styles from "./LoaderProvider.module.css";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const toggleLoader = (state) => setLoading(state);

  return (
    <LoaderContext.Provider value={{ toggleLoader }}>
      {children}
      {loading && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loader}></div>
        </div>
      )}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
