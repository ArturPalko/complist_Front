import {
  useSearchToggle,
  usePasswordsToggle,
  useEditModeToggle,
} from "../contexts/useConetxt.js";

import { pageConfigs } from "../../configs/app/pageConfig.js";
import { useSelector } from "react-redux";
import { getCurrentMode, isUserAuthed } from "../selectors/selector.js";

import { useModal } from "./useLoginModal.js";
import { useCrudModalActions } from "./useCrudModalActions";

export const useTopTableBarLogic = (pageName) => {
  const { openModal } = useModal();
  const modalType = useSelector(getCurrentMode)

  const {
    valueOfSearchCheckBox,
    handleToggleSearchField,
  } = useSearchToggle();

  const {
    valueOfpasswordCheckbox,
    handleTogglePasswords,
  } = usePasswordsToggle();

  const {
    valueOfEditCheckbox,
    handleToggleEditMode,
  } = useEditModeToggle();

  const isLoggedIn = useSelector(isUserAuthed);

  // 👉 вся CRUD логіка тепер тут
  const { add, edit, remove } = useCrudModalActions(modalType);

  const config = pageConfigs[pageName] || {};

  return {
    // toggles
    valueOfSearchCheckBox,
    valueOfpasswordCheckbox,
    valueOfEditCheckbox,

    handleToggleSearchField,
    handleTogglePasswords,
    handleToggleEditMode,

    // permissions UI
    showSearchToggle: config.showSearchToggle || false,
    showPasswordsToggle: config.showPasswordsToggle && isLoggedIn || false,
    showEditToggle: true,

    // actions
    add,
    edit,
    remove,
  };
};