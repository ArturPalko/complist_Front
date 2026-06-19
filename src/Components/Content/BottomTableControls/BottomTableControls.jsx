import React from "react";
import s from "./BottomTableControls.module.css";
import { useDispatch, useSelector } from "react-redux";
import arrangementIcon from "../../../assets/Img/arrange.png";

import {
  isSectionsMode,
  isDepartmentsMode,
  isPositionsMode,
  isUserTypesMode,
} from "../../../redux/selectors/selector";

import { setPhonesViewMode } from "../../../redux/reducers/ui-reducer";

import {
  setUnsavedOrder,
  clearUnsavedOrder,
} from "../../../redux/reducers/ui-reducer";

import { changeOrderOfDisplayElements } from "../../../dal/api";
import { setDataIsLoadedActionCreator } from "../../../redux/reducers/app-reducer";

const BottomTableControls = () => {
  const dispatch = useDispatch();

  const isSections = useSelector(isSectionsMode);
  const isDepartments = useSelector(isDepartmentsMode);
  const isPosition = useSelector(isPositionsMode);
  const isUserTypes = useSelector(isUserTypesMode);

  const unsavedOrder = useSelector(
    (state) => state.ui.unsavedOrder
  );

  // 🚀 SAVE LOGIC
const handleSave = async () => {
  if (!unsavedOrder) return;

  try {
    await changeOrderOfDisplayElements(
      unsavedOrder.payload,
      unsavedOrder.menu,
      unsavedOrder.depId,
      unsavedOrder.currentMode
    );

    dispatch(clearUnsavedOrder());
    dispatch(setDataIsLoadedActionCreator(false, unsavedOrder.menu));

  } catch (error) {
    console.error("Save failed:", error);
    alert("❌ Не вдалося зберегти зміни. Спробуйте ще раз.");
  }
};

  return (
    <div className={s.controlsWrapper}>
      
      {/* LEFT SIDE */}
      <div className={s.leftGroup}>
        <button
          className={`${s.toggleBtn} ${isSections ? s.active : ""}`}
          onClick={() => dispatch(setPhonesViewMode("sections"))}
        >
          Секції
        </button>

        <button
          className={`${s.toggleBtn} ${isDepartments ? s.active : ""}`}
          onClick={() => dispatch(setPhonesViewMode("departments"))}
        >
          Департаменти
        </button>

        <button
          className={`${s.toggleBtn} ${isPosition ? s.active : ""}`}
          onClick={() => dispatch(setPhonesViewMode("positions"))}
        >
          Посади
        </button>

        <button
          className={`${s.toggleBtn} ${isUserTypes ? s.active : ""}`}
          onClick={() => dispatch(setPhonesViewMode("userTypes"))}
        >
          Тип користувача
        </button>
      </div>

      {/* RIGHT SIDE (SAVE) */}
      <div className={s.rightGroup}>
        <button
          title="Зберегти порядок"
          aria-label="Зберегти порядок"
          className={s.saveBtn}
          onClick={handleSave}
          disabled={!unsavedOrder}
        >
          <img
            src={arrangementIcon}
            alt=""
            className={s.icon}
          />
          <span>Зберегти</span>
        </button>
      </div>

    </div>
  );
};

export default BottomTableControls;