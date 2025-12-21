import { connect } from "react-redux";
import { useState } from "react";
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
  GovUaCurrentPage,
  lotusCurrentPage,
  phonesCurrentPage
} from "../../redux/selectors/selector";
import { createContext } from "react";
import { redirectToPage } from "../../Components/NavBar/commonFunctions.js";

export const SearchToggleContext = createContext(null);
export const PasswordsToggleContext = createContext(null);

const withToggleElements = (type) => (WrappedComponent) => {
  const HOC = (props) => {
    const navigate = useNavigate();
    const activeMenu = props.activeMenu;
  const  GovUaCurrentPage = props.GovUaCurrentPage;
  const      lotusCurrentPage = props.lotusCurrentPage;
  const phonesCurrentPage=  props.phonesCurrentPage;
    /* ===== SEARCH (Redux) ===== */
    const handleToggleSearchField = (e) => {
      const checked = e?.target?.checked ?? false;
      props.toggleSearchField(checked);

      if (!checked) {
        props.clearSearchFieldsAndFoundResults();

        // Редірект тільки якщо застосовані фільтри
        if (props.isFilterApplied) {
          redirectToPage({
            navigate,
            activeMenu,
            GovUaCurrentPage,
            lotusCurrentPage,
            phonesCurrentPage: props.phonesCurrentPage
          });
        }
      }
    };

    /* ===== PASSWORDS (локальний state) ===== */
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
        const urlMap = {
          "Lotus": "http://localhost:5114/mails/Lotus/passwords",
          "Gov-ua": "http://localhost:5114/mails/Gov-ua/passwords"
        };

        const response = await fetch(urlMap[type]);
        if (!response.ok) throw new Error("Passwords fetch failed");

        const data = await response.json();
        const map = {};
        data.forEach(item => (map[item.id] = item.password));
        setPasswordsMap(map);
      } catch (err) {
        console.error(err);
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

  const mapStateToProps = (state) => {
    const active = activeMenu(state);

    return {
      activeMenu: active,
      isPresentedSearchField: !!isPresentedSearchField(state),
      isPagesNavbarLinkElementOnCurrentPagePressed:
        !!isPagesNavbarLinkElementOnCurrentPagePressed(state),
      isFilterApplied: isFilterAppliedSelector(state, active), // boolean
      GovUaCurrentPage: GovUaCurrentPage(state),
      lotusCurrentPage: lotusCurrentPage(state),
      phonesCurrentPage: phonesCurrentPage(state)
    };
  };

  const mapDispatchToProps = {
    toggleSearchField: toggleSearchFieldActionCreator,
    clearSearchFieldsAndFoundResults
  };

  return connect(mapStateToProps, mapDispatchToProps)(HOC);
};

export default withToggleElements;
