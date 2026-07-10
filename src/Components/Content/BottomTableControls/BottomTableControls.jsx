import React, { useState } from "react";
import s from "./BottomTableControls.module.css";
import { useDispatch, useSelector } from "react-redux";
import arrangementIcon from "../../../assets/Img/arrange.png";
import humanPng from "../../../assets/Img/human.png";
import {
  isSectionsMode,
  isDepartmentsMode,
  isPositionsMode,
  isUserTypesMode,
  getCurrentMode,
  addUsersModeSelected,
  selectAtiveDepartmentId,
} from "../../../redux/selectors/selector";

import {
  setPhonesViewMode,
  clearUnsavedOrder,
  toggleaddUsersMode
} from "../../../redux/reducers/ui-reducer";

import { changeOrderOfDisplayElements } from "../../../dal/api";
import { setDataIsLoadedActionCreator } from "../../../redux/reducers/app-reducer";

const BottomTableControls = () => {
  const dispatch = useDispatch();

  const isSections = useSelector(isSectionsMode);
  const activeDep = useSelector(selectAtiveDepartmentId);
  const isDepartments = useSelector(isDepartmentsMode);
  const isPosition = useSelector(isPositionsMode);
  const isUserTypes = useSelector(isUserTypesMode);
  const mode = useSelector(getCurrentMode);
  const isAddUsers = useSelector(addUsersModeSelected);

  const phoneTypes = ["landline", "internal", "cisco"];

  const selectedPhoneType = phoneTypes.includes(mode)
    ? mode
    : "";

  const unsavedOrder = useSelector(
    (state) => state.ui.unsavedOrder
  );


  const showAddUsersToggle =
    (isSections && activeDep)  || isDepartments;

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

      dispatch(
        setDataIsLoadedActionCreator(
          false,
          unsavedOrder.menu
        )
      );
    } catch (error) {
      console.error("Save failed:", error);
      alert(
        "❌ Не вдалося зберегти зміни. Спробуйте ще раз."
      );
    }
  };

  return (
    <div className={s.controlsWrapper}>
      {/* LEFT */}
      <div className={s.leftGroup}>
        <div className={s.sectionGroup}>
          <div
            className={`${s.addUsersToggle} ${
              !showAddUsersToggle ? s.hidden : ""
            }`}
            onClick={() =>
              // showAddUsersToggle &&
              // setAddUsersMode((v) => !v);
              dispatch(toggleaddUsersMode())
            }
            title="Додавання користувачів"
          >
            <div
              className={`${s.addUsersLine} ${
                isAddUsers
                  ? s.addUsersLineActive
                  : ""
              }`}
            >
              <div className={s.addUsersThumb}>
  <img
    src={humanPng}
    alt=""
    className={s.addUsersIcon}
  />
</div>
            </div>
          </div>

          <div className={s.sectionButtons}>
            <button
              className={`${s.toggleBtn} ${
                isSections ? s.active : ""
              }`}
              onClick={() =>
                dispatch(
                  setPhonesViewMode("section")
                )
              }
            >
              Секції
            </button>

            <button
              className={`${s.toggleBtn} ${
                isDepartments ? s.active : ""
              }`}
              onClick={() =>
                dispatch(
                  setPhonesViewMode("department")
                )
              }
            >
              Департаменти
            </button>
          </div>
        </div>

        <button
          className={`${s.toggleBtn} ${
            isPosition ? s.active : ""
          }`}
          onClick={() =>
            dispatch(setPhonesViewMode("position"))
          }
        >
          Посади
        </button>

        <button
          className={`${s.toggleBtn} ${
            isUserTypes ? s.active : ""
          }`}
          onClick={() =>
            dispatch(setPhonesViewMode("userType"))
          }
        >
          Тип користувача
        </button>

        <select
          className={`${s.toggleBtn} ${
            selectedPhoneType ? s.active : ""
          }`}
          value={selectedPhoneType}
          onChange={(e) =>
            dispatch(
              setPhonesViewMode(
                e.target.value || null
              )
            )
          }
        >
          <option value="">
            — Тип телефона —
          </option>
          <option value="landline">
            Landline
          </option>
          <option value="internal">
            Internal
          </option>
          <option value="cisco">
            Cisco
          </option>
        </select>
      </div>

      {/* RIGHT */}
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