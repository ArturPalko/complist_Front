import form from "../../../shared/Css/form.module.css";
import s from "./TransferUser.module.css";

import TransferUserHeader from "./subComponents/TransferUserHeader/TransferUserHeader";
import TransferDestination from "./subComponents/TransferDestination/TransferDestinatios.";
import TransferOptions from "./subComponents/TransferOptions/TransferOptions";

export default function TransferUserView({
  onClose,
  error,

  transferType,
  onTransferTypeChange,

  departmentId,
  departments,
  onDepartmentChange,

  sectionId,
  sections,
  onSectionChange,

  canTransfer,
  onTransfer,

  keepResponsibleForMails,
  setKeepResponsibleForMails,

  keepPhonesByPosition,
  setKeepPhonesByPosition,

  transferPhones,
  setTransferPhones,
}) {
  return (
    <div className={form.modalOverlay}>
      <div className={form.modal}>
        <TransferUserHeader onClose={onClose} />

        <TransferDestination
          transferType={transferType}
          departmentId={departmentId}
          sectionId={sectionId}
          departments={departments}
          sections={sections}
          onTransferTypeChange={onTransferTypeChange}
          onDepartmentChange={onDepartmentChange}
          onSectionChange={onSectionChange}
        />

        <div className={s.divider} />

        <TransferOptions
          keepResponsibleForMails={keepResponsibleForMails}
          setKeepResponsibleForMails={setKeepResponsibleForMails}
          keepPhonesByPosition={keepPhonesByPosition}
          setKeepPhonesByPosition={setKeepPhonesByPosition}
          transferPhones={transferPhones}
          setTransferPhones={setTransferPhones}
        />

        {error && (
          <div className={form.error}>
            {error}
          </div>
        )}

        <button
          type="button"
          className={s.button}
          disabled={!canTransfer}
          onClick={onTransfer}
        >
          Перевести
        </button>
      </div>
    </div>
  );
}

