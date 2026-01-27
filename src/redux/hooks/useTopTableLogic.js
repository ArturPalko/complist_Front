import { useSearchToggle, usePasswordsToggle } from "../../redux/hooks/hooks.js";
import { Pages } from "../../redux/selectors/constants.js";

export const useTopTableBarState = (mailType) => {
  const { handleToggleSearchField, valueOfSearchCheckBox } = useSearchToggle();
  const { valueOfpasswordCheckbox, handleTogglePasswords } = usePasswordsToggle();

  const showPasswordsToggle = mailType === Pages.LOTUS || mailType === Pages.GOV_UA;

  return {
    valueOfSearchCheckBox,
    handleToggleSearchField,
    valueOfpasswordCheckbox,
    handleTogglePasswords,
    showPasswordsToggle
  };
};
