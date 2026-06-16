import { addPosition, deletePosition, editPosition } from "../../dal/api";
import { useModalWindowContext } from "../../redux/contexts/useConetxt";
import { useModal } from "../../redux/hooks/useLoginModal";
import Login from "../ModalWindows/Login/Login";
import AddPositionModal from "./AddPosition/AddPositions";
import DeletePositionModal from "./DeletePosition/DeletePosition";

export default function ModalRoot() {
  const { modal, closeModal } = useModal();
  const {name, mode, modalData} = useModalWindowContext();
debugger
  if (!modal) return null;

  switch (modal) {
    case "login":
      return <Login onClose={closeModal} />;

    case "addPosition":
      return <AddPositionModal onClose={closeModal}  editValue = {name} onSubmit={addPosition} mode = {mode} modalData = {modalData} />;

    case "editPosition":
      return <AddPositionModal onClose={closeModal} editValue = {name} onSubmit = {editPosition} mode = {mode} modalData = {modalData}/>

   case "deletePosition":
      return (
        <DeletePositionModal
          onClose={closeModal}
          onConfirm={deletePosition}
          modalData={modalData}
        />
      );

    default:
      return null;
  }
}