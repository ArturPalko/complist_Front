import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDictionariesThunk, addUser } from "../../../dal/api";
import s from "./AddUser.module.css";

import {
  selectActiveSectionId,
  selectAtiveDepartmentId,
  selectDictionaryByType,
  selectPositionsDictionary,
} from "../../../redux/selectors/selector";

export default function AddUser({
  onClose,
  mode,
  editValue,
  onSubmit
}) {
  const dispatch = useDispatch();

  const departmentId = useSelector(selectAtiveDepartmentId);
  const sectionId = useSelector(selectActiveSectionId);

  const [fullName, setFullName] = useState("");
  const [positionId, setPositionId] = useState("");
  const [userTypeId, setUserTypeId] = useState("");

  const positions = useSelector(selectPositionsDictionary).flatMap(
    element => element.rows
  );

  const userTypes = useSelector(selectDictionaryByType("userTypes")).flatMap(
    element => element.rows
  );

  const defaultUserType = useMemo(
    () => userTypes.find(type => type.userType === "Користувач"),
    [userTypes]
  );

  // Значення за замовчуванням для Add
  useEffect(() => {
    if (mode === "add" && defaultUserType && userTypeId === "") {
      setUserTypeId(defaultUserType.id);
    }
  }, [mode, defaultUserType, userTypeId]);

  // Автозаповнення для Edit
  useEffect(() => {
    if (!editValue) return;

    setFullName(editValue.name ?? "");
    setPositionId(editValue.positionId ?? "");
    setUserTypeId(editValue.userTypeId ?? "");
  }, [editValue]);

  const handleCancel = () => {
    setFullName("");
    setPositionId("");
    setUserTypeId(defaultUserType?.id ?? "");
    onClose?.();
  };

const handleSave = async () => {
  const saveData = {
    name: fullName.trim(),
    positionId,
    userTypeId,
    departmentId,
    sectionId,
  };

  try {
       
    await onSubmit(saveData);
    onClose?.();
  } finally {
    dispatch(fetchDictionariesThunk());
  }
};

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <h2>{mode === "edit" ? "Редагувати користувача" : "Додати користувача"}</h2>

        <div className={s.field}>
          <label className={s.label}>ПІБ</label>

          <input
            className={s.input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className={s.field}>
          <label className={s.label}>Посада</label>

          <select
            className={s.input}
            value={positionId}
            onChange={(e) => setPositionId(Number(e.target.value))}
          >
            <option value="">Оберіть</option>

            {positions.map(position => (
              <option
                key={position.id}
                value={position.id}
              >
                {position.positionName}
              </option>
            ))}
          </select>
        </div>

        <div className={s.field}>
          <label className={s.label}>Тип користувача</label>

          <select
            className={s.input}
            value={userTypeId}
            onChange={(e) => setUserTypeId(Number(e.target.value))}
          >
            {userTypes.map(type => (
              <option
                key={type.id}
                value={type.id}
              >
                {type.userType}
              </option>
            ))}
          </select>
        </div>

        <div className={s.buttons}>
          <button
            className={s.cancel}
            onClick={handleCancel}
          >
            Скасувати
          </button>

          <button
            className={s.save}
            onClick={handleSave}
          >
            {mode === "edit" ? "Зберегти" : "Додати"}
          </button>
        </div>
      </div>
    </div>
  );
}