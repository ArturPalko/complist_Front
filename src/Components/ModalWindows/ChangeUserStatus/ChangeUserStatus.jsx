import { useState } from "react";
import { useDispatch } from "react-redux";

import ChangeUserStatusView from "./ChangeUserStatusView/ChangeUserStatusView";
import { Pages } from "../../../configs/app/constants";
import { setDataIsLoadedActionCreator } from "../../../redux/reducers/app-reducer";
import { fetchDictionariesThunk } from "../../../dal/api";

export default function ChangeUserStatus({
  selectedUserIds,
  onClose,
  onSubmit,
}) {
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleConfirm = async () => {
    if (isSaving) return;

    setError("");
    setIsSaving(true);

    try {
      await onSubmit();

      Object.values(Pages).forEach((page) => {
        dispatch(
          setDataIsLoadedActionCreator(false, page)
        );
      });

      dispatch(fetchDictionariesThunk());

      onClose();
    } catch (error) {
      console.error("ChangeUserStatus error:", error);

      setError(
        error?.response?.data?.message ||
        "Не вдалося змінити статус користувачів."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ChangeUserStatusView
      onConfirm={handleConfirm}
      onClose={onClose}
      error={error}
      isSaving={isSaving}
    />
  );
}

