import { connect } from "react-redux";
import { createContext } from "react";
import { togglepagesNavbarLinkElementOnCurrentPage, toggleSearchFieldActionCreator, clearSearchFieldsAndFoundResults } from "../toggledElements-reducer";
import { isPresentedSearchField, isPagesNavbarLinkElementOnCurrentPagePressed} from "../../redux/selectors/selector";


export const ToggleElementsContext = createContext(null)
const withToggleElements = (WrappedComponent) => {
  const HOC = (props) => {
    const handleToggleSearchField = (e) => {
      const checked = e?.target?.checked ?? false;
      props.toggleSearchField(checked);
      !checked && props.clearSearchFieldsAndFoundResults();
    };

    const togglePasswords = async (checked, setPasswordsMap) => {
      if (checked) {
        try {
          const response = await fetch(`http://localhost:5114/mails/Lotus/passwords`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();

          const map = {};
          data.forEach(item => (map[item.id] = item.password));

          setPasswordsMap(map);
        } catch (error) {
          console.error("Fetch passwords error:", error);
        }
      } else {
        setPasswordsMap({});
      }
    };


    return (
        <ToggleElementsContext.Provider
        value={{
          handleToggleSearchField, 
          valueOfSearchCheckBox: props.isPresentedSearchField, 
          isPagesNavbarLinkElementOnCurrentPagePressed:props.isPagesNavbarLinkElementOnCurrentPagePressed,
      togglePasswords
  }}
>
  <WrappedComponent />
</ToggleElementsContext.Provider>

    
    );
  };

  const mapStateToProps = (state) => ({
    isPresentedSearchField: !!isPresentedSearchField(state),
    isPagesNavbarLinkElementOnCurrentPagePressed:isPagesNavbarLinkElementOnCurrentPagePressed(state),
    
  });

  const mapDispatchToProps = {
    toggleSearchField: toggleSearchFieldActionCreator,
    clearSearchFieldsAndFoundResults: clearSearchFieldsAndFoundResults
  };

  return connect(mapStateToProps, mapDispatchToProps)(HOC);
};

export default withToggleElements;
