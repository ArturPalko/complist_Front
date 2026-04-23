import { useSearchToggle, usePasswordsToggle, useEditModeToggle } from "../contexts/useConetxt.js";
import { pageConfigs } from "../../configs/app/pageConfig.js";
import { useSelector } from "react-redux";
import { isUserAuthed } from "../selectors/selector.js";

export const useTopTableBarLogic = (pageName) => {
  // Хуки для керування станом чекбоксів
  const { handleToggleSearchField, valueOfSearchCheckBox } = useSearchToggle();
  const { valueOfpasswordCheckbox, handleTogglePasswords } = usePasswordsToggle();
  const {valueOfEditCheckbox, handleToggleEditMode} = useEditModeToggle();

  const isLoggedIn = useSelector(isUserAuthed);
  
  

  // Беремо конфіг сторінки
  const config = pageConfigs[pageName] || {};
  
console.log("ValueOfEdit:", valueOfEditCheckbox)
  return {
    // Стани
    valueOfSearchCheckBox,
    valueOfpasswordCheckbox,
    valueOfEditCheckbox,

    // Колбеки
    handleToggleSearchField,
    handleTogglePasswords,
    handleToggleEditMode,

    // Прапорці видимості чекбоксів
    showSearchToggle: config.showSearchToggle || false,
    showPasswordsToggle: config.showPasswordsToggle && isLoggedIn || false,
    showEditToggle:true
  };
};
