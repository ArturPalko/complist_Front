import styles from "./UserPhoneEditor.module.css";
import formStyles from "../../../../../shared/Css/form.module.css";

import SearchUserSelect from "../../../../../shared/components/forModal/SearchUsersSelect/SearchUserSelect";
import SearchPhoneSelect from "../../../BindPhonesToUser/SearchPhonesSelect/SearchPhonesSelect";

import { PHONE_TYPES_LABELS } from "../../../../../configs/app/constants";

export default function UserPhoneEditor({
  selectedUser,
  selectedDepartment,
  hasAnyPhone,
  phoneOptions,
  phoneValues,
  onPhoneChange,
  onClearPhone,
  showTransfer,
  onToggleTransfer,
  transferUsers,
  transferId,
  onTransferUserChange,
  onDropDownInputFocus,
  status,
  error,
}) {
    debugger
  if (!selectedUser) return null;
    // debugger
  return (
    <div className={styles.editor}>
      <div className={styles.selectedUser}>
        <div className={styles.selectedUserName}>
          {selectedUser.name}
        </div>

        <div className={styles.selectedUserInfo}>
          {selectedUser.positionName}
          {" · "}
          {selectedDepartment?.departmentName}
        </div>
      </div>

      <div className={styles.sectionTitle}>
        Телефони
      </div>

      {PHONE_TYPES_LABELS.map((type) => (
        <div
          className={styles.phoneRow}
          key={type.id}
        >
          <div className={styles.type}>
            {type.label}
          </div>

          <SearchPhoneSelect
            phones={phoneOptions[type.id] ?? []}
            value={phoneValues[type.id]}
            onChange={(value) =>
              onPhoneChange(type.id, value)
            }
            onFocus={onDropDownInputFocus}
          />

          <button
            type="button"
            className={styles.clear}
            onClick={() => onClearPhone(type.id)}
          >
            ×
          </button>
        </div>
      ))}

      <div className={styles.hint}>
        Кожен тип телефону може мати не більше
        одного призначення цьому користувачу.
      </div>

      {hasAnyPhone(selectedUser.id) && (
        <div className={styles.transfer}>
          <div className={styles.transferTitle}>
            Передати телефони
          </div>

          <button
            type="button"
            className={`${styles.secondary} ${
              showTransfer
                ? styles.secondaryActive
                : ""
            }`}
            onClick={onToggleTransfer}
          >
            Передати іншому користувачу
          </button>

          {showTransfer && (
            <div className={styles.transferBox}>
              <SearchUserSelect
                users={transferUsers}
                value={transferId}
                onChange={onTransferUserChange}
                onFocus={onDropDownInputFocus}
                placeholder="Почніть вводити ПІБ..."
              />
            </div>
          )}
        </div>
      )}

      {status && (
        <div className={styles.status}>
          {status}
        </div>
      )}

      {error && (
        <div className={formStyles.error}>
          {error}
        </div>
      )}
    </div>
  );
}