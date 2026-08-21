import { useSelector } from "react-redux";

import { useModalWindowContext } from "../../redux/contexts/useConetxt";

import Login from "../ModalWindows/Login/Login";
import DeletePositionModal from "./DeletePosition/DeletePosition";
import EntityModal from "./AddPosition/AddPositions";
import AddUser from "./AddUser/AddUser";
import AddMail from "./AddMail/AddMail";
import AddPhone from "./AddPhone/AddPhone";

import { CRUD_CONFIG } from "../../configs/app/crudConfig";
import { entityMap } from "../../configs/app/enitiyMap";

import {
  activeMenu,
  getCurrentMode,
  isDepartmentsMode,
  isSectionsMode,
  selectActiveSectionId,
  selectAtiveDepartmentId,
  selectDictionaryByType
} from "../../redux/selectors/selector";

import { PHONE_TYPES } from "../../configs/app/constants";
import { handleDelete, handleSubmit } from "./helpers";
import BindPhonesToUser from "./BindPhonesToUser/BindPhonesToUser";

export default function ModalRoot() {
  const {
    modalType,
    mode,
    modalData,
    closeModal,
  } = useModalWindowContext();

  const activeDep = useSelector(selectAtiveDepartmentId);
  const activeSec = useSelector(selectActiveSectionId);
  const isSections = useSelector(isSectionsMode);
  const isDep = useSelector(isDepartmentsMode);
  const currentMode = useSelector(getCurrentMode);
  const menu = useSelector(activeMenu);

  const isAdd = mode === "add";
  const isEdit = mode === "edit";
  const isDelete = mode === "delete";

  const isPhoneModal = PHONE_TYPES.includes(modalType);

  const isDictionaryMode =
    isDep ||
    isSections ||
    currentMode === "positions" ||
    currentMode === "userTypes" ||
    PHONE_TYPES.includes(currentMode);

  const isMailMenu =
    (menu === "Lotus" || menu === "Gov-ua") &&
    !isDictionaryMode;

  const isPhonesMenu = menu == "phones";

  const isMailModal =
    isMailMenu &&
    modalType === "mailsToUsers";

  const isUsersContext =
    (isSections && activeDep && activeSec) ||
    (isDep && activeDep && !activeSec);

  
  const isBindPhonesModal = isPhonesMenu && modalType == "phonesToUsers";

  const config = CRUD_CONFIG[modalType];
  

   const departments = useSelector(
      selectDictionaryByType("departments")
    );



  const onConfirm = () =>
    handleDelete({
      isPhoneModal,
      isMailModal,
      isUsersContext,
      modalData,
      config,
    });

  const onSubmit = (data) =>
    handleSubmit({
      isAdd,
      isEdit,
      isPhoneModal,
      isBindPhonesModal,
      isMailModal,
      isUsersContext,
      data,
      modalData,
      menu,
      config,
    });

  if (!modalType) {
    return null;
  }

  if (modalType === "login") {
    return <Login onClose={closeModal} />;
  }

  if (isDelete) {
    return (
      <DeletePositionModal
        title={config.title}
        modalData={modalData}
        onClose={closeModal}
        onConfirm={onConfirm}
      />
    );
  }

  const commonProps = {
    onClose: closeModal,
    onSubmit,
    mode,
  };

  if(isBindPhonesModal){
    return (<BindPhonesToUser onSubmit={onSubmit} deprs={departments}  onClose={closeModal}/>)
  }

  if (isPhoneModal) {
    return (
      <AddPhone
        {...commonProps}
        editValue={isEdit ? modalData : null}
        modalType={modalType}
      />
    );
  }

  if (isMailModal) {
    return (
      <AddMail
        {...commonProps}
        editValue={modalData}
      />
    );
  }

  if (isUsersContext && (isAdd || isEdit)) {
    debugger
    return (
      <AddUser
        {...commonProps}
        editValue={isEdit ? modalData : null}
      />
    );
  }

const entityTypeMap = {
  positions: "position",
  departments: "department",
  sections: "section",
  userTypes: "userType",
};

const entityType = entityTypeMap[modalType] ?? modalType;
const entity = entityMap[entityType];

const editValue = isEdit
  ? modalData?.[entity?.name] ?? modalData?.name ?? ""
  : "";
debugger
  return (
    <EntityModal
      {...commonProps}
      title={config.title}
      editValue={editValue}
    />
  );
}