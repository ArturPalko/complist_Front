import styles from './BindPhonesToUserView.module.css'
import SearchUserSelect from "../../../../shared/components/forModal/SearchUsersSelect/SearchUserSelect";
import SearchPhoneSelect from "../SearchPhonesSelect/SearchPhonesSelect";
import DepartmentSectionSelect from "../SearchPhonesSelect/subComponents/DepartmentSectionSelect/DepartmentSectionSelect";
import UserPhoneEditor from "../../AddMail/subComponents/UserPhoneEditor/UserPhoneEditor";
import UsersList from '../SearchPhonesSelect/subComponents/UsersList/UsersList';
import ModalActions from '../SearchPhonesSelect/subComponents/ModalActions/ModalActions';
import BindPhonesToUserHeader from '../SearchPhonesSelect/subComponents/BindPhonesToUserHeadr/BindPhonesToUserHeader';

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

  onUnbindAll,
  onSave,
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <BindPhonesToUserHeader
          onClose={onClose}
        />

        <div className={styles.content}>
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
            />
          )}
        </div>

        <ModalActions
          selectedUser={selectedUser}
          onUnbindAll={onUnbindAll}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}