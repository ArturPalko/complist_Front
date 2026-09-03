import styles from "./BindPhonesToUserView.module.css";

import DepartmentSectionSelect from "../SearchPhonesSelect/subComponents/DepartmentSectionSelect/DepartmentSectionSelect";
import UserPhoneEditor from "../../AddMail/subComponents/UserPhoneEditor/UserPhoneEditor";
import UsersList from "../SearchPhonesSelect/subComponents/UsersList/UsersList";
import ModalActions from "../SearchPhonesSelect/subComponents/ModalActions/ModalActions";
import BindPhonesToUserHeader from "../SearchPhonesSelect/subComponents/BindPhonesToUserHeadr/BindPhonesToUserHeader";

export default function BindPhonesToUserView({
  onClose,

  departments,
  departmentId,
  sectionId,
  selectedDepartment,
  sections,
  onDepartmentChange,
  onSectionChange,

  users,
  selectedUserId,
  onSelectUser,
  hasPhone,
  hasAnyPhone,

  selectedUser,
  phoneOptions,
  phoneValues,
  onPhoneChange,
  onClearPhone,

  showTransfer,
  onToggleTransfer,
  transferUsers,
  transferId,
  onTransferUserChange,

  status,
  error,

  onUnbindAll,
  onSave,
  formRef,
  onDropDownInputFocus,
  isSaving
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <BindPhonesToUserHeader
          onClose={onClose}
        />

        <div
          ref={formRef}
          className={styles.content}
        >
          <DepartmentSectionSelect
            departments={departments}
            departmentId={departmentId}
            sectionId={sectionId}
            selectedDepartment={selectedDepartment}
            sections={sections}
            onDepartmentChange={onDepartmentChange}
            onSectionChange={onSectionChange}
          />

          {selectedDepartment && (
            <UsersList
              users={users}
              selectedUserId={selectedUserId}
              onSelectUser={onSelectUser}
              hasPhone={hasPhone}
            />
          )}

          {selectedUser && (
            <UserPhoneEditor
              selectedUser={selectedUser}
              selectedDepartment={selectedDepartment}
              phoneOptions={phoneOptions}
              phoneValues={phoneValues}
              onPhoneChange={onPhoneChange}
              onClearPhone={onClearPhone}
              showTransfer={showTransfer}
              onToggleTransfer={onToggleTransfer}
              transferUsers={transferUsers}
              transferId={transferId}
              onTransferUserChange={onTransferUserChange}
              status={status}
              error={error}
              onDropDownInputFocus={onDropDownInputFocus}
              hasAnyPhone={hasAnyPhone}
            />
          )}
        </div>

        <ModalActions
          selectedUser={selectedUser}
          hasAnyPhone={hasAnyPhone}
          onUnbindAll={onUnbindAll}
          onClose={onClose}
          onSave={onSave}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}