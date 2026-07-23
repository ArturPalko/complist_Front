import s from "./DeletePosition.module.css"
import { useDispatch, useSelector } from "react-redux";
import { fetchDictionariesThunk } from "../../../dal/api";
import { useModalWindowContext } from "../../../redux/contexts/useConetxt";
import { setDataIsLoadedActionCreator } from "../../../redux/reducers/app-reducer";
import { activeMenu } from "../../../redux/selectors/selector";

export default function DeletePositionModal({ onClose, onConfirm, modalData }) {
  const dispatch = useDispatch();
 const {modalType} = useModalWindowContext()
 const menu = useSelector(activeMenu);
   
  const handleDelete = async () => {
    console.log("MODALTYPE:", modalType)
       
    await onConfirm(modalData); // ids
        if(modalType == "mailsToUsers"){
         dispatch(setDataIsLoadedActionCreator(false, menu))
        }
        else{
              dispatch(fetchDictionariesThunk());
        }
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