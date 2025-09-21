import { usePageNumber, rowsPerPage, connect, useState, useEffect } from "../CommonInjection/Dependencies/ComponentImports";
import PhonesTable from "../PhonesTable/PhonesTable";
import { getPhones} from "../../redux/selectors/selector";
import { getPhonesData } from "../../redux/phones-reducer";

const PhonesPage = (props) => {

  useEffect(() => {
    props.getPhonesData(); 
    console.log("виконано запит за телефонами")
  }, []);

  return (
    <PhonesTable
      phonesData={props.phonesData}
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

const mapStateToProps = (state) => ({
  phonesData: getPhones(state),
  rowsPerPage:rowsPerPage
});

export default connect(mapStateToProps, { getPhonesData })(PhonesPage);
