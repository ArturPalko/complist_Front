import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activeMenu,
  selectDictionaryByType,
} from "../../../redux/selectors/selector";
import s from "./AddMail.module.css";
import { addMail } from "../../../dal/api";
import { setDataIsLoadedActionCreator } from "../../../redux/reducers/app-reducer";
import { fetchPasswordById } from "../../../dal/api";

export default function AddMail({
  onClose,
  editValue,
  onSubmit
}) {
  const [mail, setMail] = useState("");

  const [ownerType, setOwnerType] = useState("department");
  const [ownerId, setOwnerId] = useState("");
  const [id, setId] = useState("");
  const [passwordKnown, setPasswordKnown] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState(false);

  const usersValues = useSelector(
    selectDictionaryByType("users")
  );

  const sectionsValues = useSelector(
    selectDictionaryByType("sections")
  );

  const departmentsValues = useSelector(
    selectDictionaryByType("deps")
  );

  const menu = useSelector(activeMenu);

  const dispatch = useDispatch();

  const filteredUsers = useMemo(() => {
    return usersValues.filter((u) =>
      u.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [usersValues, query]);
  const isEdit = Boolean(editValue?.id);

  useEffect(() => {
       
    if (!editValue) return;
   
    setMail(editValue.name ?? "");

    setOwnerType(
      editValue.ownerType?.toLowerCase() ?? "department"
    );
    
    setOwnerId(editValue.ownerId ?? "");
    setId(editValue.id ?? "")
    setPasswordKnown(editValue.passwordKnown ?? false);

    if (
      editValue.ownerType?.toLowerCase() === "user"
    ) {
      setQuery(editValue.owner ?? "");
    }
  }, [editValue]);
const handleShowPassword = async () => {

  // Add
  if (!editValue) {

    setPasswordKnown(true);
    setShowPassword(prev => !prev);

    if (!showPassword) {
      setPassword("");
    }

    return;
  }

  // Edit
  if (showPassword) {

    setShowPassword(false);

    return;
  }

  try {

    const value = await fetchPasswordById(
      menu,
      editValue.id
    );

    setPassword(value);

    setShowPassword(true);

  } catch (error) {

    console.error(error);

  }

};
  const handleSave = async () => {
  try {

    await onSubmit({
      id,
      mail,
      ownerType,
      ownerId,
      passwordKnown,
      password
    });

    dispatch(
      setDataIsLoadedActionCreator(
        false,
        menu
      )
    );

    onClose();

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <h2 className={s.title}>
          {editValue
            ? "Редагувати Lotus-пошту"
            : "Додати Lotus-пошту"}
        </h2>

        <div className={s.field}>
          <label className={s.label}>
            Назва поштової скриньки
          </label>

          <input
            className={s.input}
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
        </div>

        <div className={s.field}>
          <label className={s.label}>
            Тип власника
          </label>

          <select
            className={s.select}
            value={ownerType}
            onChange={(e) => {
              setOwnerType(e.target.value);
              setOwnerId("");
              setQuery("");
              setOpened(false);
            }}
          >
            <option value="department">
              Департамент
            </option>

            <option value="section">
              Секція
            </option>

            <option value="user">
              Користувач
            </option>
          </select>
        </div>

        {ownerType === "department" && (
          <div className={s.field}>
            <label className={s.label}>
              Департамент
            </label>

            <select
              className={s.select}
              value={ownerId}
              onChange={(e) =>
                setOwnerId(Number(e.target.value))
              }
            >
              <option value="">
                Оберіть
              </option>

              {departmentsValues.map((d) => (
                <option
                  key={d.id}
                  value={d.id}
                >
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {ownerType === "section" && (
          <div className={s.field}>
            <label className={s.label}>
              Секція
            </label>

            <select
              className={s.select}
              value={ownerId}
              onChange={(e) =>
                setOwnerId(Number(e.target.value))
              }
            >
              <option value="">
                Оберіть
              </option>

              {sectionsValues.map((section) => (
                <option
                  key={section.id}
                  value={section.id}
                >
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {ownerType === "user" && (
          <div className={s.field}>
            <label className={s.label}>
              Користувач
            </label>

            <input
              className={s.input}
              value={
                usersValues.find(
                  (u) =>
                    Number(u.id) ===
                    Number(ownerId)
                )?.name ?? query
              }
              placeholder="Почніть вводити ПІБ..."
              onFocus={() => setOpened(true)}
              onChange={(e) => {
                setOwnerId("");
                setQuery(e.target.value);
                setOpened(true);
              }}
            />

            {opened && (
              <div className={s.dropdown}>
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={s.option}
                    onClick={() => {
                      setOwnerId(user.id);
                      setQuery("");
                      setOpened(false);
                    }}
                  >
                    {user.name}
                  </div>
                ))}

                {!filteredUsers.length && (
                  <div className={s.empty}>
                    Нічого не знайдено
                  </div>
                )}
              </div>
            )}
          </div>
        )}


<div className={s.field}>

  <label className={s.label}>
    Пароль
  </label>

  {!isEdit && (
    <>
      <label className={s.checkboxRow}>
        <input
          type="checkbox"
          checked={passwordKnown}
          onChange={(e) =>
            setPasswordKnown(e.target.checked)
          }
        />

        Пароль відомий
      </label>

      {passwordKnown && (
        <input
          className={s.input}
          value={password}
          placeholder="Введіть пароль"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
      )}
    </>
  )}

  {isEdit && (
    <>
      <div className={s.passwordRow}>

        <input
          type="checkbox"
          checked={passwordKnown}
          disabled
        />

        <button
          type="button"
          onClick={handleShowPassword}
        >
          {showPassword
            ? "Сховати"
            : "Показати"}
        </button>

      </div>

      {showPassword && (
        <input
          className={s.input}
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
      )}
    </>
  )}

</div>












        <div className={s.buttons}>
          <button
            className={s.cancelButton}
            onClick={onClose}
          >
            Скасувати
          </button>

          <button
            className={s.saveButton}
            onClick={handleSave}
          >
            {editValue
              ? "Зберегти"
              : "Додати"}
          </button>
        </div>
      </div>
    </div>
  );
}