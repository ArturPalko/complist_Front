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
  isPhonesDataFetching
} from "../../redux/selectors/selector";
import { getPhonesData } from "../../redux/phones-reducer";
import TopTableBar from "../TopTableBar/TopTableBar";
import withToggleElements from "../../redux/hocs/withToggleElements";
import { useState } from "../CommonInjection/Dependencies/ComponentImports";

const PhonesPage = (props) => {
  // const [showWhereFound, setShowWhereFound] = useState(false);
  // if (props.rowech !== undefined) setShowWhereFound(true);

  const keysToKeep = ["currentPage", "index"];
  const [indexes, setIndexes] = useState([]);
  const [result, setResult] = useState([]);
  let highlight = [];
  let pageNumber = usePageNumber();

  useEffect(() => {
  const foundResults = props.foundSearchValueOfPhonesPage.foundResults;

  const indexes = foundResults.map(result =>
    Object.fromEntries(
      Object.entries(result).filter(([key]) => ["currentPage", "index"].includes(key))
    )
  ).map(obj => Object.values(obj));

  
  setIndexes(indexes);
  // Беремо лише ті, що потрапляють на поточну сторінку
 
const result = indexes
  .filter(([foundPage, rowIndex]) => foundPage === pageNumber) // тільки поточна сторінка
  .slice(1, 2); // бере другий елемент (індекс 1) і повертає як масив з одного елемента

console.log("Дивись:", result);


  setResult(result);
}, [props.foundSearchValueOfPhonesPage, pageNumber]);


  return (
    <>
      <TopTableBar
        title="Телефони"
        valueOfSearchCheckBox={props.isPresentedSearchField}
        handleToggleSearchField={props.handleToggleSearchField}
      />

      <PhonesTable
        foundResults={props.rowech}
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
        filtered={props.filtered}
        found={props.foundSearchValueOfPhonesPage}
        results={result}
        // showWhereFound={showWhereFound}
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
