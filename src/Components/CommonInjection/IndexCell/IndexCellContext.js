import { createContext, useContext } from "react";

export const IndexCellContext = createContext(null);

export const useIndexCellContext = () => {
  const context = useContext(IndexCellContext);

  if (!context) {
    throw new Error("useIndexCellContext must be used inside IndexCellProvider");
  }

  return context;
};

export const IndexCellProvider = ({ children, value }) => {
  return (
    <IndexCellContext.Provider value={value}>
      {children}
    </IndexCellContext.Provider>
  );
};
