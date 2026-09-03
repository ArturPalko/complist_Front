import { PHONE_TYPES_LABELS } from "../../../../../../configs/app/constants";
import styles from "./UsersList.module.css";


export default function UsersList({
  users,
  selectedUserId,
  onSelectUser,
  hasPhone,
  formRef,
}) {
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
          const isRegularUser = user.userType === "Користувач";

          let displayName = "";
          let displayPosition = "";

          if (isRegularUser) {
            // Звичайний користувач
            if (hasName) {
              displayName = user.name.trim();
            }

            displayPosition = user.positionName;
          } else {
            // Інший тип користувача
            if (hasName) {
              displayName = user.name.trim();
              displayPosition = user.userType;
            } else {
              // Немає імені — тип показуємо як посаду
              displayPosition = user.userType;
            }
          }

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
                {displayName && (
                  <div className={styles.userName}>
                    {displayName}
                  </div>
                )}

                {displayPosition && (
                  <div className={styles.userInfo}>
                    {displayPosition}
                  </div>
                )}
              </div>

              <div className={styles.phoneStatus}>
                {PHONE_TYPES_LABELS.map((type) => {
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

