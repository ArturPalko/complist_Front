import s from "./DeletePosition.module.css"
import { useDispatch } from "react-redux";
import { fetchDictionariesThunk } from "../../../dal/api";

export default function DeletePositionModal({ onClose, onConfirm, modalData }) {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    await onConfirm(modalData); // ids
    dispatch(fetchDictionariesThunk());
    onClose();
  };

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <h2>Підтвердження видалення</h2>

        <p>Видалити {modalData.length} елемент(ів)?</p>

        <div>
          <button onClick={onClose}>Скасувати</button>
          <button onClick={handleDelete}>Видалити</button>
        </div>
      </div>
    </div>
  );
}