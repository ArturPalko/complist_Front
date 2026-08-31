
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchDictionariesThunk } from "../../../dal/api";

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
  onSubmit,
}) {
  const dispatch = useDispatch();

  const departmentId = useSelector(
    selectAtiveDepartmentId
  );

  const sectionId = useSelector(
    selectActiveSectionId
  );

  const [fullName, setFullName] = useState("");
  const [positionId, setPositionId] = useState("");
  const [userTypeId, setUserTypeId] = useState("");

  const [error, setError] = useState("");

  const positions = useSelector(
    selectPositionsDictionary
  ).flatMap(
    element => element.rows
  );

  const userTypes = useSelector(
    selectDictionaryByType("userTypes")
  ).flatMap(
    element => element.rows
  );

  // ============================================
  // DEFAULT USER TYPE
  // ============================================

  const defaultUserType = useMemo(
    () =>
      userTypes.find(
        type =>
          type.userType === "Користувач"
      ),
    [userTypes]
  );

  // ============================================
  // SELECTED USER TYPE
  // ============================================

  const selectedUserType = useMemo(
    () =>
      userTypes.find(
        type =>
          type.id === Number(userTypeId)
      ),
    [userTypes, userTypeId]
  );

  const isRegularUser =
    selectedUserType?.userType ===
    "Користувач";

  // ============================================
  // DEFAULT USER TYPE FOR ADD
  // ============================================

  useEffect(() => {
    if (
      mode === "add" &&
      defaultUserType &&
      userTypeId === ""
    ) {
      setUserTypeId(
        defaultUserType.id
      );
    }
  }, [
    mode,
    defaultUserType,
    userTypeId,
  ]);

  // ============================================
  // EDIT
  // ============================================

  useEffect(() => {
    if (!editValue) return;

    setFullName(
      editValue.name ?? ""
    );

    setPositionId(
      editValue.positionId ?? ""
    );

    setUserTypeId(
      editValue.userTypeId ?? ""
    );

    setError("");
  }, [editValue]);

  // ============================================
  // CLEAR POSITION WHEN NOT REQUIRED
  // ============================================

  useEffect(() => {
    if (
      userTypeId &&
      !isRegularUser
    ) {
      setPositionId("");
    }
  }, [
    userTypeId,
    isRegularUser,
  ]);

  // ============================================
  // CANCEL
  // ============================================

  const handleCancel = () => {
    setFullName("");
    setPositionId("");

    setUserTypeId(
      defaultUserType?.id ?? ""
    );

    setError("");

    onClose?.();
  };

  // ============================================
  // SAVE
  // ============================================

  const handleSave = async () => {
    setError("");

    // Посада обов'язкова тільки
    // для звичайного користувача
    if (
      isRegularUser &&
      !positionId
    ) {
      setError(
        "Оберіть посаду користувача."
      );

      return;
    }

    const saveData = {
      name: fullName.trim(),

      // Для інших типів користувачів
      // посада не передається
      positionId:
        isRegularUser
          ? positionId
          : null,

      userTypeId,
      departmentId,
      sectionId,
    };

    try {
      await onSubmit(saveData);

      // Закриваємо тільки при успішному
      // збереженні
      onClose?.();

    } catch (error) {
      console.error(
        "Помилка при збереженні користувача:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Не вдалося зберегти користувача.";

      setError(message);

      return;

    } finally {
      dispatch(
        fetchDictionariesThunk()
      );
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={s.overlay}>
      <div className={s.modal}>

        <h2>
          {mode === "edit"
            ? "Редагувати користувача"
            : "Додати користувача"}
        </h2>

        {/* ПІБ */}

        <div className={s.field}>
          <label className={s.label}>
            ПІБ
          </label>

          <input
            className={s.input}
            value={fullName}
            onChange={(e) => {
              setFullName(
                e.target.value
              );

              setError("");
            }}
          />
        </div>

        {/* ПОСАДА */}

        {isRegularUser && (
          <div className={s.field}>
            <label className={s.label}>
              Посада
            </label>

            <select
              className={s.input}
              value={positionId}
              onChange={(e) => {
                setPositionId(
                  e.target.value
                    ? Number(
                        e.target.value
                      )
                    : ""
                );

                setError("");
              }}
            >
              <option value="">
                Оберіть
              </option>

              {positions.map(
                position => (
                  <option
                    key={position.id}
                    value={position.id}
                  >
                    {
                      position.positionName
                    }
                  </option>
                )
              )}
            </select>
          </div>
        )}

        {/* ТИП КОРИСТУВАЧА */}

        <div className={s.field}>
          <label className={s.label}>
            Тип користувача
          </label>

          <select
            className={s.input}
            value={userTypeId}
            onChange={(e) => {
              setUserTypeId(
                Number(e.target.value)
              );

              setError("");
            }}
          >
            {userTypes.map(
              type => (
                <option
                  key={type.id}
                  value={type.id}
                >
                  {type.userType}
                </option>
              )
            )}
          </select>
        </div>

        {/* ERROR */}

        {error && (
          <div className={s.error}>
            {error}
          </div>
        )}

        {/* BUTTONS */}

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
            {mode === "edit"
              ? "Зберегти"
              : "Додати"}
          </button>
        </div>

      </div>
    </div>
  );
}

