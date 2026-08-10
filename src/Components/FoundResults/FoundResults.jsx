import { connect } from "react-redux";

import TooManyResultsOfSearch from "../UI/TooManyResultsOfSearch/TooManyResultsOFSearch.jsx";

import {
  Pages,
  // якщо Pages.DICTIONARIES вже є
} from "../../configs/app/constants.js";

import {
  activeMenu,
  getDataForMenu,
  selectSearchValueByPage,
  isFilterAppliedSelector,
  getCurrentMode,
} from "../../redux/selectors/selector";

import { useFoundResults } from "../../redux/hooks/useFoundResults.js";

import { getPageComponent } from "../../configs/app/pageComponent.js";

import { FoundResultsContext } from "../../redux/contexts/useConetxt.js";


const FoundResults = ({
  activeMenu,
  data,
  foundSearchValues,
  isFilterApplied,
  currentMode,
}) => {

  /*
   * =====================================================
   * КЛЮЧ ПОШУКУ
   * =====================================================
   *
   * Звичайні меню:
   *
   *   Gov-ua
   *   Lotus
   *   phones
   *
   * Dictionary:
   *
   *   positions
   *   departments
   *   sections
   *   userTypes
   *
   * всі використовують:
   *
   *   searchField.dictionary
   */

  const searchKey = currentMode
    ? Pages.DICTIONARIES
    : activeMenu;


  console.log("========== FOUND RESULTS ==========");
  console.log("activeMenu:", activeMenu);
  console.log("currentMode:", currentMode);
  console.log("searchKey:", searchKey);
  console.log("data:", data);
  console.log("foundSearchValues:", foundSearchValues);


  const {
    presentRows,
    indexDataOfFoundResultsForFoundResultsPage,
    tooManyResults,
  } = useFoundResults(
    data,
    foundSearchValues,
    searchKey,
    isFilterApplied
  );


  console.log(
    "presentRows:",
    presentRows
  );

  console.log(
    "indexData:",
    indexDataOfFoundResultsForFoundResultsPage
  );

  console.log(
    "tooManyResults:",
    tooManyResults
  );


  /*
   * =====================================================
   * COMPONENT
   * =====================================================
   */

  const ActiveComponent = getPageComponent(
    activeMenu,
    currentMode
  );


  if (tooManyResults) {
    return <TooManyResultsOfSearch />;
  }

  if (!ActiveComponent) {
    return null;
  }


  return (
    <FoundResultsContext.Provider
      value={{
        /*
         * Для Dictionary передаємо dictionary,
         * а не Gov-ua / Lotus / phones.
         */
        pageName: searchKey,

        foundResults: presentRows,

        indexDataOfFoundResultsForFoundResultsPage,
      }}
    >
      <ActiveComponent />
    </FoundResultsContext.Provider>
  );
};


// =====================================================
// REDUX
// =====================================================

const mapStateToProps = (state) => {

  const menu = activeMenu(state);

  const currentMode = getCurrentMode(state);

  /*
   * Той самий принцип, що і в Search / PagesNavBar.
   */
  const searchKey = currentMode
    ? Pages.DICTIONARIES
    : menu;


  /*
   * Тут НЕ треба робити reduce по всіх Pages.
   *
   * Нам потрібен конкретний search state.
   */

  const foundSearchValues = {
    [searchKey]:
      selectSearchValueByPage(searchKey)(state),
  };


  console.log(
    "FoundResults mapState searchKey:",
    searchKey
  );

  console.log(
    "FoundResults search value:",
    selectSearchValueByPage(searchKey)(state)
  );


  return {

    activeMenu: menu,

    currentMode,

    /*
     * Дані Dictionary ми вже отримуємо
     * відповідно до currentMode через getDataForMenu.
     */
    data: getDataForMenu(state, menu),

    foundSearchValues,

    isFilterApplied:
      isFilterAppliedSelector(menu)(state),
  };
};


export default connect(
  mapStateToProps
)(FoundResults);