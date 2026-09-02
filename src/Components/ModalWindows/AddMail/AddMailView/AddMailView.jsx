
import form from "../../../../shared/Css/form.module.css"

import ResponsibleUsersSelector from "../subComponents/ResponsibleUsersSelector/ResponsibleUsersSelector";
import FormButtons from "../subComponents/FormButtons/FormButtons";
import PasswordField from "../subComponents/PasswordField/PasswordField";
import OwnerSelector from "../subComponents/OwnerSelector/OwnerSelector";
import MailNameField from "../subComponents/MailNameField/MailNameField";

export default function AddMailView({
  editValue,
  modalConfig,
  isEdit,
  mail,
  setMail,
  previousName,
  setPreviousName,
  autoUpdatePreviousName,
  setAutoUpdatePreviousName,
  ownerType,
  ownerId,
  ownerIds,
  ownerDisplayName,
  sectionDepartmentId,
  query,
  opened,
  users,
  departments,
  sections,
  setOwnerType,
  setOwnerId,
  setOwnerIds,
  setSectionDepartmentId,
  setOwnerDisplayName,
  setQuery,
  setOpened,
  password,
  passwordKnown,
  showPassword,
  setPassword,
  setPasswordKnown,
  handleShowPassword,
  showResponsibleUsers,
  responsibleUserIds,
  responsibleQuery,
  responsibleOpened,
  filteredResponsibleUsers,
  setResponsibleQuery,
  setResponsibleOpened,
  addResponsibleUser,
  removeResponsibleUser,
  removeAllResponsibleUsers,
  error,
  onClose,
  onSave,
}) {
  return (
    <div className={form.modalOverlay}>
      <div className={form.modal}>
        <h2 className={form.title}>
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
          ownerDisplayName={ownerDisplayName}
          setOwnerDisplayName={setOwnerDisplayName}
          ownerType={ownerType}
          ownerId={ownerId}
          ownerIds={ownerIds}
          sectionDepartmentId={sectionDepartmentId}
          setSectionDepartmentId={setSectionDepartmentId}
          query={query}
          opened={opened}
          users={users}
          departments={departments}
          sections={sections}
          setOwnerType={setOwnerType}
          setOwnerId={setOwnerId}
          setOwnerIds={setOwnerIds}
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

        {showResponsibleUsers && ownerType !== "user" && (
          <ResponsibleUsersSelector
            ownerType={ownerType}
            users={users}
            responsibleUserIds={responsibleUserIds}
            responsibleQuery={responsibleQuery}
            responsibleOpened={responsibleOpened}
            filteredResponsibleUsers={filteredResponsibleUsers}
            setResponsibleQuery={setResponsibleQuery}
            setResponsibleOpened={setResponsibleOpened}
            addResponsibleUser={addResponsibleUser}
            removeResponsibleUser={removeResponsibleUser}
            removeAllResponsibleUsers={removeAllResponsibleUsers}
          />
        )}

        {error && <div className={form.error}>{error}</div>}

        <FormButtons
          onCancel={onClose}
          onSave={onSave}
          isEdit={!!editValue}
        />
      </div>
    </div>
  );
}