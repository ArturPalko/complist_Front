import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  selectDictionaryByType,
} from "../../../redux/selectors/selector";

import TransferUserView from "./TransferUserView";
import { useDragContext } from "../../../redux/contexts/useConetxt";

import { transferUser } from "../../../dal/api";

export function TransferUser({ onClose }) {
  // =========================
  // Redux dictionaries
  // =========================

  const departments = useSelector(
    selectDictionaryByType("deps")
  );

  const sections = useSelector(
    selectDictionaryByType("sections")
  );

  // =========================
  // Form state
  // =========================

  const [transferType, setTransferType] =
    useState("department");

  const [departmentId, setDepartmentId] =
    useState("");

  const [sectionId, setSectionId] =
    useState("");

  const [
    keepResponsibleForMails,
    setKeepResponsibleForMails,
  ] = useState(false);

  const [
    keepPhonesByPosition,
    setKeepPhonesByPosition,
  ] = useState(false);

  const [
    transferPhones,
    setTransferPhones,
  ] = useState(false);

      const {selectedIds} = useDragContext();
  // =========================
  // Departments
  // =========================

  const departmentsValues = useMemo(
    () =>
      [...departments].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    [departments]
  );

  // =========================
  // Sections
  // =========================

  const filteredSections = useMemo(() => {
    if (departmentId === "") {
      return [];
    }

    return sections
      .filter(
        (section) =>
          Number(section.departmentId) ===
          Number(departmentId)
      )
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  }, [sections, departmentId]);

  const hasSections =
    filteredSections.length > 0;

  // =========================
  // Transfer type
  // =========================

  const handleTransferTypeChange = (e) => {
    const value = e.target.value;

    setTransferType(value);

    setDepartmentId("");
    setSectionId("");
  };

  // =========================
  // Department
  // =========================

  const handleDepartmentChange = (e) => {
    const value = e.target.value;

    setDepartmentId(
      value === "" ? "" : Number(value)
    );

    setSectionId("");
  };

  // =========================
  // Section
  // =========================

  const handleSectionChange = (e) => {
    const value = e.target.value;

    setSectionId(
      value === "" ? "" : Number(value)
    );
  };

  // =========================
  // Transfer availability
  // =========================

  const canTransfer =
    departmentId !== "" &&
    (
      transferType === "department" ||
      (
        transferType === "section" &&
        hasSections &&
        sectionId !== ""
      )
    );

  // =========================
  // Transfer
  // =========================

  const handleTransfer = () => {
    if (!canTransfer) {
      return;
    }

const userIds = selectedIds;
    const data = {
      // userIds: [101, 102, 103],
      userIds,
      transferType,

      departmentId,

      sectionId:
        transferType === "section"
          ? sectionId
          : null,

      keepResponsibleForMails,
      keepPhonesByPosition,
      transferPhones,
    };

    console.log(
      "TRANSFER USER:",
      data
    );
     transferUser(data);

    // alert(
    //   JSON.stringify(
    //     data,
    //     null,
    //     2
    //   )
    // );
  };

  return (
    <TransferUserView
      onClose={onClose}

      transferType={transferType}
      onTransferTypeChange={
        handleTransferTypeChange
      }

      departmentId={departmentId}
      departments={departmentsValues}
      onDepartmentChange={
        handleDepartmentChange
      }

      sectionId={sectionId}
      sections={filteredSections}
      onSectionChange={
        handleSectionChange
      }

      canTransfer={canTransfer}
      onTransfer={handleTransfer}

      keepResponsibleForMails={
        keepResponsibleForMails
      }
      setKeepResponsibleForMails={
        setKeepResponsibleForMails
      }

      keepPhonesByPosition={
        keepPhonesByPosition
      }
      setKeepPhonesByPosition={
        setKeepPhonesByPosition
      }

      transferPhones={transferPhones}
      setTransferPhones={
        setTransferPhones
      }
    />
  );
}

export default TransferUser;
