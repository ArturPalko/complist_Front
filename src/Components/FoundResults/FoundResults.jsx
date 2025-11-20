import { 
  activeMenu, getPhones, getGovUaMails, getLotusMails,
  foundSearchValueOfPhonesPage, foundSearchValueOfLotusMailsPage,
  foundSearchValueOfGovUaPage, getPhonesPageIndexDataOfFoundResults, getGovUaMailsPageIndexDataOfFoundResults,
  getLotusMailsPageIndexDataOfFoundResults,
  rowsPerPage,
} from "../../redux/selectors/selector";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { useEffect, useState,createContext } from "react";
import PhonesPage from "../Phones/Phones";
import LotusMails from "../LotusMails/LotusMails";
import GovUaMails from "../GovUaMails/GovUaMails";
import { useCurrentPageIndexData } from '../../redux/hooks/hooks';
import { ToggleElementsContext } from "../../redux/hocs/withToggleElements";
import TooManyResultsOfSearch from "../TooManyResultsOfSearch/TooManyResultsOFSearch";


export const FoundResultsContext = createContext(null);
const FoundResults = (props) => {
  const [rowsToPresent, setRowsToPresent] = useState([]);
  const [indexDataOfFoundResultsForFoundResultsPage, setIndexDataOfFoundResultsForFoundResultsPage] = useState([]);

  const pageComponents = {
    phones: PhonesPage,
    govUa: GovUaMails,
    Lotus: LotusMails
  };

  const pageDataMap = {
  "phones": {
    dataFromStore: props.getPhones,
    foundData: props.foundSearchValueOfPhonesPage,
    getIndexData: useCurrentPageIndexData("phones")
  },
  "Lotus": {
    dataFromStore: props.getLotusMails,
    foundData: props.foundSearchValueOfLotusMailsPage,
    getIndexData: useCurrentPageIndexData("Lotus")
  },
  "Gov-ua": {
    dataFromStore: props.getGovUaMails,
    foundData: props.foundSearchValueOfGovUaPage,
    getIndexData: useCurrentPageIndexData("Gov-ua")
  }
};


  const activeMenuKey = props.activeMenu === "Gov-ua" ? "govUa" : props.activeMenu;

  function prepareRowToPresentAndSearchedIndexes(dataFromStore, foundData) {
    if (!dataFromStore || !foundData || !foundData.foundResults) return;

    const present = dataFromStore.flatMap(item =>
      item.rows.filter(row =>
        foundData.foundResults.some(result =>
          result &&
          item.pageIndex === result.currentPage &&
          (Object.values(row).includes(result.dataValue) ||
            (row.phones && row.phones.some(phoneObj => phoneObj.phoneName === result.dataValue)))
        )
      )
    );

    setRowsToPresent(present);

  }
  const dataForCurrentPage = useCurrentPageIndexData(props.activeMenu);

  useEffect(() => {
  const page = pageDataMap[props.activeMenu];
  if (!page) return;

  const { dataFromStore, foundData, getIndexData } = page;

  setIndexDataOfFoundResultsForFoundResultsPage(getIndexData);
  prepareRowToPresentAndSearchedIndexes(dataFromStore, foundData);

  }, [
    props.activeMenu,
    props.getPhones,
    props.getLotusMails,
    props.getGovUaMails,
    props.foundSearchValueOfPhonesPage,
    props.foundSearchValueOfLotusMailsPage,
    props.foundSearchValueOfGovUaPage
  ]);

  const ActiveComponent = pageComponents[activeMenuKey];
 

  return (
    rowsToPresent.length > rowsPerPage ? (
      <TooManyResultsOfSearch/>
    ) : ActiveComponent ? (
      <FoundResultsContext.Provider value={{ 
        foundResults: rowsToPresent || null, 
        indexDataOfFoundResultsForFoundResultsPage: indexDataOfFoundResultsForFoundResultsPage || null 
      }}>
        <ActiveComponent />
      </FoundResultsContext.Provider>
    ) : null
  );


};

const mapStateToProps = (state) => ({
  activeMenu: activeMenu(state),
  getPhones: getPhones(state),
  getLotusMails: getLotusMails(state),
  getGovUaMails: getGovUaMails(state),
  foundSearchValueOfPhonesPage: foundSearchValueOfPhonesPage(state),
  foundSearchValueOfLotusMailsPage: foundSearchValueOfLotusMailsPage(state),
  foundSearchValueOfGovUaPage: foundSearchValueOfGovUaPage(state),
  getPhonesPageIndexDataOfFoundResults: getPhonesPageIndexDataOfFoundResults(state)
});

export default connect(mapStateToProps)(FoundResults);
