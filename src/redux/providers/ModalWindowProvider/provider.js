import { useState, useMemo, useEffect } from "react";
import { ModalWindowContext, useDragContext } from "../../contexts/useConetxt";
import { useSelector } from "react-redux";
import { selectPositionsDictionary } from "../../selectors/selector";




export function ModalWindowProvider({ children }) {
  const { selectedIds } = useDragContext();

  const [modalType, setModalType] = useState(null);
  const [mode, setMode] = useState(null);
  const [modalData, setModalData] = useState(null);
let name;
  // 👇 просто витягуємо name напряму
  switch (modalType){
    case "positions":
      name = modalData.positionName
      break
    case "userTypes":
      name= modalData.userType
  }
  // const name =
  //   modalType === "positions" && modalData
  //     ? modalData.positionName
  //     : null;
 //debugger
  const openModal = (type, data = null) => {
    setModalType(type);
    setModalData(data);
  };

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

  const value = useMemo(
    () => ({
      mode,
      modalType,
      modalData,
      setMode,
      setModalData,
      setModalType,
      openModal,
      closeModal,
      name,
    }),
    [modalType, modalData, name, mode]
  );
 //debugger
  return (
    <ModalWindowContext.Provider value={value}>
      {children}
    </ModalWindowContext.Provider>
  );
}