import { useSearchToggle, usePasswordsToggle } from "./hooks.js";
import { pageConfigs } from "../../configs/app/pageConfig.js";

export const useTopTableBarLogic = (pageName) => {
  // Хуки для керування станом чекбоксів
  const { handleToggleSearchField, valueOfSearchCheckBox } = useSearchToggle();
  const { valueOfpasswordCheckbox, handleTogglePasswords } = usePasswordsToggle();

  // Беремо конфіг сторінки
  const config = pageConfigs[pageName] || {};

  return {
    // Стани
    valueOfSearchCheckBox,
    valueOfpasswordCheckbox,

    // Колбеки
    handleToggleSearchField,
    handleTogglePasswords,

    // Прапорці видимості чекбоксів
    showSearchToggle: config.showSearchToggle || false,
    showPasswordsToggle: config.showPasswordsToggle || false
  };
};
