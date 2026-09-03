import { setDataIsLoadedActionCreator } from "../../../../redux/reducers/app-reducer";

export const handleSave = async ({
  autoUpdatePreviousName,
  id,
  menu,
  mail,
  previousName,

  ownerType,
  ownerId,
  ownerIds,
  ownerDisplayName,

  passwordKnown,
  password,
  responsibleUserIds,

  onSubmit,
  dispatch,
  onClose,
}) => {
  const data = {
    autoUpdatePreviousName,
    id,
    menu,
    mail,
    previousName,

    ownerType,
    ownerId,
    ownerIds,
    ownerDisplayName,

    passwordKnown,
    password,
    responsibleUserIds,
  };


  await onSubmit(data);

  dispatch(
    setDataIsLoadedActionCreator(
      false,
      menu
    )
  );

  onClose();
};