import { connect } from "react-redux";
import { useState } from "react";
import {
  toggleSearchFieldActionCreator,
  clearSearchFieldsAndFoundResults
} from "../toggledElements-reducer";
import {
  isPresentedSearchField,
  isPagesNavbarLinkElementOnCurrentPagePressed
} from "../../redux/selectors/selector";
import { createContext } from "react";



// Контексти
export const SearchToggleContext = createContext(null);
export const PasswordsToggleContext = createContext(null);

const withToggleElements = (type) => (WrappedComponent) => {
  const HOC = (props) => {
    /* ===== SEARCH (Redux) ===== */
    const handleToggleSearchField = (e) => {
      const checked = e?.target?.checked ?? false;
      props.toggleSearchField(checked);
      if (!checked) props.clearSearchFieldsAndFoundResults();
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
        // Робимо запит залежно від типу
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
        debugger;
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

  const mapStateToProps = (state) => ({
    isPresentedSearchField: !!isPresentedSearchField(state),
    isPagesNavbarLinkElementOnCurrentPagePressed:
      !!isPagesNavbarLinkElementOnCurrentPagePressed(state)
  });

  const mapDispatchToProps = {
    toggleSearchField: toggleSearchFieldActionCreator,
    clearSearchFieldsAndFoundResults
  };

  return connect(mapStateToProps, mapDispatchToProps)(HOC);
};

export default withToggleElements;
