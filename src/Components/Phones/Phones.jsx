import { usePageNumber, rowsPerPage, useEffect,withDataLoader,setDataIsLoadedActionCreator,compose } from "../CommonInjection/Dependencies/ComponentImports";
import PhonesTable from "../PhonesTable/PhonesTable";
import { getPhones, isDataFetching, isPhonesDataLoaded, isPhonesDataFetching} from "../../redux/selectors/selector";
import { getPhonesData } from "../../redux/phones-reducer";
import TopTableBar from "../TopTableBar/TopTableBar";
import withToggleElements from "../../redux/hocs/withToggleElements";

const PhonesPage = (props) => {
  return (
    <>
    <TopTableBar
      title="Телефони"
      valueOfSearchCheckBox={props.isPresentedSearchField}
      handleToggleSearchField={props.handleToggleSearchField} 
      />
    <PhonesTable
      foundResults = {props.rowech}
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
            { key: "cisco", label: "IP (Cisco)" },
          ],
        },
      ]}
      pageNumber={usePageNumber()}
      rowsPerPage={rowsPerPage}
    />
    </>
  )
}
    

export default compose(
  withDataLoader(
  isPhonesDataLoaded,
  isPhonesDataFetching,   
  getPhones,      
  getPhonesData,              
  "phones"),
  withToggleElements                    
)(PhonesPage);
