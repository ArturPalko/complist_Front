import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { activeMenu } from "../../../redux/selectors/selector";

import BindPhonesToUserView from "./BindPhonesToUserView/BindPhonesToUserView";

import {
  setDataIsLoadedActionCreator,
} from "../../../redux/reducers/app-reducer";

import { fetchDictionariesThunk } from "../../../dal/api";

import { EMPTY_PHONE_VALUES } from "../../../redux/hooks/useBindPhonesToUserData/helpers";
import useBindPhonesToUserData from "../../../redux/hooks/useBindPhonesToUserData/useBindPhonesToUserData";
import { scrollContainerToBottom } from "./helpers";

export default function BindPhonesToUser({
  onSubmit,
  onClose,
  deprs,
}) {
  const [departmentId, setDepartmentId] = useState("");
  const [sectionId, setSectionId] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferId, setTransferId] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const [phoneValues, setPhoneValues] = useState({
    ...EMPTY_PHONE_VALUES,
  });

  const formRef = useRef(null);

  const dispatch = useDispatch();
  const menu = useSelector(activeMenu);

  const {
    departments,
    selectedDepartment,
    sections,
    users,
    selectedUser,
    userPhones,
    phoneOptions,
    hasPhone,
    hasAnyPhone,
    transferUsers,
  } = useBindPhonesToUserData({
    deprs,
    departmentId,
    sectionId,
    selectedUserId,
  });
  
  // LOAD USER PHONES
  // userPhones intentionally not in dependencies,
  // so local phone changes are not overwritten by Redux.
  useEffect(() => {
    if (!selectedUserId) {
      setPhoneValues({
        ...EMPTY_PHONE_VALUES,
      });
      return;
    }

    setPhoneValues({
      landline: userPhones?.landline || "",
      internal: userPhones?.internal || "",
      cisco: userPhones?.cisco || "",
    });
  }, [selectedUserId]);

  // COMMON SCROLL
  useEffect(() => {
    if (!selectedUserId && !showTransfer) {
      return;
    }

    scrollContainerToBottom(formRef.current);
  }, [selectedUserId, showTransfer]);

  // SCROLL WHEN STATUS OR ERROR APPEARS
  useEffect(() => {
    if (!status && !error) return;

    setTimeout(() => {
      scrollContainerToBottom(formRef.current);
    }, 0);
  }, [status, error]);

  const handleScrollToBottom = () => {
    scrollContainerToBottom(formRef.current);
  };

  const resetSelection = () => {
    setSelectedUserId(null);
    setShowTransfer(false);
    setTransferId("");
    setStatus("");
    setError("");

    setPhoneValues({
      ...EMPTY_PHONE_VALUES,
    });
  };

  const handleDepartmentChange = (event) => {
    setDepartmentId(event.target.value);
    setSectionId("all");
    resetSelection();
  };

  const handleSectionChange = (event) => {
    setSectionId(event.target.value);
    resetSelection();
  };

  const handleSelectUser = (user) => {
    setSelectedUserId(user.id);
    setShowTransfer(false);
    setTransferId("");
    setStatus("");
    setError("");
  };

  const handlePhoneChange = (type, value) => {
    setPhoneValues((prev) => ({
      ...prev,
      [type]: value,
    }));

    setStatus("");
    setError("");
  };

  const handleClearPhone = (type) => {
    setPhoneValues((prev) => ({
      ...prev,
      [type]: "",
    }));

    setError("");

    setStatus(
      `Значення ${type} буде очищено після збереження.`
    );
  };

  const handleUnbindAll = () => {
    if (!selectedUser) return;

    setPhoneValues({
      ...EMPTY_PHONE_VALUES,
    });

    setError("");

    setStatus(
      "Усі телефони буде відв'язано після збереження."
    );
  };

  const handleToggleTransfer = () => {
    setShowTransfer((value) => !value);
    setTransferId("");
    setError("");
    setStatus("");
  };

const handleSave = async () => {
  if (!selectedUser) return;

  setIsSaving(true);
  setError("");

  try {
    const data = {
      userId: selectedUser.id,
      phones: phoneValues,
      transferId: transferId || null,
    };

    await onSubmit(data);

    setStatus("");

    if (transferId) {
      setPhoneValues({
        ...EMPTY_PHONE_VALUES,
      });

      setTransferId("");
      setShowTransfer(false);
    }

    dispatch(
      setDataIsLoadedActionCreator(false, menu)
    );

    dispatch(fetchDictionariesThunk());

  } catch (error) {
    console.error("Помилка збереження:", error);

    setStatus("");

    setError(
      error?.response?.data?.message ||
      "Не вдалося зберегти зміни."
    );

  } finally {
    setIsSaving(false);
  }
};

  return (
    <BindPhonesToUserView
      onClose={onClose}
      departments={departments}
      departmentId={departmentId}
      sectionId={sectionId}
      selectedDepartment={selectedDepartment}
      sections={sections}
      onDepartmentChange={handleDepartmentChange}
      onSectionChange={handleSectionChange}
      users={users}
      selectedUserId={selectedUserId}
      onSelectUser={handleSelectUser}
      hasPhone={hasPhone}
      hasAnyPhone={hasAnyPhone}
      selectedUser={selectedUser}
      phoneOptions={phoneOptions}
      phoneValues={phoneValues}
      onPhoneChange={handlePhoneChange}
      onClearPhone={handleClearPhone}
      showTransfer={showTransfer}
      onToggleTransfer={handleToggleTransfer}
      transferUsers={transferUsers}
      transferId={transferId}
      onTransferUserChange={setTransferId}
      onDropDownInputFocus={handleScrollToBottom}
      status={status}
      error={error}
      onUnbindAll={handleUnbindAll}
      onSave={handleSave}
      formRef={formRef}
      isSaving={isSaving}
    />
  );
}

