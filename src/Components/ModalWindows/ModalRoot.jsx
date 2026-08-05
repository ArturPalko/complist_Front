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
  apiAddEntity,
  apiDeleteEntity,
  apiEditEntity,
  addMail,
  editMail,
} from "../../dal/api";

import {
  activeMenu,
  isDepartmentsMode,
  isSectionsMode,
  selectActiveSectionId,
  selectAtiveDepartmentId,
} from "../../redux/selectors/selector";

import { PHONE_TYPES } from "../../configs/app/constants";
import { handleDelete, handleSubmit } from "./helpers";

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
  const menu = useSelector(activeMenu);

  const isAdd = mode === "add";
  const isEdit = mode === "edit";
  const isDelete = mode === "delete";

  const isPhoneModal = PHONE_TYPES.includes(modalType);

  const isLotusMenu = menu === "Lotus";
  const isGovUaMenu = menu === "Gov-ua";
  const isMailMenu = isLotusMenu || isGovUaMenu;

  const isMailModal =
    isMailMenu && modalType === "mailsToUsers";

  const isUsersContext =
    (isSections && activeDep && activeSec) ||
    (isDep && activeDep && !activeSec);
debugger
  const config = CRUD_CONFIG[modalType];

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
      isMailModal,
      isUsersContext,
      data,
      modalData,
      menu,
      config,
    });
debugger
  // ---------------- NO MODAL ----------------

  if (!modalType) return null;

// ---------------- LOGIN ----------------

if (modalType === "login") {
  return <Login onClose={closeModal} />;
}

// ---------------- DELETE ----------------

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

// ---------------- COMMON PROPS ----------------

const commonProps = {
  onClose: closeModal,
  onSubmit,
  mode,
  
};

// ---------------- PHONE ----------------

if (isPhoneModal) {
  return (
    <AddPhone
      {...commonProps}
      editValue={isEdit ? modalData : null}
      modalType={modalType}
    />
  );
}

// ---------------- MAIL ----------------

if (isMailModal) {
  return (
    <AddMail
      {...commonProps}
      editValue={modalData}
    />
  );
}

// ---------------- USER ----------------
debugger
if (isUsersContext && (isAdd || isEdit)) {
  return (
    <AddUser
      {...commonProps}
      editValue={isEdit ? modalData : null}
    />
  );
}

// ---------------- DEFAULT ENTITY ----------------

const entity = entityMap[modalType];

const editValue = entity?.name
  ? modalData?.[entity.name] ?? ""
  : "";

return (
  <EntityModal
    {...commonProps}
    title={config.title}
    editValue={editValue}
  />
);
}