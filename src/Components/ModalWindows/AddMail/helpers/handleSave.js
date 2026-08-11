import { setDataIsLoadedActionCreator } from "../../../../redux/reducers/app-reducer";

export const handleSave = async ({
  autoUpdatePreviousName,
  id,
  menu,
  mail,
  previousName,
  ownerType,
  ownerId,
  passwordKnown,
  password,
  responsibleUserIds,
  onSubmit,
  dispatch,
  onClose,
}) => {
  try {
    const data = {
      autoUpdatePreviousName,
      id,
      menu,
      mail,
      previousName,
      ownerType,
      ownerId,
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
  } catch (error) {
    console.error(error);
  }
};