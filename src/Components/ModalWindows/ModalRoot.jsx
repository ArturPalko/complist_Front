import { addPosition, deletePosition, editPosition } from "../../dal/api";
import { useModalWindowContext } from "../../redux/contexts/useConetxt";
import { useModal } from "../../redux/hooks/useLoginModal";
import Login from "../ModalWindows/Login/Login";
import DeletePositionModal from "./DeletePosition/DeletePosition";
import { CRUD_CONFIG } from "../../configs/app/crudConfig";
import EntityModal from "./AddPosition/AddPositions";
import { apiAddEntity, apiDeleteEntity, apiEditEntity } from "../../dal/api";





export default function ModalRoot() {
  const { modal, closeModal } = useModal();
  const { modalType, mode, modalData , name} = useModalWindowContext();
//debugger
  if (!modal) return null;

  const config = CRUD_CONFIG[modalType];
  if (!config) return null;

  // LOGIN
  if (modal === "login") {
    return <Login onClose={closeModal} />;
  }

  // DELETE
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

  // ADD / EDIT
  return (
    <EntityModal
      title={config.title}
      onClose={closeModal}
      editValue={name}
      mode={mode}
      onSubmit={async (data) => {
        // 🔥 ADD
        //debugger
        if (mode === "add") {
          const payload = config.mappers.add(data);
          //debugger
          return apiAddEntity(config.endpoint, payload);
        }

        // 🔥 EDIT
        if (mode === "edit") {
          const payload = config.mappers.edit(data, modalData);
          return apiEditEntity(config.endpoint, payload);
        }
      }}
    />
  );
}