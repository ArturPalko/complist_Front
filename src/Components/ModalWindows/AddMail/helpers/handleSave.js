import { setDataIsLoadedActionCreator } from "../../../../redux/reducers/app-reducer";

export const handleSave = async ({
  id,
  menu,
  mail,
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
      id,
      menu,
      mail,
      ownerType,
      ownerId,
      passwordKnown,
      password,
      responsibleUserIds,
    };

    console.log(data);

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