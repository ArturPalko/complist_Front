import {
  usePageNumber,
  rowsPerPage,
  useEffect,
  withDataLoader,
  setDataIsLoadedActionCreator,
  compose
} from "../CommonInjection/Dependencies/ComponentImports";

import PhonesTable from "../PhonesTable/PhonesTable";
import {
  getPhones,
  isDataFetching,
  isPhonesDataLoaded,
  isPhonesDataFetching,
  getPhonesCurrentPageNumber
} from "../../redux/selectors/selector";
import { getPhonesData } from "../../redux/phones-reducer";
import TopTableBar from "../TopTableBar/TopTableBar";
import withToggleElements from "../../redux/hocs/withToggleElements";
import { useState } from "../CommonInjection/Dependencies/ComponentImports";

const PhonesPage = (props) => {

  const [indexesOfFoundResultsForCurrentPage, setindexesOfFoundResultsForCurrentPage] = useState([]);
  let pageNumber = usePageNumber();

    useEffect(() => {
      let pageNumber = props.getPhonesCurrentPageNumber;
      const data = props.getPhonesPageIndexDataOfFoundResults ?? []; 
      const filtered = data
        .filter(item => item.currentPage == pageNumber)
        .map(item => item.index); // масив індексів

              console.log ("DATA для Filtred:", data)
              console.log ("Фільтред:", filtered)
          
      setindexesOfFoundResultsForCurrentPage(filtered);
      //debugger;


    }, [props.foundSearchValueOfPhonesPage, props.indexDataOfFoundResults,props.getPhonesCurrentPageNumber]);



  return (
    <>
      <TopTableBar
        title="Телефони"
        valueOfSearchCheckBox={props.isPresentedSearchField}
        handleToggleSearchField={props.handleToggleSearchField}
      />

      <PhonesTable
        foundResults={props.foundResults}
        phonesData={props.data}
        isDataFetching={props.isDataFetching}
        columns={[
          { key: "userPosition", label: "Назва посади" },
          { key: "userName", label: "Прізвище, ім'я по батькові" },
          {
            key: "phones",
            label: "Телефон",
            subLabels: [
              { key: "landline", label: "Міський" },
              { key: "extension", label: "Внутрішній" },
              { key: "cisco", label: "IP (Cisco)" }
            ]
          }
        ]}
        pageNumber={pageNumber}
        rowsPerPage={rowsPerPage}
        indexDataOfFoundResultsForFoundResultsPage={props.indexDataOfFoundResultsForFoundResultsPage}
        found={props.foundSearchValueOfPhonesPage}
        indexesOfFoundResultsForCurrentPage={indexesOfFoundResultsForCurrentPage}
        isPagesNavbarLinkElementOnCurrentPagePressed={props.isPagesNavbarLinkElementOnCurrentPagePressed}
        isRenderFromFoundResultsPage={props.isRenderFromFoundResultsPage ?? true}
      />
    </>
  );
};

export default compose(
  withDataLoader(
    isPhonesDataLoaded,
    isPhonesDataFetching,
    getPhones,
    getPhonesData,
    "phones"
  ),
  withToggleElements
)(PhonesPage);
