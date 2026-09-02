import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  selectDictionaryByType,
} from "../../../redux/selectors/selector";

import TransferUserView from "./TransferUserView";
import { useDragContext } from "../../../redux/contexts/useConetxt";
import { transferUser } from "../../../dal/api";

export function TransferUser({ onClose }) {
  const departments = useSelector(
    selectDictionaryByType("deps")
  );

  const sections = useSelector(
    selectDictionaryByType("sections")
  );

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

  const [error, setError] = useState("");

  const { selectedIds } = useDragContext();

  const departmentsValues = useMemo(
    () =>
      [...departments].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    [departments]
  );

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

  const handleTransferTypeChange = (e) => {
    setTransferType(e.target.value);
    setDepartmentId("");
    setSectionId("");
    setError("");
  };

  const handleDepartmentChange = (e) => {
    const value = e.target.value;

    setDepartmentId(
      value === "" ? "" : Number(value)
    );
    setSectionId("");
    setError("");
  };

  const handleSectionChange = (e) => {
    const value = e.target.value;

    setSectionId(
      value === "" ? "" : Number(value)
    );
    setError("");
  };

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

  const handleTransfer = async () => {
    setError("");

    if (!canTransfer) {
      return;
    }

    const data = {
      userIds: selectedIds,
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

    console.log("TRANSFER USER:", data);

    try {
      await transferUser(data);
      onClose();
    } catch (err) {
      console.error("TransferUser error:", err);

      setError(
        err?.response?.data?.message ||
        "Не вдалося перевести користувачів."
      );
    }
  };

  return (
    <TransferUserView
      onClose={onClose}
      error={error}
      transferType={transferType}
      onTransferTypeChange={handleTransferTypeChange}
      departmentId={departmentId}
      departments={departmentsValues}
      onDepartmentChange={handleDepartmentChange}
      sectionId={sectionId}
      sections={filteredSections}
      onSectionChange={handleSectionChange}
      canTransfer={canTransfer}
      onTransfer={handleTransfer}
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
  );
}

export default TransferUser;