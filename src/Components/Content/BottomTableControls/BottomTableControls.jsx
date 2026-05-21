import React from "react";
import s from "./BottomTableControls.module.css";
import { useDragContext } from "../../../redux/contexts/useConetxt";
import { useDispatch, useSelector } from "react-redux";
import { togglePhonesViewMode } from "../../../redux/reducers/ui-reducer";
import { isSectionsMode } from "../../../redux/selectors/selector";

const BottomTableControls = () => {
const dispatch = useDispatch();
const isSections = useSelector(isSectionsMode);
  return (
    <div className={s.controlsWrapper}>
      <button
        className={`${s.toggleBtn} ${
          isSections ? s.active : ""
        }`}
        onClick={() => dispatch(togglePhonesViewMode())}
      >
        Секції
      </button>
    </div>
  );
};

export default BottomTableControls;