import { useSearchToggle, usePasswordsToggle } from "../contexts/useConetxt.js";
import { pageConfigs } from "../../configs/app/pageConfig.js";
import { useSelector } from "react-redux";
import { isUserAuthed } from "../selectors/selector.js";

export const useTopTableBarLogic = (pageName) => {
  // Хуки для керування станом чекбоксів
  const { handleToggleSearchField, valueOfSearchCheckBox } = useSearchToggle();
  const { valueOfpasswordCheckbox, handleTogglePasswords } = usePasswordsToggle();
  const isLoggedIn = useSelector(isUserAuthed);
  
  

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
    showPasswordsToggle: config.showPasswordsToggle && isLoggedIn || false
  };
};
