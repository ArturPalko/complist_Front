import { connect } from "react-redux";
import { createContext } from "react";
import TooManyResultsOfSearch from "../TooManyResultsOfSearch/TooManyResultsOFSearch";

import { Pages } from "../../configs/constants.js";
import { activeMenu, getDataForMenu, selectSearchValueByPage, isFilterAppliedSelector } from "../../redux/selectors/selector";
import { useFoundResults } from "../../redux/hooks/useFoundResults.js"
import {getPageComponent} from "../../configs/pageComponent.js"

export const FoundResultsContext = createContext(null);

const FoundResults = ({ activeMenu, data, foundSearchValues, isFilterApplied }) => {
  const { presentRows, indexDataOfFoundResultsForFoundResultsPage, tooManyResults } =
    useFoundResults(data, foundSearchValues, activeMenu, isFilterApplied);

  const ActiveComponent = getPageComponent(activeMenu);


  if (tooManyResults) return <TooManyResultsOfSearch />;
  if (!ActiveComponent) return null;
  return (
    <FoundResultsContext.Provider value={{ 
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

  const foundSearchValues = Object.values(Pages).reduce((acc, pageKey) => {
    acc[pageKey] = selectSearchValueByPage(pageKey)(state);
    return acc;
  }, {});

  return {
    activeMenu: menu,
    data: getDataForMenu(state, menu),
    foundSearchValues,
    isFilterApplied: isFilterAppliedSelector(menu)(state)
  };
};

export default connect(mapStateToProps)(FoundResults);
