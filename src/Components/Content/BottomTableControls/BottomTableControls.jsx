import React from "react";
import s from "./BottomTableControls.module.css";
import { useDragContext } from "../../../redux/contexts/useConetxt";
import { useDispatch, useSelector } from "react-redux";
// import { togglePhonesViewMode } from "../../../redux/reducers/ui-reducer";
import { isSectionsMode, isDepartmentsMode, isPositionsMode, isUserTypesMode } from "../../../redux/selectors/selector";
import { setPhonesViewMode } from "../../../redux/reducers/ui-reducer";
import { getPositionsAndTypesOfUsers } from "../../../redux/selectors/selector";

const BottomTableControls = () => {
const dispatch = useDispatch();
const isSections = useSelector(isSectionsMode);
const isDepartments = useSelector(isDepartmentsMode);
const isPosition = useSelector(isPositionsMode);
const isUserTypes = useSelector(isUserTypesMode)

  return (
    <div className={s.controlsWrapper}>
      <button
        className={`${s.toggleBtn} ${
          isSections ? s.active : ""
        }`}
        onClick={() => dispatch(setPhonesViewMode("sections"))}
      >
        Секції
      </button>

       <button
        className={`${s.toggleBtn} ${
          isDepartments ? s.active : ""
        }`}
        onClick={() => dispatch(setPhonesViewMode("departments"))}
      >
        Департаменти
      </button>
        <button
        className={`${s.toggleBtn} ${
          isPosition ? s.active : ""
        }`}
        onClick={() => dispatch(setPhonesViewMode("positions"))}
      >
        Посади
      </button>

       <button
        className={`${s.toggleBtn} ${
          isUserTypes ? s.active : ""
        }`}
        onClick={() => dispatch(setPhonesViewMode("userTypes"))}
      >
        Тип користувача
      </button>
      
    </div>
  );
};

export default BottomTableControls;