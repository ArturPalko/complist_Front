import { 
  activeMenu, getPhones, getGovUaMails, getLotusMails,
 selectSearchValueByPage, rowsPerPage, isFilterAppliedSelector
} from "../../redux/selectors/selector";
import { connect } from "react-redux";
import { useEffect, useState, createContext } from "react";
import PhonesPage from "../Phones/Phones";
import LotusMails from "../LotusMails/LotusMails";
import GovUaMails from "../GovUaMails/GovUaMails";
import TooManyResultsOfSearch from "../TooManyResultsOfSearch/TooManyResultsOFSearch";
import { useFilteredPageData } from "../../redux/hooks/hooks";

export const FoundResultsContext = createContext(null);

const FoundResults = (props) => {
  //const [rowsToPresent, setRowsToPresent] = useState([]);
 // const [indexDataOfFoundResultsForFoundResultsPage, setIndexDataOfFoundResultsForFoundResultsPage] = useState([]);

  const pageComponents = {
    phones: PhonesPage,
    govUa: GovUaMails,
    Lotus: LotusMails
  };

  // Вибір даних по активному меню
  const dataFromStore = (() => {
    switch (props.activeMenu) {
      case "phones": return props.getPhones;
      case "Lotus": return props.getLotusMails;
      case "Gov-ua": return props.getGovUaMails;
      default: return [];
    }
  })();

  const foundResultsForCurrentMenu = (() => {
    switch (props.activeMenu) {
      case "phones": return props.foundSearchValueOfPhonesPage?.foundResults || [];
      case "Lotus": return props.foundSearchValueOfLotusMailsPage?.foundResults || [];
      case "Gov-ua": return props.foundSearchValueOfGovUaPage?.foundResults || [];
      default: return [];
    }
  })();

  const { data: filteredPageData } = useFilteredPageData(dataFromStore);
  const dataToSearch = props.isFilterApplied ? filteredPageData : dataFromStore;

  const activeMenuKey = props.activeMenu === "Gov-ua" ? "govUa" : props.activeMenu;

  // useEffect(() => {
  //   if (!dataToSearch || !foundResultsForCurrentMenu.length) {
  //     setRowsToPresent([]);
  //     setIndexDataOfFoundResultsForFoundResultsPage([]);
  //     return;
  //   }

    const presentRows = dataToSearch.flatMap(item =>
      item.rows.filter(row =>
        foundResultsForCurrentMenu.some(result =>
          item.pageIndex === result.currentPage &&
          (Object.values(row).includes(result.dataValue) ||
            (row.phones && row.phones.some(phoneObj => phoneObj.phoneName === result.dataValue)))
        )
      )
    );

   // setRowsToPresent(presentRows);
 
    //setIndexDataOfFoundResultsForFoundResultsPage(foundResultsForCurrentMenu.map(r => r.currentPage));
    const indexDataOfFoundResultsForFoundResultsPage =
  foundResultsForCurrentMenu.map((r, index) => ({
    currentPage: r.currentPage,
    index: r.index
  }));

    
  // }, [
  //   dataToSearch,
  //   foundResultsForCurrentMenu
  // ]);

  const ActiveComponent = pageComponents[activeMenuKey];

  if (presentRows.length > rowsPerPage) return <TooManyResultsOfSearch />;
  if (!ActiveComponent) return null;
debugger;
  return (
    <FoundResultsContext.Provider value={{
      //  foundResults: rowsToPresent || [],
      foundResults: presentRows,
      indexDataOfFoundResultsForFoundResultsPage
    }}>
      <ActiveComponent />
    </FoundResultsContext.Provider>
  );
};

const mapStateToProps = (state) => ({
  activeMenu: activeMenu(state),
  getPhones: getPhones(state),
  getLotusMails: getLotusMails(state),
  getGovUaMails: getGovUaMails(state),
  foundSearchValueOfPhonesPage: selectSearchValueByPage("phones")(state),
  foundSearchValueOfLotusMailsPage: selectSearchValueByPage("Lotus")(state),
  foundSearchValueOfGovUaPage: selectSearchValueByPage("Gov-ua")(state),
  isFilterApplied: isFilterAppliedSelector(state)
});

export default connect(mapStateToProps)(FoundResults);
