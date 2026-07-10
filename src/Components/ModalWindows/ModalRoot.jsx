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
} from "../../dal/api";
import { useSelector } from "react-redux";
import { isSectionsMode, selectActiveSectionId, selectAtiveDepartmentId } from "../../redux/selectors/selector";
import AddUser from "./AddUser/AddUser";

export default function ModalRoot() {
  const { modalType, mode, modalData, closeModal } =
    useModalWindowContext();
  const activeDep = useSelector(selectAtiveDepartmentId);
  const activeSec = useSelector (selectActiveSectionId);
  const isSectiosns = useSelector(isSectionsMode);
debugger
  if(isSectiosns && activeDep && activeSec && mode=="add"){
    debugger
    return <AddUser onClose ={closeModal}/>
  }
         
  // ---------------- NO MODAL ----------------
  if (!modalType) return null;
    if (modalType === "login") {
    return <Login onClose={closeModal} />;
  }

  const config = CRUD_CONFIG[modalType];
           
  if (!config) return null;

  // ---------------- DELETE ----------------
  if (mode === "delete") {
    return (
      <DeletePositionModal
        title={config.title}
        modalData={modalData}
        onClose={closeModal}
        onConfirm={async () => {
          return apiDeleteEntity(config.endpoint, modalData);
        }}
      />
    );
  }

  // ---------------- EDIT VALUE RESOLVE ----------------
  const entity = entityMap[modalType];

  const editValue = entity?.name
    ? modalData?.[entity.name] ?? ""
    : "";
        console.log("DEPR:",modalData)
     
        
        
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