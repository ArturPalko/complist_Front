import { fetchPasswordById } from "../../../../dal/api";

export const handleShowPassword = async ({
  showPassword,
  setShowPassword,
  setPassword,
  menu,
  id,
}) => {
  if (showPassword) {
    setShowPassword(false);
    return;
  }

  const password = await fetchPasswordById(
    menu,
    id
  );

  setPassword(password);
  setShowPassword(true);
};

