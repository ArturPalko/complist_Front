import { useEffect, useRef } from "react";
import styles from "./UserPhoneEditor.module.css";
import SearchUserSelect from "../../../../../shared/components/forModal/SearchUsersSelect/SearchUserSelect";
import SearchPhoneSelect from "../../../BindPhonesToUser/SearchPhonesSelect/SearchPhonesSelect";

const PHONE_TYPES = [
  {
    id: "landline",
    label: "Landline",
  },
  {
    id: "internal",
    label: "Internal",
  },
  {
    id: "cisco",
    label: "Cisco",
  },
];

export default function UserPhoneEditor({
  selectedUser,
  selectedDepartment,
  phoneOptions,
  phoneValues,
  onPhoneChange,
  onClearPhone,
  showTransfer,
  onToggleTransfer,
  transferUsers,
  transferUserId,
  onTransferUserChange,
  status,
}) {
  const transferBoxRef = useRef(null);

  useEffect(() => {
    if (showTransfer) {
      transferBoxRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [showTransfer]);

  if (!selectedUser) return null;

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

      {PHONE_TYPES.map((type) => (
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
          />

          <button
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

      <div className={styles.transfer}>
        <div className={styles.transferTitle}>
          Передати телефони
        </div>

        <button
          className={`${styles.secondary} ${
            showTransfer ? styles.secondaryActive : ""
          }`}
          onClick={onToggleTransfer}
        >
          Передати іншому користувачу
        </button>

        {showTransfer && (
          <div
            className={styles.transferBox}
            ref={transferBoxRef}
          >
           <SearchUserSelect
            users={transferUsers}
            value={transferUserId}
            onChange={onTransferUserChange}
            onFocus={() => {
                transferBoxRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                });
            }}
            placeholder="Почніть вводити ПІБ..."
            />
          </div>
        )}
      </div>

      {status && (
        <div className={styles.status}>
          {status}
        </div>
      )}
    </div>
  );
}