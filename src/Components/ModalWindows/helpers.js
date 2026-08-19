import {
  apiDeleteEntity,
  deleteMail,
   apiAddEntity,
  apiEditEntity,
  addMail,
  editMail,
  apiAssignPhonesToUser
} from "../../dal/api";

export async function handleDelete({
  isPhoneModal,
  isMailModal,
  isUsersContext,
  modalData,
  config,
}) {
  if (isPhoneModal) {
    return apiDeleteEntity("phones", modalData);
  }

  if (isMailModal) {
    return deleteMail(modalData);
  }

  if (isUsersContext) {
    return apiDeleteEntity("users", modalData);
  }

  return apiDeleteEntity(config.endpoint, modalData);
}


export async function handleSubmit({
  isAdd,
  isEdit,
  isPhoneModal,
  isMailModal,
  isUsersContext,
  isBindPhonesModal,
  data,
  modalData,
  menu,
  config,
}) {
  if (isBindPhonesModal) {
    return apiAssignPhonesToUser(data);
  }

  if (isPhoneModal) {
    return isAdd
      ? apiAddEntity("phones", data)
      : apiEditEntity("phones", data);
  }

  if (isMailModal) {
    return isAdd
      ? addMail(data, menu)
      : editMail(data);
  }

  if (isUsersContext) {
    return isAdd
      ? apiAddEntity("users", data)
      : apiEditEntity("users", {
          id: modalData.id,
          ...data,
        });
  }

  const payload = isAdd
    ? config.mappers.add(data, modalData)
    : config.mappers.edit(data, modalData);

  return isAdd
    ? apiAddEntity(config.endpoint, payload)
    : apiEditEntity(config.endpoint, payload);
}