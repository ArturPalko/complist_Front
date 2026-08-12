// import { useSelector } from "react-redux";

// import { useModalWindowContext } from "../../redux/contexts/useConetxt";

// import Login from "../ModalWindows/Login/Login";
// import DeletePositionModal from "./DeletePosition/DeletePosition";
// import EntityModal from "./AddPosition/AddPositions";
// import AddUser from "./AddUser/AddUser";
// import AddMail from "./AddMail/AddMail";
// import AddPhone from "./AddPhone/AddPhone";

// import { CRUD_CONFIG } from "../../configs/app/crudConfig";
// import { entityMap } from "../../configs/app/enitiyMap";

// import {
//   apiAddEntity,
//   apiDeleteEntity,
//   apiEditEntity,
//   addMail,
//   editMail,
// } from "../../dal/api";

// import {
//   activeMenu,
//   isDepartmentsMode,
//   isSectionsMode,
//   selectActiveSectionId,
//   selectAtiveDepartmentId,
// } from "../../redux/selectors/selector";

// import { PHONE_TYPES } from "../../configs/app/constants";
// import { handleDelete, handleSubmit } from "./helpers";

// export default function ModalRoot() {
//   const {
//     modalType,
//     mode,
//     modalData,
//     closeModal,
//   } = useModalWindowContext();

//   const activeDep = useSelector(selectAtiveDepartmentId);
//   const activeSec = useSelector(selectActiveSectionId);
//   const isSections = useSelector(isSectionsMode);
//   const isDep = useSelector(isDepartmentsMode);
//   const menu = useSelector(activeMenu);

//   const isAdd = mode === "add";
//   const isEdit = mode === "edit";
//   const isDelete = mode === "delete";

//   const isPhoneModal = PHONE_TYPES.includes(modalType);

//   const isLotusMenu = menu === "Lotus";
//   const isGovUaMenu = menu === "Gov-ua";
//   const isMailMenu = isLotusMenu || isGovUaMenu;

//   const isMailModal =
//     isMailMenu && modalType === "mailsToUsers";

//   const isUsersContext =
//     (isSections && activeDep && activeSec) ||
//     (isDep && activeDep && !activeSec);
  
//   const config = CRUD_CONFIG[modalType];

//   const onConfirm = () =>
//     handleDelete({
//       isPhoneModal,
//       isMailModal,
//       isUsersContext,
//       modalData,
//       config,
//     });

//   const onSubmit = (data) =>
//     handleSubmit({
//       isAdd,
//       isEdit,
//       isPhoneModal,
//       isMailModal,
//       isUsersContext,
//       data,
//       modalData,
//       menu,
//       config,
//     });
  
//   // ---------------- NO MODAL ----------------

//   if (!modalType) return null;

// // ---------------- LOGIN ----------------

// if (modalType === "login") {
//   return <Login onClose={closeModal} />;
// }

// // ---------------- DELETE ----------------

// if (isDelete) {
//   return (
//     <DeletePositionModal
//       title={config.title}
//       modalData={modalData}
//       onClose={closeModal}
//       onConfirm={onConfirm}
//     />
//   );
// }

// // ---------------- COMMON PROPS ----------------

// const commonProps = {
//   onClose: closeModal,
//   onSubmit,
//   mode,
  
// };

// // ---------------- PHONE ----------------

// if (isPhoneModal) {
//   return (
//     <AddPhone
//       {...commonProps}
//       editValue={isEdit ? modalData : null}
//       modalType={modalType}
//     />
//   );
// }

// // ---------------- MAIL ----------------

// if (isMailModal) {
//   return (
//     <AddMail
//       {...commonProps}
//       editValue={modalData}
//     />
//   );
// }

// // ---------------- USER ----------------
  
// if (isUsersContext && (isAdd || isEdit)) {
//   return (
//     <AddUser
//       {...commonProps}
//       editValue={isEdit ? modalData : null}
//     />
//   );
// }

// // ---------------- DEFAULT ENTITY ----------------

// const entity = entityMap[modalType];

// const editValue = entity?.name
//   ? modalData?.[entity.name] ?? ""
//   : "";

// return (
//   <EntityModal
//     {...commonProps}
//     title={config.title}
//     editValue={editValue}
//   />
// );
// }

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

  const isMailModal =
    isMailMenu &&
    modalType === "mailsToUsers";

  const isUsersContext =
    (isSections && activeDep && activeSec) ||
    (isDep && activeDep && !activeSec);

  console.log("========== MODAL ROOT ==========");
  console.log("menu:", menu);
  console.log("currentMode:", currentMode);
  console.log("modalType:", modalType);
  console.log("mode:", mode);

  console.log("activeDep:", activeDep);
  console.log("activeSec:", activeSec);

  console.log("isDep:", isDep);
  console.log("isSections:", isSections);

  console.log("PHONE_TYPES:", PHONE_TYPES);
  console.log(
    "PHONE_TYPES.includes(currentMode):",
    PHONE_TYPES.includes(currentMode)
  );
  console.log(
    "PHONE_TYPES.includes(modalType):",
    PHONE_TYPES.includes(modalType)
  );

  console.log("isPhoneModal:", isPhoneModal);
  console.log("isDictionaryMode:", isDictionaryMode);
  console.log("isMailMenu:", isMailMenu);
  console.log("isMailModal:", isMailModal);
  console.log("isUsersContext:", isUsersContext);
  console.log("================================");

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

  if (!modalType) {
    console.log("MODAL ROOT: modalType is empty");
    return null;
  }

  if (modalType === "login") {
    console.log("MODAL ROOT -> LOGIN");
    return <Login onClose={closeModal} />;
  }

  if (isDelete) {
    console.log("MODAL ROOT -> DELETE");
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

  if (isPhoneModal) {
    console.log("MODAL ROOT -> ADD PHONE");
    return (
      <AddPhone
        {...commonProps}
        editValue={isEdit ? modalData : null}
        modalType={modalType}
      />
    );
  }

  if (isMailModal) {
    console.log("MODAL ROOT -> ADD MAIL");
    return (
      <AddMail
        {...commonProps}
        editValue={modalData}
      />
    );
  }

  if (isUsersContext && (isAdd || isEdit)) {
    console.log("MODAL ROOT -> ADD USER");
    return (
      <AddUser
        {...commonProps}
        editValue={isEdit ? modalData : null}
      />
    );
  }

  console.log("MODAL ROOT -> ENTITY MODAL");

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