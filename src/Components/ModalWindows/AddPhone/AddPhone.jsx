import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import s from "./AddPhone.module.css";
import form from "../../../shared/Css/form.module.css";

import { activeMenu, selectDictionaryByType } from "../../../redux/selectors/selector";

import ResponsibleUsers from "../AddMail/subComponents/ResponsibleUsersSelector/ResponsibleUsersSelector";
import FormButtons from "../AddMail/subComponents/FormButtons/FormButtons";
import { setDataIsLoadedActionCreator } from "../../../redux/reducers/app-reducer";

export default function AddPhone({
  modalType,
  onClose,
  onSubmit,
  editValue = null,
}) {
  const users = useSelector(selectDictionaryByType("users"));

  const [phone, setPhone] = useState("");
  const [ownerIds, setOwnerIds] = useState([]);
  const dispatch = useDispatch();
  const menu = useSelector(activeMenu);

  useEffect(() => {
    if (!editValue) {
      setPhone("");
      setOwnerIds([]);
      return;
    }

    setPhone(editValue.number ?? "");
    setOwnerIds(editValue.users?.map((user) => user.id) ?? []);
  }, [editValue]);

  const addOwner = (id) => {
    if (!id) return;

    setOwnerIds((prev) =>
      prev.includes(id) ? prev : [...prev, id]
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

  await  onSubmit({
      id: editValue?.id,
      name: phone,
      type,
      assignedUsers: ownerIds,
    });

     dispatch(
          setDataIsLoadedActionCreator(
            false,
            menu
          )
        );
  };

  return (
    <div className={s.container}>
      <div className={s.modal}>
        <div className={form.field}>
          <label className={form.label}>Номер телефону</label>

          <input
            className={form.input}
            type="text"
            placeholder="Введіть номер телефону"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <ResponsibleUsers
          users={users}
          responsibleUserIds={ownerIds}
          addResponsibleUser={addOwner}
          removeResponsibleUser={removeOwner}
          removeAllResponsibleUsers={clearOwners}
        />

        <FormButtons
          onCancel={onClose}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}