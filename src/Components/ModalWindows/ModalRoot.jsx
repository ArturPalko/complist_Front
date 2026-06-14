import { useModal } from "../../redux/hooks/useLoginModal";
import Login from "../ModalWindows/Login/Login";
import AddPositionModal from "./AddPosition/AddPositions";

export default function ModalRoot() {
  const { modal, closeModal } = useModal();

  if (!modal) return null;

  switch (modal) {
    case "login":
      return <Login onClose={closeModal} />;

    case "addPosition":
      return <AddPositionModal onClose={closeModal} />;

    case "editPosition":
      return <div>Edit modal</div>;

    case "deletePosition":
      return <div>Delete modal</div>;

    default:
      return null;
  }
}