import { useState, useMemo, useEffect } from "react";
import { ModalWindowContext, useDragContext } from "../../contexts/useConetxt";
import { useSelector } from "react-redux";
import { selectPositionsDictionary } from "../../selectors/selector";




export function ModalWindowProvider({ children }) {
  const { selectedIds } = useDragContext();

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);

  // 👇 просто витягуємо name напряму
  const name =
    modalType === "position" && modalData
      ? modalData.positionName
      : null;
debugger
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
      modalType,
      modalData,
      setModalData,
      setModalType,
      openModal,
      closeModal,
      name,
    }),
    [modalType, modalData, name]
  );
debugger
  return (
    <ModalWindowContext.Provider value={value}>
      {children}
    </ModalWindowContext.Provider>
  );
}