import {
  usePageNumber,
  rowsPerPage,
  useEffect,
//  withDataLoader,
  setDataIsLoadedActionCreator,
  //compose
} from "../CommonInjection/Dependencies/ComponentImports";
import { compose } from "redux";
import withDataLoader from "../../redux/hocs/withDataLoader"; // ✅ правильно



import PhonesTable from "../PhonesTable/PhonesTable";
import {
  getPhones,
  isDataFetching,
  isPhonesDataLoaded,
  isPhonesDataFetching,
  getPageIndexDataOfFoundResultsByPage
} from "../../redux/selectors/selector";
import { getPhonesData } from "../../redux/phones-reducer";
import TopTableBar from "../TopTableBar/TopTableBar";
import withToggleElements from "../../redux/hocs/withToggleElements";
import { useState } from "../CommonInjection/Dependencies/ComponentImports";
import { useIndexesForPage } from "../../redux/hooks/hooks";
import { useSelector } from "react-redux";

const PhonesPage = (props) => {

  const pageName = "phones"; 
  const indexesOfFoundResultsForCurrentPage = useIndexesForPage(pageName);
  

  return (
    <>
      <TopTableBar
        title="Телефони"
      />
      <PhonesTable
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
        pageNumber={usePageNumber()}
        rowsPerPage={rowsPerPage}
        indexesOfFoundResultsForCurrentPage={indexesOfFoundResultsForCurrentPage}
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
