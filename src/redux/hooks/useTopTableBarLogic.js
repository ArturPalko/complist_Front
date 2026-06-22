import { useSearchToggle, usePasswordsToggle, useEditModeToggle, useModalWindowContext } from "../contexts/useConetxt.js";
import { pageConfigs } from "../../configs/app/pageConfig.js";
import { useSelector } from "react-redux";
import { getCurrentMode, isUserAuthed, selectAtiveDepartmentId, selectDictionaryByType, selectSectionsById } from "../selectors/selector.js";
import { useModal } from "./useLoginModal.js";
import { deletePosition as deletePos } from "../../dal/api.js";
import { selectPositionsDictionary } from "../selectors/selector.js";
import { useDragContext } from "../contexts/useConetxt.js";


export const useTopTableBarLogic = (pageName) => {
  const { openModal } = useModal();
let depr = useSelector(selectAtiveDepartmentId);

  const { selectedIds } = useDragContext();
  const{setModalData, setModalType ,setMode}=useModalWindowContext();
 const positions = useSelector(selectPositionsDictionary);
 const sections = useSelector(selectSectionsById(depr))
 debugger


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
          if(modalType == "sections"){
            debugger
        setModalData({departmentId:depr})
        debugger
      }
      else{
        setModalData([]);
      }
            
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
let position;
  const editPosition = () => {
    debugger
    if (!selectedIds?.length) return;

    const id = selectedIds[0];
   if(modalType == "departments"){
        position = value
      .flatMap(p => p.rows)
      .find(r => r.departmentId === selectedIds[0]);
   }
    if(modalType == "positions"){
    //  position = positions
    //   .flatMap(p => p.rows)
    //   .find(r => r.id === selectedIds[0]);
      let a = positions
      .flatMap(p => p.rows)
      position = a.find(r => r.id === selectedIds[0]);
   }

    if(modalType == "sections"){
     position = sections
      .flatMap(p => p.rows)
      .find(r => r.sectionId === selectedIds[0]);
   }
   debugger
      debugger
    setMode("edit")
    setModalType (modalType)
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
