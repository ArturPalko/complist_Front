import { useModalWindowContext } from "../../redux/contexts/useConetxt";

import Login from "../ModalWindows/Login/Login";
import DeletePositionModal from "./DeletePosition/DeletePosition";
import EntityModal from "./AddPosition/AddPositions";

import { CRUD_CONFIG } from "../../configs/app/crudConfig";
import { entityMap } from "../../configs/app/enitiyMap";

import {
  apiAddEntity,
  apiDeleteEntity,
  apiEditEntity,
  deleteUser,
  apiEditUser,
  addUser,
  deleteMail,
  addMail,
  editMail,
  addPhone,
  deletePhone,
  editPhone

} from "../../dal/api";
import { useSelector } from "react-redux";
import { activeMenu, isDepartmentsMode, isSectionsMode, selectActiveSectionId, selectAtiveDepartmentId } from "../../redux/selectors/selector";
import AddUser from "./AddUser/AddUser";
import AddMail from "./AddMail/AddMail";
import { PHONE_TYPES } from "../Content/Tables/PhonesTable/PhonesTable";
import AddPhone from "./AddPhone/AddPhone";
;

export default function ModalRoot() {
  const { modalType, mode, modalData, closeModal } =
    useModalWindowContext();
  const activeDep = useSelector(selectAtiveDepartmentId);
  const activeSec = useSelector (selectActiveSectionId);
  const isSectiosns = useSelector(isSectionsMode);
  const isDep = useSelector(isDepartmentsMode)
  const menu = useSelector(activeMenu);
  
  const config = CRUD_CONFIG[modalType];
debugger
const handleDelete = async () => {
    debugger 

  if (PHONE_TYPES.includes(modalType) && mode == "delete"){
    deletePhone(modalData)
    return
  }




  if((menu == "Lotus" || menu == "Gov-ua")  && mode == "delete"){
    let a = modalData;
         
       deleteMail(modalData)
       
    return 
    
  }
  


  if (
    (
      isSectiosns &&
      activeDep &&
      activeSec &&
      mode === "delete"
    ) ||
    (
      isDep &&
      activeDep &&
      !activeSec &&
      mode === "delete"
    )
  ) {
    return deleteUser(modalData);
  }

  return apiDeleteEntity(config.endpoint, modalData);
};
   
debugger
  if (PHONE_TYPES.includes(modalType) && mode != "delete"){
    debugger
    return <AddPhone onClose={closeModal} editValue={mode === "edit" ? modalData : null} modalType={modalType} onSubmit={async (data) => {
        debugger
      if (mode === "add") {
          console.log("DEPR:", modalData);
          debugger
        
          return addPhone(data);
        }

        if (mode === "edit") {
          return editPhone(data);
        }
      }}/>
  }

console.log({ menu, modalType })
if (
    ((menu === "Lotus" || menu === "Gov-ua")  && modalType === "mailsToUsers")
   &&
  mode !== "delete"
) {
  return (
    <AddMail
      editValue={modalData}
      onClose={closeModal}
      onSubmit={async (data) => {
        if (mode === "add") {
          console.log("DEPR:", modalData);

          return addMail(data, menu);
        }

        if (mode === "edit") {
          return editMail(data);
        }
      }}
    />
  );
}
   
if (
  (
    isSectiosns &&
    activeDep &&
    activeSec &&
    (mode === "add" || mode === "edit")
  ) ||
  (
    isDep &&
    activeDep &&
    !activeSec &&
    (mode === "add" || mode === "edit")
  )
) {
  return (
   <AddUser
  onClose={closeModal}
  mode={mode}
  editValue={mode === "edit" ? modalData : null}
  onSubmit={async (data) => {
    if (mode === "add") {
      return addUser(data);
    }

    if (mode === "edit") {
      return apiEditUser({
        id: modalData.id,
        ...data,
      });
    }
  }}
/>
  );
}
         
  // ---------------- NO MODAL ----------------
  if (!modalType) return null;
    if (modalType === "login") {
    return <Login onClose={closeModal} />;
  }


           
  // if (!config) return null;
   
  // ---------------- DELETE ----------------
  if (mode === "delete") {
    return (
     <DeletePositionModal
        title={config.title}
        modalData={modalData}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
    );
  }

  // ---------------- EDIT VALUE RESOLVE ----------------
  const entity = entityMap[modalType];

  const editValue = entity?.name
    ? modalData?.[entity.name] ?? ""
    : "";
        console.log("DEPR:",modalData)
     
        
    debugger    
  // ---------------- ADD / EDIT ----------------
  return (
    <EntityModal
      title={config.title}
      onClose={closeModal}
      editValue={editValue}
      mode={mode}
      onSubmit={async (data) => {
        // ADD
        if (mode === "add") {
               console.log("DEPR:",modalData)
                   
          const payload = config.mappers.add(data, modalData);
                   
          return apiAddEntity(config.endpoint, payload);
        }

        // EDIT
        if (mode === "edit") {
          const payload = config.mappers.edit(data, modalData);
          return apiEditEntity(config.endpoint, payload);
        }
      }}
    />
  );
}