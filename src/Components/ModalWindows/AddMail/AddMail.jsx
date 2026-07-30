import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  activeMenu,
  selectDictionaryByType,
} from "../../../redux/selectors/selector";

import s from "./AddMail.module.css";

import {
  setDataIsLoadedActionCreator
} from "../../../redux/reducers/app-reducer";
import { fetchPasswordById } from "../../../dal/api";
import ResponsibleUsersSelector from "./subComponents/ResponsibleUsersSelector/ResponsibleUsersSelector";
import FormButtons from "./subComponents/FormButtons/FormButtons";
import PasswordField from "./subComponents/PasswordField/PasswordField";
import OwnerSelector from "./subComponents/OwnerSelector/OwnerSelector";
import { initializeEditForm } from "./helpers/initializeEditForm";
import { addResponsibleUser, removeResponsibleUser } from "./helpers/responsibleUsersHelpers";
import { handleSave } from "./helpers/handleSave";
import { handleShowPassword } from "./helpers/handleShowPassword";
import { pageConfigs } from "../../../configs/app/pageConfig";
import MailNameField from "./subComponents/MailNameField/MailNameField";

export default function AddMail({
  onClose,
  editValue,
  onSubmit
}) {
   const [autoUpdatePreviousName, setAutoUpdatePreviousName] =
  useState(true);

  const [mail, setMail] = useState("");

  const [ownerType, setOwnerType] = useState("department");
  const [ownerId, setOwnerId] = useState("");

  const [id, setId] = useState("");

  const [passwordKnown, setPasswordKnown] = useState(false);
  const [password, setPassword] = useState("");
  const [responsibleUserIds, setResponsibleUserIds] = useState([]);

  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState(false);

  const [showPassword, setShowPassword] =
  useState(false);


  const [responsibleQuery, setResponsibleQuery] = useState("");
  const [responsibleOpened, setResponsibleOpened] = useState(false);

const [previousName, setPreviousName] = useState("");

  
  const usersValues = useSelector(
    selectDictionaryByType("users")
  );
  debugger

  const sectionsValues = useSelector(
    selectDictionaryByType("sections")
  );

const departments = useSelector(
  selectDictionaryByType("deps")
);

const departmentsValues = useMemo(
  () =>
    [...departments].sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
  [departments]
);;

console.log("departmentValues:", departmentsValues)

  const menu = useSelector(activeMenu);

  const dispatch = useDispatch();



  const filteredUsers = useMemo(() => {

    return usersValues.filter(user =>
      user.name
        .toLowerCase()
        .includes(query.toLowerCase())
    );

  }, [usersValues, query]);



  const filteredResponsibleUsers = useMemo(() => {

    return usersValues.filter(user =>
      user.name
        .toLowerCase()
        .includes(responsibleQuery.toLowerCase())
    );

  }, [
    usersValues,
    responsibleQuery
  ]);


const isEdit = Boolean(editValue?.id);


const modalConfig =
  pageConfigs[menu].modalWindows.addMail;
debugger
useEffect(() => {
initializeEditForm(editValue, {
  setMail,
  setPreviousName,
  setOwnerType,
  setOwnerId,
  setId,
  setPasswordKnown,
  setResponsibleUserIds,
  setQuery,
});
}, [editValue]);


  return (

    <div className={s.overlay}>

      <div className={s.modal}>

      <h2 className={s.title}>
        {editValue
          ? `Редагувати ${modalConfig.title} пошту`
          : `Додати ${modalConfig.title} пошту`}
      </h2>

       <MailNameField
        value={mail}
        onChange={setMail}
        oldValue={previousName}
        onOldChange={setPreviousName}
        showOldField={modalConfig.showOldMailName}
        autoUpdatePreviousName={autoUpdatePreviousName}
        setAutoUpdatePreviousName={setAutoUpdatePreviousName}
      />

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
          handleShowPassword={() =>
          handleShowPassword({
            showPassword,
            setShowPassword,
            setPassword,
            menu,
            id: editValue.id,
          })
        }
      />

      {modalConfig.showResponsibleUsers && <ResponsibleUsersSelector
        ownerType={ownerType}
        users={usersValues}
        responsibleUserIds={responsibleUserIds}
        responsibleQuery={responsibleQuery}
        responsibleOpened={responsibleOpened}
        filteredResponsibleUsers={filteredResponsibleUsers}
        setResponsibleQuery={setResponsibleQuery}
        setResponsibleOpened={setResponsibleOpened}
        addResponsibleUser={(userId) =>
          addResponsibleUser({
            userId,
            responsibleUserIds,
            setResponsibleUserIds,
            setResponsibleQuery,
            setResponsibleOpened,
          })
        }
        removeResponsibleUser={(userId) =>
          removeResponsibleUser({
            userId,
            setResponsibleUserIds,
          })
        }
        removeAllResponsibleUsers={() =>
      setResponsibleUserIds([])
    }
      /> }

      <FormButtons
        onCancel={onClose}
        onSave={() =>
          handleSave({
          autoUpdatePreviousName,
          id,
          menu,
          mail,
          previousName,
          ownerType,
          ownerId,
          passwordKnown,
          password,
          responsibleUserIds,
          onSubmit,
          dispatch,
          onClose,
        })
        }
        isEdit={!!editValue}
      />
      </div>
    </div>
  );
}