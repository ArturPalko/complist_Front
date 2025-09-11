import { connect } from "react-redux";

import { addPhonesActionCreator } from "../../redux/phones-reducer";
import PhonesTable from "../PhonesTable/PhonesTable";

const PhonesPage = ({ phonesData, addPhonesActionCreator }) => (
  <PhonesTable
    fetchUrl="http://localhost:5114/phones"
    addPhonesActionCreator={addPhonesActionCreator}
    phonesData={phonesData}
    columns={[
      { key: "userPosition", label: "Назва посади" },
      { key: "userName", label: "Прізвище, ім'я по батькові" },
      { key: "userName", label: "Телефон" },
    ]}
    title="Телефонний довідник Вінницької митниці"
  />
);

const mapStateToProps = (state) => ({
  phonesData: state.phones.phones // <- беремо саме масив
});
const mapDispatchToProps = { addPhonesActionCreator };

export default connect(mapStateToProps, mapDispatchToProps)(PhonesPage);