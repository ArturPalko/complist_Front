import { usePageNumber, rowsPerPage, useEffect,withDataLoader,setDataIsLoadedActionCreator } from "../CommonInjection/Dependencies/ComponentImports";
import PhonesTable from "../PhonesTable/PhonesTable";
import { getPhones, isPhonesDataLoaded} from "../../redux/selectors/selector";
import { getPhonesData } from "../../redux/phones-reducer";

const PhonesPage = (props) => {

  return (
    <PhonesTable
      phonesData={props.data}
      isDataLoaded={props.isDataLoaded}
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
  getPhones,      
  getPhonesData,              
  setDataIsLoadedActionCreator, 
  "phones"                    
)(PhonesPage);
