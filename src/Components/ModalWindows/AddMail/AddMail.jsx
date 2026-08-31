import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  activeMenu,
  selectDictionaryByType,
} from "../../../redux/selectors/selector";

import s from "./AddMail.module.css";

import ResponsibleUsersSelector from "./subComponents/ResponsibleUsersSelector/ResponsibleUsersSelector";
import FormButtons from "./subComponents/FormButtons/FormButtons";
import PasswordField from "./subComponents/PasswordField/PasswordField";
import OwnerSelector from "./subComponents/OwnerSelector/OwnerSelector";
import MailNameField from "./subComponents/MailNameField/MailNameField";

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
  // =========================
  // General form state
  // =========================

  const [
    autoUpdatePreviousName,
    setAutoUpdatePreviousName,
  ] = useState(true);

  const [mail, setMail] = useState("");
  const [previousName, setPreviousName] = useState("");

  // =========================
  // Validation error
  // =========================

  const [error, setError] = useState("");

  // =========================
  // Owner
  // =========================

  const [ownerType, setOwnerType] =
    useState("department");

  // Для department / user
  const [ownerId, setOwnerId] = useState("");

  // Для section
  const [ownerIds, setOwnerIds] = useState([]);

  // Департамент, до якого належать вибрані секції
  const [
    sectionDepartmentId,
    setSectionDepartmentId,
  ] = useState("");

  // =========================
  // Mail data
  // =========================

  const [id, setId] = useState("");
  const [passwordKnown, setPasswordKnown] =
    useState(false);

  const [password, setPassword] = useState("");

  // =========================
  // Responsible users
  // =========================

  const [
    responsibleUserIds,
    setResponsibleUserIds,
  ] = useState([]);

  const [
    responsibleQuery,
    setResponsibleQuery,
  ] = useState("");

  const [
    responsibleOpened,
    setResponsibleOpened,
  ] = useState(false);

  // =========================
  // User search
  // =========================

  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  // =========================
  // Redux
  // =========================

  const usersValues = useSelector(
    selectDictionaryByType("users")
  );

  const sectionsValues = useSelector(
    selectDictionaryByType("sections")
  );

  const departments = useSelector(
    selectDictionaryByType("deps")
  );

  const menu = useSelector(activeMenu);

  const dispatch = useDispatch();

  // =========================
  // Normalize users
  // =========================

  const users = useMemo(
    () =>
      usersValues
        .flatMap(
          (page) => page.rows ?? []
        )
        .filter(
          (user) =>
            user.userType === "Користувач" &&
            user.name?.trim() &&
            !user.customName
        ),
    [usersValues]
  );

  // =========================
  // Departments sorted
  // =========================

  const departmentsValues = useMemo(
    () =>
      [...departments].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    [departments]
  );

  // =========================
  // Filter users
  // =========================

  const filteredUsers = useMemo(() => {
    const normalizedQuery =
      query.toLowerCase();

    return users.filter((user) =>
      (user.name ?? "")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [users, query]);

  // =========================
  // Filter responsible users
  // =========================

  const filteredResponsibleUsers =
    useMemo(() => {
      const normalizedQuery =
        responsibleQuery.toLowerCase();

      return users.filter((user) =>
        (user.name ?? "")
          .toLowerCase()
          .includes(normalizedQuery)
      );
    }, [
      users,
      responsibleQuery,
    ]);

  // =========================
  // Edit mode
  // =========================

  const isEdit = Boolean(editValue?.id);

  const modalConfig =
    pageConfigs[menu].modalWindows.addMail;

  const [
    ownerDisplayName,
    setOwnerDisplayName,
  ] = useState("");

  // =========================
  // Initialize edit form
  // =========================

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
  }, [
    editValue,
    sectionsValues,
  ]);

  // =========================
  // SAVE / VALIDATION
  // =========================

  const handleFormSave = async () => {
    setError("");

    // -------------------------
    // Mail name validation
    // -------------------------

    if (!mail.trim()) {
      setError(
        "Потрібно ввести назву скриньки."
      );

      return;
    }

    // -------------------------
    // Owner validation
    // -------------------------

    const hasOwner =
      ownerType === "section"
        ? ownerIds.length > 0
        : Boolean(ownerId);

    if (!hasOwner) {
      setError(
        "Потрібно обрати власника скриньки."
      );

      return;
    }

    // -------------------------
    // Save
    // -------------------------

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
      console.error(
        "Помилка при збереженні пошти:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Не вдалося зберегти скриньку.";

      setError(message);
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className={s.overlay}>
      <div className={s.modal}>

        {/* =========================
            Title
        ========================= */}

        <h2 className={s.title}>
          {editValue
            ? `Редагувати ${modalConfig.title} пошту`
            : `Додати ${modalConfig.title} пошту`}
        </h2>

        {/* =========================
            Mail name
        ========================= */}

        <MailNameField
          value={mail}
          onChange={(value) => {
            setMail(value);
            setError("");
          }}
          oldValue={previousName}
          onOldChange={setPreviousName}
          showOldField={
            modalConfig.showOldMailName
          }
          autoUpdatePreviousName={
            autoUpdatePreviousName
          }
          setAutoUpdatePreviousName={
            setAutoUpdatePreviousName
          }
        />

        {/* =========================
            Owner selector
        ========================= */}

        <OwnerSelector
          ownerDisplayName={ownerDisplayName}
          setOwnerDisplayName={
            setOwnerDisplayName
          }

          ownerType={ownerType}
          ownerId={ownerId}
          ownerIds={ownerIds}

          sectionDepartmentId={
            sectionDepartmentId
          }

          setSectionDepartmentId={
            setSectionDepartmentId
          }

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

          setQuery={setQuery}

          setOpened={setOpened}
        />

        {/* =========================
            Password
        ========================= */}

        <PasswordField
          isEdit={isEdit}
          password={password}
          passwordKnown={passwordKnown}
          showPassword={showPassword}

          setPassword={setPassword}

          setPasswordKnown={
            setPasswordKnown
          }

          handleShowPassword={() =>
            handleShowPassword({
              showPassword,
              setShowPassword,
              setPassword,
              menu,
              id: editValue?.id,
            })
          }
        />

        {/* =========================
            Responsible users
        ========================= */}

        {modalConfig.showResponsibleUsers &&
          ownerType !== "user" && (
            <ResponsibleUsersSelector
              ownerType={ownerType}

              users={users}

              responsibleUserIds={
                responsibleUserIds
              }

              responsibleQuery={
                responsibleQuery
              }

              responsibleOpened={
                responsibleOpened
              }

              filteredResponsibleUsers={
                filteredResponsibleUsers
              }

              setResponsibleQuery={
                setResponsibleQuery
              }

              setResponsibleOpened={
                setResponsibleOpened
              }

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
            />
          )}

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className={s.error}>
            {error}
          </div>
        )}

        {/* =========================
            Form buttons
        ========================= */}

        <FormButtons
          onCancel={onClose}
          onSave={handleFormSave}
          isEdit={!!editValue}
        />

      </div>
    </div>
  );
}