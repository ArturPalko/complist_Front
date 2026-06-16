import { useSearchToggle, usePasswordsToggle, useEditModeToggle, useModalWindowContext } from "../contexts/useConetxt.js";
import { pageConfigs } from "../../configs/app/pageConfig.js";
import { useSelector } from "react-redux";
import { isUserAuthed } from "../selectors/selector.js";
import { useModal } from "./useLoginModal.js";
import { deletePosition as deletePos } from "../../dal/api.js";
import { selectPositionsDictionary } from "../selectors/selector.js";
import { useDragContext } from "../contexts/useConetxt.js";


export const useTopTableBarLogic = (pageName) => {
  const { openModal } = useModal();

  const { selectedIds } = useDragContext();
  const{setModalData, setModalType ,setMode}=useModalWindowContext();
  const positions = useSelector(selectPositionsDictionary);

  const { handleToggleSearchField, valueOfSearchCheckBox } = useSearchToggle();
  const { valueOfpasswordCheckbox, handleTogglePasswords } = usePasswordsToggle();
  const { valueOfEditCheckbox, handleToggleEditMode } = useEditModeToggle();

  const isLoggedIn = useSelector(isUserAuthed);

  const addPosition = () => {
      setMode("add")
          setModalType ("position")
            setModalData([]);
    openModal("addPosition");
    debugger
  };

  const deletePosition = () => {
    if (!selectedIds?.length) return;
    setMode("delete")
    // deletePos(selectedIds);
      setModalType ("position")
    setModalData(selectedIds);
    openModal("deletePosition");
  };

  const editPosition = () => {
    if (!selectedIds?.length) return;

    const id = selectedIds[0];

    const position = positions
      .flatMap(p => p.rows)
      .find(r => r.id === selectedIds[0]);

    setMode("edit")
    setModalType ("position")
    debugger
    setModalData(position);
    
    openModal("editPosition");
  };

  const config = pageConfigs[pageName] || {};

  return {
    valueOfSearchCheckBox,
    valueOfpasswordCheckbox,
    valueOfEditCheckbox,

    handleToggleSearchField,
    handleTogglePasswords,
    handleToggleEditMode,

    showSearchToggle: config.showSearchToggle || false,
    showPasswordsToggle: config.showPasswordsToggle && isLoggedIn || false,
    showEditToggle: true,

    addPosition,
    editPosition,
    deletePosition,
  };
};
