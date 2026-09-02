import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  activeMenu,
  selectDictionaryByType,
} from "../../../redux/selectors/selector";

import { fetchDictionariesThunk } from "../../../dal/api";
import { setDataIsLoadedActionCreator } from "../../../redux/reducers/app-reducer";

import AddPhoneView from "./AddPhoneView/AddPhoneView";



export default function AddPhone({
  modalType,
  onClose,
  onSubmit,
  editValue = null,
}) {
  const userPages = useSelector(
    selectDictionaryByType("users")
  );

  const users = userPages.flatMap(
    (page) => page.rows ?? []
  );

  const [phone, setPhone] = useState("");
  const [ownerIds, setOwnerIds] = useState([]);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const menu = useSelector(activeMenu);

  useEffect(() => {
    setError("");

    if (!editValue) {
      setPhone("");
      setOwnerIds([]);
      return;
    }

    setPhone(editValue.number ?? "");

    setOwnerIds(
      editValue.users?.map((user) => user.id) ?? []
    );
  }, [editValue]);

  const addOwner = (id) => {
    if (!id) return;

    setOwnerIds((prev) =>
      prev.includes(id)
        ? prev
        : [...prev, id]
    );
  };

  const removeOwner = (id) => {
    setOwnerIds((prev) =>
      prev.filter((userId) => userId !== id)
    );
  };

  const clearOwners = () => {
    setOwnerIds([]);
  };

  const handleSave = async () => {
    setError("");

    let type;

    switch (modalType) {
      case "landline":
        type = 1;
        break;
      case "internal":
        type = 2;
        break;
      case "cisco":
        type = 3;
        break;
      default:
        type = editValue?.phoneTypeId;
        break;
    }

    try {
      await onSubmit({
        id: editValue?.id,
        name: phone.trim(),
        type,
        assignedUsers: ownerIds,
      });

      dispatch(
        setDataIsLoadedActionCreator(
          false,
          menu
        )
      );

      dispatch(fetchDictionariesThunk());

      onClose();
    } catch (err) {
      console.error("AddPhone error:", err);

      if (err.response?.status === 409) {
        setError(
          err.response?.data?.message ||
          "Телефон з таким номером уже існує."
        );
        return;
      }

      setError("Не вдалося зберегти телефон.");
    }
  };

  return (
    <AddPhoneView
      phone={phone}
      setPhone={(value) => {
        setPhone(value);
        setError("");
      }}
      error={error}
      users={users}
      ownerIds={ownerIds}
      addOwner={addOwner}
      removeOwner={removeOwner}
      clearOwners={clearOwners}
      editValue={editValue}
      onClose={onClose}
      onSave={handleSave}
    />
  );
}