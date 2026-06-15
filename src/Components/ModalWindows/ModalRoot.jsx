import { useModalWindowContext } from "../../redux/contexts/useConetxt";
import { useModal } from "../../redux/hooks/useLoginModal";
import Login from "../ModalWindows/Login/Login";
import AddPositionModal from "./AddPosition/AddPositions";

export default function ModalRoot() {
  const { modal, closeModal } = useModal();
  const {name} = useModalWindowContext();
debugger
  if (!modal) return null;

  switch (modal) {
    case "login":
      return <Login onClose={closeModal} />;

    case "addPosition":
      return <AddPositionModal onClose={closeModal} />;

    case "editPosition":
      return <AddPositionModal onClose={closeModal} editValue = {name} />

    case "deletePosition":
      return <div>Delete modal</div>;

    default:
      return null;
  }
}