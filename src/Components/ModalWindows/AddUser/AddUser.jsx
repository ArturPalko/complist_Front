import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import s from "./AddUser.module.css";

import {
  selectDictionaryByType,
  selectPositionsDictionary,
} from "../../../redux/selectors/selector";

export default function AddUser({ onClose }) {
  const [fullName, setFullName] = useState("");
  const [positionId, setPositionId] = useState("");
  const [userTypeId, setUserTypeId] = useState("");

  const positions = useSelector(selectPositionsDictionary)
    .flatMap(element => element.rows);

  const userTypes = useSelector(selectDictionaryByType("userTypes"))
    .flatMap(element => element.rows);

  const defaultUserType = useMemo(
    () => userTypes.find(type => type.userType === "Користувач"),
    [userTypes]
  );

  useEffect(() => {
    if (defaultUserType && userTypeId === "") {
      setUserTypeId(defaultUserType.id);
    }
  }, [defaultUserType, userTypeId]);

  const handleCancel = () => {
    setFullName("");
    setPositionId("");
    setUserTypeId(defaultUserType?.id ?? "");
    onClose?.();
  };

  const handleSave = () => {
    console.log({
      fullName: fullName.trim(),
      positionId,
      userTypeId,
    });
  };

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <h2>Додати користувача</h2>

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
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
}