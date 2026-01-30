import { connect } from "react-redux";
import { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  toggleSearchFieldActionCreator,
  clearSearchFieldsAndFoundResults
} from "../toggledElements-reducer";

import {
  isPresentedSearchField,
  isPagesNavbarLinkElementOnCurrentPagePressed,
  isFilterAppliedSelector,
  activeMenu,
  currentPageByMenu
} from "../../redux/selectors/selector";

import { redirectToPage } from "../../Components/NavBar/commonFunctions.js";
import { fetchPasswordsByType } from "../../redux/api/api"; // через Axios

// Контексти для Search та Passwords
export const SearchToggleContext = createContext(null);
export const PasswordsToggleContext = createContext(null);

// HOC
const withToggleElements = (type) => (WrappedComponent) => {
  const HOC = (props) => {
    const navigate = useNavigate();

    const {
      activeMenu: menuFromProps,
      currentPage,
      isFilterApplied
    } = props;

    /* ===== SEARCH (Redux) ===== */
    const handleToggleSearchField = (e) => {
      const checked = e?.target?.checked ?? false;
      props.toggleSearchField(checked);

      if (!checked) {
        props.clearSearchFieldsAndFoundResults();

        // редірект тільки якщо були застосовані фільтри
        if (isFilterApplied) {
          redirectToPage({
            navigate,
            activeMenu: menuFromProps,
            currentPage
          });
        }
      }
    };

    /* ===== PASSWORDS (local state) ===== */
    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordsMap, setPasswordsMap] = useState({});

    const handleTogglePasswords = async (e) => {
      const checked = e.target.checked;
      setShowPasswords(checked);

      if (!checked) {
        setPasswordsMap({});
        return;
      }

      try {
        // Використовуємо Axios з api.js
        const map = await fetchPasswordsByType(type);
        setPasswordsMap(map);
      } catch (err) {
        console.error("Помилка завантаження паролів:", err.message);
      }
    };

    return (
      <SearchToggleContext.Provider
        value={{
          handleToggleSearchField,
          valueOfSearchCheckBox: props.isPresentedSearchField,
          isPagesNavbarLinkElementOnCurrentPagePressed:
            props.isPagesNavbarLinkElementOnCurrentPagePressed
        }}
      >
        <PasswordsToggleContext.Provider
          value={{
            showPasswords,
            passwordsMap,
            handleTogglePasswords
          }}
        >
          <WrappedComponent
            {...props}
            showPasswords={showPasswords}
            passwordsMap={passwordsMap}
          />
        </PasswordsToggleContext.Provider>
      </SearchToggleContext.Provider>
    );
  };

  /* ===== Redux mapState & mapDispatch ===== */
  const mapStateToProps = (state) => {
    const menu = activeMenu(state);

    return {
      activeMenu: menu,
      currentPage: currentPageByMenu(state, menu),
      isPresentedSearchField: !!isPresentedSearchField(state),
      isPagesNavbarLinkElementOnCurrentPagePressed:
        !!isPagesNavbarLinkElementOnCurrentPagePressed(state),
      isFilterApplied: isFilterAppliedSelector(state, menu)
    };
  };

  const mapDispatchToProps = {
    toggleSearchField: toggleSearchFieldActionCreator,
    clearSearchFieldsAndFoundResults
  };

  return connect(mapStateToProps, mapDispatchToProps)(HOC);
};

export default withToggleElements;
