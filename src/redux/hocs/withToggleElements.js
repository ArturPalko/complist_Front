import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  toggleSearchFieldActionCreator,
  clearSearchFieldsAndFoundResults
} from "../reducers/toggledElements-reducer.js";

import {
  isPresentedSearchField,
  isPagesNavbarLinkElementOnCurrentPagePressed,
  isFilterAppliedSelector,
  activeMenu,
  currentPageByMenu,
  isUserAuthed
} from "../../redux/selectors/selector";
import {SearchToggleContext, PasswordsToggleContext} from "../contexts/useConetxt.js"

import { redirectToPage } from "../../shared/functions/redirectToPage.js";
import { fetchPasswordsByType } from "../../dal/api.js"; 


// HOC
const withToggleElements = (type) => (WrappedComponent) => {
  const HOC = (props) => {
    const navigate = useNavigate();

    const {
      activeMenu: menuFromProps,
      currentPage,
      isFilterApplied
    } = props;
      /* ===== RESET showPasswords якщо користувач не залогінений ===== */
  useEffect(() => {
    if (!props.isUserAuthed) {
      setShowPasswords(false);
      setPasswordsMap({});
    }
  }, [props.isUserAuthed]);

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
      isFilterApplied: isFilterAppliedSelector(state, menu),
      isUserAuthed :isUserAuthed(state)
    };
  };

  const mapDispatchToProps = {
    toggleSearchField: toggleSearchFieldActionCreator,
    clearSearchFieldsAndFoundResults
  };

  return connect(mapStateToProps, mapDispatchToProps)(HOC);
};

export default withToggleElements;
