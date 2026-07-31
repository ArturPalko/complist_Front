import { useState } from "react";
import { useSelector } from "react-redux";

import s from "./AddPhone.module.css";
import form from "../../../shared/Css/form.module.css";

import { selectDictionaryByType } from "../../../redux/selectors/selector";

import ResponsibleUsers from "../AddMail/subComponents/ResponsibleUsersSelector/ResponsibleUsersSelector";
import FormButtons from "../AddMail/subComponents/FormButtons/FormButtons";

export default function AddPhone({modalType, onClose, onSubmit, editValue = null }) {
  const users = useSelector(selectDictionaryByType("users"));

  const [phone, setPhone] = useState(editValue?.phone ?? "");
  const [ownerIds, setOwnerIds] = useState(editValue?.ownerIds ?? []);

  const addOwner = (id) => {
      if(!id) return
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

  const handleSave = () => {
    let type;

    switch(modalType){
      case "internal":
        type = 2
        break
      
      case "lanline":
        type = 1
        break
      
      case "cisco":
        type = 3
        break
    }
    debugger
    
  onSubmit({
  name: phone,
  type,
  assignedUsers: ownerIds,
});
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