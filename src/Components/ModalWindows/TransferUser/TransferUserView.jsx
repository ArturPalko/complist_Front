import React from "react";

import s from "../AddPhone/AddPhone.module.css";
import form from "../../../shared/Css/form.module.css"
import TransferUserHeader from "./subComponents/TransferUserHeader/TransferUserHeader";
import TransferDestination from "./subComponents/TransferDestination/TransferDestinatios.";
import TransferOptions from "./subComponents/TransferOptions/TransferOptions";

export default function TransferUserView({
  onClose,

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
    <div className={s.container}>
      <div className={s.modal}>

        {/* =========================
            Header
        ========================= */}

        <TransferUserHeader onClose={onClose} />

        {/* =========================
            Transfer type
        ========================= */}

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

        {/* =========================
            Divider
        ========================= */}

        <div className={s.divider} />

=
       <TransferOptions
        keepResponsibleForMails={keepResponsibleForMails}
        setKeepResponsibleForMails={
            setKeepResponsibleForMails
        }
        keepPhonesByPosition={keepPhonesByPosition}
        setKeepPhonesByPosition={
            setKeepPhonesByPosition
        }
        transferPhones={transferPhones}
        setTransferPhones={setTransferPhones}
        />
        {/* =========================
            Transfer button
        ========================= */}

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

