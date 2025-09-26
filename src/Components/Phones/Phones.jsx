import { usePageNumber, rowsPerPage, useEffect,withDataLoader,setDataIsLoadedActionCreator } from "../CommonInjection/Dependencies/ComponentImports";
import PhonesTable from "../PhonesTable/PhonesTable";
import { getPhones, isDataFetching, isPhonesDataLoaded, isPhonesDataFetching} from "../../redux/selectors/selector";
import { getPhonesData } from "../../redux/phones-reducer";

const PhonesPage = (props) => {

  return (
    <PhonesTable
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
      title="Телефонний довідник"
      rowsPerPage={rowsPerPage}
    />
  );
};

export default withDataLoader(
  isPhonesDataLoaded,
  isPhonesDataFetching,   
  getPhones,      
  getPhonesData,              
  //setDataIsLoadedActionCreator, 
  "phones"                    
)(PhonesPage);
