import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  activeMenu,
  selectDictionaryByType,
} from "../../../redux/selectors/selector";

import AddMailView from "./AddMailView/AddMailView";
import { initializeEditForm } from "./helpers/initializeEditForm";
import {
  addResponsibleUser,
  removeResponsibleUser,
} from "./helpers/responsibleUsersHelpers";
import { handleSave } from "./helpers/handleSave";
import { handleShowPassword } from "./helpers/handleShowPassword";

import { pageConfigs } from "../../../configs/app/pageConfig";

export default function AddMail({
  onClose,
  editValue,
  onSubmit,
}) {
  const [autoUpdatePreviousName, setAutoUpdatePreviousName] = useState(true);
  const [mail, setMail] = useState("");
  const [previousName, setPreviousName] = useState("");
  const [error, setError] = useState("");

  const [ownerType, setOwnerType] = useState("department");
  const [ownerId, setOwnerId] = useState("");
  const [ownerIds, setOwnerIds] = useState([]);
  const [sectionDepartmentId, setSectionDepartmentId] = useState("");
  const [ownerDisplayName, setOwnerDisplayName] = useState("");

  const [id, setId] = useState("");
  const [passwordKnown, setPasswordKnown] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [responsibleUserIds, setResponsibleUserIds] = useState([]);
  const [responsibleQuery, setResponsibleQuery] = useState("");
  const [responsibleOpened, setResponsibleOpened] = useState(false);

  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState(false);

  const usersValues = useSelector(selectDictionaryByType("users"));
  const sectionsValues = useSelector(selectDictionaryByType("sections"));
  const departments = useSelector(selectDictionaryByType("deps"));
  const menu = useSelector(activeMenu);

  const dispatch = useDispatch();

  const users = useMemo(
    () =>
      usersValues
        .flatMap((page) => page.rows ?? [])
        .filter(
          (user) =>
            user.userType === "Користувач" &&
            user.name?.trim() &&
            !user.customName
        ),
    [usersValues]
  );

  const departmentsValues = useMemo(
    () =>
      [...departments].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    [departments]
  );

  const filteredResponsibleUsers = useMemo(() => {
    const normalizedQuery = responsibleQuery.toLowerCase();

    return users.filter((user) =>
      (user.name ?? "").toLowerCase().includes(normalizedQuery)
    );
  }, [users, responsibleQuery]);

  const isEdit = Boolean(editValue?.id);
  const modalConfig = pageConfigs[menu].modalWindows.addMail;

  useEffect(() => {
    initializeEditForm(
      editValue,
      {
        setMail,
        setPreviousName,
        setOwnerType,
        setOwnerId,
        setOwnerIds,
        setSectionDepartmentId,
        setId,
        setPasswordKnown,
        setResponsibleUserIds,
        setQuery,
        setOwnerDisplayName,
      },
      sectionsValues
    );

    setError("");
  }, [editValue, sectionsValues]);

  const handleFormSave = async () => {
    setError("");

    if (!mail.trim()) {
      setError("Потрібно ввести назву скриньки.");
      return;
    }

    const hasOwner =
      ownerType === "section"
        ? ownerIds.length > 0
        : Boolean(ownerId);

    if (!hasOwner) {
      setError("Потрібно обрати власника скриньки.");
      return;
    }

    try {
      await handleSave({
        autoUpdatePreviousName,
        id,
        menu,
        mail,
        previousName,
        ownerType,
        ownerId,
        ownerIds,
        ownerDisplayName,
        passwordKnown,
        password,
        responsibleUserIds,
        onSubmit,
        dispatch,
        onClose,
      });
    } catch (error) {
      console.error("Помилка при збереженні пошти:", error);

      const message =
        error?.response?.data?.message ||
        "Не вдалося зберегти скриньку.";

      setError(message);
    }
  };

  return (
    <AddMailView
      editValue={editValue}
      modalConfig={modalConfig}
      isEdit={isEdit}
      mail={mail}
      setMail={(value) => {
        setMail(value);
        setError("");
      }}
      previousName={previousName}
      setPreviousName={setPreviousName}
      autoUpdatePreviousName={autoUpdatePreviousName}
      setAutoUpdatePreviousName={setAutoUpdatePreviousName}
      ownerType={ownerType}
      ownerId={ownerId}
      ownerIds={ownerIds}
      ownerDisplayName={ownerDisplayName}
      sectionDepartmentId={sectionDepartmentId}
      query={query}
      opened={opened}
      users={users}
      departments={departmentsValues}
      sections={sectionsValues}
      setOwnerType={(value) => {
        setOwnerType(value);
        setError("");
      }}
      setOwnerId={(value) => {
        setOwnerId(value);
        setError("");
      }}
      setOwnerIds={(value) => {
        setOwnerIds(value);
        setError("");
      }}
      setSectionDepartmentId={setSectionDepartmentId}
      setOwnerDisplayName={setOwnerDisplayName}
      setQuery={setQuery}
      setOpened={setOpened}
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
          id: editValue?.id,
        })
      }
      showResponsibleUsers={modalConfig.showResponsibleUsers}
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
      removeAllResponsibleUsers={() => setResponsibleUserIds([])}
      error={error}
      onClose={onClose}
      onSave={handleFormSave}
    />
  );
}