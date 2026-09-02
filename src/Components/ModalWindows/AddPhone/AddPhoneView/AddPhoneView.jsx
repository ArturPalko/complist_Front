import s from "./AddPhoneView.module.css"
import form from "../../../../shared/Css/form.module.css"

import ResponsibleUsers from "../../AddMail/subComponents/ResponsibleUsersSelector/ResponsibleUsersSelector";
import FormButtons from "../../AddMail/subComponents/FormButtons/FormButtons";

export default function AddPhoneView({
  phone,
  setPhone,
  error,
  users,
  ownerIds,
  addOwner,
  removeOwner,
  clearOwners,
  editValue,
  onClose,
  onSave,
}) {
  return (
    <div className={s.container}>
      <div className={s.modal}>
        <div className={form.field}>
          <label className={form.label}>
            Номер телефону
          </label>

          <input
            className={form.input}
            type="text"
            placeholder="Введіть номер телефону"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {error && (
            <p className={form.error}>
              {error}
            </p>
          )}
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
          onSave={onSave}
          isEdit={!!editValue}
        />
      </div>
    </div>
  );
}