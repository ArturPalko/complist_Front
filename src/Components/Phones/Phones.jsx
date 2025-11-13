import {
  usePageNumber,
  rowsPerPage,
} from "../CommonInjection/Dependencies/ComponentImports";
import { compose } from "redux";
import withDataLoader from "../../redux/hocs/withDataLoader";
import withToggleElements from "../../redux/hocs/withToggleElements";

import PhonesTable from "../PhonesTable/PhonesTable";
import TopTableBar from "../TopTableBar/TopTableBar";

import {
  getPhones,
  isPhonesDataLoaded,
  isPhonesDataFetching,
  getDepartmentsAndSectionsPerPage
} from "../../redux/selectors/selector";

import { getPhonesData } from "../../redux/phones-reducer";
import { useIndexesForPage } from "../../redux/hooks/hooks";

import { connect } from "react-redux";

const PhonesPage = (props) => {
  const pageName = "phones";
  const indexesOfFoundResultsForCurrentPage = useIndexesForPage(pageName);
  const departmentsAndSectionsPerPage = props.getDepartmentsAndSectionsPerPage(pageName);



  return (
    <>
      <TopTableBar title="Телефони" />
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
              { key: "cisco", label: "IP (Cisco)" },
            ],
          },
        ]}
        pageNumber={usePageNumber()}
        rowsPerPage={rowsPerPage}
        indexesOfFoundResultsForCurrentPage={indexesOfFoundResultsForCurrentPage}
       departmentsAndSectionsPerPage={departmentsAndSectionsPerPage}



      />
    </>
  );
};


const mapStateToProps = (state) => ({
  getDepartmentsAndSectionsPerPage: (menu) =>
    getDepartmentsAndSectionsPerPage(state, menu),
});


export default compose(
  withDataLoader(
    isPhonesDataLoaded,
    isPhonesDataFetching,
    getPhones,
    getPhonesData,
    "phones"
  ),
  withToggleElements,
   connect(mapStateToProps),
)(PhonesPage);
