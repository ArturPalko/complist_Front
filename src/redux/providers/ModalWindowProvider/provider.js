import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ModalWindowContext, useDragContext } from "../../contexts/useConetxt";

export function ModalWindowProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {selectedIds, setSelectedIds} = useDragContext();


  const query = new URLSearchParams(location.search);
  const urlModal = query.get("modal");

  const [modalType, setModalType] = useState(null);
  const [mode, setMode] = useState(null);
  const [modalData, setModalData] = useState(null);

  // ---------------- OPEN MODAL ----------------
  const openModal = ({ type, mode = null, data = null }) => {
    if(type=="login") return;
    debugger
    setModalType(type);
    setMode(mode);
    setModalData(data);
    debugger

    // sync to URL
    const newQuery = new URLSearchParams(location.search);
    newQuery.set("modal", type);
    debugger
    navigate({ search: newQuery.toString() }, { replace: true });
  };

  // ---------------- CLOSE MODAL ----------------
  const closeModal = () => {
    setModalType(null);
    setMode(null);
    setModalData(null);
    setSelectedIds([])

    const newQuery = new URLSearchParams(location.search);
    newQuery.delete("modal");

      console.log("Current pathname:", location.pathname);
  console.log("Current search:", location.search);
  console.log("New search:", `?${newQuery.toString()}`);
  console.log(
    "Navigate to:",
    `${location.pathname}?${newQuery.toString()}`
  );
    navigate({ search: newQuery.toString() }, { replace: true });
  };

  // ---------------- URL → CONTEXT SYNC ----------------
  useEffect(() => {
    if (!urlModal) {
      setModalType(null);
      setMode(null);
      setModalData(null);
      return;
    }

    // якщо модалка вже відкрита — не пересоздаємо
    if (modalType === urlModal) return;

    setModalType(urlModal);
    setMode(null);
    setModalData(null);
  }, [urlModal]);

  // ---------------- CONTEXT VALUE ----------------
  const value = useMemo(
    () => ({
      modalType,
      mode,
      modalData,

      setModalType,
      setMode,
      setModalData,

      openModal,
      closeModal,
    }),
    [modalType, mode, modalData,     location.pathname,
    location.search]
  );

  return (
    <ModalWindowContext.Provider value={value}>
      {children}
    </ModalWindowContext.Provider>
  );
}