import SaveCancelButtons from "../../../../../../shared/components/forModal/SaveCancelButtons/SaveCancelButtons";
import styles from "./ModalActions.module.css";

export default function ModalActions({
  selectedUser,
  hasAnyPhone,
  onUnbindAll,
  onClose,
  onSave,
  isSaving,
}) {
  return (
    <div className={styles.actions}>
      <button
        className={styles.danger}
        style={{
          visibility:
            selectedUser && hasAnyPhone(selectedUser.id)
              ? "visible"
              : "hidden",
        }}
        onClick={onUnbindAll}
      >
        Відв'язати всі телефони
      </button>

      <SaveCancelButtons
        onCancel={onClose}
        onSave={onSave}
        isEdit={true}
        isSaving={isSaving}
      />
    </div>
  );
}