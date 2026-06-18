import { useSearchToggle, usePasswordsToggle, useEditModeToggle, useModalWindowContext } from "../contexts/useConetxt.js";
import { pageConfigs } from "../../configs/app/pageConfig.js";
import { useSelector } from "react-redux";
import { getCurrentMode, isUserAuthed, selectDictionaryByType } from "../selectors/selector.js";
import { useModal } from "./useLoginModal.js";
import { deletePosition as deletePos } from "../../dal/api.js";
import { selectPositionsDictionary } from "../selectors/selector.js";
import { useDragContext } from "../contexts/useConetxt.js";


export const useTopTableBarLogic = (pageName) => {
  const { openModal } = useModal();

  const { selectedIds } = useDragContext();
  const{setModalData, setModalType ,setMode}=useModalWindowContext();
  // const positions = useSelector(selectPositionsDictionary);


  const { handleToggleSearchField, valueOfSearchCheckBox } = useSearchToggle();
  const { valueOfpasswordCheckbox, handleTogglePasswords } = usePasswordsToggle();
  const { valueOfEditCheckbox, handleToggleEditMode } = useEditModeToggle();
  const modalType = useSelector(getCurrentMode);
    const value = useSelector(selectDictionaryByType(modalType));

  const isLoggedIn = useSelector(isUserAuthed);

  const addPosition = () => {
      setMode("add")
          setModalType (modalType)
          //debugger
            setModalData([]);
    openModal("addPosition");
    //debugger
  };

  const deletePosition = () => {
    if (!selectedIds?.length) return;
    setMode("delete")
    // deletePos(selectedIds);
      setModalType (modalType)
    setModalData(selectedIds);
    openModal("deletePosition");
  };

  const editPosition = () => {
    if (!selectedIds?.length) return;

    const id = selectedIds[0];

    // const position = positions
    //   .flatMap(p => p.rows)
    //   .find(r => r.id === selectedIds[0]);
       const position = value
      .flatMap(p => p.rows)
      .find(r => r.id === selectedIds[0]);

    setMode("edit")
    setModalType (modalType)
    //debugger
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
