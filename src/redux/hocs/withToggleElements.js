import { connect } from "react-redux";
import { toggleSearchFieldActionCreator } from "../toggledElements-reducer";
import { isPresentedSearchField, isPagesNavbarLinkElementOnCurrentPagePressed} from "../../redux/selectors/selector";

const withToggleElements = (WrappedComponent) => {
  const HOC = (props) => {
    const handleToggleSearch = (e) => {
      const checked = e?.target?.checked ?? false;
      props.toggleSearchField(checked); 
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
      <WrappedComponent
        {...props}
        handleToggleSearchField={handleToggleSearch}
        togglePasswords={togglePasswords}
      />
    );
  };

  const mapStateToProps = (state) => ({
    isPresentedSearchField: !!isPresentedSearchField(state),
    isPagesNavbarLinkElementOnCurrentPagePressed:isPagesNavbarLinkElementOnCurrentPagePressed(state)
    
  });

  const mapDispatchToProps = {
    toggleSearchField: toggleSearchFieldActionCreator
  };

  return connect(mapStateToProps, mapDispatchToProps)(HOC);
};

export default withToggleElements;
