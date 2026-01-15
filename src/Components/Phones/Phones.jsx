import React, { useRef } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PhonesTable from "../PhonesTable/PhonesTable";
import TopTableBar from "../TopTableBar/TopTableBar";
import { rowsPerPage } from "../CommonInjection/Dependencies/ComponentImports";
import {
  isPhonesDataLoaded,
  isPhonesDataFetching,
  getDepartmentsAndSectionsPerPage
} from "../../redux/selectors/selector";
import { getPhonesData } from "../../redux/phones-reducer";
import { useIndexesForPage, usePageNumber } from "../../redux/hooks/hooks";
import withDataLoaderForMenu from "../../redux/hocs/withDataLoader";
import withToggleElements from "../../redux/hocs/withToggleElements";



const PhonesPage = (props) => {
  const pageName = "phones";
  const indexesOfFoundResultsForCurrentPage = useIndexesForPage(pageName);
  const pageNumber = usePageNumber();
  const departmentsAndSectionsPerPage = props.getDepartmentsAndSectionsPerPage(pageName);

  const titleRef = useRef(null);

  return (
    <>
      <TopTableBar ref={titleRef} title="Телефони" />
      <PhonesTable
        titleRef={titleRef}
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
        pageNumber={pageNumber}
        rowsPerPage={rowsPerPage}
        indexesOfFoundResultsForCurrentPage={indexesOfFoundResultsForCurrentPage}
        departmentsAndSectionsPerPage={departmentsAndSectionsPerPage}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  getDepartmentsAndSectionsPerPage: (menu) => getDepartmentsAndSectionsPerPage(state, menu),
});

export default compose(
  withDataLoaderForMenu("phones", getPhonesData),
  withToggleElements("phones"),
  connect(mapStateToProps)
)(PhonesPage);
