import { connect } from "react-redux";
import TooManyResultsOfSearch from "../UI/TooManyResultsOfSearch/TooManyResultsOFSearch.jsx"

import { Pages } from "../../configs/app/constants.js";
import { activeMenu, getDataForMenu, selectSearchValueByPage, isFilterAppliedSelector, getCurrentMode } from "../../redux/selectors/selector";
import { useFoundResults } from "../../redux/hooks/useFoundResults.js"
import { getPageComponent } from "../../configs/app/pageComponent.js";
import { FoundResultsContext } from "../../redux/contexts/useConetxt.js";


const FoundResults = ({ activeMenu, data, foundSearchValues, isFilterApplied, currentMode }) => {
  const { presentRows, indexDataOfFoundResultsForFoundResultsPage, tooManyResults } =
    useFoundResults(data, foundSearchValues, activeMenu, isFilterApplied);
    
console.log("FoundResults render!!!!!!!!!!++++++++++///////////////////");
// console.log ("preset:", presentRows)


  const ActiveComponent = getPageComponent(activeMenu,currentMode);
debugger
console.log("presentRows:", presentRows)
  if (tooManyResults) return <TooManyResultsOfSearch />;
  if (!ActiveComponent) return null;
  return (
    <FoundResultsContext.Provider value={{ 
      pageName:activeMenu,
      foundResults: presentRows,
      indexDataOfFoundResultsForFoundResultsPage
    }}>
      <ActiveComponent />
    </FoundResultsContext.Provider>
  );
};

// ===== Redux =====
const mapStateToProps = (state) => {
  const menu = activeMenu(state);
  const currentMode = getCurrentMode(state)

  const foundSearchValues = Object.values(Pages).reduce((acc, pageKey) => {
    acc[pageKey] = selectSearchValueByPage(pageKey)(state);
    return acc;
  }, {});


  return {
    activeMenu: menu,
    currentMode,
    data: getDataForMenu(state, menu),
    foundSearchValues,
    isFilterApplied: isFilterAppliedSelector(menu)(state)
  };
};

export default connect(mapStateToProps)(FoundResults);
