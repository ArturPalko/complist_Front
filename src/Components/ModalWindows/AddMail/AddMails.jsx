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
import OwnerSelector from "./subComponents/OwnerSelector/OwnerSelector";
import PasswordField from "./subComponents/PasswordField/PasswordField";
import FormButtons from "./subComponents/FormButtons/FormButtons";


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

   <OwnerSelector
  ownerType={ownerType}
  ownerId={ownerId}
  query={query}
  opened={opened}

  users={usersValues}
  departments={departmentsValues}
  sections={sectionsValues}

  setOwnerType={setOwnerType}
  setOwnerId={setOwnerId}
  setQuery={setQuery}
  setOpened={setOpened}
/>

<PasswordField
  isEdit={isEdit}
  password={password}
  passwordKnown={passwordKnown}
  showPassword={showPassword}
  setPassword={setPassword}
  setPasswordKnown={setPasswordKnown}
  handleShowPassword={handleShowPassword}
/>

 <FormButtons
  onCancel={onClose}
  onSave={handleSave}
  isEdit={!!editValue}
/>
      </div>
    </div>
  );
}