import React from "react";
import s from "./BottomTableControls.module.css";
import arrangementIcon from "../../../assets/Img/arrange.png";
import humanPng from "../../../assets/Img/human.png";

const BottomTableControlsView = ({
  showAddUsersToggle,
  isAddUsers,

  isSections,
  isDepartments,
  isPosition,
  isUserTypes,

  selectedPhoneType,
  unsavedOrder,

  onToggleAddUsers,
  onOpenMode,
  onSave,
}) => {
  return (
    <div className={s.controlsWrapper}>
      {/* LEFT */}
      <div className={s.leftGroup}>
        <div className={s.sectionGroup}>
          <div
            className={`${s.addUsersToggle} ${
              !showAddUsersToggle ? s.hidden : ""
            }`}
            onClick={onToggleAddUsers}
            title="Додавання користувачів"
          >
            <div
              className={`${s.addUsersLine} ${
                isAddUsers ? s.addUsersLineActive : ""
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
              onClick={() => onOpenMode("sections")}
            >
              Секції
            </button>

            <button
              className={`${s.toggleBtn} ${
                isDepartments ? s.active : ""
              }`}
              onClick={() => onOpenMode("departments")}
            >
              Департаменти
            </button>
          </div>
        </div>

        <button
          className={`${s.toggleBtn} ${
            isPosition ? s.active : ""
          }`}
          onClick={() => onOpenMode("positions")}
        >
          Посади
        </button>

        <button
          className={`${s.toggleBtn} ${
            isUserTypes ? s.active : ""
          }`}
          onClick={() => onOpenMode("userTypes")}
        >
          Тип користувача
        </button>

        <select
          className={`${s.toggleBtn} ${
            selectedPhoneType ? s.active : ""
          }`}
          value={selectedPhoneType}
          onChange={(e) =>
            onOpenMode(e.target.value || null)
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
          onClick={onSave}
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

export default BottomTableControlsView;