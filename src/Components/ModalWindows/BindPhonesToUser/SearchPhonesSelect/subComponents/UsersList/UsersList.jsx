import styles from "./UsersList.module.css";

const PHONE_TYPES = [
  {
    id: "landline",
    label: "Міський",
  },
  {
    id: "internal",
    label: "Внутрішній",
  },
  {
    id: "cisco",
    label: "Cisco",
  },
];

export default function UsersList({
  users,
  selectedUserId,
  onSelectUser,
  hasPhone,
  formRef,
}) {
  debugger;

  return (
    <div className={styles.usersBlock}>
      <div className={styles.usersHeader}>
        <div className={styles.sectionTitle}>
          Користувачі
        </div>

        <div className={styles.usersCount}>
          {users.length} користувачів
        </div>
      </div>

      <div className={styles.users}>
        {users.map((user) => {
          const hasName = Boolean(user.name?.trim());

          const displayName = hasName
            ? user.name.trim()
            : user.userType !== "Користувач"
              ? user.userType
              : "";

          const displayPosition = hasName
            ? user.positionName
            : "";

          return (
            <button
              key={user.id}
              type="button"
              className={`${styles.userRow} ${
                Number(selectedUserId) === Number(user.id)
                  ? styles.active
                  : ""
              }`}
              onClick={() => onSelectUser(user)}
            >
              <div className={styles.userMain}>
                <div className={styles.userName}>
                  {displayName}
                </div>

                {displayPosition && (
                  <div className={styles.userInfo}>
                    {displayPosition}
                  </div>
                )}
              </div>

              <div className={styles.phoneStatus}>
                {PHONE_TYPES.map((type) => {
                  const phoneAssigned = hasPhone(
                    user.id,
                    type.id
                  );

                  return (
                    <span
                      key={type.id}
                      className={
                        phoneAssigned
                          ? `${styles.badge} ${styles.badgeActive}`
                          : styles.badge
                      }
                    >
                      {type.label}
                    </span>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}